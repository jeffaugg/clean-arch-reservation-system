import { ApiProperty } from "@nestjs/swagger";
import { Transform } from "class-transformer";
import {
  IsBoolean,
  IsDateString,
  IsNumber,
  IsOptional,
  Min,
} from "class-validator";

export class SetAvailabilityDto {
  @ApiProperty({
    example: "2026-12-25",
    description: "Data no formato YYYY-MM-DD",
  })
  @IsDateString()
  date: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  isBlocked: boolean;

  @ApiProperty({ required: false, example: 350.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Transform(({ value }) => (value ? Number(value) : undefined))
  priceOverride?: number;
}
