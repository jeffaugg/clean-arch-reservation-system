import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import { LoginUseCase } from "../use-cases/login.use-case";
import { LoginDto } from "../dto/login.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post("login")
  @HttpCode(HttpStatus.OK)
  async login(@Body() body: LoginDto) {
    return this.loginUseCase.execute(body);
  }
}
