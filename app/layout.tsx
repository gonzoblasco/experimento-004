import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/Nav'

export const metadata: Metadata = {
  title: 'Salon Flow',
  description:
    'Mobile-first scheduling and finance tracker for hair professionals',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang='en'>
      <body className='bg-gray-100 text-gray-900 min-h-screen'>
        <Nav position='top' />
        <div className='mx-auto max-w-5xl p-4 md:p-8'>{children}</div>
      </body>
    </html>
  )
}
