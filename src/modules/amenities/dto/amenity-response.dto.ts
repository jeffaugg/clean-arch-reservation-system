import { ApiProperty } from "@nestjs/swagger";
import { Amenity } from "generated/prisma/client";

export class AmenityResponseDto {
  @ApiProperty({ example: "123e4567-e89b-12d3-a456-426614174000" })
  id: string;

  @ApiProperty({ example: "Wi-Fi" })
  name: string;

  @ApiProperty({
    example: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
  })
  iconUrl: string;

  @ApiProperty({ example: "2024-01-04T10:30:00Z" })
  createdAt: Date;

  static fromEntity(amenity: Amenity): AmenityResponseDto {
    const dto = new AmenityResponseDto();
    dto.id = amenity.id;
    dto.name = amenity.name;
    dto.iconUrl = amenity.iconUrl;
    return dto;
  }

  static fromEntities(amenities: Amenity[]): AmenityResponseDto[] {
    return amenities.map((amenity) => this.fromEntity(amenity));
  }
}
