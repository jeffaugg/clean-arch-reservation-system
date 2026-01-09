import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/client";
import { PrismaService } from "src/shared/database/prisma.service";
import {
  CreatePropertyData,
  IPropertyRepository,
} from "./interface/property.repository";

@Injectable()
export class PropertyRepository implements IPropertyRepository {
  constructor(private readonly prisma: PrismaService) {}

  async validateAmenityIds(amenityIds: string[]): Promise<boolean> {
    const count = await this.prisma.amenity.count({
      where: {
        id: { in: amenityIds },
      },
    });

    return count === amenityIds.length;
  }

  async createProperty(data: CreatePropertyData) {
    return this.prisma.$transaction(async (tx) => {
      const property = await tx.property.create({
        data: {
          hostId: data.hostId,
          title: data.title,
          description: data.description,
          address: data.address,
          city: data.city,
          latitude: new Decimal(data.latitude),
          longitude: new Decimal(data.longitude),
          maxGuests: data.maxGuests,
          basePrice: new Decimal(data.basePrice),
          cleaningFee: new Decimal(data.cleaningFee),
          images: {
            create: data.imageUrls.map((url, index) => ({
              url,
              isMain: index === 0,
            })),
          },
          amenities: {
            create: data.amenityIds.map((amenityId) => ({
              amenityId,
            })),
          },
        },
        include: {
          images: true,
          amenities: {
            include: {
              amenity: true,
            },
          },
        },
      });

      return property;
    });
  }
}
