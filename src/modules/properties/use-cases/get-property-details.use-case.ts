import { Injectable, NotFoundException } from "@nestjs/common";
import { PropertyDetailsResponseDto } from "../dto/property-details-response.dto";
import { IPropertyRepository } from "../repositories/interface/property.repository";

@Injectable()
export class GetPropertyDetailsUseCase {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(propertyId: string): Promise<PropertyDetailsResponseDto> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException("Imóvel não encontrado");
    }

    return PropertyDetailsResponseDto.fromEntity(property);
  }
}
