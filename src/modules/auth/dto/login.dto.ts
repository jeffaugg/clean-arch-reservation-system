import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const loginSchema = z.object({
  email: z.email({ message: "E-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "A senha deve ter no mínimo 6 caracteres" }),
});

export class LoginDto extends createZodDto(loginSchema) {}
