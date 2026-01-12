import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from "@nestjs/common";
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from "@nestjs/swagger";
import { Request } from "express";
import { ActiveUserId } from "src/shared/decorators/activeUserId";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { ListGuestReservationsUseCase } from "../user-cases/list-guest-reservations.use-case";
import { ListHostReservationsUseCase } from "../user-cases/list-host-reservations.use-case";
import { CreateReservationUseCase } from "../user-cases/create-reservation.use-case";
import { CancelReservationUseCase } from "../user-cases/cancel-reservation.use-case";
import { CancelReservationResponseDto } from "../dto/cancel-reservation.dto";
import {
  CreateReservationDto,
  createReservationSchema,
} from "../dto/create-reservation.dto";
import { CreateReservationResponse } from "../dto/create-reservation-response";
import { CreateReviewDto, createReviewSchema } from "../dto/create-review.dto";
import { CreateReviewUseCase } from "../user-cases/create-review.use-case";

type AuthedRequest = Request & { userId: string };

@ApiTags("reservations")
@ApiBearerAuth()
@Controller("reservations")
export class ReservationController {
  constructor(
    private readonly createReservationUseCase: CreateReservationUseCase,
    private readonly listGuestReservationsUseCase: ListGuestReservationsUseCase,
    private readonly listHostReservationsUseCase: ListHostReservationsUseCase,
    private readonly cancelReservationUseCase: CancelReservationUseCase,
    private readonly createReviewUseCase: CreateReviewUseCase,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Reserva criada com sucesso" })
  @ApiResponse({ status: HttpStatus.CREATED, type: ReservationResponseDto })
  async create(
    @Body() body: CreateReservationDto,
    @Req() req: AuthedRequest,
  ): Promise<CreateReservationResponse> {
    const guestId = req.userId;
    const data = createReservationSchema.parse(body);
    return this.createReservationUseCase.execute(data, guestId);
  }

  @Get("guest")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Listar minhas reservas (como hóspede)" })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de reservas feitas pelo usuário",
    type: [ReservationResponseDto],
  })
  async listAsGuest(
    @ActiveUserId() userId: string,
  ): Promise<ReservationResponseDto[]> {
    return this.listGuestReservationsUseCase.execute(userId);
  }

  @Get("host")
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: "Listar reservas nas minhas propriedades (como anfitrião)",
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: "Lista de reservas recebidas nas propriedades do usuário",
    type: [ReservationResponseDto],
  })
  async listAsHost(
    @ActiveUserId() hostId: string,
  ): Promise<ReservationResponseDto[]> {
    return this.listHostReservationsUseCase.execute(hostId);
  }

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

  @Post(":id/reviews")
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: "Criar review de uma reserva" })
  @ApiParam({
    name: "id",
    description: "ID da reserva a ser avaliada",
    example: "123e4567-e89b-12d3-a456-426614174000",
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: "Review criada com sucesso",
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: "Reserva ainda não pode ser avaliada",
  })
  @ApiResponse({
    status: HttpStatus.FORBIDDEN,
    description: "Apenas o hóspede da reserva pode avaliá-la",
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: "Reserva não encontrada",
  })
  async createReview(
    @Param("id") reservationId: string,
    @Req() req: AuthedRequest,
    @Body() body: CreateReviewDto,
  ): Promise<{ message: string }> {
    const guestId = req.userId;
    const data = createReviewSchema.parse(body);

    await this.createReviewUseCase.execute(reservationId, guestId, data);

    return { message: "Review created successfully" };
  }
}
