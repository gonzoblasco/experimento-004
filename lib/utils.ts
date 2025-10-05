export type FinanceEntry = {
  id: number;
  type: "INCOME" | "EXPENSE";
  amount: number;
  category: string;
  notes: string | null;
  occurredOn: string;
};

export type FinanceSnapshot = {
  amount: number;
  type: string;
  occurredOn: Date;
};

/**
 * Calcula los totales de ingresos y gastos para un conjunto de entradas financieras
 * a partir de una fecha de inicio específica.
 */
export function calcTotals(entries: FinanceEntry[] | FinanceSnapshot[], start: Date) {
  return entries
    .filter((entry) => {
      const entryDate = entry.occurredOn instanceof Date 
        ? entry.occurredOn 
        : new Date(entry.occurredOn);
      return entryDate >= start;
    })
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

/**
 * Calcula el inicio del día actual (00:00:00)
 */
export function getStartOfToday(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/**
 * Calcula el inicio de la semana actual (lunes a las 00:00:00)
 */
export function getStartOfWeek(): Date {
  const startOfToday = getStartOfToday();
  const startOfWeek = new Date(startOfToday);
  const day = startOfWeek.getDay();
  const diff = (day + 6) % 7; // Inicia la semana el lunes
  startOfWeek.setDate(startOfWeek.getDate() - diff);
  return startOfWeek;
}

/**
 * Calcula el inicio del mes actual (día 1 a las 00:00:00)
 */
export function getStartOfMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

/**
 * Obtiene todas las fechas de referencia para cálculos de períodos
 */
export function getDateReferences() {
  return {
    startOfToday: getStartOfToday(),
    startOfWeek: getStartOfWeek(),
    startOfMonth: getStartOfMonth(),
  };
}
