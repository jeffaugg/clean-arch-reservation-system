import { PrismaClient } from "@prisma/client/extension";

const prisma = new PrismaClient();

async function main() {
  console.log("Starting seed...");

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
