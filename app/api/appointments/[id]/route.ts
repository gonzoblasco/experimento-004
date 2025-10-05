import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

function serialize(appointment: any) {
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

export async function PUT(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.service !== undefined) data.service = body.service;
  if (body.start) data.start = new Date(body.start);
  if (body.end) data.end = new Date(body.end);
  if (body.status) data.status = body.status;
  if (body.clientId !== undefined) data.clientId = body.clientId;
  if (body.price !== undefined) {
    const parsedPrice = Number(body.price);
    if (Number.isNaN(parsedPrice)) {
      return NextResponse.json({ error: "Invalid price" }, { status: 400 });
    }
    data.price = parsedPrice;
  }

  const appointment = await prisma.appointment.update({
    where: { id },
    data,
    include: { client: true }
  });

  return NextResponse.json(serialize(appointment));
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.appointment.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
