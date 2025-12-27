import { LoginUseCase } from "./use-cases/login.use-case.js";
import { RegisterUserUseCase } from "./use-cases/register-user.use-case";
import { Module } from "@nestjs/common";
import { PrismaService } from "../../shared/database/prisma.service.js";
import { IAuthRepository } from "./repositories/interface/auth.repository.js";
import { AuthRepository } from "./repositories/auth.repository.js";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./controllers/auth.controller.js";
@Module({
  imports: [
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "7d" },
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    LoginUseCase,
    RegisterUserUseCase,
    {
      provide: IAuthRepository,
      useClass: AuthRepository,
    },
  ],
  exports: [IAuthRepository],
})
export class AuthModule {}
