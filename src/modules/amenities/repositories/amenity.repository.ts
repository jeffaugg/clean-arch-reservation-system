import { Injectable } from "@nestjs/common";
import { Amenity } from "generated/prisma/client";
import { PrismaService } from "src/shared/database/prisma.service";
import { CreateAmenityDto } from "../dto/create-amenity.dto";
import { IAmenityRepository } from "./interface/amenity.repository";

@Injectable()
export class AmenityRepository implements IAmenityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateAmenityDto): Promise<Amenity> {
    return this.prisma.amenity.create({
      data,
    });
  }

  async findAll(): Promise<Amenity[]> {
    return this.prisma.amenity.findMany({
      orderBy: { name: "asc" },
    });
  }

  async findByName(name: string): Promise<Amenity | null> {
    return this.prisma.amenity.findUnique({
      where: { name },
    });
  }
}
