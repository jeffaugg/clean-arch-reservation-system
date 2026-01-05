import { Inject, Injectable } from "@nestjs/common";
import { AmenityResponseDto } from "../dto/amenity-response.dto";
import type { IAmenityRepository } from "../repositories/interface/amenity.repository";
import { AMENITY_REPOSITORY_TOKEN } from "../repositories/interface/amenity.repository";

@Injectable()
export class ListAmenitiesUseCase {
  constructor(
    @Inject(AMENITY_REPOSITORY_TOKEN)
    private readonly amenityRepository: IAmenityRepository
  ) {}

  async execute(): Promise<AmenityResponseDto[]> {
    const amenities = await this.amenityRepository.findAll();
    return AmenityResponseDto.fromEntities(amenities);
  }
}
