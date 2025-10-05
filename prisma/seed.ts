import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  await prisma.financeEntry.deleteMany();
  await prisma.appointment.deleteMany();
  await prisma.client.deleteMany();

  await prisma.client.createMany({
    data: [
      {
        name: "Alex Rivera",
        phone: "555-0102",
        email: "alex@example.com",
        notes: "Prefers morning appointments"
      },
      {
        name: "Jordan Kim",
        phone: "555-0178",
        email: "jordan@example.com",
        notes: "Color touch-up every 6 weeks"
      }
    ]
  });

  const clientRecords = await prisma.client.findMany();

  const alex = clientRecords.find((client) => client.name === "Alex Rivera");
  const jordan = clientRecords.find((client) => client.name === "Jordan Kim");

  const now = new Date();
  const todayMorning = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 9, 0, 0);

  await prisma.appointment.createMany({
    data: [
      {
        service: "Precision Cut",
        start: todayMorning,
        end: new Date(todayMorning.getTime() + 60 * 60 * 1000),
        price: 65,
        status: "SCHEDULED",
        clientId: alex?.id
      },
      {
        service: "Full Color",
        start: new Date(todayMorning.getTime() + 2 * 60 * 60 * 1000),
        end: new Date(todayMorning.getTime() + 4 * 60 * 60 * 1000),
        price: 180,
        status: "SCHEDULED",
        clientId: jordan?.id
      }
    ]
  });

  await prisma.financeEntry.createMany({
    data: [
      {
        type: "INCOME",
        amount: 220,
        category: "Haircut & color",
        notes: "Weekend bookings",
        occurredOn: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 1)
      },
      {
        type: "EXPENSE",
        amount: 45,
        category: "Supplies",
        notes: "Shampoo and color stock",
        occurredOn: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 2)
      },
      {
        type: "EXPENSE",
        amount: 30,
        category: "Coffee & snacks",
        notes: "Client refreshments",
        occurredOn: new Date(now.getFullYear(), now.getMonth(), now.getDate())
      }
    ]
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
