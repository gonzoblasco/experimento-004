'use client'

import { useEffect, useMemo, useState } from 'react'
import { FinanceEntry, calcTotals, getDateReferences } from '@/lib/utils'

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
  occurredOn: '',
}

export function FinanceBoard({ initialEntries }: FinanceBoardProps) {
  const [entries, setEntries] = useState(initialEntries)
  const [draft, setDraft] = useState<DraftEntry>(emptyDraft)
  const [error, setError] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { startOfToday, startOfWeek, startOfMonth } = getDateReferences()

  const summary = useMemo(
    () => ({
      daily: calcTotals(entries, startOfToday),
      weekly: calcTotals(entries, startOfWeek),
      monthly: calcTotals(entries, startOfMonth),
    }),
    [entries, startOfMonth, startOfToday, startOfWeek]
  )

  async function createEntry() {
    if (!draft.amount || !draft.category || !draft.occurredOn) {
      setError('Amount, category and date are required.')
      return
    }
    setIsSubmitting(true)
    setError(null)
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
        throw new Error('Failed to create entry')
      }
      const created: FinanceEntry = await response.json()
      setEntries((prev) => [created, ...prev])
      setDraft(emptyDraft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
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
      <div className='rounded-2xl bg-white p-4 shadow-sm'>
        <h2 className='mb-3 text-lg font-semibold'>Log income or expense</h2>
        <div className='space-y-3'>
          {error && <p className='text-sm text-red-600'>{error}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Type</span>
              <select
                className='w-full rounded-lg border border-gray-200 p-2'
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
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Amount</span>
              <input
                type='number'
                min='0'
                step='0.01'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.amount}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, amount: event.target.value }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Category</span>
              <input
                className='w-full rounded-lg border border-gray-200 p-2'
                placeholder='Haircut, supplies, rent...'
                value={draft.category}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    category: event.target.value,
                  }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Date</span>
              <input
                type='date'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.occurredOn}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    occurredOn: event.target.value,
                  }))
                }
              />
            </label>
            <label className='text-sm sm:col-span-2'>
              <span className='mb-1 block text-gray-600'>Notes</span>
              <textarea
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.notes}
                rows={3}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, notes: event.target.value }))
                }
              />
            </label>
          </div>
          <button
            className='w-full rounded-lg bg-primary px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60'
            disabled={isSubmitting}
            onClick={createEntry}
          >
            {isSubmitting ? 'Saving...' : 'Add entry'}
          </button>
        </div>
      </div>

      <section className='rounded-2xl bg-white p-4 shadow-sm'>
        <h2 className='text-lg font-semibold'>Summary</h2>
        <div className='mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3'>
          {(['daily', 'weekly', 'monthly'] as const).map((period) => (
            <div key={period} className='rounded-xl border border-gray-100 p-3'>
              <p className='text-xs uppercase text-gray-500'>{period}</p>
              <p className='text-sm text-gray-500'>Income</p>
              <p className='text-lg font-semibold text-primary'>
                ${summary[period].income.toFixed(2)}
              </p>
              <p className='text-sm text-gray-500'>Expenses</p>
              <p className='text-lg font-semibold text-red-500'>
                ${summary[period].expense.toFixed(2)}
              </p>
            </div>
          ))}
        </div>
      </section>

      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Entries</h2>
        <ul className='space-y-3'>
          {entries.length === 0 && (
            <li className='rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm'>
              No entries yet.
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
    <li className='rounded-2xl bg-white p-4 shadow-sm'>
      <div className='flex items-start justify-between gap-3'>
        <div>
          <p className='font-semibold capitalize'>{entry.category}</p>
          <p className='text-sm text-gray-500'>
            {new Date(entry.occurredOn).toLocaleDateString()} ·{' '}
            {entry.type.toLowerCase()}
          </p>
          {entry.notes && (
            <p className='text-sm text-gray-500'>{entry.notes}</p>
          )}
        </div>
        <p
          className={`text-lg font-semibold ${
            entry.type === 'INCOME' ? 'text-primary' : 'text-red-500'
          }`}
        >
          {entry.type === 'INCOME' ? '+' : '-'}${entry.amount.toFixed(2)}
        </p>
      </div>

      {isEditing ? (
        <div className='mt-3 space-y-3 border-t border-gray-100 pt-3 text-sm'>
          {localError && <p className='text-sm text-red-600'>{localError}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            <label>
              <span className='mb-1 block text-gray-600'>Type</span>
              <select
                className='w-full rounded-lg border border-gray-200 p-2'
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
                className='w-full rounded-lg border border-gray-200 p-2'
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
                className='w-full rounded-lg border border-gray-200 p-2'
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
                className='w-full rounded-lg border border-gray-200 p-2'
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
                className='w-full rounded-lg border border-gray-200 p-2'
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
              className='rounded-lg bg-primary px-4 py-2 text-white'
              onClick={async () => {
                if (!draft.category) {
                  setLocalError('Category is required.')
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
                    err instanceof Error ? err.message : 'Failed to update'
                  )
                }
              }}
            >
              Save changes
            </button>
            <button
              className='rounded-lg border border-gray-200 px-4 py-2'
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
              Cancel
            </button>
            <button
              className='ml-auto rounded-lg border border-red-200 px-4 py-2 text-red-600'
              onClick={async () => {
                try {
                  await onDelete(entry.id)
                } catch (err) {
                  setLocalError(
                    err instanceof Error ? err.message : 'Failed to delete'
                  )
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ) : (
        <div className='mt-3 flex gap-2'>
          <button
            className='rounded-lg border border-gray-200 px-4 py-2 text-sm'
            onClick={() => setIsEditing(true)}
          >
            Edit
          </button>
        </div>
      )}
      {localError && !isEditing && (
        <p className='mt-2 text-sm text-red-600'>{localError}</p>
      )}
    </li>
  )
}
