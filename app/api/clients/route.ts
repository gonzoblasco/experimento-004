import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" }
  });
  return NextResponse.json(
    clients.map((client) => ({
      id: client.id,
      name: client.name,
      phone: client.phone ?? null,
      email: client.email ?? null,
      notes: client.notes ?? null
    }))
  );
}

export async function POST(request: Request) {
  const body = await request.json();
  const { name, phone, email, notes } = body;

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  const client = await prisma.client.create({
    data: {
      name,
      phone: phone ?? null,
      email: email ?? null,
      notes: notes ?? null
    }
  });

  return NextResponse.json({
    id: client.id,
    name: client.name,
    phone: client.phone,
    email: client.email,
    notes: client.notes
  }, { status: 201 });
}
