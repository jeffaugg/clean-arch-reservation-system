import { Injectable } from "@nestjs/common";
import { AmenityResponseDto } from "../dto/amenity-response.dto";
import { IAmenityRepository } from "../repositories/interface/amenity.repository";

@Injectable()
export class ListAmenitiesUseCase {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  async execute(): Promise<AmenityResponseDto[]> {
    const amenities = await this.amenityRepository.findAll();
    return AmenityResponseDto.fromEntities(amenities);
  }
}
