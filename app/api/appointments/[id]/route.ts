import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Appointment, Client } from "@prisma/client";

type Params = {
  params: {
    id: string;
  };
};

// Esquema de validación para el cuerpo de la solicitud PUT
const updateAppointmentSchema = z.object({
  service: z.string().optional(),
  start: z.string().datetime().optional(),
  end: z.string().datetime().optional(),
  status: z.string().optional(),
  clientId: z.number().int().optional(),
  price: z.number().positive().optional()
});

function serialize(appointment: Appointment & { client: Client | null }) {
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

  try {
    const body = await request.json();
    
    // Validar el cuerpo de la solicitud usando Zod
    const validatedData = updateAppointmentSchema.parse(body);
    
    // Preparar los datos para la actualización
    const data: Record<string, unknown> = {};
    
    if (validatedData.service !== undefined) data.service = validatedData.service;
    if (validatedData.start !== undefined) data.start = new Date(validatedData.start);
    if (validatedData.end !== undefined) data.end = new Date(validatedData.end);
    if (validatedData.status !== undefined) data.status = validatedData.status;
    if (validatedData.clientId !== undefined) data.clientId = validatedData.clientId;
    if (validatedData.price !== undefined) data.price = validatedData.price;

    const appointment = await prisma.appointment.update({
      where: { id },
      data,
      include: { client: true }
    });

    return NextResponse.json(serialize(appointment));
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { 
          error: "Validation error", 
          details: error.errors.map(err => ({
            field: err.path.join('.'),
            message: err.message
          }))
        }, 
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: "Internal server error" }, 
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request, { params }: Params) {
  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  await prisma.appointment.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}
