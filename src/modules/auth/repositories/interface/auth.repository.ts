import { Prisma, User } from "generated/prisma/client";

export abstract class IAuthRepository {
  abstract findByEmail(email: string): Promise<User | null>;
  abstract create(data: Prisma.UserCreateInput): Promise<User>;
}
