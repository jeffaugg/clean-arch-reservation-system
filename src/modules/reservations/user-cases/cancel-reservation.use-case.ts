import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { IReservationRepository } from "../repositories/interface/reservation.repository";
import { IPropertyRepository } from "src/modules/properties/repositories/interface/property.repository";
import { CancelReservationResponseDto } from "../dto/cancel-reservation.dto";
import { ReservationStatus } from "generated/prisma/enums";

@Injectable()
export class CancelReservationUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly propertyRepository: IPropertyRepository,
  ) {}

  async execute(
    reservationId: string,
    userId: string,
  ): Promise<CancelReservationResponseDto> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException("Reservation not found");
    }

    if (reservation.status === ReservationStatus.CANCELLED) {
      throw new BadRequestException("Reservation is already cancelled");
    }

    const propertyHostId = await this.propertyRepository.findPropertyHostId(
      reservation.propertyId,
    );

    const isGuest = reservation.guestId === userId;
    const isHost = propertyHostId === userId;

    if (!isGuest && !isHost) {
      throw new ForbiddenException(
        "Only the guest or property host can cancel this reservation",
      );
    }

    const today = this.getTodayUtc();
    const checkInDate = new Date(reservation.checkIn);

    if (checkInDate.getTime() <= today.getTime()) {
      throw new BadRequestException(
        "Cannot cancel reservations where check-in date has passed or is today",
      );
    }

    const updatedReservation = await this.reservationRepository.updateStatus(
      reservationId,
      ReservationStatus.CANCELLED,
    );

    return {
      id: updatedReservation.id,
      status: updatedReservation.status,
      message: "Reservation cancelled successfully",
    };
  }

  private getTodayUtc(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }
}
