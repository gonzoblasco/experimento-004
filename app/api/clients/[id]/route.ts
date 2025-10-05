import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = {
  params: {
    id: string;
  };
};

export async function PUT(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    const body = await request.json();
    const data: Record<string, unknown> = {};

    if (body.name !== undefined) data.name = body.name;
    if (body.phone !== undefined) data.phone = body.phone ?? null;
    if (body.email !== undefined) data.email = body.email ?? null;
    if (body.notes !== undefined) data.notes = body.notes ?? null;

    const client = await prisma.client.update({
      where: { id },
      data
    });

    return NextResponse.json({
      id: client.id,
      name: client.name,
      phone: client.phone,
      email: client.email,
      notes: client.notes
    });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Failed to update client" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  try {
    await prisma.client.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("Error deleting client:", error);
    return NextResponse.json(
      { error: "Failed to delete client" }, 
      { status: 500 }
    );
  }
}
