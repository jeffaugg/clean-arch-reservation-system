import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createPropertySchema = z.object({
  title: z.string().min(3).max(100),
  description: z.string().min(10).max(5000),
  address: z.string().min(5).max(200),
  city: z.string().min(2).max(100),
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  maxGuests: z.number().int().min(1).max(50),
  basePrice: z.number().positive(),
  cleaningFee: z.number().nonnegative(),
  imageUrls: z.array(z.string().url()).min(1),
  amenityIds: z.array(z.string().uuid()).min(1),
});

export class CreatePropertyDto extends createZodDto(createPropertySchema) {
  @ApiProperty({ example: "Casa na Praia" })
  title: string;

  @ApiProperty({ example: "Linda casa com vista para o mar" })
  description: string;

  @ApiProperty({ example: "Av. Atlântica, 1000" })
  address: string;

  @ApiProperty({ example: "Rio de Janeiro" })
  city: string;

  @ApiProperty({ example: -22.9068 })
  latitude: number;

  @ApiProperty({ example: -43.1729 })
  longitude: number;

  @ApiProperty({ example: 6 })
  maxGuests: number;

  @ApiProperty({ example: 350.0 })
  basePrice: number;

  @ApiProperty({ example: 50.0 })
  cleaningFee: number;

  @ApiProperty({
    example: [
      "https://minio.localhost/bucket/image1.jpg",
      "https://minio.localhost/bucket/image2.jpg",
    ],
    type: [String],
  })
  imageUrls: string[];

  @ApiProperty({
    example: ["uuid-1", "uuid-2"],
    type: [String],
  })
  amenityIds: string[];
}
