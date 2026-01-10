import { ApiPropertyOptional } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsInt, IsNumber, IsOptional, IsString, Min } from "class-validator";

export class ListPropertiesQueryDto {
  @ApiPropertyOptional({ description: "Número da página", default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ description: "Itens por página", default: 10 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 10;

  @ApiPropertyOptional({ description: "Cidade" })
  @IsOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional({ description: "Preço máximo" })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ description: "Número de hóspedes" })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  guests?: number;
}
