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

export abstract class IPropertyRepository {
  abstract createProperty(data: CreatePropertyData): Promise<any>;
  abstract validateAmenityIds(amenityIds: string[]): Promise<boolean>;
}
