import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { IReservationRepository } from "./interface/reservation.repository";
import { CreateReservationInput } from "../dto/create-reservation-input.dto";
import { Reservation, ReservationStatus } from "generated/prisma/client";

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

  async findById(id: string): Promise<Reservation | null> {
    return this.prisma.reservation.findUnique({
      where: { id },
    });
  }

  async updateStatusIfPending(
    id: string,
    nextStatus: ReservationStatus,
  ): Promise<number> {
    const result = await this.prisma.reservation.updateMany({
      where: { id, status: ReservationStatus.PENDING },
      data: { status: nextStatus },
    });

    return result.count;
  }

  async findByGuestId(guestId: string) {
    return this.prisma.reservation.findMany({
      where: { guestId },
      include: {
        property: {
          include: { images: true },
        },
      },
      orderBy: { checkIn: "asc" },
    });
  }

  async findByHostId(hostId: string) {
    return this.prisma.reservation.findMany({
      where: {
        property: {
          hostId: hostId,
        },
      },
      include: {
        property: {
          include: { images: true },
        },
      },
      orderBy: { checkIn: "asc" },
    });
  }
}
