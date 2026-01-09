import { Injectable } from "@nestjs/common";
import {
  PaginatedPropertiesDto,
  PropertyListItemDto,
} from "../dto/paginated-properties.dto";
import { IPropertyRepository } from "../repositories/interface/property.repository";

export interface ListPropertiesInput {
  page: number;
  limit: number;
  city?: string;
  maxPrice?: number;
  guests?: number;
}

@Injectable()
export class ListPropertiesUseCase {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(input: ListPropertiesInput): Promise<PaginatedPropertiesDto> {
    const { page, limit, city, maxPrice, guests } = input;

    const { data, total } = await this.propertyRepository.listProperties(
      { city, maxPrice, guests },
      { page, limit }
    );

    const properties = data.map((property) =>
      PropertyListItemDto.fromPrisma(property)
    );

    return {
      data: properties,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}
