// create-reservation.dto.ts
import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createReservationSchema = z.object({
  propertyId: z.string(),
  checkInDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  checkOutDate: z.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid date format",
  }),
  guestCount: z.number().min(1).max(20),
});

export type CreateReservationData = z.infer<typeof createReservationSchema>;

export class CreateReservationDto extends createZodDto(
  createReservationSchema,
) {
  @ApiProperty({
    example: "b1a8f8e2-3c4d-4e5f-9a6b-7c8d9e0f1a2b",
    description: "ID da propriedade",
  })
  propertyId: string;

  @ApiProperty({ example: "2023-05-15", description: "Data de check-in" })
  checkInDate: string;

  @ApiProperty({ example: "2023-05-20", description: "Data de check-out" })
  checkOutDate: string;

  @ApiProperty({ example: 4, description: "Número de hóspedes" })
  guestCount: number;
}
