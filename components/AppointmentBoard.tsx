'use client'

import { useEffect, useMemo, useState } from 'react'
import { formatDateTime } from '@/lib/utils'

type ClientOption = {
  id: number
  name: string
}

type Appointment = {
  id: number
  service: string
  start: string
  end: string
  price: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  clientId: number | null
  clientName: string | null
}

type AppointmentBoardProps = {
  initialAppointments: Appointment[]
  clients: ClientOption[]
}

type DraftAppointment = {
  service: string
  start: string
  end: string
  price: string
  clientId: string
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
}

const emptyDraft: DraftAppointment = {
  service: '',
  start: '',
  end: '',
  price: '',
  clientId: '',
  status: 'SCHEDULED',
}

function formatDateInput(value: string) {
  const date = new Date(value)
  if (isNaN(date.getTime())) return ''
function formatDateInput(value: string) {
  const date = new Date(value);
  if (isNaN(date.getTime())) return "";
  const pad = (n: number) => `${n}`.padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
}

type AppointmentCardProps = {
  appointment: Appointment
  onUpdate: (
    id: number,
    payload: Partial<Omit<Appointment, 'id' | 'clientName'>>
  ) => Promise<void>
  onDelete: (id: number) => Promise<void>
}

function AppointmentCard({
  appointment,
  onUpdate,
  onDelete,
}: AppointmentCardProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)
  const [draft, setDraft] = useState({
    start: appointment.start,
    end: appointment.end,
    price: appointment.price,
    status: appointment.status,
  })

  useEffect(() => {
    if (!isEditing) {
      setDraft({
        start: appointment.start,
        end: appointment.end,
        price: appointment.price,
        status: appointment.status,
      })
    }
  }, [appointment, isEditing])

  return (
    <li className='rounded-2xl bg-white p-4 shadow-sm'>
      <div className='flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <p className='font-semibold'>{appointment.clientName ?? 'Walk-in'}</p>
          <p className='text-sm text-gray-500'>{appointment.service}</p>
          <p className='text-sm text-gray-500'>
            {formatDateTime(appointment.start)}
            {' – '}
            {formatDateTime(appointment.end, {
              showDate: false,
              showTime: true,
            })}
          </p>
        </div>
        <div className='text-sm text-right text-gray-600'>
          <p className='font-semibold text-primary'>
            ${appointment.price.toFixed(2)}
          </p>
          <p>{appointment.status.toLowerCase()}</p>
        </div>
      </div>

      {isEditing ? (
        <div className='mt-3 space-y-3 border-t border-gray-100 pt-3 text-sm'>
          {localError && <p className='text-sm text-red-600'>{localError}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            <label>
              <span className='mb-1 block text-gray-600'>Start</span>
              <input
                type='datetime-local'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={formatDateInput(draft.start)}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    start: new Date(event.target.value).toISOString(),
                  }))
                }
              />
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>End</span>
              <input
                type='datetime-local'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={formatDateInput(draft.end)}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    end: new Date(event.target.value).toISOString(),
                  }))
                }
              />
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>Price</span>
              <input
                type='number'
                min='0'
                step='0.01'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.price}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    price: Number(event.target.value),
                  }))
                }
              />
            </label>
            <label>
              <span className='mb-1 block text-gray-600'>Status</span>
              <select
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.status}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: event.target.value as Appointment['status'],
                  }))
                }
              >
                <option value='SCHEDULED'>Scheduled</option>
                <option value='COMPLETED'>Completed</option>
                <option value='CANCELLED'>Cancelled</option>
              </select>
            </label>
          </div>
          <div className='flex flex-wrap gap-2'>
            <button
              className='rounded-lg bg-primary px-4 py-2 text-white'
              onClick={async () => {
                try {
                  setLocalError(null)
                  await onUpdate(appointment.id, draft)
                  setIsEditing(false)
                } catch (err) {
                  setLocalError(
                    err instanceof Error ? err.message : 'Failed to save'
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
                  start: appointment.start,
                  end: appointment.end,
                  price: appointment.price,
                  status: appointment.status,
                })
                setIsEditing(false)
              }}
              type='button'
            >
              Cancel
            </button>
            <button
              className='ml-auto rounded-lg border border-red-200 px-4 py-2 text-red-600'
              onClick={async () => {
                try {
                  await onDelete(appointment.id)
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
          <button
            className='rounded-lg border border-red-200 px-4 py-2 text-sm text-red-600'
            onClick={async () => {
              try {
                await onUpdate(appointment.id, { status: 'CANCELLED' })
              } catch (err) {
                setLocalError(
                  err instanceof Error ? err.message : 'Failed to cancel'
                )
              }
            }}
          >
            Cancel
          </button>
        </div>
      )}
      {localError && !isEditing && (
        <p className='mt-2 text-sm text-red-600'>{localError}</p>
      )}
    </li>
  )
}

