import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

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

export async function GET(request: Request) {
  const url = new URL(request.url);
  const fromParam = url.searchParams.get("from");
  const from = fromParam ? new Date(fromParam) : undefined;

  const entries = await prisma.financeEntry.findMany({
    where: from
      ? {
          occurredOn: {
            gte: from
          }
        }
      : undefined,
    orderBy: { occurredOn: "desc" }
  });

  return NextResponse.json(entries.map(serialize));
}

export async function POST(request: Request) {
  const body = await request.json();
  const { type, amount, category, notes, occurredOn } = body;

  if (!type || amount === undefined || !category || !occurredOn) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  const parsedAmount = Number(amount);
  if (Number.isNaN(parsedAmount)) {
    return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
  }

  const entry = await prisma.financeEntry.create({
    data: {
      type,
      amount: parsedAmount,
      category,
      notes: notes ?? null,
      occurredOn: new Date(occurredOn)
    }
  });

  return NextResponse.json(serialize(entry), { status: 201 });
}
