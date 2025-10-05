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

/**
 * Formatea una fecha a YYYY-MM-DD de forma determinista (sin depender de locale).
 */
export function formatDateYMD(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/**
 * Formatea una fecha a DD/MM/YYYY de forma determinista.
 */
export function formatDateDMY(input: string | Date): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${pad(date.getDate())}/${pad(date.getMonth() + 1)}/${date.getFullYear()}`;
}

/**
 * Formatea fecha y hora como "DD Mon, HH:MM" o variantes según opciones.
 * Por defecto: abreviado en inglés para evitar dependencias del runtime.
 */
export function formatDateTime(input: string | Date, options?: { showDate?: boolean; showTime?: boolean }): string {
  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return "";
  const monthNames = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  const pad = (n: number) => `${n}`.padStart(2, "0");
  const parts: string[] = [];
  const showDate = options?.showDate ?? true;
  const showTime = options?.showTime ?? true;
  if (showDate) {
    parts.push(`${pad(date.getDate())} ${monthNames[date.getMonth()]}`);
  }
  if (showTime) {
    parts.push(`${pad(date.getHours())}:${pad(date.getMinutes())}`);
  }
  return parts.join(" ");
}
