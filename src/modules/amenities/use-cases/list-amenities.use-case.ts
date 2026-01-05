import { Injectable } from "@nestjs/common";
import { Amenity } from "generated/prisma/client";
import type { IAmenityRepository } from "../repositories/interface/amenity.repository";

@Injectable()
export class ListAmenitiesUseCase {
  constructor(private readonly amenityRepository: IAmenityRepository) {}

  async execute(): Promise<Amenity[]> {
    return this.amenityRepository.findAll();
  }
}
