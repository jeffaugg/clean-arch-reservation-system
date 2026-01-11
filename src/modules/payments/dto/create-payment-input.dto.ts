import { PaymentStatus, Prisma } from "generated/prisma/client";

export type CreatePaymentInput = {
  reservationId: string;
  provider: string;
  transactionId: string;
  amount: Prisma.Decimal;
  status: PaymentStatus;
};