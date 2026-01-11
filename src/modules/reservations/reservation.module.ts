import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { ReservationController } from "./controllers/reservation.controller";
import { CreateReservationUseCase } from "./user-cases/create-reservation.use-case";
import { IReservationRepository } from "./repositories/interface/reservation.repository";
import { ReservationRepository } from "./repositories/reservation.repository";
import { PropertyModule } from "../properties/property.module";

@Module({
imports: [PropertyModule],
  controllers: [ReservationController],
  providers: [
    PrismaService,
    CreateReservationUseCase,
    {
      provide: IReservationRepository,
      useClass: ReservationRepository,
    },
  ],
  exports: [IReservationRepository],
})
export class ReservationModule {}
