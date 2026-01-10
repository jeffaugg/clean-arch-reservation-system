import { ApiProperty } from "@nestjs/swagger";

class PropertyImageSimpleDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;
}

export class PropertyListItemDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  maxGuests: number;

  @ApiProperty()
  basePrice: string;

  @ApiProperty({ type: PropertyImageSimpleDto, nullable: true })
  mainImage: PropertyImageSimpleDto | null;

  static fromPrisma(property: any): PropertyListItemDto {
    return {
      id: property.id,
      title: property.title,
      city: property.city,
      maxGuests: property.maxGuests,
      basePrice: property.basePrice.toString(),
      mainImage: property.images[0]
        ? {
            id: property.images[0].id,
            url: property.images[0].url,
          }
        : null,
    };
  }
}

export class PaginatedPropertiesDto {
  @ApiProperty({ type: [PropertyListItemDto] })
  data: PropertyListItemDto[];

  @ApiProperty()
  total: number;

  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;

  @ApiProperty()
  totalPages: number;
}
