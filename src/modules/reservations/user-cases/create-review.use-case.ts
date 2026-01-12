import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { IReservationRepository } from "../repositories/interface/reservation.repository";
import { CreateReviewData } from "../dto/create-review.dto";
import { IReviewRepository } from "../repositories/interface/review.repository";
import { ReservationStatus } from "generated/prisma/enums";

@Injectable()
export class CreateReviewUseCase {
  constructor(
    private readonly reservationRepository: IReservationRepository,
    private readonly reviewRepository: IReviewRepository,
  ) {}

  async execute(
    reservationId: string,
    authorId: string,
    data: CreateReviewData,
  ): Promise<void> {
    const reservation =
      await this.reservationRepository.findById(reservationId);

    if (!reservation) {
      throw new NotFoundException("Reservation not found");
    }

    if (reservation.guestId !== authorId) {
      throw new ForbiddenException(
        "Only the guest who made the reservation can review it",
      );
    }

    const today = this.getTodayUtc();
    const checkOutDate = new Date(reservation.checkOut);

    const hasCheckoutPassed = today.getTime() > checkOutDate.getTime();
    const isConfirmed = reservation.status === ReservationStatus.CONFIRMED;

    if (!(isConfirmed && hasCheckoutPassed)) {
      throw new BadRequestException(
        "You can only review a reservation after the stay is completed",
      );
    }

    const existingReview =
      await this.reviewRepository.findByReservationId(reservationId);

    if (existingReview) {
      throw new ConflictException("This reservation has already been reviewed");
    }

    await this.reviewRepository.create({
      reservationId,
      authorId,
      rating: data.rating,
      comment: data.comment,
    });
  }

  private getTodayUtc(): Date {
    const now = new Date();
    return new Date(
      Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
    );
  }
}
