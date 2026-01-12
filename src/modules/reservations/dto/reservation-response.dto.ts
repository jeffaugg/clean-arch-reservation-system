import { ApiProperty } from "@nestjs/swagger";
import { ReservationStatus } from "generated/prisma/enums";

class ReservationPropertyDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  city: string;

  @ApiProperty({ nullable: true })
  mainImageUrl: string | null;
}

export class ReservationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  checkIn: Date;

  @ApiProperty()
  checkOut: Date;

  @ApiProperty()
  guestCount: number;

  @ApiProperty()
  totalPrice: string;

  @ApiProperty({ enum: ReservationStatus })
  status: ReservationStatus;

  @ApiProperty({ type: ReservationPropertyDto })
  property: ReservationPropertyDto;

  static fromPrisma(reservation: any): ReservationResponseDto {
    return {
      id: reservation.id,
      checkIn: reservation.checkIn,
      checkOut: reservation.checkOut,
      guestCount: reservation.guestCount,
      totalPrice: reservation.totalPrice.toString(),
      status: reservation.status,
      property: {
        id: reservation.property.id,
        title: reservation.property.title,
        city: reservation.property.city,
        mainImageUrl: reservation.property.images?.[0]?.url || null,
      },
    };
  }
}
