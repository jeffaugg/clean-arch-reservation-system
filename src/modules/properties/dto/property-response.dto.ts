import { ApiProperty } from "@nestjs/swagger";

class PropertyImageDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  isMain: boolean;
}

class PropertyAmenityDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  iconUrl: string;
}

export class PropertyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  hostId: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  address: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  latitude: string;

  @ApiProperty()
  longitude: string;

  @ApiProperty()
  maxGuests: number;

  @ApiProperty()
  basePrice: string;

  @ApiProperty()
  cleaningFee: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty({ type: [PropertyImageDto] })
  images: PropertyImageDto[];

  @ApiProperty({ type: [PropertyAmenityDto] })
  amenities: PropertyAmenityDto[];

  static fromEntity(property: any): PropertyResponseDto {
    return {
      id: property.id,
      hostId: property.hostId,
      title: property.title,
      description: property.description,
      address: property.address,
      city: property.city,
      latitude: property.latitude.toString(),
      longitude: property.longitude.toString(),
      maxGuests: property.maxGuests,
      basePrice: property.basePrice.toString(),
      cleaningFee: property.cleaningFee.toString(),
      createdAt: property.createdAt,
      images:
        property.images?.map((img: any) => ({
          id: img.id,
          url: img.url,
          isMain: img.isMain,
        })) || [],
      amenities:
        property.amenities?.map((pa: any) => ({
          id: pa.amenity.id,
          name: pa.amenity.name,
          iconUrl: pa.amenity.iconUrl,
        })) || [],
    };
  }
}
