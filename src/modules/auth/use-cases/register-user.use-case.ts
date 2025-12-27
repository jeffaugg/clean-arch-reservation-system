import { ConflictException, Injectable } from "@nestjs/common";
import * as bcrypt from "bcryptjs";
import { RegisterDto } from "../dto/register.dto";
import { UserResponseDto } from "../dto/user-response.dto";
import { IAuthRepository } from "../repositories/interface/auth.repository";

@Injectable()
export class RegisterUserUseCase {
  constructor(private readonly authRepository: IAuthRepository) {}

  async execute(input: RegisterDto): Promise<UserResponseDto> {
    const userExists = await this.authRepository.findByEmail(input.email);

    if (userExists) {
      throw new ConflictException("Este e-mail já está em uso.");
    }

    const passwordHash = await bcrypt.hash(input.password, 10);

    const newUser = await this.authRepository.create({
      name: input.name,
      email: input.email,
      passwordHash: passwordHash,
      phone: input.phone,
    });

    return UserResponseDto.fromEntity(newUser);
  }
}
