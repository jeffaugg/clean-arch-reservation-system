import { Controller, Get } from "@nestjs/common";
import { AppService } from "./app.service";
import { IsPublic } from "./shared/decorators/isPublic";

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @IsPublic()
  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
