import { ConflictException, Inject, Injectable } from "@nestjs/common";
import { AmenityResponseDto } from "../dto/amenity-response.dto";
import { CreateAmenityDto } from "../dto/create-amenity.dto";
import type { IAmenityRepository } from "../repositories/interface/amenity.repository";
import { AMENITY_REPOSITORY_TOKEN } from "../repositories/interface/amenity.repository";

@Injectable()
export class CreateAmenityUseCase {
  constructor(
    @Inject(AMENITY_REPOSITORY_TOKEN)
    private readonly amenityRepository: IAmenityRepository
  ) {}

  async execute(data: CreateAmenityDto): Promise<AmenityResponseDto> {
    const existingAmenity = await this.amenityRepository.findByName(data.name);

    if (existingAmenity) {
      throw new ConflictException("Amenity with this name already exists");
    }

    const amenity = await this.amenityRepository.create(data);
    return AmenityResponseDto.fromEntity(amenity);
  }
}
