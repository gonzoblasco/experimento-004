# 🤖 Guía para Agentes de IA - Salon Flow

Esta documentación está específicamente diseñada para agentes de IA que trabajen en el proyecto Salon Flow.

## 🎯 Contexto del Proyecto

**Salon Flow** es una aplicación móvil-first para la gestión de salones de belleza que incluye:

- Gestión de citas y programación
- Base de datos de clientes
- Control financiero (ingresos/gastos)
- Dashboard con resúmenes

## 🏗️ Arquitectura Técnica

### Stack Principal

- **Frontend**: Next.js 14 + React 18 + TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: SQLite con Prisma ORM
- **Validación**: Zod
- **Desarrollo**: ESLint + PostCSS

### Estructura de Archivos Crítica

```
app/
├── api/                    # API Routes (Backend)
│   ├── appointments/       # Endpoints de citas
│   ├── clients/           # Endpoints de clientes
│   └── finance/           # Endpoints financieros
├── appointments/page.tsx  # Página de citas
├── clients/page.tsx       # Página de clientes
├── finances/page.tsx     # Página de finanzas
└── page.tsx               # Dashboard principal

components/
├── AppointmentBoard.tsx   # Gestión de citas
├── ClientBoard.tsx       # Gestión de clientes
├── FinanceBoard.tsx      # Control financiero
└── Nav.tsx               # Navegación

prisma/
├── schema.prisma         # Esquema de BD
└── seed.ts              # Datos de ejemplo
```

## 📊 Modelo de Datos

### Entidades Principales

```typescript
// Cliente
type Client = {
  id: number
  name: string
  phone?: string
  email?: string
  notes?: string
  appointments: Appointment[]
  createdAt: Date
}

// Cita
type Appointment = {
  id: number
  service: string
  start: string (ISO date)
  end: string (ISO date)
  price: number
  status: 'SCHEDULED' | 'COMPLETED' | 'CANCELLED'
  clientId?: number
  clientName?: string
  createdAt: string
  updatedAt: string
}

// Entrada Financiera
type FinanceEntry = {
  id: number
  type: 'INCOME' | 'EXPENSE'
  amount: number
  category: string
  notes?: string
  occurredOn: string (ISO date)
  createdAt: string
}
```

### Relaciones

- **Client → Appointment**: One-to-Many
- **Appointment → Client**: Many-to-One (opcional)

## 🔌 API Endpoints

### Citas

- `GET /api/appointments` - Listar citas
- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/[id]` - Actualizar cita
- `DELETE /api/appointments/[id]` - Eliminar cita

### Clientes

- `GET /api/clients` - Listar clientes
- `POST /api/clients` - Crear cliente
- `PUT /api/clients/[id]` - Actualizar cliente
- `DELETE /api/clients/[id]` - Eliminar cliente

### Finanzas

- `GET /api/finance` - Listar entradas
- `POST /api/finance` - Crear entrada
- `PUT /api/finance/[id]` - Actualizar entrada
- `DELETE /api/finance/[id]` - Eliminar entrada

## 🎨 Patrones de Componentes

### Estructura de Componentes

```typescript
// Patrón común de componentes
type ComponentProps = {
  initialData: DataType[]
  // ... otras props
}

export function Component({ initialData }: ComponentProps) {
  const [data, setData] = useState(initialData)
  const [draft, setDraft] = useState(emptyDraft)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Funciones CRUD
  async function createItem() {
    /* ... */
  }
  async function updateItem(id: number, payload: Partial<DataType>) {
    /* ... */
  }
  async function deleteItem(id: number) {
    /* ... */
  }

  return (
    <div className='space-y-6'>
      {/* Formulario de creación */}
      {/* Lista de elementos */}
    </div>
  )
}
```

### Patrones de UI

```css
/* Cards principales */
.rounded-2xl.bg-white.p-4.shadow-sm

/* Botones primarios */
.rounded-lg.bg-primary.px-4.py-2.text-white

