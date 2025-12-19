import { Injectable } from "@nestjs/common";

import { IAuthRepository } from "./interface/auth.repository";
import { User } from "generated/prisma/client";
import { PrismaService } from "src/shared/database/prisma.service";

@Injectable()
export class AuthRepository implements IAuthRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }
}
