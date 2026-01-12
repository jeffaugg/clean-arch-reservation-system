import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { ReservationController } from "./controllers/reservation.controller";
import { CreateReservationUseCase } from "./user-cases/create-reservation.use-case";
import { CancelReservationUseCase } from "./user-cases/cancel-reservation.use-case";
import { IReservationRepository } from "./repositories/interface/reservation.repository";
import { ReservationRepository } from "./repositories/reservation.repository";
import { PropertyModule } from "../properties/property.module";
import { ListHostReservationsUseCase } from "./user-cases/list-host-reservations.use-case";
import { ListGuestReservationsUseCase } from "./user-cases/list-guest-reservations.use-case";

import { ReviewRepository } from "./repositories/review.repository";
import { IReviewRepository } from "./repositories/interface/review.repository";
import { CreateReviewUseCase } from "./user-cases/create-review.use-case";

@Module({
  imports: [PropertyModule],
  controllers: [ReservationController],
  providers: [
    PrismaService,
    CreateReservationUseCase,
    ListHostReservationsUseCase,
    ListGuestReservationsUseCase,
    CancelReservationUseCase,
    CreateReviewUseCase,
    {
      provide: IReservationRepository,
      useClass: ReservationRepository,
    },
    {
      provide: IReviewRepository,
      useClass: ReviewRepository,
    },
  ],
  exports: [IReservationRepository, IReviewRepository],
})
export class ReservationModule {}
