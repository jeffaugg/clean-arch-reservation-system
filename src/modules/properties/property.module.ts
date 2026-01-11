import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { PropertyController } from "./controllers/property.controller";
import { IPropertyRepository } from "./repositories/interface/property.repository";
import { PropertyRepository } from "./repositories/property.repository";
import { CreatePropertyUseCase } from "./use-cases/create-property.use-case";
import { GetPropertyDetailsUseCase } from "./use-cases/get-property-details.use-case";
import { ListPropertiesUseCase } from "./use-cases/list-properties.use-case";
import { SetAvailabilityUseCase } from "./use-cases/set-availability.use-case";

@Module({
  controllers: [PropertyController],
  providers: [
    PrismaService,
    CreatePropertyUseCase,
    ListPropertiesUseCase,
    GetPropertyDetailsUseCase,
    SetAvailabilityUseCase,
    {
      provide: IPropertyRepository,
      useClass: PropertyRepository,
    },
  ],
  exports: [IPropertyRepository],
})
export class PropertyModule {}
