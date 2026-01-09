import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { ActiveUserId } from "src/shared/decorators/activeUserId";
import { IsPublic } from "src/shared/decorators/isPublic";
import { CreatePropertyDto } from "../dto/create-property.dto";
import { ListPropertiesQueryDto } from "../dto/list-properties-query.dto";
import { PaginatedPropertiesDto } from "../dto/paginated-properties.dto";
import { PropertyResponseDto } from "../dto/property-response.dto";
import { CreatePropertyUseCase } from "../use-cases/create-property.use-case";
import { ListPropertiesUseCase } from "../use-cases/list-properties.use-case";

@ApiTags("properties")
@Controller("properties")
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase
  ) {}

  @Get()
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar imóveis com filtros e paginação" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de imóveis paginada",
    type: PaginatedPropertiesDto,
  })
  async list(
    @Query() query: ListPropertiesQueryDto
  ): Promise<PaginatedPropertiesDto> {
    return this.listPropertiesUseCase.execute({
      page: Number(query.page) || 1,
      limit: Number(query.limit) || 10,
      city: query.city,
      maxPrice: query.maxPrice ? Number(query.maxPrice) : undefined,
      guests: query.guests ? Number(query.guests) : undefined,
    });
  }

  @Post()
  @ApiBearerAuth()
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
