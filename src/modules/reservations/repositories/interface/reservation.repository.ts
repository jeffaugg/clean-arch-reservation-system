import { Prisma, Reservation, ReservationStatus } from "generated/prisma/client";
import { CreateReservationInput } from "../../dto/create-reservation-input.dto";

export abstract class IReservationRepository {
  abstract create(data: CreateReservationInput): Promise<Reservation>;
  abstract findByDates(startDate: Date, endDate: Date): Promise<Reservation[]>;
  abstract findById(id: string): Promise<Reservation | null>;
  abstract updateStatusIfPending(
    id: string,
    nextStatus: ReservationStatus,
  ): Promise<number>;
}
