'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const links = [
  { href: '/', label: 'Dashboard' },
  { href: '/appointments', label: 'Appointments' },
  { href: '/clients', label: 'Clients' },
  { href: '/finances', label: 'Finances' },
]

interface NavProps {
  position?: 'top' | 'bottom'
}

export function Nav({ position = 'bottom' }: NavProps) {
  const pathname = usePathname()

  const isTop = position === 'top'
  const isBottom = position === 'bottom'

  return (
    <nav
      className={`${
        isBottom
          ? 'fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white shadow md:static md:mb-6 md:rounded-xl md:border md:px-6'
          : 'fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white/95 backdrop-blur-sm shadow-lg md:static md:mb-6 md:rounded-xl md:border md:px-6'
      }`}
    >
      <ul className='flex items-center justify-around gap-1 p-2 md:justify-start md:gap-4'>
        {links.map((link) => {
          const isActive = pathname === link.href
          return (
            <li key={link.href}>
              <Link
                className={`flex flex-col items-center rounded-lg px-3 py-2 text-sm font-medium transition-colors md:flex-row md:gap-2 ${
                  isActive
                    ? 'bg-primary text-white md:bg-primary/90'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                href={link.href}
              >
                <span>{link.label}</span>
              </Link>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
