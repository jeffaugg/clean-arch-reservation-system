import { PrismaPg } from "@prisma/adapter-pg";
import * as bcrypt from "bcryptjs";
import { Prisma, PrismaClient } from "generated/prisma/client";
import { Pool } from "pg";

// Configuração do Adapter para rodar em script isolado
const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function dateOnlyUtc(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

async function main() {
  console.log("Starting seed...");

  // -------------------------
  // 1) Amenities
  // -------------------------
  const amenities = [
    {
      name: "Wi-Fi",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/93/93158.png",
    },
    {
      name: "Piscina",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png",
    },
    {
      name: "Ar Condicionado",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png",
    },
    {
      name: "Estacionamento",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097038.png",
    },
    {
      name: "Cozinha",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/1198/1198314.png",
    },
    {
      name: "TV",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/716/716429.png",
    },
    {
      name: "Academia",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png",
    },
    {
      name: "Pet Friendly",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png",
    },
    {
      name: "Churrasqueira",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448653.png",
    },
    {
      name: "Lavanderia",
      iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png",
    },
  ];

  for (const amenity of amenities) {
    await prisma.amenity.upsert({
      where: { name: amenity.name },
      update: {},
      create: amenity,
    });
  }

  const amenityRows = await prisma.amenity.findMany();
  const amenityIdByName = new Map(amenityRows.map((a) => [a.name, a.id]));

  // -------------------------
  // 2) Users (hosts + guests)
  // -------------------------
  const passwordHash = await bcrypt.hash("123456", 10);

  const host1 = await prisma.user.upsert({
    where: { email: "host1@mail.com" },
    update: { name: "Host 1" },
    create: {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "Host 1",
      email: "host1@mail.com",
      passwordHash,
      phone: "+55 85 99999-0001",
    },
  });

  const host2 = await prisma.user.upsert({
    where: { email: "host2@mail.com" },
    update: { name: "Host 2" },
    create: {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Host 2",
      email: "host2@mail.com",
      passwordHash,
      phone: "+55 88 99999-0002",
    },
  });

  const guest1 = await prisma.user.upsert({
    where: { email: "guest1@mail.com" },
    update: { name: "Guest 1" },
    create: {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name: "Guest 1",
      email: "guest1@mail.com",
      passwordHash,
      phone: "+55 85 99999-1001",
    },
  });

  const guest2 = await prisma.user.upsert({
    where: { email: "guest2@mail.com" },
    update: { name: "Guest 2" },
    create: {
      id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      name: "Guest 2",
      email: "guest2@mail.com",
      passwordHash,
      phone: "+55 88 99999-2002",
    },
  });

  // -------------------------
  // 3) Properties (+ images + amenities + calendar)
  // -------------------------
  const properties = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      hostId: host1.id,
      title: "Loft moderno perto da praia",
      description:
        "Loft completo, confortável e bem localizado. Ideal para casal.",
      address: "Av. Beira Mar, 1000",
      city: "Fortaleza",
      latitude: "-3.71722000",
      longitude: "-38.54337000",
      maxGuests: 2,
      basePrice: "180.00",
      cleaningFee: "50.00",
      images: [
        "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
      ],
      amenityNames: ["Wi-Fi", "Ar Condicionado", "Cozinha", "TV"],
      calendar: [
        { date: "2026-01-15", isBlocked: true },
        { date: "2026-01-20", isBlocked: false, priceOverride: "220.00" },
      ],
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      hostId: host1.id,
      title: "Casa com piscina e churrasqueira",
      description:
        "Casa ampla com lazer completo. Ótima para família e amigos.",
      address: "Rua das Palmeiras, 250",
      city: "Fortaleza",
      latitude: "-3.73186000",
      longitude: "-38.52667000",
      maxGuests: 8,
      basePrice: "520.00",
      cleaningFee: "120.00",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
      ],
      amenityNames: [
        "Wi-Fi",
        "Piscina",
        "Churrasqueira",
        "Estacionamento",
        "Pet Friendly",
      ],
      calendar: [
        { date: "2026-01-12", isBlocked: true },
        { date: "2026-01-13", isBlocked: true },
      ],
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      hostId: host2.id,
      title: "Apartamento central com garagem",
      description: "Perto de tudo, fácil acesso, confortável e seguro.",
      address: "Rua Central, 45",
      city: "Quixadá",
      latitude: "-4.96611000",
      longitude: "-39.01528000",
      maxGuests: 4,
      basePrice: "160.00",
      cleaningFee: "40.00",
      images: [
        "https://images.unsplash.com/photo-1523217582562-09d0def993a6",
        "https://images.unsplash.com/photo-1501183638710-841dd1904471",
      ],
      amenityNames: ["Wi-Fi", "Estacionamento", "Cozinha", "TV", "Lavanderia"],
      calendar: [
        { date: "2026-02-01", isBlocked: false, priceOverride: "190.00" },
      ],
    },
  ];

  for (const p of properties) {
    const exists = await prisma.property.findUnique({ where: { id: p.id } });
    if (exists) continue;

    const amenityIds: string[] = [];
    for (const name of p.amenityNames) {
      const id = amenityIdByName.get(name);
      if (id) amenityIds.push(id);
    }

    await prisma.property.create({
      data: {
        id: p.id,
        hostId: p.hostId,
        title: p.title,
        description: p.description,
        address: p.address,
        city: p.city,
        latitude: new Prisma.Decimal(p.latitude),
        longitude: new Prisma.Decimal(p.longitude),
        maxGuests: p.maxGuests,
        basePrice: new Prisma.Decimal(p.basePrice),
        cleaningFee: new Prisma.Decimal(p.cleaningFee),
        images: {
          create: p.images.map((url, idx) => ({
            url,
            isMain: idx === 0,
          })),
        },
        amenities: {
          create: amenityIds.map((amenityId) => ({ amenityId })),
        },
        calendar: {
          create: p.calendar.map((c) => {
            const payload: any = {
              date: dateOnlyUtc(c.date),
              isBlocked: c.isBlocked,
            };
            if (c.priceOverride)
              payload.priceOverride = new Prisma.Decimal(c.priceOverride);
            return payload;
          }),
        },
      },
    });
  }

  // -------------------------
  // 4) Reservations
  // -------------------------
  // A) CONFIRMED
  await prisma.reservation.upsert({
    where: { id: "r1111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "r1111111-1111-1111-1111-111111111111",
      propertyId: "11111111-1111-1111-1111-111111111111",
      guestId: guest1.id,
      checkIn: dateOnlyUtc("2026-01-08"),
      checkOut: dateOnlyUtc("2026-01-10"),
      guestCount: 2,
      totalPrice: new Prisma.Decimal("410.00"),
      status: "CONFIRMED",
    },
  });

  // B) PENDING (Recente)
  await prisma.reservation.upsert({
    where: { id: "r2222222-2222-2222-2222-222222222222" },
    update: {},
    create: {
      id: "r2222222-2222-2222-2222-222222222222",
      propertyId: "33333333-3333-3333-3333-333333333333",
      guestId: guest2.id,
      checkIn: dateOnlyUtc("2026-02-10"),
      checkOut: dateOnlyUtc("2026-02-12"),
      guestCount: 2,
      totalPrice: new Prisma.Decimal("360.00"),
      status: "PENDING",
    },
  });

  // C) PENDING (Antigo)
  await prisma.reservation.upsert({
    where: { id: "r3333333-3333-3333-3333-333333333333" },
    update: {},
    create: {
      id: "r3333333-3333-3333-3333-333333333333",
      propertyId: "22222222-2222-2222-2222-222222222222",
      guestId: guest1.id,
      checkIn: dateOnlyUtc("2026-01-25"),
      checkOut: dateOnlyUtc("2026-01-27"),
      guestCount: 4,
      totalPrice: new Prisma.Decimal("1160.00"),
      status: "PENDING",
      createdAt: new Date(Date.now() - 31 * 60 * 1000),
    },
  });

  // -------------------------
  // 5) Payments
  // -------------------------
  await prisma.payment.upsert({
    where: { id: "p11111111-1111-1111-1111-111111111111" },
    update: {},
    create: {
      id: "p11111111-1111-1111-1111-111111111111",
      reservationId: "r2222222-2222-2222-2222-222222222222",
      provider: "mock",
      transactionId: "tx_mock_1",
      amount: new Prisma.Decimal("360.00"),
      status: "PENDING",
    },
  });

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Fecha conexão do Pool também
  });
