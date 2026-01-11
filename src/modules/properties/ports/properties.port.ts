// properties.port.ts
import { Prisma } from "generated/prisma/client";

export type PropertyPricing = {
  basePrice: Prisma.Decimal;
  maxGuests: number;
  fees: Prisma.Decimal;
};

export abstract class IPropertyPort {
  abstract getPricing(propertyId: string): Promise<PropertyPricing>;
}
