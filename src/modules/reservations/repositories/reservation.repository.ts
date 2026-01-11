import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { IReservationRepository } from "./interface/reservation.repository";
import { CreateReservationInput } from "../dto/create-reservation-input.dto";
import { Reservation } from "generated/prisma/client";

@Injectable()
export class ReservationRepository implements IReservationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReservationInput): Promise<Reservation> {
    const reservation = await this.prisma.reservation.create({
      data: {
        propertyId: data.propertyId,
        guestId: data.guestId,
        checkIn: data.checkIn,
        checkOut: data.checkOut,
        guestCount: data.guestCount,
        totalPrice: data.totalPrice,
      },
    });

    return reservation;
  }

  findByDates(startDate: Date, endDate: Date): Promise<Reservation[]> {
    return this.prisma.reservation.findMany({
      where: {
        AND: [{ checkIn: { lt: endDate } }, { checkOut: { gt: startDate } }],
      },
      orderBy: { checkIn: "asc" },
    });
  }
}
