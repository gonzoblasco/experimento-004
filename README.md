# 💇‍♀️ Salon Flow

Una aplicación móvil-first para la gestión de salones de belleza y peluquerías, diseñada para optimizar la programación de citas, gestión de clientes y control financiero.

## ✨ Características

### 📱 **Diseño Mobile-First**

- Interfaz optimizada para dispositivos móviles
- Navegación intuitiva con barra inferior
- Responsive design que funciona en desktop y tablet

### 📅 **Gestión de Citas**

- **Dashboard** con el horario del día, citas próximas y resúmenes financieros
- Crear, editar, cancelar y completar citas
- Asociar citas con clientes existentes o walk-ins
- Control de precios y servicios
- Estados de citas: Programada, Completada, Cancelada

### 👥 **Gestión de Clientes**

- Base de datos de clientes con información de contacto
- Notas personalizadas por cliente
- Historial de citas por cliente
- Gestión completa (crear, editar, eliminar)

### 💰 **Control Financiero**

- Registro de ingresos y gastos
- Categorización de transacciones
- Resúmenes diarios, semanales y mensuales
- Seguimiento de rentabilidad

## 🚀 Tecnologías

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Base de Datos**: Prisma ORM con SQLite
- **Validación**: Zod
- **Desarrollo**: ESLint, PostCSS

## 📦 Instalación

### Prerrequisitos

- Node.js 18+
- npm o yarn

### Pasos de instalación

1. **Clonar el repositorio**

```bash
git clone <repository-url>
cd salon-scheduler
```

2. **Instalar dependencias**

```bash
npm install
```

3. **Configurar la base de datos**

```bash
# Generar el cliente de Prisma
npm run prisma:generate

# Aplicar migraciones
npm run prisma:push

# Poblar con datos de ejemplo (opcional)
npm run prisma:seed
```

4. **Configurar variables de entorno**
   Crear archivo `.env.local`:

```env
DATABASE_URL="file:./dev.db"
```

5. **Ejecutar en modo desarrollo**

```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

## 🗂️ Estructura del Proyecto

```
salon-scheduler/
├── app/                    # App Router de Next.js
│   ├── api/               # API Routes
│   │   ├── appointments/  # Endpoints de citas
│   │   ├── clients/       # Endpoints de clientes
│   │   └── finance/       # Endpoints financieros
│   ├── appointments/      # Página de citas
│   ├── clients/          # Página de clientes
│   ├── finances/         # Página de finanzas
│   └── page.tsx          # Dashboard principal
├── components/           # Componentes React
│   ├── AppointmentBoard.tsx
│   ├── ClientBoard.tsx
│   ├── FinanceBoard.tsx
│   └── Nav.tsx
├── lib/                  # Utilidades
│   └── prisma.ts         # Cliente de Prisma
├── prisma/               # Esquema y migraciones
│   ├── schema.prisma
│   └── seed.ts
└── public/              # Archivos estáticos
```

## 🎯 Uso de la Aplicación

### Dashboard Principal

- **Vista del día**: Citas programadas para hoy
- **Próximas citas**: Próximas 5 citas programadas
- **Resumen financiero**: Ingresos y gastos por período

### Gestión de Citas

1. **Crear cita**: Seleccionar cliente, servicio, horario y precio
2. **Editar cita**: Modificar detalles o cambiar estado
3. **Cancelar cita**: Marcar como cancelada
4. **Completar cita**: Marcar como completada

### Gestión de Clientes

1. **Agregar cliente**: Nombre, teléfono, email y notas
2. **Editar información**: Actualizar datos de contacto
3. **Ver historial**: Citas asociadas al cliente

### Control Financiero

1. **Registrar ingresos**: Servicios completados, propinas, etc.
2. **Registrar gastos**: Suministros, alquiler, servicios
3. **Categorizar**: Organizar por tipo de transacción
4. **Analizar**: Ver resúmenes por período

## 🔧 Scripts Disponibles

```bash
# Desarrollo
npm run dev          # Servidor de desarrollo
npm run build        # Construir para producción
npm run start        # Servidor de producción
npm run lint         # Verificar código

# Base de datos
npm run prisma:generate  # Generar cliente Prisma
npm run prisma:push      # Aplicar cambios al esquema
npm run prisma:seed      # Poblar con datos de ejemplo
```

## 📊 Modelo de Datos

### Cliente (Client)

- `id`: Identificador único
- `name`: Nombre del cliente
- `phone`: Teléfono (opcional)
- `email`: Email (opcional)
- `notes`: Notas adicionales
- `createdAt`: Fecha de creación

### Cita (Appointment)

- `id`: Identificador único
- `service`: Servicio a realizar
- `start`: Fecha y hora de inicio
- `end`: Fecha y hora de fin
- `price`: Precio del servicio
- `status`: Estado (SCHEDULED, COMPLETED, CANCELLED)
- `clientId`: Referencia al cliente
- `createdAt`: Fecha de creación
- `updatedAt`: Fecha de última actualización

### Entrada Financiera (FinanceEntry)

- `id`: Identificador único
- `type`: Tipo (INCOME, EXPENSE)
- `amount`: Monto
- `category`: Categoría
- `notes`: Notas adicionales
- `occurredOn`: Fecha de la transacción
- `createdAt`: Fecha de creación

## 🎨 Personalización

### Colores

La aplicación usa una paleta de colores definida en Tailwind:

- **Primary**: Color principal para botones y elementos destacados
- **Gray**: Escala de grises para texto y fondos
- **Red**: Para gastos y elementos de advertencia

### Componentes

Todos los componentes están en la carpeta `components/` y son reutilizables:

- `AppointmentBoard`: Gestión completa de citas
- `ClientBoard`: Gestión de clientes
- `FinanceBoard`: Control financiero
- `Nav`: Navegación principal

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conectar repositorio con Vercel
2. Configurar variables de entorno
3. Desplegar automáticamente

### Otras plataformas

- **Netlify**: Compatible con Next.js
- **Railway**: Soporte para SQLite
- **Heroku**: Con addon de base de datos

## 🤝 Contribución

1. Fork el proyecto
2. Crear rama para feature (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir Pull Request

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🆘 Soporte

Para soporte y preguntas:

- Crear un issue en GitHub
- Revisar la documentación de la API
- Consultar los logs de la aplicación

## 🔮 Roadmap

### Próximas características

- [ ] Notificaciones push
- [ ] Integración con calendario
- [ ] Reportes avanzados
- [ ] Múltiples usuarios
- [ ] Sincronización en la nube
- [ ] App móvil nativa

---

**Desarrollado con ❤️ para profesionales de la belleza**
