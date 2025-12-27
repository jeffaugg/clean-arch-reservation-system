import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginUseCase } from "../use-cases/login.use-case.js";
import { RegisterUserUseCase } from "../use-cases/register-user.use-case.js";
import { LoginDto } from "../dto/login.dto.js";
import { RegisterDto } from "../dto/register.dto.js";

@Controller("auth")
export class AuthController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly registerUseCase: RegisterUserUseCase,
  ) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }

  @Post("register")
  async register(@Body() body: RegisterDto) {
    return this.registerUseCase.execute(body);
  }
}
