import { Global, Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module.js";
import { AppController } from "./app.controller.js";
import { AppService } from "./app.service.js";
import { APP_GUARD } from "@nestjs/core";
import { AuthGuard } from "./modules/auth/auth.guard.js";
import { ConfigModule } from "@nestjs/config";
import { StorageModule } from "./modules/storage/storage.module.js";
import { StorageProviderModule } from "./shared/container/providers/storage/storage.module.js";

@Global()
@Module({
  imports: [
    AuthModule,
    StorageModule,
    StorageProviderModule,
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
