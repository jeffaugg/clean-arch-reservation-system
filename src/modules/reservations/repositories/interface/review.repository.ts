import { Review } from "generated/prisma/client";

export type CreateReviewRepositoryInput = {
  reservationId: string;
  authorId: string;
  rating: number;
  comment: string;
};

export abstract class IReviewRepository {
  abstract create(data: CreateReviewRepositoryInput): Promise<Review>;

  abstract findByReservationId(reservationId: string): Promise<Review | null>;
}
