# 🔌 Documentación de API - Salon Flow

Esta documentación describe todos los endpoints de la API REST de Salon Flow.

## 📋 Información General

- **Base URL**: `http://localhost:3000/api` (desarrollo)
- **Content-Type**: `application/json`
- **Métodos HTTP**: GET, POST, PUT, DELETE
- **Autenticación**: No requerida (aplicación de un solo usuario)

## 📅 Endpoints de Citas (Appointments)

### GET /api/appointments

Obtiene todas las citas.

**Respuesta:**

```json
[
  {
    "id": 1,
    "service": "Corte de pelo",
    "start": "2024-01-15T10:00:00.000Z",
    "end": "2024-01-15T11:00:00.000Z",
    "price": 25.0,
    "status": "SCHEDULED",
    "clientId": 1,
    "clientName": "Juan Pérez",
    "createdAt": "2024-01-10T08:00:00.000Z",
    "updatedAt": "2024-01-10T08:00:00.000Z"
  }
]
```

### POST /api/appointments

Crea una nueva cita.

**Body:**

```json
{
  "service": "Corte de pelo",
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T11:00:00.000Z",
  "price": 25.0,
  "clientId": 1,
  "status": "SCHEDULED"
}
```

**Respuesta:**

```json
{
  "id": 1,
  "service": "Corte de pelo",
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T11:00:00.000Z",
  "price": 25.0,
  "status": "SCHEDULED",
  "clientId": 1,
  "clientName": "Juan Pérez",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

### GET /api/appointments/[id]

Obtiene una cita específica.

**Parámetros:**

- `id` (number): ID de la cita

**Respuesta:**

```json
{
  "id": 1,
  "service": "Corte de pelo",
  "start": "2024-01-15T10:00:00.000Z",
  "end": "2024-01-15T11:00:00.000Z",
  "price": 25.0,
  "status": "SCHEDULED",
  "clientId": 1,
  "clientName": "Juan Pérez",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T08:00:00.000Z"
}
```

### PUT /api/appointments/[id]

Actualiza una cita existente.

**Parámetros:**

- `id` (number): ID de la cita

**Body:**

```json
{
  "service": "Corte y peinado",
  "start": "2024-01-15T10:30:00.000Z",
  "end": "2024-01-15T11:30:00.000Z",
  "price": 35.0,
  "status": "COMPLETED"
}
```

**Respuesta:**

```json
{
  "id": 1,
  "service": "Corte y peinado",
  "start": "2024-01-15T10:30:00.000Z",
  "end": "2024-01-15T11:30:00.000Z",
  "price": 35.0,
  "status": "COMPLETED",
  "clientId": 1,
  "clientName": "Juan Pérez",
  "createdAt": "2024-01-10T08:00:00.000Z",
  "updatedAt": "2024-01-10T09:00:00.000Z"
}
```

### DELETE /api/appointments/[id]

Elimina una cita.

**Parámetros:**

- `id` (number): ID de la cita

**Respuesta:**

```json
{
  "success": true,
  "message": "Appointment deleted successfully"
}
```

## 👥 Endpoints de Clientes (Clients)

### GET /api/clients

Obtiene todos los clientes.

**Respuesta:**

```json
[
  {
    "id": 1,
    "name": "Juan Pérez",
    "phone": "+1234567890",
    "email": "juan@example.com",
    "notes": "Cliente frecuente",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
]
```

### POST /api/clients

Crea un nuevo cliente.

**Body:**

```json
{
  "name": "María García",
  "phone": "+0987654321",
  "email": "maria@example.com",
  "notes": "Prefiere cortes cortos"
}
```

**Respuesta:**

```json
{
  "id": 2,
  "name": "María García",
  "phone": "+0987654321",
  "email": "maria@example.com",
  "notes": "Prefiere cortes cortos",
  "createdAt": "2024-01-10T08:00:00.000Z"
}
```

### GET /api/clients/[id]

Obtiene un cliente específico.

**Parámetros:**

- `id` (number): ID del cliente

**Respuesta:**

```json
{
  "id": 1,
  "name": "Juan Pérez",
  "phone": "+1234567890",
  "email": "juan@example.com",
  "notes": "Cliente frecuente",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### PUT /api/clients/[id]

Actualiza un cliente existente.

**Parámetros:**

- `id` (number): ID del cliente

**Body:**

```json
{
  "name": "Juan Carlos Pérez",
  "phone": "+1234567890",
  "email": "juancarlos@example.com",
  "notes": "Cliente VIP"
}
```

**Respuesta:**

```json
{
  "id": 1,
  "name": "Juan Carlos Pérez",
  "phone": "+1234567890",
  "email": "juancarlos@example.com",
  "notes": "Cliente VIP",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### DELETE /api/clients/[id]

Elimina un cliente.

**Parámetros:**

- `id` (number): ID del cliente

**Respuesta:**

```json
{
  "success": true,
  "message": "Client deleted successfully"
}
```

## 💰 Endpoints de Finanzas (Finance)

### GET /api/finance

Obtiene todas las entradas financieras.

**Respuesta:**

```json
[
  {
    "id": 1,
    "type": "INCOME",
    "amount": 25.0,
    "category": "Corte de pelo",
    "notes": "Servicio completado",
    "occurredOn": "2024-01-15T10:00:00.000Z",
    "createdAt": "2024-01-15T10:00:00.000Z"
  }
]
```

### POST /api/finance

Crea una nueva entrada financiera.

**Body:**

```json
{
  "type": "INCOME",
  "amount": 50.0,
  "category": "Coloración",
  "notes": "Servicio de coloración completa",
  "occurredOn": "2024-01-15T14:00:00.000Z"
}
```

**Respuesta:**

```json
{
  "id": 2,
  "type": "INCOME",
  "amount": 50.0,
  "category": "Coloración",
  "notes": "Servicio de coloración completa",
  "occurredOn": "2024-01-15T14:00:00.000Z",
  "createdAt": "2024-01-15T14:00:00.000Z"
}
```

### GET /api/finance/[id]

Obtiene una entrada financiera específica.

**Parámetros:**

- `id` (number): ID de la entrada

**Respuesta:**

```json
{
  "id": 1,
  "type": "INCOME",
  "amount": 25.0,
  "category": "Corte de pelo",
  "notes": "Servicio completado",
  "occurredOn": "2024-01-15T10:00:00.000Z",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### PUT /api/finance/[id]

Actualiza una entrada financiera existente.

**Parámetros:**

- `id` (number): ID de la entrada

**Body:**

```json
{
  "type": "INCOME",
  "amount": 30.0,
  "category": "Corte y peinado",
  "notes": "Servicio actualizado",
  "occurredOn": "2024-01-15T10:00:00.000Z"
}
```

**Respuesta:**

```json
{
  "id": 1,
  "type": "INCOME",
  "amount": 30.0,
  "category": "Corte y peinado",
  "notes": "Servicio actualizado",
  "occurredOn": "2024-01-15T10:00:00.000Z",
  "createdAt": "2024-01-15T10:00:00.000Z"
}
```

### DELETE /api/finance/[id]

Elimina una entrada financiera.

**Parámetros:**

- `id` (number): ID de la entrada

**Respuesta:**

```json
{
  "success": true,
  "message": "Finance entry deleted successfully"
}
```

## 📊 Códigos de Estado HTTP

### Éxito

- `200 OK`: Operación exitosa
- `201 Created`: Recurso creado exitosamente

### Errores del Cliente

- `400 Bad Request`: Datos de entrada inválidos
- `404 Not Found`: Recurso no encontrado
- `422 Unprocessable Entity`: Datos de validación fallidos

### Errores del Servidor

- `500 Internal Server Error`: Error interno del servidor

## 🔍 Ejemplos de Uso

### Crear una cita completa

```javascript
const response = await fetch('/api/appointments', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    service: 'Corte de pelo',
    start: '2024-01-15T10:00:00.000Z',
    end: '2024-01-15T11:00:00.000Z',
    price: 25.0,
    clientId: 1,
    status: 'SCHEDULED',
  }),
})

const appointment = await response.json()
```

### Obtener resumen financiero

```javascript
const response = await fetch('/api/finance')
const entries = await response.json()

// Calcular totales
const totals = entries.reduce(
  (acc, entry) => {
    if (entry.type === 'INCOME') {
      acc.income += entry.amount
    } else {
      acc.expense += entry.amount
    }
    return acc
  },
  { income: 0, expense: 0 }
)
```

### Actualizar estado de cita

```javascript
const response = await fetch(`/api/appointments/${appointmentId}`, {
  method: 'PUT',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    status: 'COMPLETED',
  }),
})
```

## 🛡️ Validación de Datos

### Citas

- `service`: String requerido
- `start`: DateTime requerido
- `end`: DateTime requerido
- `price`: Number positivo requerido
- `clientId`: Number opcional
- `status`: Enum ['SCHEDULED', 'COMPLETED', 'CANCELLED']

### Clientes

- `name`: String requerido
- `phone`: String opcional
- `email`: String opcional (formato email)
- `notes`: String opcional

### Finanzas

- `type`: Enum ['INCOME', 'EXPENSE'] requerido
- `amount`: Number positivo requerido
- `category`: String requerido
- `notes`: String opcional
- `occurredOn`: DateTime requerido

## 🔧 Configuración de Desarrollo

### Variables de Entorno

```env
DATABASE_URL="file:./dev.db"
```

### Testing de API

```bash
# Usar curl para testing
curl -X GET http://localhost:3000/api/appointments
curl -X POST http://localhost:3000/api/clients \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Client","phone":"1234567890"}'
```

### Herramientas Recomendadas

- **Postman**: Testing de API
- **Insomnia**: Cliente REST
- **curl**: Línea de comandos
- **Thunder Client**: Extensión de VS Code

## 📈 Rate Limiting

Actualmente no hay rate limiting implementado, pero se recomienda para producción:

- **Límite**: 100 requests por minuto por IP
- **Headers**: `X-RateLimit-Limit`, `X-RateLimit-Remaining`

## 🔒 Seguridad

### Headers de Seguridad

- `X-Content-Type-Options: nosniff`
- `X-Frame-Options: DENY`
- `X-XSS-Protection: 1; mode=block`

### Validación

- Todos los inputs son validados con Zod
- Sanitización automática de strings
- Prevención de SQL injection con Prisma ORM

## 🚀 Optimizaciones

### Caching

- **Headers**: `Cache-Control: max-age=300` para datos estáticos
- **ETags**: Para validación de cache

### Compresión

- **Gzip**: Habilitado automáticamente en Next.js
- **Brotli**: Para mejor compresión

---

**API Documentation v1.0 - Salon Flow** 🚀
