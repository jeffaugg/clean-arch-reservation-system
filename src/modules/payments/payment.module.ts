import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { PaymentController } from "./controllers/payment.controller";
import { ProcessPaymentUseCase } from "./use-cases/process-payment.use-case";
import { PaymentRepository } from "./repositories/payment.repository";
import { IPaymentRepository } from "./repositories/interface/payment.repository";
import { ReservationModule } from "../reservations/reservation.module";

@Module({
  imports: [ReservationModule],
  controllers: [PaymentController],
  providers: [
    PrismaService,
    ProcessPaymentUseCase,
    {
      provide: IPaymentRepository,
      useClass: PaymentRepository,
    },
  ],
  exports: [IPaymentRepository],
})
export class PaymentModule {}
