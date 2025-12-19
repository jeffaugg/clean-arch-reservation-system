import { PrismaService } from "src/shared/database/prisma.service";
import { IAuthRepository } from "./repositories/interface/auth.repository";
import { Module } from "@nestjs/common";
import { AuthRepository } from "./repositories/auth.repository";

@Module({
  providers: [
    PrismaService,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
  ],
  exports: [IAuthRepository],
})
export class AuthModule {}
