import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginUseCase } from "../use-cases/login.use-case";
import { RegisterUserUseCase } from "../use-cases/register-user.use-case";
import { LoginDto } from "../dto/login.dto";
import { RegisterDto } from "../dto/register.dto";
import { IsPublic } from "src/shared/decorators/isPublic";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUserUseCase,
  ) {}

  @IsPublic()
  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @IsPublic()
  @Post("register")
  @HttpCode(HttpStatus.CREATED)
  async register(@Body() body: RegisterDto) {
    return this.registerUseCase.execute(body);
  }
}
