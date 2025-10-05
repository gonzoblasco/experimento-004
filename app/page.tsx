import { prisma } from "@/lib/prisma";
import { Nav } from "@/components/Nav";
import Link from "next/link";

type FinanceSnapshot = {
  amount: number;
  type: "INCOME" | "EXPENSE";
  occurredOn: Date;
};

function calcTotals(entries: FinanceSnapshot[], start: Date) {
  return entries
    .filter((entry) => entry.occurredOn >= start)
    .reduce(
      (acc, entry) => {
        if (entry.type === "INCOME") {
          acc.income += entry.amount;
        } else {
          acc.expense += entry.amount;
        }
        return acc;
      },
      { income: 0, expense: 0 }
    );
}

export default async function DashboardPage() {
  const now = new Date();
  const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();
  const diff = (day + 6) % 7; // start week on Monday
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [upcomingAppointments, todaysAppointments, financeEntriesRaw] = await Promise.all([
    prisma.appointment.findMany({
      where: {
        start: { gte: now },
        status: { in: ["SCHEDULED", "COMPLETED"] }
      },
      include: { client: true },
      orderBy: { start: "asc" },
      take: 5
    }),
    prisma.appointment.findMany({
      where: {
        start: {
          gte: startOfToday,
          lt: new Date(startOfToday.getTime() + 24 * 60 * 60 * 1000)
        }
      },
      include: { client: true },
      orderBy: { start: "asc" }
    }),
    prisma.financeEntry.findMany({
      where: {
        occurredOn: {
          gte: new Date(startOfMonth.getFullYear(), startOfMonth.getMonth(), 1)
        }
      },
      orderBy: { occurredOn: "desc" }
    })
  ]);

  const financeEntries: FinanceSnapshot[] = financeEntriesRaw.map((entry) => ({
    amount: Number(entry.amount),
    type: entry.type,
    occurredOn: entry.occurredOn
  }));

  const totals = {
    daily: calcTotals(financeEntries, startOfToday),
    weekly: calcTotals(financeEntries, startOfWeek),
    monthly: calcTotals(financeEntries, startOfMonth)
  };

  return (
    <div className="space-y-6 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Today&apos;s snapshot</h1>
        <p className="text-sm text-gray-600">
          Manage your day and keep finances on track.
        </p>
      </header>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Today&apos;s schedule</h2>
          <Link className="text-sm text-primary" href="/appointments">
            View all
          </Link>
        </div>
        <ul className="space-y-3">
          {todaysAppointments.length === 0 && (
            <li className="text-sm text-gray-500">No appointments today.</li>
          )}
          {todaysAppointments.map((appt) => (
            <li key={appt.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
              <div>
                <p className="font-medium">{appt.client?.name ?? "Walk-in"}</p>
                <p className="text-sm text-gray-500">{appt.service}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>
                  {new Date(appt.start).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })} -
                  {" "}
                  {new Date(appt.end).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
                <p className="font-semibold text-primary">${Number(appt.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Upcoming</h2>
          <Link className="text-sm text-primary" href="/appointments">
            Manage
          </Link>
        </div>
        <ul className="space-y-3">
          {upcomingAppointments.length === 0 && (
            <li className="text-sm text-gray-500">No upcoming bookings.</li>
          )}
          {upcomingAppointments.map((appt) => (
            <li key={appt.id} className="flex items-center justify-between rounded-xl border border-gray-100 p-3">
              <div>
                <p className="font-medium">{appt.client?.name ?? "Walk-in"}</p>
                <p className="text-sm text-gray-500">{appt.service}</p>
              </div>
              <div className="text-right text-sm text-gray-500">
                <p>{new Date(appt.start).toLocaleString([], { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}</p>
                <p className="font-semibold text-primary">${Number(appt.price).toFixed(2)}</p>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl bg-white p-4 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Finance highlights</h2>
          <Link className="text-sm text-primary" href="/finances">
            Details
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {["daily", "weekly", "monthly"].map((period) => (
            <div key={period} className="rounded-xl border border-gray-100 p-3">
              <p className="text-xs uppercase text-gray-500">{period}</p>
              <p className="text-sm text-gray-500">Income</p>
              <p className="text-lg font-semibold text-primary">
                ${totals[period as keyof typeof totals].income.toFixed(2)}
              </p>
              <p className="text-sm text-gray-500">Expenses</p>
              <p className="text-lg font-semibold text-red-500">
                ${totals[period as keyof typeof totals].expense.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <Nav />
    </div>
  );
}
