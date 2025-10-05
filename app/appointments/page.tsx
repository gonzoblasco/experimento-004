import { AppointmentBoard } from "@/components/AppointmentBoard";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";

export default async function AppointmentsPage() {
  const now = new Date();
  const appointments = await prisma.appointment.findMany({
    where: {
      start: {
        gte: new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7)
      }
    },
    include: { client: true },
    orderBy: { start: "asc" }
  });

  const clients = await prisma.client.findMany({
    orderBy: { name: "asc" }
  });

  const serializedAppointments = appointments.map((appointment) => ({
    id: appointment.id,
    service: appointment.service,
    start: appointment.start.toISOString(),
    end: appointment.end.toISOString(),
    price: Number(appointment.price),
    status: appointment.status,
    clientId: appointment.clientId,
    clientName: appointment.client?.name ?? null
  }));

  const clientOptions = clients.map((client) => ({
    id: client.id,
    name: client.name
  }));

  return (
    <div className="space-y-6 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Appointments</h1>
        <p className="text-sm text-gray-600">
          Stay on top of bookings and keep clients informed.
        </p>
      </header>

      <AppointmentBoard
        clients={clientOptions}
        initialAppointments={serializedAppointments}
      />

      <Nav />
    </div>
  );
}
