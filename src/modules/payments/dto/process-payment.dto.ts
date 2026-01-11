import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const processPaymentSchema = z.object({
  reservationId: z.string(),
  cardToken: z.string().min(1),
});

export class ProcessPaymentDto extends createZodDto(processPaymentSchema) {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID da reserva",
  })
  reservationId: string;

  @ApiProperty({
    example: "tok_visa_123456789",
    description: "Token do cartão",
  })
  cardToken: string;
}
