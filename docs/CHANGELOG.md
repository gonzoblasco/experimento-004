# 📝 Changelog - Salon Flow

Todas las notables cambios a este proyecto serán documentadas en este archivo.

El formato está basado en [Keep a Changelog](https://keepachangelog.com/es-ES/1.0.0/),
y este proyecto adhiere a [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Documentación completa del proyecto
- Guía para desarrolladores
- Documentación de API
- Guía de despliegue
- Guía para agentes de IA

## [0.1.0] - 2024-01-15

### Added

- **Dashboard principal** con resumen del día
- **Gestión de citas** completa (crear, editar, cancelar, completar)
- **Gestión de clientes** con información de contacto
- **Control financiero** con ingresos y gastos
- **Navegación móvil-first** con barra inferior
- **Base de datos SQLite** con Prisma ORM
- **API REST** para todas las funcionalidades
- **Diseño responsive** optimizado para móviles
- **Validación de datos** con Zod
- **Estilos modernos** con Tailwind CSS

### Features

- Dashboard con citas del día y próximas citas
- Resúmenes financieros diarios, semanales y mensuales
- Formularios intuitivos para crear y editar
- Estados de citas: Programada, Completada, Cancelada
- Asociación de citas con clientes o walk-ins
- Categorización de transacciones financieras
- Notas personalizadas para clientes y transacciones
- Interfaz optimizada para dispositivos móviles

### Technical

- Next.js 14 con App Router
- React 18 con TypeScript
- Prisma ORM con SQLite
- Tailwind CSS para estilos
- Zod para validación
- ESLint para calidad de código
- PostCSS para procesamiento de CSS

### API Endpoints

- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/[id]` - Actualizar cita
- `DELETE /api/appointments/[id]` - Eliminar cita
- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/[id]` - Actualizar cliente
- `DELETE /api/clients/[id]` - Eliminar cliente
- `GET /api/finance` - Listar entradas financieras
- `POST /api/finance` - Crear entrada financiera
- `PUT /api/finance/[id]` - Actualizar entrada financiera
- `DELETE /api/finance/[id]` - Eliminar entrada financiera

### Database Schema

```prisma
model Client {
  id          Int           @id @default(autoincrement())
  name        String
  phone       String?
  email       String?
  notes       String?
  appointments Appointment[]
  createdAt   DateTime      @default(now())
}

model Appointment {
  id          Int       @id @default(autoincrement())
  service     String
  start       DateTime
  end         DateTime
  price       Float
  status      String    @default("SCHEDULED")
  client      Client?    @relation(fields: [clientId], references: [id], onDelete: Cascade)
  clientId    Int?
  createdAt   DateTime   @default(now())
  updatedAt    DateTime   @updatedAt
}

model FinanceEntry {
  id        Int       @id @default(autoincrement())
  type      String
  amount    Float
  category  String
  notes     String?
  occurredOn DateTime @default(now())
  createdAt DateTime @default(now())
}
```

### Scripts

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Construir para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Verificar código
- `npm run prisma:generate` - Generar cliente Prisma
- `npm run prisma:push` - Aplicar cambios al esquema
- `npm run prisma:seed` - Poblar con datos de ejemplo

### Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "5.12.1",
    "next": "14.1.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "zod": "^4.1.11"
  },
  "devDependencies": {
    "@types/node": "20.11.19",
    "@types/react": "18.2.57",
    "@types/react-dom": "18.2.18",
    "autoprefixer": "10.4.17",
    "eslint": "8.56.0",
    "eslint-config-next": "14.1.0",
    "postcss": "8.4.35",
    "prisma": "5.12.1",
    "tailwindcss": "3.4.1",
    "ts-node": "10.9.2",
    "typescript": "5.3.3"
  }
}
```

## [0.0.1] - 2024-01-10

### Added

- Estructura inicial del proyecto
- Configuración básica de Next.js
- Esquema inicial de Prisma
- Componentes básicos de React
- Configuración de Tailwind CSS

---

**Formato de versionado**: [MAJOR.MINOR.PATCH]

- **MAJOR**: Cambios incompatibles en la API
- **MINOR**: Nueva funcionalidad compatible
- **PATCH**: Correcciones de bugs compatibles
