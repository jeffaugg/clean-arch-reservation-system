import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { CreateReservationUseCase } from "../user-cases/create-reservation.use-case";
import { CancelReservationUseCase } from "../user-cases/cancel-reservation.use-case";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { CancelReservationResponseDto } from "../dto/cancel-reservation.dto";
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
    private readonly cancelReservationUseCase: CancelReservationUseCase,
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

  @UseGuards(AuthGuard)
  @Patch(":id/cancel")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Cancelar uma reserva" })
  @ApiParam({
    name: "id",
    description: "ID da reserva a ser cancelada",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    type: CancelReservationResponseDto,
    description: "Reserva cancelada com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Não é possível cancelar reservas passadas ou em andamento",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Apenas o hóspede ou o host podem cancelar a reserva",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  async cancel(
    @Param("id") reservationId: string,
    @Req() req: AuthedRequest,
  ): Promise<CancelReservationResponseDto> {
    const userId = req.userId;
    return this.cancelReservationUseCase.execute(reservationId, userId);
  }
}
