'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  FinanceEntry,
  calcTotals,
  getDateReferences,
  formatDateDMY,
} from '@/lib/utils'

type FinanceBoardProps = {
  initialEntries: FinanceEntry[]
}

type DraftEntry = {
  type: 'INCOME' | 'EXPENSE'
  amount: string
  category: string
  notes: string
  occurredOn: string
}

const emptyDraft: DraftEntry = {
  type: 'INCOME',
  amount: '',
  category: '',
  notes: '',
  occurredOn: new Date().toISOString().split('T')[0], // Fecha actual por defecto
}

export function FinanceBoard({ initialEntries }: FinanceBoardProps) {
  const [entries, setEntries] = useState(initialEntries)
  const [draft, setDraft] = useState<DraftEntry>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<
    Partial<Record<keyof DraftEntry, string>>
  >({})

  const { startOfToday, startOfWeek, startOfMonth } = getDateReferences()

  const summary = useMemo(
    () => ({
      daily: calcTotals(entries, startOfToday),
      weekly: calcTotals(entries, startOfWeek),
      monthly: calcTotals(entries, startOfMonth),
    }),
    [entries, startOfMonth, startOfToday, startOfWeek]
  )

  // Validación en tiempo real
  const validateField = (field: keyof DraftEntry, value: string) => {
    switch (field) {
      case 'amount':
        if (!value) return 'El monto es requerido'
        if (isNaN(Number(value)) || Number(value) <= 0)
          return 'El monto debe ser un número positivo'
        return ''
      case 'category':
        if (!value.trim()) return 'La categoría es requerida'
        return ''
      case 'occurredOn':
        if (!value) return 'La fecha es requerida'
        return ''
      default:
        return ''
    }
  }

  const handleFieldChange = (field: keyof DraftEntry, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }))

    // Validar campo en tiempo real
    const error = validateField(field, value)
    setFieldErrors((prev) => ({ ...prev, [field]: error }))

    // Limpiar error general si hay errores de campo
    if (error) {
      setError(null)
    }
  }

  async function createEntry() {
    // Validar todos los campos
    const errors: Partial<Record<keyof DraftEntry, string>> = {}
    let hasErrors = false

    if (!draft.amount) {
      errors.amount = 'El monto es requerido'
      hasErrors = true
    } else if (isNaN(Number(draft.amount)) || Number(draft.amount) <= 0) {
      errors.amount = 'El monto debe ser un número positivo'
      hasErrors = true
    }

    if (!draft.category.trim()) {
      errors.category = 'La categoría es requerida'
      hasErrors = true
    }

    if (!draft.occurredOn) {
      errors.occurredOn = 'La fecha es requerida'
      hasErrors = true
    }

    setFieldErrors(errors)

    if (hasErrors) {
      setError('Por favor corrige los errores antes de continuar')
      return
    }

    setIsSubmitting(true)
    setError(null)
    setFieldErrors({})

    try {
      const response = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...draft,
          amount: parseFloat(draft.amount),
        }),
      })
      if (!response.ok) {
        throw new Error('Error al crear la entrada')
      }
      const created: FinanceEntry = await response.json()
      setEntries((prev) => [created, ...prev])
      setDraft(emptyDraft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function updateEntry(id: number, payload: Partial<FinanceEntry>) {
    const response = await fetch(`/api/finance/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Failed to update entry')
    }
    const updated: FinanceEntry = await response.json()
    setEntries((prev) =>
      prev.map((entry) => (entry.id === id ? updated : entry))
    )
  }

  async function deleteEntry(id: number) {
    const response = await fetch(`/api/finance/${id}`, { method: 'DELETE' })
    if (!response.ok) {
      throw new Error('Failed to delete entry')
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-white p-6 shadow-sm'>
        <h2 className='mb-4 text-lg font-semibold'>
          Registrar ingreso o gasto
        </h2>
        <div className='space-y-4'>
          {error && (
            <div className='rounded-lg bg-red-50 border border-red-200 p-3'>
              <p className='text-sm text-red-600'>{error}</p>
            </div>
          )}

          {/* Layout mejorado: flujo lógico de campos */}
          <div className='space-y-4'>
            {/* Primera fila: Tipo y Monto */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label
                  htmlFor='type'
                  className='block text-sm font-medium text-gray-700'
                >
                  Tipo *
                </label>
                <select
                  id='type'
                  className={`w-full rounded-lg border-2 p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    fieldErrors.type
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400 focus:border-primary'
                  }`}
                  value={draft.type}
                  onChange={(event) =>
                    handleFieldChange(
                      'type',
                      event.target.value as DraftEntry['type']
                    )
                  }
                >
                  <option value='INCOME'>Ingreso</option>
                  <option value='EXPENSE'>Gasto</option>
                </select>
                {fieldErrors.type && (
                  <p className='text-xs text-red-600'>{fieldErrors.type}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='amount'
                  className='block text-sm font-medium text-gray-700'
                >
                  Monto *
                </label>
                <div className='relative'>
                  <span className='absolute left-3 top-1/2 -translate-y-1/2 text-gray-500'>
                    $
                  </span>
                  <input
                    id='amount'
                    type='number'
                    min='0'
                    step='0.01'
                    placeholder='0.00'
                    className={`w-full rounded-lg border-2 p-3 pl-8 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                      fieldErrors.amount
                        ? 'border-red-400 bg-red-50'
                        : 'border-gray-300 bg-white hover:border-gray-400 focus:border-primary'
                    }`}
                    value={draft.amount}
                    onChange={(event) =>
                      handleFieldChange('amount', event.target.value)
                    }
                  />
                </div>
                {fieldErrors.amount && (
                  <p className='text-xs text-red-600'>{fieldErrors.amount}</p>
                )}
              </div>
            </div>

            {/* Segunda fila: Categoría y Fecha */}
            <div className='grid gap-4 sm:grid-cols-2'>
              <div className='space-y-2'>
                <label
                  htmlFor='category'
                  className='block text-sm font-medium text-gray-700'
                >
                  Categoría *
                </label>
                <input
                  id='category'
                  type='text'
                  placeholder='Corte, suministros, alquiler...'
                  className={`w-full rounded-lg border-2 p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    fieldErrors.category
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400 focus:border-primary'
                  }`}
                  value={draft.category}
                  onChange={(event) =>
                    handleFieldChange('category', event.target.value)
                  }
                />
                {fieldErrors.category && (
                  <p className='text-xs text-red-600'>{fieldErrors.category}</p>
                )}
              </div>

              <div className='space-y-2'>
                <label
                  htmlFor='date'
                  className='block text-sm font-medium text-gray-700'
                >
                  Fecha *
                </label>
                <input
                  id='date'
                  type='date'
                  className={`w-full rounded-lg border-2 p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
                    fieldErrors.occurredOn
                      ? 'border-red-400 bg-red-50'
                      : 'border-gray-300 bg-white hover:border-gray-400 focus:border-primary'
                  }`}
                  value={draft.occurredOn}
                  onChange={(event) =>
                    handleFieldChange('occurredOn', event.target.value)
                  }
                />
                {fieldErrors.occurredOn && (
                  <p className='text-xs text-red-600'>
                    {fieldErrors.occurredOn}
                  </p>
                )}
              </div>
            </div>

            {/* Tercera fila: Notas */}
            <div className='space-y-2'>
              <label
                htmlFor='notes'
                className='block text-sm font-medium text-gray-700'
              >
                Notas (opcional)
              </label>
              <textarea
                id='notes'
                placeholder='Información adicional sobre esta transacción...'
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-3 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 hover:border-gray-400 focus:border-primary'
                value={draft.notes}
                rows={3}
                onChange={(event) =>
                  handleFieldChange('notes', event.target.value)
                }
              />
            </div>
          </div>

          {/* Botón mejorado */}
          <button
            className='w-full rounded-lg bg-primary px-6 py-3 text-white font-medium shadow-sm transition-all hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:bg-primary'
            disabled={isSubmitting}
            onClick={createEntry}
          >
            {isSubmitting ? (
              <span className='flex items-center justify-center gap-2'>
                <svg className='h-4 w-4 animate-spin' viewBox='0 0 24 24'>
                  <circle
                    className='opacity-25'
                    cx='12'
                    cy='12'
                    r='10'
                    stroke='currentColor'
                    strokeWidth='4'
                    fill='none'
                  />
                  <path
                    className='opacity-75'
                    fill='currentColor'
                    d='M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z'
                  />
                </svg>
                Guardando...
              </span>
            ) : (
              'Agregar entrada'
            )}
          </button>
        </div>
      </div>

      <section className='rounded-2xl bg-white p-6 shadow-sm'>
        <h2 className='text-lg font-semibold mb-4'>Resumen</h2>
        <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <div
              key={period}
              className='rounded-xl border border-gray-100 p-4 hover:shadow-sm transition-shadow'
            >
              <p className='text-xs uppercase text-gray-500 font-medium mb-3'>
                {period === 'daily'
                  ? 'Hoy'
                  : period === 'weekly'
                  ? 'Esta semana'
                  : 'Este mes'}
              </p>
              <div className='space-y-2'>
                <div>
                  <p className='text-sm text-gray-500'>Ingresos</p>
                  <p className='text-lg font-semibold text-green-600'>
                    +${summary[period].income.toFixed(2)}
                  </p>
                </div>
                <div>
                  <p className='text-sm text-gray-500'>Gastos</p>
                  <p className='text-lg font-semibold text-red-500'>
                    -${summary[period].expense.toFixed(2)}
                  </p>
                </div>
                <div className='pt-2 border-t border-gray-100'>
                  <p className='text-sm text-gray-500'>Balance</p>
                  <p
                    className={`text-lg font-semibold ${
                      summary[period].income - summary[period].expense >= 0
                        ? 'text-green-600'
                        : 'text-red-500'
                    }`}
                  >
                    {summary[period].income - summary[period].expense >= 0
                      ? '+'
                      : ''}
                    $
                    {(summary[period].income - summary[period].expense).toFixed(
                      2
                    )}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Entradas</h2>
        <ul className='space-y-3' role='list'>
          {entries.length === 0 && (
            <li className='rounded-2xl bg-white p-6 text-center shadow-sm'>
              <div className='text-gray-400 mb-2'>
                <svg
                  className='mx-auto h-12 w-12'
                  fill='none'
                  viewBox='0 0 24 24'
                  stroke='currentColor'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={1.5}
                    d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                  />
                </svg>
              </div>
              <p className='text-sm text-gray-500'>
                Aún no hay entradas registradas
              </p>
              <p className='text-xs text-gray-400 mt-1'>
                Agrega tu primera entrada usando el formulario de arriba
              </p>
            </li>
          )}
          {entries.map((entry) => (
            <FinanceCard
              key={entry.id}
              entry={entry}
              onDelete={deleteEntry}
              onUpdate={updateEntry}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}

type FinanceCardProps = {
  entry: FinanceEntry
  onUpdate: (id: number, payload: Partial<FinanceEntry>) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

function FinanceCard({ entry, onUpdate, onDelete }: FinanceCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    amount: entry.amount,
    category: entry.category,
    notes: entry.notes ?? '',
    occurredOn: entry.occurredOn.slice(0, 10),
    type: entry.type as DraftEntry['type'],
  })

  useEffect(() => {
    if (!isEditing) {
      setDraft({
        amount: entry.amount,
        category: entry.category,
        notes: entry.notes ?? '',
        occurredOn: entry.occurredOn.slice(0, 10),
        type: entry.type as DraftEntry['type'],
      })
    }
  }, [entry, isEditing])

  return (
    <li className='rounded-2xl bg-white p-4 shadow-sm hover:shadow-md transition-shadow'>
      <div className='flex items-start justify-between gap-3'>
        <div className='flex-1 min-w-0'>
          <div className='flex items-center gap-2 mb-1'>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                entry.type === 'INCOME'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-red-100 text-red-800'
              }`}
            >
              {entry.type === 'INCOME' ? 'Ingreso' : 'Gasto'}
            </span>
          </div>
          <p className='font-semibold text-gray-900 capitalize truncate'>
            {entry.category}
          </p>
          <p className='text-sm text-gray-500'>
            {formatDateDMY(entry.occurredOn)}
          </p>
          {entry.notes && (
            <p className='text-sm text-gray-600 mt-1 line-clamp-2'>
              {entry.notes}
            </p>
          )}
        </div>
        <div className='text-right flex-shrink-0'>
          <p
            className={`text-lg font-semibold ${
              entry.type === 'INCOME' ? 'text-green-600' : 'text-red-500'
            }`}
          >
            {entry.type === 'INCOME' ? '+' : '-'}${entry.amount.toFixed(2)}
          </p>
        </div>
      </div>

      {isEditing ? (
        <div className='mt-3 space-y-3 border-t border-gray-100 pt-3 text-sm'>
          {localError && <p className='text-sm text-red-600'>{localError}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            <label>
              <span className='mb-1 block text-gray-600'>Type</span>
              <select
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-2 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={draft.type}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    type: event.target.value as DraftEntry['type'],
                  }))
                }
              >
                <option value='INCOME'>Income</option>
                <option value='EXPENSE'>Expense</option>
              </select>
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>Amount</span>
              <input
                type='number'
                min='0'
                step='0.01'
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-2 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={draft.amount}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    amount: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>Category</span>
              <input
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-2 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={draft.category}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              />
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>Date</span>
              <input
                type='date'
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-2 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                value={draft.occurredOn}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    occurredOn: event.target.value,
                  }))
                }
              />
            </label>
            <label className='sm:col-span-2'>
              <span className='mb-1 block text-gray-600'>Notes</span>
              <textarea
                className='w-full rounded-lg border-2 border-gray-300 bg-white p-2 hover:border-gray-400 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20'
                rows={3}
                value={draft.notes}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    notes: event.target.value,
                  }))
                }
              />
            </label>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              className='rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
              onClick={async () => {
                if (!draft.category) {
                  setLocalError('La categoría es requerida.')
                  return
                }
                try {
                  setLocalError(null)
                  await onUpdate(entry.id, {
                    ...draft,
                    amount: Number(draft.amount),
                    occurredOn: new Date(draft.occurredOn).toISOString(),
                  })
                  setIsEditing(false)
                } catch (err) {
                  setLocalError(
                    err instanceof Error ? err.message : 'Error al actualizar'
                  )
                }
              }}
            >
              Guardar cambios
            </button>
            <button
              className='rounded-lg border border-gray-200 px-4 py-2 hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
              onClick={() => {
                setDraft({
                  amount: entry.amount,
                  category: entry.category,
                  notes: entry.notes ?? '',
                  occurredOn: entry.occurredOn.slice(0, 10),
                  type: entry.type,
                })
                setIsEditing(false)
              }}
            >
              Cancelar
            </button>
            <button
              className='ml-auto rounded-lg border border-red-200 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors focus:outline-none focus:ring-2 focus:ring-red-200'
              onClick={async () => {
                if (
                  confirm('¿Estás seguro de que quieres eliminar esta entrada?')
                ) {
                  try {
                    await onDelete(entry.id)
                  } catch (err) {
                    setLocalError(
                      err instanceof Error ? err.message : 'Error al eliminar'
                    )
                  }
                }
              }}
            >
              Eliminar
            </button>
          </div>
        </div>
      ) : (
        <div className='mt-3 flex gap-2'>
          <button
            className='rounded-lg border border-gray-200 px-4 py-2 text-sm hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20'
            onClick={() => setIsEditing(true)}
            aria-label={`Editar entrada de ${entry.category}`}
          >
            Editar
          </button>
        </div>
      )}
      {localError && !isEditing && (
        <p className='mt-2 text-sm text-red-600'>{localError}</p>
      )}
    </li>
  )
}
