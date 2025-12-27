import { createZodDto } from "nestjs-zod";
import { z } from "zod";

const registerSchema = z.object({
  name: z.string().min(2, "Nome deve ter pelo menos 2 caracteres"),
  email: z.email("E-mail inválido"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres"),
  phone: z.string().optional(),
});

export class RegisterDto extends createZodDto(registerSchema) {}
