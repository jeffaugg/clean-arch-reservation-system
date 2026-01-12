import { ApiProperty } from "@nestjs/swagger";

export class CancelReservationResponseDto {
  @ApiProperty({
    example: "123e4567-e89b-12d3-a456-426614174000",
    description: "ID da reserva cancelada",
  })
  id: string;

  @ApiProperty({
    example: "CANCELLED",
    description: "Status atualizado da reserva",
  })
  status: string;

  @ApiProperty({
    example: "Reservation cancelled successfully",
    description: "Mensagem de confirmação",
  })
  message: string;
}
