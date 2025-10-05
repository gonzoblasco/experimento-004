import { FinanceBoard } from "@/components/FinanceBoard";
import { Nav } from "@/components/Nav";
import { prisma } from "@/lib/prisma";

export default async function FinancesPage() {
  const entries = await prisma.financeEntry.findMany({
    orderBy: { occurredOn: "desc" }
  });

  const serializedEntries = entries.map((entry) => ({
    id: entry.id,
    type: entry.type,
    amount: Number(entry.amount),
    category: entry.category,
    notes: entry.notes ?? null,
    occurredOn: entry.occurredOn.toISOString()
  }));

  return (
    <div className="space-y-6 pb-24">
      <header className="space-y-1">
        <h1 className="text-2xl font-semibold">Finances</h1>
        <p className="text-sm text-gray-600">
          Track cashflow with quick summaries and detailed entries.
        </p>
      </header>

      <FinanceBoard initialEntries={serializedEntries} />

      <Nav />
    </div>
  );
}
