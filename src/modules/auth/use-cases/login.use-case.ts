import { Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from "bcryptjs";
import { LoginDto } from "../dto/login.dto";
import { IAuthRepository } from "../repositories/interface/auth.repository";

export interface LoginResponse {
  accessToken: string;
}

@Injectable()
export class LoginUseCase {
  constructor(
    private readonly authRepository: IAuthRepository,
    private readonly jwtService: JwtService,
  ) {}

  async execute(input: LoginDto): Promise<LoginResponse> {
    const user = await this.authRepository.findByEmail(input.email);

    if (!user) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const isPasswordValid = await bcrypt.compare(
      input.password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException("Credenciais inválidas");
    }

    const payload = { sub: user.id, email: user.email, name: user.name };

    const accessToken = await this.jwtService.signAsync(payload);

    return { accessToken };
  }
}
