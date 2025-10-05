import { ClientBoard } from '@/components/ClientBoard'
import { prisma } from '@/lib/prisma'

export default async function ClientsPage() {
  const clients = await prisma.client.findMany({
    orderBy: { name: 'asc' },
  })

  const serializedClients = clients.map((client) => ({
    id: client.id,
    name: client.name,
    phone: client.phone ?? null,
    email: client.email ?? null,
    notes: client.notes ?? null,
  }))

  return (
    <div className='space-y-6'>
      <header className='space-y-1'>
        <h1 className='text-2xl font-semibold'>Clients</h1>
        <p className='text-sm text-gray-600'>
          Keep client details handy for quick rebookings.
        </p>
      </header>

      <ClientBoard initialClients={serializedClients} />
    </div>
  )
}
