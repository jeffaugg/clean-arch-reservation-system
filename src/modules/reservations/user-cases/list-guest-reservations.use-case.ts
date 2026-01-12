import { Injectable } from "@nestjs/common";
import { ReservationResponseDto } from "../dto/reservation-response.dto";
import { IReservationRepository } from "../repositories/interface/reservation.repository";

@Injectable()
export class ListGuestReservationsUseCase {
  constructor(private readonly reservationRepository: IReservationRepository) {}

  async execute(guestId: string): Promise<ReservationResponseDto[]> {
    const reservations =
      await this.reservationRepository.findByGuestId(guestId);
    return reservations.map(ReservationResponseDto.fromPrisma);
  }
}
