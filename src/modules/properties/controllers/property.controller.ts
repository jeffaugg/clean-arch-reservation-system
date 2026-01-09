import { Body, Controller, HttpCode, HttpStatus, Post } from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/activeUserId";
import { CreatePropertyDto } from "../dto/create-property.dto";
import { PropertyResponseDto } from "../dto/property-response.dto";
import { CreatePropertyUseCase } from "../use-cases/create-property.use-case";

@ApiTags("properties")
@ApiBearerAuth()
@Controller("properties")
export class PropertyController {
  constructor(private readonly createPropertyUseCase: CreatePropertyUseCase) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Criar novo imóvel" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Imóvel criado com sucesso",
    type: PropertyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Dados inválidos ou amenidades não existem",
  })
  async create(
    @Body() dto: CreatePropertyDto,
    @ActiveUserId() hostId: string
  ): Promise<PropertyResponseDto> {
    return this.createPropertyUseCase.execute(hostId, dto);
  }
}
