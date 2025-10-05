# 👨‍💻 Guía para Desarrolladores - Salon Flow

Esta documentación está dirigida a desarrolladores que trabajen en el proyecto Salon Flow, incluyendo agentes de IA y desarrolladores humanos.

## 🏗️ Arquitectura del Sistema

### Stack Tecnológico

- **Framework**: Next.js 14 con App Router
- **Lenguaje**: TypeScript
- **Base de Datos**: SQLite con Prisma ORM
- **Estilos**: Tailwind CSS
- **Validación**: Zod
- **Desarrollo**: ESLint, PostCSS

### Patrones de Diseño

- **Componentes**: React funcionales con hooks
- **Estado**: useState y useEffect para estado local
- **API**: RESTful endpoints con Next.js API Routes
- **Base de Datos**: ORM con Prisma
- **Validación**: Zod schemas en el frontend

## 📁 Estructura Detallada del Proyecto

```
salon-scheduler/
├── app/                          # Next.js App Router
│   ├── api/                     # API Routes (Backend)
│   │   ├── appointments/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts     # GET, PUT, DELETE /api/appointments/[id]
│   │   │   └── route.ts         # GET, POST /api/appointments
│   │   ├── clients/
│   │   │   ├── [id]/
│   │   │   │   └── route.ts     # GET, PUT, DELETE /api/clients/[id]
│   │   │   └── route.ts         # GET, POST /api/clients
│   │   └── finance/
│   │       ├── [id]/
│   │       │   └── route.ts     # GET, PUT, DELETE /api/finance/[id]
│   │       └── route.ts         # GET, POST /api/finance
│   ├── appointments/
│   │   └── page.tsx             # Página de gestión de citas
│   ├── clients/
│   │   └── page.tsx             # Página de gestión de clientes
│   ├── finances/
│   │   └── page.tsx             # Página de control financiero
│   ├── globals.css              # Estilos globales
│   ├── layout.tsx               # Layout principal
│   └── page.tsx                  # Dashboard principal
├── components/                  # Componentes React
│   ├── AppointmentBoard.tsx     # Gestión de citas
│   ├── ClientBoard.tsx          # Gestión de clientes
│   ├── FinanceBoard.tsx         # Control financiero
│   └── Nav.tsx                  # Navegación
├── lib/
│   └── prisma.ts                # Cliente de Prisma
├── prisma/
│   ├── schema.prisma            # Esquema de base de datos
│   ├── dev.db                   # Base de datos SQLite
│   └── seed.ts                  # Datos de ejemplo
└── docs/                        # Documentación
    ├── DEVELOPER.md             # Esta guía
    ├── API.md                   # Documentación de API
    └── DEPLOYMENT.md            # Guía de despliegue
```

## 🎯 Componentes Principales

### 1. AppointmentBoard.tsx

**Propósito**: Gestión completa de citas
**Funcionalidades**:

- Crear nuevas citas
- Editar citas existentes
- Cancelar citas
- Completar citas
- Asociar con clientes

**Estados**:

- `appointments`: Lista de citas
- `draft`: Formulario de nueva cita
- `isSubmitting`: Estado de carga
- `error`: Mensajes de error

**API Calls**:

- `POST /api/appointments` - Crear cita
- `PUT /api/appointments/[id]` - Actualizar cita
- `DELETE /api/appointments/[id]` - Eliminar cita

### 2. ClientBoard.tsx

**Propósito**: Gestión de clientes
**Funcionalidades**:

- Agregar nuevos clientes
- Editar información de clientes
- Eliminar clientes
- Ver historial de citas

**Estados**:

- `clients`: Lista de clientes
- `draft`: Formulario de nuevo cliente
- `isSubmitting`: Estado de carga
- `error`: Mensajes de error

### 3. FinanceBoard.tsx

**Propósito**: Control financiero
**Funcionalidades**:

- Registrar ingresos y gastos
- Categorizar transacciones
- Ver resúmenes por período
- Editar entradas financieras

**Estados**:

- `entries`: Lista de entradas financieras
- `draft`: Formulario de nueva entrada
- `summary`: Resúmenes calculados
- `isSubmitting`: Estado de carga

### 4. Nav.tsx

**Propósito**: Navegación principal
**Funcionalidades**:

- Navegación entre secciones
- Indicador de página activa
- Diseño responsive (móvil/desktop)

## 🗄️ Modelo de Datos

### Esquema Prisma

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
  updatedAt   DateTime   @updatedAt
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

### Relaciones

- **Client ↔ Appointment**: One-to-Many (un cliente puede tener múltiples citas)
- **Appointment → Client**: Many-to-One (una cita pertenece a un cliente, opcional)

## 🔌 API Endpoints

### Citas (Appointments)

- `GET /api/appointments` - Listar todas las citas
- `POST /api/appointments` - Crear nueva cita
- `GET /api/appointments/[id]` - Obtener cita específica
- `PUT /api/appointments/[id]` - Actualizar cita
- `DELETE /api/appointments/[id]` - Eliminar cita

### Clientes (Clients)

- `GET /api/clients` - Listar todos los clientes
- `POST /api/clients` - Crear nuevo cliente
- `GET /api/clients/[id]` - Obtener cliente específico
- `PUT /api/clients/[id]` - Actualizar cliente
- `DELETE /api/clients/[id]` - Eliminar cliente

