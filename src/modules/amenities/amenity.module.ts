import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { AmenityController } from "./controllers/amenity.controller";
import { IAmenityRepository } from "./repositories/interface/amenity.repository";
import { AmenityRepository } from "./repositories/amenity.repository";
import { CreateAmenityUseCase } from "./use-cases/create-amenity.use-case";
import { ListAmenitiesUseCase } from "./use-cases/list-amenities.use-case";

@Module({
  controllers: [AmenityController],
  providers: [
    PrismaService,
    CreateAmenityUseCase,
    ListAmenitiesUseCase,
    {
      provide: IAmenityRepository,
      useClass: AmenityRepository,
    },
  ],
  exports: [IAmenityRepository],
})
export class AmenityModule {}
