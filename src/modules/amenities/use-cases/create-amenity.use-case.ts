// Caminho: src/modules/amenities/use-cases/create-amenity.use-case.ts
import { ConflictException, Injectable } from "@nestjs/common";
import { Amenity } from "generated/prisma/client";
import { CreateAmenityDto } from "../dto/create-amenity.dto";
import type { IAmenityRepository } from "../repositories/interface/amenity.repository";

@Injectable()
export class CreateAmenityUseCase {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  async execute(data: CreateAmenityDto): Promise<Amenity> {
    const existingAmenity = await this.amenityRepository.findByName(data.name);

    if (existingAmenity) {
      throw new ConflictException("Amenity with this name already exists");
    }

    return this.amenityRepository.create(data);
  }
}
