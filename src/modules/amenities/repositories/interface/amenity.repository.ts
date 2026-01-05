import { Amenity } from "generated/prisma/client";
import { CreateAmenityDto } from "../../dto/create-amenity.dto";

export const AMENITY_REPOSITORY_TOKEN = "IAmenityRepository";

export abstract class IAmenityRepository {
  abstract create(data: CreateAmenityDto): Promise<Amenity>;
  abstract findAll(): Promise<Amenity[]>;
  abstract findByName(name: string): Promise<Amenity | null>;
}
