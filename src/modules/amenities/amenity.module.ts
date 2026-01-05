import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { AmenityController } from "./controllers/amenity.controller";
import { AmenityRepository } from "./repositories/amenity.repository";
import { AMENITY_REPOSITORY_TOKEN } from "./repositories/interface/amenity.repository";
import { CreateAmenityUseCase } from "./use-cases/create-amenity.use-case";
import { ListAmenitiesUseCase } from "./use-cases/list-amenities.use-case";

@Module({
  controllers: [AmenityController],
  providers: [
    PrismaService,
    CreateAmenityUseCase,
    ListAmenitiesUseCase,
    {
      provide: AMENITY_REPOSITORY_TOKEN,
      useClass: AmenityRepository,
    },
  ],
  exports: [AMENITY_REPOSITORY_TOKEN],
})
export class AmenityModule {}
