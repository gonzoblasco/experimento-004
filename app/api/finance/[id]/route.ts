import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

function serialize(entry: any) {
  return {
    id: entry.id,
    type: entry.type,
    amount: Number(entry.amount),
    category: entry.category,
    notes: entry.notes ?? null,
    occurredOn: entry.occurredOn.toISOString()
  };
}

export async function PUT(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }
  const body = await request.json();
  const data: Record<string, unknown> = {};

  if (body.type) data.type = body.type;
  if (body.category !== undefined) data.category = body.category;
  if (body.notes !== undefined) data.notes = body.notes ?? null;
  if (body.occurredOn) data.occurredOn = new Date(body.occurredOn);
  if (body.amount !== undefined) {
    const parsedAmount = Number(body.amount);
    if (Number.isNaN(parsedAmount)) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    data.amount = parsedAmount;
  }

  const entry = await prisma.financeEntry.update({
    where: { id },
    data
  });

  return NextResponse.json(serialize(entry));
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.financeEntry.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
