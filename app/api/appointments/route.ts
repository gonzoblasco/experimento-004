import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

function serializeAppointment(appointment: any) {
  return {
    id: appointment.id,
    service: appointment.service,
    start: appointment.start.toISOString(),
    end: appointment.end.toISOString(),
    price: Number(appointment.price),
    status: appointment.status,
    clientId: appointment.clientId,
    clientName: appointment.client?.name ?? null
  };
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fromParam = url.searchParams.get("from");
  const from = fromParam ? new Date(fromParam) : new Date();

  const appointments = await prisma.appointment.findMany({
    where: {
      start: {
        gte: from
      }
    },
    include: { client: true },
    orderBy: { start: "asc" }
  });

  return NextResponse.json(appointments.map(serializeAppointment));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { service, start, end, price, clientId, status } = body;

  if (!service || !start || !end || price === undefined) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const parsedPrice = Number(price);
  if (Number.isNaN(parsedPrice)) {
    return NextResponse.json({ error: "Invalid price" }, { status: 400 });
  }

  const appointment = await prisma.appointment.create({
    data: {
      service,
      start: new Date(start),
      end: new Date(end),
      price: parsedPrice,
      status: status ?? "SCHEDULED",
      clientId: clientId ?? null
    },
    include: { client: true }
  });

  return NextResponse.json(serializeAppointment(appointment), { status: 201 });
}
