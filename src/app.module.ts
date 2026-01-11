import { Global, Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_GUARD } from "@nestjs/core";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { AmenityModule } from "./modules/amenities/amenity.module.js";
import { AuthGuard } from "./modules/auth/auth.guard.js";
import { AuthModule } from "./modules/auth/auth.module.js";
import { PropertyModule } from "./modules/properties/property.module.js";
import { StorageModule } from "./modules/storage/storage.module.js";
import { StorageProviderModule } from "./shared/container/providers/storage/storage.module.js";
import { ReservationModule } from "./modules/reservations/reservation.module.js";

@Global()
@Module({
  imports: [
    AuthModule,
    StorageModule,
    StorageProviderModule,
    AmenityModule,
    PropertyModule,
    ReservationModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
