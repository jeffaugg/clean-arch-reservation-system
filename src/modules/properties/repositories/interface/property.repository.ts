export interface CreatePropertyData {
  hostId: string;
  title: string;
  description: string;
  address: string;
  city: string;
  latitude: number;
  longitude: number;
  maxGuests: number;
  basePrice: number;
  cleaningFee: number;
  imageUrls: string[];
  amenityIds: string[];
}

export interface ListPropertiesFilters {
  city?: string;
  maxPrice?: number;
  guests?: number;
}

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
}

export abstract class IPropertyRepository {
  abstract createProperty(data: CreatePropertyData): Promise<any>;
  abstract validateAmenityIds(amenityIds: string[]): Promise<boolean>;
  abstract listProperties(
    filters: ListPropertiesFilters,
    pagination: PaginationParams
  ): Promise<PaginatedResult<any>>;
  abstract findById(propertyId: string): Promise<any | null>;
}