/* Inputs */
.w-full.rounded-lg.border.border-gray-200.p-2

/* Grid responsive */
.grid.gap-3.sm:grid-cols-2
```

## 🔧 Funcionalidades Clave

### Dashboard (app/page.tsx)

- **Citas de hoy**: Filtradas por fecha actual
- **Próximas citas**: 5 citas siguientes
- **Resumen financiero**: Totales diarios/semanales/mensuales

### Gestión de Citas (AppointmentBoard.tsx)

- **Crear**: Formulario con cliente, servicio, horario, precio
- **Editar**: Modal inline con todos los campos
- **Estados**: SCHEDULED → COMPLETED/CANCELLED
- **Validación**: Campos requeridos, fechas válidas

### Gestión de Clientes (ClientBoard.tsx)

- **CRUD completo**: Crear, leer, actualizar, eliminar
- **Campos**: Nombre (requerido), teléfono, email, notas
- **Relaciones**: Citas asociadas

### Control Financiero (FinanceBoard.tsx)

- **Tipos**: INCOME (ingresos), EXPENSE (gastos)
- **Categorización**: Campo libre para categoría
- **Resúmenes**: Cálculos automáticos por período
- **Fechas**: Campo de fecha para transacciones

## 🎯 Tareas Comunes para Agentes

### 1. Agregar Nueva Funcionalidad

```typescript
// 1. Crear endpoint API
// app/api/nueva-funcionalidad/route.ts
export async function GET() {
  /* ... */
}
export async function POST(request: Request) {
  /* ... */
}

// 2. Crear componente
// components/NuevoComponente.tsx
export function NuevoComponente() {
  /* ... */
}

// 3. Agregar página
// app/nueva-pagina/page.tsx
export default function NuevaPagina() {
  /* ... */
}

// 4. Actualizar navegación
// components/Nav.tsx
const links = [
  // ... enlaces existentes
  { href: '/nueva-pagina', label: 'Nueva Funcionalidad' },
]
```

### 2. Modificar Esquema de Base de Datos

```prisma
// prisma/schema.prisma
model NuevaTabla {
  id        Int      @id @default(autoincrement())
  campo     String
  createdAt DateTime @default(now())
}

// Luego ejecutar:
// npm run prisma:generate
// npm run prisma:push
```

### 3. Agregar Validación

```typescript
// Usar Zod para validación
import { z } from 'zod'

const schema = z.object({
  name: z.string().min(1, 'Nombre requerido'),
  email: z.string().email('Email inválido').optional(),
  phone: z.string().optional(),
})

// En componente
const result = schema.safeParse(draft)
if (!result.success) {
  setError(result.error.errors[0].message)
  return
}
```

### 4. Optimizar Performance

```typescript
// Usar useMemo para cálculos costosos
const sortedData = useMemo(
  () => data.sort((a, b) => new Date(a.date) - new Date(b.date)),
  [data]
)

// Usar useCallback para funciones
const handleSubmit = useCallback(async () => {
  // ... lógica
}, [dependencies])
```

## 🐛 Debugging Común

### Problemas de Base de Datos

```bash
# Regenerar cliente Prisma
npm run prisma:generate

# Aplicar cambios
npm run prisma:push

# Ver datos
npx prisma studio
```

### Problemas de API

```typescript
// Verificar respuesta
const response = await fetch('/api/endpoint')
if (!response.ok) {
  const error = await response.text()
  console.error('API Error:', error)
  throw new Error(`API Error: ${response.status}`)
}
```

### Problemas de Estado

```typescript
// Verificar estado actual
console.log('Current state:', { data, draft, error })

// Resetear estado
setData(initialData)
setDraft(emptyDraft)
setError(null)
```

## 🎨 Mejoras de UI/UX

### Responsive Design

```typescript
// Grid responsive
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {/* Contenido */}
</div>

