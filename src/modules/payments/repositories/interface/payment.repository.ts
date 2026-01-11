import { Payment, Prisma } from "generated/prisma/client";
import { CreatePaymentInput } from "../../dto/create-payment-input.dto";

export abstract class IPaymentRepository {
  abstract create(data: CreatePaymentInput): Promise<Payment>;
}