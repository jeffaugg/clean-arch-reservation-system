import { Injectable, NotFoundException } from "@nestjs/common";
import {
  IPropertyRepository,
  PropertyReviewModel,
} from "../repositories/interface/property.repository";

@Injectable()
export class ListPropertyReviewsUseCase {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(propertyId: string): Promise<PropertyReviewModel[]> {
    const property = await this.propertyRepository.findById(propertyId);

    if (!property) {
      throw new NotFoundException("Property not found");
    }

    return this.propertyRepository.findReviewsByPropertyId(propertyId);
  }
}
