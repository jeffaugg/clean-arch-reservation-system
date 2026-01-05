import { Amenity } from "generated/prisma/client";
import { CreateAmenityDto } from "../../dto/create-amenity.dto";

export abstract class IAmenityRepository {
  abstract create(data: CreateAmenityDto): Promise<Amenity>;
  abstract findAll(): Promise<Amenity[]>;
  abstract findByName(name: string): Promise<Amenity | null>;
}
