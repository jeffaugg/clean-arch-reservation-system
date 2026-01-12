import { Injectable } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import {
  CreateReviewRepositoryInput,
  IReviewRepository,
} from "./interface/review.repository";
import { Review } from "generated/prisma/client";

@Injectable()
export class ReviewRepository implements IReviewRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateReviewRepositoryInput): Promise<Review> {
    return this.prisma.review.create({
      data: {
        reservationId: data.reservationId,
        authorId: data.authorId,
        rating: data.rating,
        comment: data.comment,
      },
    });
  }

  async findByReservationId(reservationId: string): Promise<Review | null> {
    return this.prisma.review.findUnique({
      where: { reservationId },
    });
  }
}
