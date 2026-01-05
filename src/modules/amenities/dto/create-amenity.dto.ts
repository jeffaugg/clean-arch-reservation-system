import { ApiProperty } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(100),
  iconUrl: z.string().url(),
});

export class CreateAmenityDto extends createZodDto(createAmenitySchema) {
  @ApiProperty({
    example: "Wi-Fi",
    description: "Nome da comodidade",
  })
  name: string;

  @ApiProperty({
    example: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
    description: "URL do ícone",
  })
  iconUrl: string;
}
