import { Module } from "@nestjs/common";
import { PrismaService } from "src/shared/database/prisma.service";
import { PropertyController } from "./controllers/property.controller";
import { IPropertyRepository } from "./repositories/interface/property.repository";
import { PropertyRepository } from "./repositories/property.repository";
import { CreatePropertyUseCase } from "./use-cases/create-property.use-case";
import { ListPropertiesUseCase } from "./use-cases/list-properties.use-case";

@Module({
  controllers: [PropertyController],
  providers: [
    PrismaService,
    CreatePropertyUseCase,
    ListPropertiesUseCase,
    {
      provide: IPropertyRepository,
      useClass: PropertyRepository,
    },
  ],
})
export class PropertyModule {}
