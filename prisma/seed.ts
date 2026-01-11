import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient, Prisma } from "generated/prisma/client"; // se não resolver, use path relativo
import * as bcrypt from "bcryptjs";

function dateOnlyUtc(date: string): Date {
  return new Date(`${date}T00:00:00.000Z`);
}

const prisma = new PrismaClient({
  adapter: new PrismaPg({
    connectionString: process.env.DATABASE_URL as string,
  }),
});

async function main() {
  console.log("Starting seed...");

  const amenities = [
    { name: "Wi-Fi", iconUrl: "https://cdn-icons-png.flaticon.com/512/93/93158.png" },
    { name: "Piscina", iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917995.png" },
    { name: "Ar Condicionado", iconUrl: "https://cdn-icons-png.flaticon.com/512/2331/2331970.png" },
    { name: "Estacionamento", iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097038.png" },
    { name: "Cozinha", iconUrl: "https://cdn-icons-png.flaticon.com/512/1198/1198314.png" },
    { name: "TV", iconUrl: "https://cdn-icons-png.flaticon.com/512/716/716429.png" },
    { name: "Academia", iconUrl: "https://cdn-icons-png.flaticon.com/512/2936/2936886.png" },
    { name: "Pet Friendly", iconUrl: "https://cdn-icons-png.flaticon.com/512/616/616408.png" },
    { name: "Churrasqueira", iconUrl: "https://cdn-icons-png.flaticon.com/512/3448/3448653.png" },
    { name: "Lavanderia", iconUrl: "https://cdn-icons-png.flaticon.com/512/2917/2917242.png" },
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

  const passwordHash = await bcrypt.hash("123456", 10);

  const host1 = await prisma.user.upsert({
    where: { email: "host1@mail.com" },
    update: { name: "Host 1" },
    create: {
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
      name: "Host 2",
      email: "host2@mail.com",
      passwordHash,
      phone: "+55 88 99999-0002",
    },
  });

  const properties = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      hostId: host1.id,
      title: "Loft moderno perto da praia",
      description: "Loft completo, confortável e bem localizado. Ideal para casal.",
      address: "Av. Beira Mar, 1000",
      city: "Fortaleza",
      latitude: " -3.71722",
      longitude: "-38.54337",
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
      description: "Casa ampla com lazer completo. Ótima para família e amigos.",
      address: "Rua das Palmeiras, 250",
      city: "Fortaleza",
      latitude: " -3.73186",
      longitude: "-38.52667",
      maxGuests: 8,
      basePrice: "520.00",
      cleaningFee: "120.00",
      images: [
        "https://images.unsplash.com/photo-1564013799919-ab600027ffc6",
        "https://images.unsplash.com/photo-1502005229762-cf1b2da7c5d6",
      ],
      amenityNames: ["Wi-Fi", "Piscina", "Churrasqueira", "Estacionamento", "Pet Friendly"],
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
      latitude: " -4.96611",
      longitude: "-39.01528",
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

            if (c.priceOverride) {
              payload.priceOverride = new Prisma.Decimal(c.priceOverride);
            }

            return payload;
          }),
        },
      },
    });
  }

  console.log("Seed completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