### Finanzas (Finance)

- `GET /api/finance` - Listar todas las entradas financieras
- `POST /api/finance` - Crear nueva entrada
- `GET /api/finance/[id]` - Obtener entrada específica
- `PUT /api/finance/[id]` - Actualizar entrada
- `DELETE /api/finance/[id]` - Eliminar entrada

## 🎨 Patrones de UI/UX

### Diseño Mobile-First

- **Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Navegación**: Barra inferior en móvil, horizontal en desktop
- **Formularios**: Grid responsive (1 col móvil, 2 cols desktop)
- **Cards**: Bordes redondeados, sombras sutiles

### Colores y Tipografía

```css
/* Colores principales */
--primary: #3B82F6 (azul)
--gray-100: #F3F4F6
--gray-500: #6B7280
--gray-900: #111827
--red-500: #EF4444 (para gastos)

/* Tipografía */
font-family: system-ui, sans-serif
text-sm: 14px
text-lg: 18px
text-xl: 20px
text-2xl: 24px
```

### Componentes Reutilizables

- **Cards**: `.rounded-2xl .bg-white .p-4 .shadow-sm`
- **Botones**: `.rounded-lg .px-4 .py-2`
- **Inputs**: `.w-full .rounded-lg .border .border-gray-200 .p-2`
- **Labels**: `.text-sm .text-gray-600`

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```env
DATABASE_URL="file:./dev.db"
```

### Scripts de Desarrollo

```bash
# Desarrollo
npm run dev              # Servidor de desarrollo en puerto 3000
npm run build           # Construir para producción
npm run start           # Servidor de producción
npm run lint            # Verificar código con ESLint

# Base de datos
npm run prisma:generate # Generar cliente Prisma
npm run prisma:push     # Aplicar cambios al esquema
npm run prisma:seed     # Poblar con datos de ejemplo
```

### Estructura de Commits

```
feat: nueva funcionalidad
fix: corrección de bug
docs: documentación
style: formato, espacios
refactor: refactorización
test: pruebas
chore: tareas de mantenimiento
```

## 🐛 Debugging y Troubleshooting

### Problemas Comunes

1. **Error de base de datos**

```bash
npm run prisma:generate
npm run prisma:push
```

2. **Dependencias desactualizadas**

```bash
npm install
```

3. **Puerto ocupado**

```bash
# Cambiar puerto en package.json o usar:
npm run dev -- -p 3001
```

### Logs y Debugging

- **Frontend**: React DevTools, console.log
- **Backend**: Logs en terminal del servidor
- **Base de datos**: Prisma Studio (`npx prisma studio`)

## 🧪 Testing

### Estrategia de Testing

- **Unit Tests**: Funciones utilitarias
- **Integration Tests**: API endpoints
- **E2E Tests**: Flujos completos de usuario

### Herramientas Recomendadas

- **Jest**: Framework de testing
- **React Testing Library**: Testing de componentes
- **Playwright**: E2E testing

## 🚀 Optimizaciones

### Performance

- **Lazy Loading**: Componentes pesados
- **Memoization**: useMemo para cálculos costosos
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: `npm run build && npm run analyze`

### SEO

- **Metadata**: Next.js metadata API
- **Sitemap**: Generación automática
- **Open Graph**: Meta tags para redes sociales

## 🔒 Seguridad

### Mejores Prácticas

- **Validación**: Zod schemas en frontend y backend
- **Sanitización**: Limpiar inputs del usuario
- **Rate Limiting**: Limitar requests por IP
- **HTTPS**: Siempre en producción

### Vulnerabilidades Comunes

- **SQL Injection**: Prisma ORM previene esto
- **XSS**: React escapa automáticamente
- **CSRF**: Next.js incluye protección

## 📈 Monitoreo y Analytics

### Métricas Importantes

- **Performance**: Core Web Vitals
- **Errors**: JavaScript errors, API errors
- **Usage**: Páginas más visitadas, funcionalidades más usadas

### Herramientas Recomendadas

- **Vercel Analytics**: Para aplicaciones en Vercel
- **Google Analytics**: Tracking de usuarios
- **Sentry**: Error monitoring

## 🤝 Contribución

### Flujo de Trabajo

1. Fork del repositorio
2. Crear rama feature (`git checkout -b feature/nueva-funcionalidad`)
3. Hacer commits descriptivos
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Crear Pull Request

### Code Review

- **Revisar**: Funcionalidad, performance, seguridad
- **Comentarios**: Constructivos y específicos
- **Testing**: Verificar que los tests pasen

## 📚 Recursos Adicionales

### Documentación Oficial

- [Next.js Documentation](https://nextjs.org/docs)
- [Prisma Documentation](https://www.prisma.io/docs)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [React Documentation](https://react.dev)

### Herramientas de Desarrollo

- **VS Code Extensions**: ES7+ React/Redux/React-Native snippets, Tailwind CSS IntelliSense
- **Browser Extensions**: React Developer Tools
- **Database**: Prisma Studio, DB Browser for SQLite

---

**¡Happy Coding! 🚀**
