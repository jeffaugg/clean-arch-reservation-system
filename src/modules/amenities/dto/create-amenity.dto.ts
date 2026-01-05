import { createZodDto } from "nestjs-zod";
import { z } from "zod";

export const createAmenitySchema = z.object({
  name: z.string().min(1).max(100),
  iconUrl: z.string().url(),
});

export class CreateAmenityDto extends createZodDto(createAmenitySchema) {}
