import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createReviewSchema = z.object({
  rating: z
    .number()
    .int()
    .min(1, { message: "rating must be at least 1" })
    .max(5, { message: "rating must be at most 5" }),
  comment: z
    .string()
    .min(1, { message: "comment must not be empty" })
    .max(1000, { message: "comment must be at most 1000 characters" }),
});

export type CreateReviewData = z.infer<typeof createReviewSchema>;

export class CreateReviewDto extends createZodDto(createReviewSchema) {
  @ApiProperty({
    example: 5,
    description: "Rating da estadia (1 a 5)",
    minimum: 1,
    maximum: 5,
  })
  rating: number;

  @ApiProperty({
    example: "Estadia excelente, anfitrião super atencioso.",
    description: "Comentário do hóspede sobre a estadia",
  })
  comment: string;
}
