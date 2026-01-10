import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
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
import { AvailabilityResponseDto } from "../dto/availability-response.dto";
import { CreatePropertyDto } from "../dto/create-property.dto";
import { ListPropertiesQueryDto } from "../dto/list-properties-query.dto";
import { PaginatedPropertiesDto } from "../dto/paginated-properties.dto";
import { PropertyDetailsResponseDto } from "../dto/property-details-response.dto";
import { PropertyResponseDto } from "../dto/property-response.dto";
import { SetAvailabilityDto } from "../dto/set-availability.dto";
import { CreatePropertyUseCase } from "../use-cases/create-property.use-case";
import { GetPropertyDetailsUseCase } from "../use-cases/get-property-details.use-case";
import { ListPropertiesUseCase } from "../use-cases/list-properties.use-case";
import { SetAvailabilityUseCase } from "../use-cases/set-availability.use-case";

@ApiTags("properties")
@Controller("properties")
export class PropertyController {
  constructor(
    private readonly createPropertyUseCase: CreatePropertyUseCase,
    private readonly listPropertiesUseCase: ListPropertiesUseCase,
    private readonly getPropertyDetailsUseCase: GetPropertyDetailsUseCase,
    private readonly setAvailabilityUseCase: SetAvailabilityUseCase
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

  @Get(":id")
  @IsPublic()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Buscar detalhes completos de um imóvel" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Detalhes do imóvel",
    type: PropertyDetailsResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Imóvel não encontrado",
  })
  async getById(@Param("id") id: string): Promise<PropertyDetailsResponseDto> {
    return this.getPropertyDetailsUseCase.execute(id);
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

  @Post(":id/availability")
  @ApiBearerAuth()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Gerenciar disponibilidade de um imóvel" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Disponibilidade configurada com sucesso",
    type: AvailabilityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Imóvel não encontrado",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Apenas o anfitrião pode gerenciar disponibilidade",
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Data possui reserva confirmada",
  })
  async setAvailability(
    @Param("id") propertyId: string,
    @Body() dto: SetAvailabilityDto,
    @ActiveUserId() hostId: string
  ): Promise<AvailabilityResponseDto> {
    return this.setAvailabilityUseCase.execute({
      propertyId,
      hostId,
      date: dto.date,
      isBlocked: dto.isBlocked,
      priceOverride: dto.priceOverride,
    });
  }
}
