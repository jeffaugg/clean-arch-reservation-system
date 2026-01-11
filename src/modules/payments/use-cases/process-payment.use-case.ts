import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { ProcessPaymentDto } from "../dto/process-payment.dto";
import { PaymentStatus, ReservationStatus } from "generated/prisma/enums";
import { Prisma } from "generated/prisma/client";
import { PrismaService } from "src/shared/database/prisma.service";
import { randomUUID } from "crypto";
import { IReservationRepository } from "src/modules/reservations/repositories/interface/reservation.repository";
import { IPaymentRepository } from "../repositories/interface/payment.repository";

@Injectable()
export class ProcessPaymentUseCase {
    
   constructor(
    private readonly prisma: PrismaService,
    private readonly reservationRepository: IReservationRepository,
    private readonly paymentRepository: IPaymentRepository,
  ) {}

  async execute(data: ProcessPaymentDto) {
    const reservation = await this.reservationRepository.findById(data.reservationId);

    if (!reservation) {
      throw new NotFoundException("Reservation not found");
    }

    if (reservation.status !== ReservationStatus.PENDING) {
      throw new BadRequestException("Reservation must be PENDING to process payment");
    }

    const amount = reservation.totalPrice;
    const limit = new Prisma.Decimal(1000);

    if (amount.comparedTo(limit) >= 0) {
      throw new BadRequestException("Payment declined (simulated): amount >= 1000");
    }

    const payment = await this.prisma.$transaction(async (tx) => {
      const updated = await this.reservationRepository.updateStatusIfPending(
        reservation.id,
        ReservationStatus.CONFIRMED,
      );

      if (updated !== 1) {
        throw new BadRequestException("Reservation must be PENDING to process payment");
      }

      return this.paymentRepository.create(
        {
          reservationId: reservation.id,
          provider: "FAKE_CARD",
          transactionId: randomUUID(),
          amount,
          status: PaymentStatus.SUCCESS,
        }
      );
    });

    return {
      paymentId: payment.id,
      reservationId: payment.reservationId,
      reservationStatus: ReservationStatus.CONFIRMED,
      paymentStatus: payment.status,
      amount: payment.amount.toString(),
    };
  }
}
