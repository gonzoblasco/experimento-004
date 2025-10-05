# Salon Flow

Mobile-first booking and finance tracker tailored for barbers and hairdressers. Built with Next.js 14, Prisma, and SQLite for quick local setup.

## Features

- **Dashboard** with today&apos;s schedule, upcoming appointments, and income/expense summaries.
- **Appointments** management for creating, updating, cancelling, and deleting bookings with optional client assignment.
- **Client CRM** for storing basic contact details and notes.
- **Finance ledger** to log income/expense entries with categories, notes, and rolling summaries.

## Getting started

### Requirements

- Node.js 18+
- pnpm, npm, or yarn

### Setup

```bash
cp .env.example .env
npm install
npm run prisma:generate
npm run prisma:push
npm run prisma:seed
npm run dev
```

The development server runs on [http://localhost:3000](http://localhost:3000).

## Project structure

- `app/` – Next.js App Router pages and API routes
- `components/` – Client components for forms and interactive lists
- `lib/` – Shared Prisma client
- `prisma/` – Prisma schema and seed script

## Deployment notes

- SQLite works well for single-user or low-volume deployments. For multi-user or hosted environments, update `DATABASE_URL` to point to a managed PostgreSQL/MySQL instance and re-run `npm run prisma:push`.
- `npm run build` and `npm start` serve the production build.
