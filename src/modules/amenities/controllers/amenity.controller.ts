import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { AmenityResponseDto } from "../dto/amenity-response.dto";
import { CreateAmenityDto } from "../dto/create-amenity.dto";
import { CreateAmenityUseCase } from "../use-cases/create-amenity.use-case";
import { ListAmenitiesUseCase } from "../use-cases/list-amenities.use-case";

@ApiTags("amenities")
@ApiBearerAuth()
@Controller("amenities")
export class AmenityController {
  constructor(
    private readonly createAmenityUseCase: CreateAmenityUseCase,
    private readonly listAmenitiesUseCase: ListAmenitiesUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Criar nova comodidade" })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Comodidade criada com sucesso",
    type: AmenityResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: "Comodidade já existe",
  })
  async create(@Body() body: CreateAmenityDto): Promise<AmenityResponseDto> {
    return this.createAmenityUseCase.execute(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar todas as comodidades" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de comodidades",
    type: [AmenityResponseDto],
  })
  async list(): Promise<AmenityResponseDto[]> {
    return this.listAmenitiesUseCase.execute();
  }
}
