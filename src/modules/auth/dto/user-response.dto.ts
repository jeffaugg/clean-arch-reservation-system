import { User } from "generated/prisma/client";

export class UserResponseDto {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  static fromEntity(user: User): UserResponseDto {
    const response = new UserResponseDto();
    response.id = user.id;
    response.name = user.name;
    response.email = user.email;
    response.createdAt = user.createdAt;
    return response;
  }
}