// Navegación móvil/desktop
<nav className="fixed bottom-0 left-0 right-0 z-50 md:static">
  {/* Navegación */}
</nav>
```

### Accesibilidad

```typescript
// Labels apropiados
<label htmlFor="input-id" className="block text-sm text-gray-600">
  Nombre
</label>
<input
  id="input-id"
  className="w-full rounded-lg border border-gray-200 p-2"
  aria-describedby="error-message"
/>

// Mensajes de error
{error && (
  <p id="error-message" className="text-sm text-red-600">
    {error}
  </p>
)}
```

## 🚀 Optimizaciones

### Bundle Size

```typescript
// Lazy loading de componentes
const LazyComponent = dynamic(() => import('./Component'), {
  loading: () => <div>Loading...</div>,
})

// Tree shaking
import { specificFunction } from 'library'
// En lugar de
import * as library from 'library'
```

### Database Queries

```typescript
// Incluir relaciones necesarias
const appointments = await prisma.appointment.findMany({
  include: { client: true },
  where: { status: 'SCHEDULED' },
  orderBy: { start: 'asc' },
})

// Usar select para campos específicos
const clients = await prisma.client.findMany({
  select: { id: true, name: true, phone: true },
})
```

## 🔒 Seguridad

### Validación de Inputs

```typescript
// Sanitizar strings
const sanitizeString = (str: string) => str.trim().replace(/[<>]/g, '')

// Validar números
const isValidPrice = (price: number) => !isNaN(price) && price >= 0

// Validar fechas
const isValidDate = (date: string) => !isNaN(Date.parse(date))
```

### Prevención de XSS

```typescript
// React escapa automáticamente, pero para HTML:
const sanitizeHTML = (html: string) => {
  return html.replace(/[<>]/g, '')
}
```

## 📈 Métricas y Analytics

### Tracking de Eventos

```typescript
// Función de tracking
const trackEvent = (event: string, data?: any) => {
  if (typeof window !== 'undefined') {
    // Google Analytics, Mixpanel, etc.
    console.log('Event:', event, data)
  }
}

// Uso en componentes
const handleCreateAppointment = async () => {
  await createAppointment()
  trackEvent('appointment_created', { service: draft.service })
}
```

## 🧪 Testing

### Unit Tests

```typescript
// Ejemplo de test
import { render, screen, fireEvent } from '@testing-library/react'
import { AppointmentBoard } from './AppointmentBoard'

test('creates appointment', async () => {
  render(<AppointmentBoard initialAppointments={[]} clients={[]} />)

  fireEvent.change(screen.getByLabelText('Service'), {
    target: { value: 'Haircut' },
  })

  fireEvent.click(screen.getByText('Create appointment'))

  expect(screen.getByText('Haircut')).toBeInTheDocument()
})
```

## 🔄 Flujo de Trabajo

### 1. Análisis de Requerimientos

- Entender la funcionalidad solicitada
- Identificar componentes afectados
- Planificar cambios en BD si es necesario

### 2. Implementación

- Crear/modificar endpoints API
- Actualizar componentes React
- Modificar esquema de BD si es necesario
- Actualizar navegación

### 3. Testing

- Probar funcionalidad manualmente
- Verificar responsive design
- Comprobar validaciones
- Revisar performance

### 4. Documentación

- Actualizar README si es necesario
- Documentar nuevos endpoints
- Actualizar guías de desarrollo

## 🎯 Mejores Prácticas

### Código Limpio

- Nombres descriptivos para variables y funciones
- Componentes pequeños y enfocados
- Separación de responsabilidades
- Comentarios cuando sea necesario

### Performance

- Evitar re-renders innecesarios
- Usar useMemo y useCallback apropiadamente
- Optimizar queries de base de datos
- Lazy loading para componentes pesados

### Mantenibilidad

- Estructura consistente
- Patrones establecidos
- Documentación actualizada
- Tests cuando sea posible

---

**¡Desarrollo exitoso! 🚀**
