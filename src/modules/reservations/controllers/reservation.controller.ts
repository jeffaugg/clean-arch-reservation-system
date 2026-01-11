import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateReservationUseCase } from "../user-cases/create-reservation.use-case";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import {
  CreateReservationData,
  createReservationSchema,
} from "../dto/create-reservation.dto";
import { AuthGuard } from "src/modules/auth/auth.guard";

type AuthedRequest = Request & { userId: string };

@ApiTags("reservations")
@ApiBearerAuth()
@Controller("reservations")
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
  ) {}

  @UseGuards(AuthGuard)
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Reserva criada com sucesso" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReservationResponseDto })
  async create(
    @Body() body: unknown,
    @Req() req: AuthedRequest,
  ): Promise<ReservationResponseDto> {
    const guestId = req.userId;
    const data: CreateReservationData = createReservationSchema.parse(body);
    return this.createReservationUseCase.execute(data, guestId);
  }
}
