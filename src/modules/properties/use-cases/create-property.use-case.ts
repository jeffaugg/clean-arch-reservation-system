import { BadRequestException, Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "../dto/create-property.dto";
import { PropertyResponseDto } from "../dto/property-response.dto";
import { IPropertyRepository } from "../repositories/interface/property.repository";

@Injectable()
export class CreatePropertyUseCase {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(
    hostId: string,
    data: CreatePropertyDto
  ): Promise<PropertyResponseDto> {
    const amenitiesExist = await this.propertyRepository.validateAmenityIds(
      data.amenityIds
    );

    if (!amenitiesExist) {
      throw new BadRequestException("One or more amenity IDs are invalid");
    }

    const property = await this.propertyRepository.createProperty({
      hostId,
      ...data,
    });

    return PropertyResponseDto.fromEntity(property);
  }
}
