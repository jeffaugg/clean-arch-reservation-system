import { Injectable } from "@nestjs/common";
import { Decimal } from "@prisma/client/runtime/client";
import { PrismaService } from "src/shared/database/prisma.service";
import {
  CreatePropertyData,
  IPropertyRepository,
  ListPropertiesFilters,
  PaginatedResult,
  PaginationParams,
  PropertyReviewModel,
  SetAvailabilityData,
} from "./interface/property.repository";
import { AvailabilityCalendar } from "generated/prisma/client";

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

  async listProperties(
    filters: ListPropertiesFilters,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<any>> {
    const where: any = {};

    if (filters.city) {
      where.city = {
        contains: filters.city,
        mode: "insensitive",
      };
    }

    if (filters.maxPrice) {
      where.basePrice = {
        lte: new Decimal(filters.maxPrice),
      };
    }

    if (filters.guests) {
      where.maxGuests = {
        gte: filters.guests,
      };
    }

    const skip = (pagination.page - 1) * pagination.limit;

    const [data, total] = await Promise.all([
      this.prisma.property.findMany({
        where,
        skip,
        take: pagination.limit,
        select: {
          id: true,
          title: true,
          city: true,
          maxGuests: true,
          basePrice: true,
          images: {
            where: { isMain: true },
            select: {
              id: true,
              url: true,
            },
            take: 1,
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      }),
      this.prisma.property.count({ where }),
    ]);

    return { data, total };
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

  async findById(propertyId: string) {
    return this.prisma.property.findUnique({
      where: { id: propertyId },
      include: {
        images: {
          orderBy: {
            isMain: "desc",
          },
        },
        amenities: {
          include: {
            amenity: true,
          },
        },
        host: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });
  }

  async findPropertyHostId(propertyId: string): Promise<string | null> {
    const property = await this.prisma.property.findUnique({
      where: { id: propertyId },
      select: { hostId: true },
    });

    return property?.hostId || null;
  }

  async hasConfirmedReservationOnDate(
    propertyId: string,
    date: Date,
  ): Promise<boolean> {
    const count = await this.prisma.reservation.count({
      where: {
        propertyId,
        status: "CONFIRMED",
        checkIn: { lte: date },
        checkOut: { gt: date },
      },
    });

    return count > 0;
  }

  async setAvailability(data: SetAvailabilityData) {
    return this.prisma.availabilityCalendar.upsert({
      where: {
        propertyId_date: {
          propertyId: data.propertyId,
          date: data.date,
        },
      },
      create: {
        propertyId: data.propertyId,
        date: data.date,
        isBlocked: data.isBlocked,
        priceOverride: data.priceOverride
          ? new Decimal(data.priceOverride)
          : null,
      },
      update: {
        isBlocked: data.isBlocked,
        priceOverride: data.priceOverride
          ? new Decimal(data.priceOverride)
          : null,
      },
    });
  }

  async findCalendarBetween(
    propertyId: string,
    startDate: Date,
    endDate: Date,
  ): Promise<AvailabilityCalendar[]> {
    return this.prisma.availabilityCalendar.findMany({
      where: {
        propertyId,
        date: {
          gte: startDate,
          lt: endDate,
        },
      },
      orderBy: { date: "asc" },
    });
  }

  async findReviewsByPropertyId(
    propertyId: string,
  ): Promise<PropertyReviewModel[]> {
    const reviews = await this.prisma.review.findMany({
      where: {
        reservation: {
          propertyId,
        },
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return reviews.map((review) => ({
      id: review.id,
      rating: review.rating,
      comment: review.comment,
      createdAt: review.createdAt,
      author: {
        id: review.author.id,
        name: review.author.name,
      },
    }));
  }
}
