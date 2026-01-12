import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateReservationDto } from "../dto/create-reservation.dto";
import { IReservationRepository } from "../repositories/interface/reservation.repository";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { IPropertyRepository } from "src/modules/properties/repositories/interface/property.repository";
import {
  Prisma,
  Reservation,
  ReservationStatus,
} from "generated/prisma/client";
import { CreateReservationInput } from "../dto/create-reservation-input.dto";
import { CreateReservationResponse } from "../dto/create-reservation-response";

function parseDateOnlyUtc(dateStr: string): Date {
  return new Date(`${dateStr}T00:00:00.000Z`);
}

function dateKeyUtc(d: Date): string {
  const y = d.getUTCFullYear();
  const m = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

function addDaysUtc(d: Date, days: number): Date {
  const copy = new Date(d.getTime());
  copy.setUTCDate(copy.getUTCDate() + days);
  return copy;
}

function minutesAgo(min: number): Date {
  return new Date(Date.now() - min * 60 * 1000);
}

@Injectable()
export class CreateReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(
    data: CreateReservationDto,
    guestId: string,
  ): Promise<CreateReservationResponse> {
    const checkIn = parseDateOnlyUtc(data.checkInDate);
    const checkOut = parseDateOnlyUtc(data.checkOutDate);

    if (checkOut.getTime() <= checkIn.getTime()) {
      throw new BadRequestException(
        "checkOutDate must be greater than checkInDate",
      );
    }

    const property = await this.propertyRepository.findById(data.propertyId);
    if (!property) throw new NotFoundException("Property not found");

    if (data.guestCount > property.maxGuests) {
      throw new BadRequestException("guestCount exceeds maxGuests");
    }

    const calendar = await this.propertyRepository.findCalendarBetween(
      property.id,
      checkIn,
      checkOut,
    );

    const hasBlocked = calendar.some((d) => d.isBlocked);
    if (hasBlocked) {
      throw new ConflictException(
        "Property has blocked dates in the selected period",
      );
    }

    const overlaps = await this.reservationRepository.findByDates(
      checkIn,
      checkOut,
    );

    const holdCutoff = minutesAgo(30);

    const conflict = overlaps
      .filter((r: Reservation) => r.propertyId === property.id)
      .some((r: Reservation) => {
        if (r.status === ReservationStatus.CONFIRMED) return true;

        if (r.status === ReservationStatus.PENDING) {
          return r.createdAt.getTime() >= holdCutoff.getTime();
        }

        return false;
      });

    if (conflict) {
      throw new ConflictException(
        "Property is not available for the selected dates",
      );
    }

    const overrideByDate = new Map(
      calendar
        .filter(
          (d) => d.priceOverride !== null && d.priceOverride !== undefined,
        )
        .map((d) => [dateKeyUtc(d.date), d.priceOverride!]),
    );

    let totalNights = new Prisma.Decimal(0);
    for (
      let day = new Date(checkIn.getTime());
      day.getTime() < checkOut.getTime();
      day = addDaysUtc(day, 1)
    ) {
      const key = dateKeyUtc(day);
      const nightly = overrideByDate.get(key) ?? property.basePrice;
      totalNights = totalNights.add(nightly);
    }

    const totalPrice = totalNights.add(property.cleaningFee);

    const input: CreateReservationInput = {
      propertyId: property.id,
      guestId,
      checkIn,
      checkOut,
      guestCount: data.guestCount,
      totalPrice,
    };

    const reservation = await this.reservationRepository.create(input);
    return CreateReservationResponse.fromEntity(reservation);
  }
}
