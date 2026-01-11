import { Prisma } from "generated/prisma/client";

export type CreateReservationInput = {
  propertyId: string;
  guestId: string;
  checkIn: Date;
  checkOut: Date;
  guestCount: number;
  totalPrice: Prisma.Decimal;
};
