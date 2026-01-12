import { Injectable } from "@nestjs/common";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { IReservationRepository } from "../repositories/interface/reservation.repository";

@Injectable()
export class ListHostReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(hostId: string): Promise<ReservationResponseDto[]> {
    const reservations = await this.reservationRepository.findByHostId(hostId);
    return reservations.map(ReservationResponseDto.fromPrisma);
  }
}
