import { ValidationPipe } from "@nestjs/common";
import { NestFactory } from "@nestjs/core";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";
import { ZodValidationPipe } from "nestjs-zod";
import { AppModule } from "./app.module";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ZodValidationPipe(),
    new ValidationPipe({
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    })
  );

  const config = new DocumentBuilder()
    .setTitle("Clean Architecture Reservation System")
    .setDescription("API para sistema de reservas seguindo Clean Architecture")
    .setVersion("1.0")
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup("api/docs", app, document);

  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
