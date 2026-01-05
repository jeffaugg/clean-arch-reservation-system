import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
} from "@nestjs/common";
import { AmenityResponseDto } from "../dto/amenity-response.dto";
import { CreateAmenityDto } from "../dto/create-amenity.dto";
import { CreateAmenityUseCase } from "../use-cases/create-amenity.use-case";
import { ListAmenitiesUseCase } from "../use-cases/list-amenities.use-case";

@Controller("amenities")
export class AmenityController {
  constructor(
    private readonly createAmenityUseCase: CreateAmenityUseCase,
    private readonly listAmenitiesUseCase: ListAmenitiesUseCase
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() body: CreateAmenityDto): Promise<AmenityResponseDto> {
    return this.createAmenityUseCase.execute(body);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  async list(): Promise<AmenityResponseDto[]> {
    return this.listAmenitiesUseCase.execute();
  }
}
