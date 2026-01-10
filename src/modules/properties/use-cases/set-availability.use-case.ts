import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { AvailabilityResponseDto } from "../dto/availability-response.dto";
import { IPropertyRepository } from "../repositories/interface/property.repository";

export interface SetAvailabilityInput {
  propertyId: string;
  hostId: string;
  date: string;
  isBlocked: boolean;
  priceOverride?: number;
}

@Injectable()
export class SetAvailabilityUseCase {
  constructor(private readonly propertyRepository: IPropertyRepository) {}

  async execute(input: SetAvailabilityInput): Promise<AvailabilityResponseDto> {
    const propertyHostId = await this.propertyRepository.findPropertyHostId(
      input.propertyId
    );

    if (!propertyHostId) {
      throw new NotFoundException("Imóvel não encontrado");
    }

    if (propertyHostId !== input.hostId) {
      throw new ForbiddenException(
        "Apenas o anfitrião do imóvel pode gerenciar disponibilidade"
      );
    }

    const targetDate = new Date(input.date);

    const hasReservation =
      await this.propertyRepository.hasConfirmedReservationOnDate(
        input.propertyId,
        targetDate
      );

    if (hasReservation && input.isBlocked) {
      throw new ConflictException(
        "Não é possível bloquear uma data com reserva confirmada"
      );
    }

    const availability = await this.propertyRepository.setAvailability({
      propertyId: input.propertyId,
      date: targetDate,
      isBlocked: input.isBlocked,
      priceOverride: input.priceOverride,
    });

    return AvailabilityResponseDto.fromEntity(availability);
  }
}
