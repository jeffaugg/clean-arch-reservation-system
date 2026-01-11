import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { Prisma, Payment } from "generated/prisma/client";
import { IPaymentRepository } from "./interface/payment.repository";
import { CreatePaymentInput } from "../dto/create-payment-input.dto";

@Injectable()
export class PaymentRepository implements IPaymentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreatePaymentInput): Promise<Payment> {

    return this.prisma.payment.create({
      data: {
        reservationId: data.reservationId,
        provider: data.provider,
        transactionId: data.transactionId,
        amount: data.amount,
        status: data.status,
      },
    });
  }
}