export function AppointmentBoard({
  initialAppointments,
  clients,
}: AppointmentBoardProps) {
  const [appointments, setAppointments] = useState(initialAppointments)
  const [draft, setDraft] = useState<DraftAppointment>(emptyDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sortedAppointments = useMemo(
    () =>
      [...appointments].sort(
        (a, b) => new Date(a.start).getTime() - new Date(b.start).getTime()
      ),
    [appointments]
  )

  async function createAppointment() {
    if (!draft.service || !draft.start || !draft.end || !draft.price) {
      setError('Please fill in required fields.')
      return
    }
    setIsSubmitting(true)
    setError(null)
    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          service: draft.service,
          start: new Date(draft.start).toISOString(),
          end: new Date(draft.end).toISOString(),
          price: parseFloat(draft.price),
          clientId: draft.clientId ? Number(draft.clientId) : null,
          status: draft.status,
        }),
      })
      if (!response.ok) {
        throw new Error('Failed to create appointment')
      }
      const created: Appointment = await response.json()
      setAppointments((prev) => [...prev, created])
      setDraft(emptyDraft)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error')
    } finally {
      setIsSubmitting(false)
    }
  }

  async function updateAppointment(
    id: number,
    payload: Partial<Omit<Appointment, 'id' | 'clientName'>>
  ) {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    if (!response.ok) {
      throw new Error('Failed to update appointment')
    }
    const updated: Appointment = await response.json()
    setAppointments((prev) =>
      prev.map((appt) => (appt.id === id ? updated : appt))
    )
  }

  async function deleteAppointment(id: number) {
    const response = await fetch(`/api/appointments/${id}`, {
      method: 'DELETE',
    })
    if (!response.ok) {
      throw new Error('Failed to delete appointment')
    }
    setAppointments((prev) => prev.filter((appt) => appt.id !== id))
  }

  return (
    <div className='space-y-6'>
      <div className='rounded-2xl bg-white p-4 shadow-sm'>
        <h2 className='mb-3 text-lg font-semibold'>Book appointment</h2>
        <div className='space-y-3'>
          {error && <p className='text-sm text-red-600'>{error}</p>}
          <div className='grid gap-3 sm:grid-cols-2'>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Client</span>
              <select
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.clientId}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    clientId: event.target.value,
                  }))
                }
              >
                <option value=''>Walk-in / new client</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Service</span>
              <input
                className='w-full rounded-lg border border-gray-200 p-2'
                placeholder='Haircut, color, etc.'
                value={draft.service}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, service: event.target.value }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Start</span>
              <input
                type='datetime-local'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.start}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, start: event.target.value }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>End</span>
              <input
                type='datetime-local'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.end}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, end: event.target.value }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Price</span>
              <input
                type='number'
                min='0'
                step='0.01'
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.price}
                onChange={(event) =>
                  setDraft((prev) => ({ ...prev, price: event.target.value }))
                }
              />
            </label>
            <label className='text-sm'>
              <span className='mb-1 block text-gray-600'>Status</span>
              <select
                className='w-full rounded-lg border border-gray-200 p-2'
                value={draft.status}
                onChange={(event) =>
                  setDraft((prev) => ({
                    ...prev,
                    status: event.target.value as DraftAppointment['status'],
                  }))
                }
              >
                <option value='SCHEDULED'>Scheduled</option>
                <option value='COMPLETED'>Completed</option>
                <option value='CANCELLED'>Cancelled</option>
              </select>
            </label>
          </div>
          <button
            className='w-full rounded-lg bg-primary px-4 py-2 text-white shadow disabled:cursor-not-allowed disabled:opacity-60'
            disabled={isSubmitting}
            onClick={createAppointment}
          >
            {isSubmitting ? 'Saving...' : 'Create appointment'}
          </button>
        </div>
      </div>

      <div className='space-y-4'>
        <h2 className='text-lg font-semibold'>Upcoming appointments</h2>
        <ul className='space-y-3'>
          {sortedAppointments.length === 0 && (
            <li className='rounded-2xl bg-white p-4 text-sm text-gray-500 shadow-sm'>
              No appointments yet.
            </li>
          )}
          {sortedAppointments.map((appt) => (
            <AppointmentCard
              key={appt.id}
              appointment={appt}
              onUpdate={updateAppointment}
              onDelete={deleteAppointment}
            />
          ))}
        </ul>
      </div>
    </div>
  )
}
