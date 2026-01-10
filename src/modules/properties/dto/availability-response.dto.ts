import { ApiProperty } from "@nestjs/swagger";

export class AvailabilityResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  propertyId: string;

  @ApiProperty()
  date: Date;

  @ApiProperty()
  isBlocked: boolean;

  @ApiProperty({ nullable: true })
  priceOverride: string | null;

  static fromEntity(availability: any): AvailabilityResponseDto {
    return {
      id: availability.id,
      propertyId: availability.propertyId,
      date: availability.date,
      isBlocked: availability.isBlocked,
      priceOverride: availability.priceOverride?.toString() || null,
    };
  }
}
