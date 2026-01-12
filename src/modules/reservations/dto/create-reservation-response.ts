import { ApiProperty } from "@nestjs/swagger";
import { Reservation } from "generated/prisma/client";

export class CreateReservationResponse {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  static fromEntity(reservation: Reservation): CreateReservationResponse {
    const dto = new CreateReservationResponse();
    dto.id = reservation.id;
    return dto;
  }

  static fromEntities(
    reservations: Reservation[],
  ): CreateReservationResponse[] {
    return reservations.map((reservation) => this.fromEntity(reservation));
  }
}
