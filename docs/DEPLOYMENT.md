# 🚀 Guía de Despliegue - Salon Flow

Esta guía cubre todas las opciones de despliegue para la aplicación Salon Flow.

## 📋 Prerrequisitos

- Cuenta en plataforma de despliegue
- Repositorio en GitHub/GitLab
- Node.js 18+ en el entorno de producción
- Base de datos compatible (SQLite, PostgreSQL, MySQL)

## 🌟 Opciones de Despliegue

### 1. Vercel (Recomendado)

**Ventajas:**

- Optimizado para Next.js
- Despliegue automático desde Git
- CDN global
- HTTPS automático
- Soporte para SQLite y bases de datos externas

#### Pasos de Despliegue:

1. **Conectar repositorio**

   - Ir a [vercel.com](https://vercel.com)
   - Conectar cuenta de GitHub
   - Importar proyecto

2. **Configurar variables de entorno**

   ```env
   DATABASE_URL="file:./dev.db"
   ```

3. **Configurar build settings**

   ```json
   {
     "buildCommand": "npm run build",
     "outputDirectory": ".next",
     "installCommand": "npm install"
   }
   ```

4. **Desplegar**
   - Vercel detecta automáticamente Next.js
   - Despliegue automático en cada push

#### Configuración Avanzada (vercel.json):

```json
{
  "framework": "nextjs",
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "env": {
    "DATABASE_URL": "file:./dev.db"
  },
  "functions": {
    "app/api/**/*.ts": {
      "maxDuration": 30
    }
  }
}
```

### 2. Netlify

**Ventajas:**

- Despliegue desde Git
- Formularios integrados
- CDN global
- Funciones serverless

#### Pasos de Despliegue:

1. **Conectar repositorio**

   - Ir a [netlify.com](https://netlify.com)
   - Conectar cuenta de GitHub
   - Importar proyecto

2. **Configurar build settings**

   ```yaml
   # netlify.toml
   [build]
     command = "npm run build"
     publish = ".next"

   [build.environment]
     NODE_VERSION = "18"
     DATABASE_URL = "file:./dev.db"
   ```

3. **Configurar funciones**
   ```yaml
   [functions]
     directory = "app/api"
   ```

### 3. Railway

**Ventajas:**

- Soporte nativo para SQLite
- Base de datos PostgreSQL incluida
- Despliegue automático
- Logs en tiempo real

#### Pasos de Despliegue:

1. **Conectar repositorio**

   - Ir a [railway.app](https://railway.app)
   - Conectar cuenta de GitHub
   - Crear nuevo proyecto

2. **Configurar base de datos**

   ```bash
   # Agregar PostgreSQL
   railway add postgresql
   ```

3. **Configurar variables**

   ```env
   DATABASE_URL="postgresql://user:pass@host:port/db"
   NODE_ENV="production"
   ```

4. **Configurar build**
   ```json
   {
     "scripts": {
       "build": "npm run prisma:generate && npm run build",
       "start": "npm run start"
     }
   }
   ```

### 4. Heroku

**Ventajas:**

- Plataforma establecida
- Add-ons para base de datos
- Escalabilidad fácil

#### Pasos de Despliegue:

1. **Instalar Heroku CLI**

   ```bash
   npm install -g heroku
   heroku login
   ```

2. **Crear aplicación**

   ```bash
   heroku create salon-flow-app
   ```

3. **Configurar base de datos**

   ```bash
   heroku addons:create heroku-postgresql:hobby-dev
   ```

4. **Configurar variables**

   ```bash
   heroku config:set NODE_ENV=production
   heroku config:set DATABASE_URL=$(heroku config:get DATABASE_URL)
   ```

5. **Desplegar**
   ```bash
   git push heroku main
   ```

### 5. DigitalOcean App Platform

**Ventajas:**

- Precios competitivos
- Escalabilidad automática
- Base de datos gestionada

#### Pasos de Despliegue:

1. **Crear aplicación**

   - Ir a [DigitalOcean App Platform](https://cloud.digitalocean.com/apps)
   - Conectar repositorio

2. **Configurar build**
   ```yaml
   # .do/app.yaml
   name: salon-flow
   services:
     - name: web
       source_dir: /
       github:
         repo: username/salon-flow
         branch: main
       run_command: npm start
       environment_slug: node-js
       instance_count: 1
       instance_size_slug: basic-xxs
       envs:
         - key: NODE_ENV
           value: production
         - key: DATABASE_URL
           value: ${db.DATABASE_URL}
   databases:
     - name: db
       engine: PG
       version: '13'
   ```

## 🗄️ Configuración de Base de Datos

### SQLite (Desarrollo)

```env
DATABASE_URL="file:./dev.db"
```

### PostgreSQL (Producción)

```env
DATABASE_URL="postgresql://username:password@host:port/database"
```

### MySQL (Alternativa)

```env
DATABASE_URL="mysql://username:password@host:port/database"
```

### Configuración de Prisma para Producción

1. **Actualizar schema.prisma**

   ```prisma
   datasource db {
     provider = "postgresql" // o "mysql"
     url      = env("DATABASE_URL")
   }
   ```

2. **Migrar base de datos**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

3. **Poblar datos iniciales**
   ```bash
   npm run prisma:seed
   ```

## 🔧 Variables de Entorno

### Desarrollo

```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

### Producción

```env
DATABASE_URL="postgresql://user:pass@host:port/db"
NODE_ENV="production"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
```

## 🛡️ Configuración de Seguridad

### Headers de Seguridad

```javascript
// next.config.js
const nextConfig = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ]
  },
}
```

### HTTPS

- **Vercel/Netlify**: HTTPS automático
- **Heroku**: HTTPS incluido
- **Railway**: HTTPS automático
- **DigitalOcean**: Configurar SSL

## 📊 Monitoreo y Logs

### Vercel

- **Analytics**: Integrado
- **Logs**: Dashboard de Vercel
- **Performance**: Core Web Vitals

### Netlify

- **Analytics**: Netlify Analytics
- **Logs**: Netlify Functions logs
- **Performance**: Netlify Analytics

### Railway

- **Logs**: Railway dashboard
- **Metrics**: CPU, Memory, Network
- **Alerts**: Configurables

### Heroku

- **Logs**: `heroku logs --tail`
- **Metrics**: Heroku Metrics
- **Add-ons**: New Relic, DataDog

## 🔄 CI/CD Pipeline

### GitHub Actions

```yaml
# .github/workflows/deploy.yml
name: Deploy to Production

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm install
      - run: npm run build
      - run: npm run test
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v20
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.ORG_ID }}
          vercel-project-id: ${{ secrets.PROJECT_ID }}
```

### GitLab CI

```yaml
# .gitlab-ci.yml
stages:
  - build
  - test
  - deploy

build:
  stage: build
  script:
    - npm install
    - npm run build
  artifacts:
    paths:
      - .next/

test:
  stage: test
  script:
    - npm run test

deploy:
  stage: deploy
  script:
    - npm run deploy
  only:
    - main
```

## 🚀 Optimizaciones de Producción

### Next.js

```javascript
// next.config.js
const nextConfig = {
  compress: true,
  poweredByHeader: false,
  generateEtags: false,
  images: {
    domains: ['example.com'],
    formats: ['image/webp', 'image/avif'],
  },
  experimental: {
    optimizeCss: true,
  },
}
```

### Base de Datos

```javascript
// lib/prisma.js
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: ['query', 'error', 'warn'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
```

### Caching

```javascript
// middleware.js
import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // Cache static assets
  if (request.nextUrl.pathname.startsWith('/_next/static')) {
    response.headers.set('Cache-Control', 'public, max-age=31536000, immutable')
  }

  return response
}
```

## 🔍 Troubleshooting

### Problemas Comunes

1. **Error de base de datos**

   ```bash
   npx prisma migrate deploy
   npx prisma generate
   ```

2. **Build falla**

   ```bash
   npm run build
   npm run lint
   ```

3. **Variables de entorno**

   ```bash
   # Verificar variables
   echo $DATABASE_URL
   ```

4. **Logs de producción**

   ```bash
   # Vercel
   vercel logs

   # Heroku
   heroku logs --tail

   # Railway
   railway logs
   ```

### Debugging

- **Frontend**: React DevTools
- **Backend**: Logs del servidor
- **Base de datos**: Prisma Studio
- **Network**: Chrome DevTools

## 📈 Escalabilidad

### Horizontal Scaling

- **Load Balancer**: Nginx, Cloudflare
- **Multiple Instances**: 2+ instancias
- **Database**: Read replicas

### Vertical Scaling

- **Memory**: 512MB → 1GB → 2GB
- **CPU**: 1 vCPU → 2 vCPU → 4 vCPU
- **Storage**: SSD, más espacio

### Optimizaciones

- **CDN**: Cloudflare, AWS CloudFront
- **Caching**: Redis, Memcached
- **Database**: Indexes, query optimization

## 💰 Costos Estimados

### Vercel

- **Hobby**: Gratis (100GB bandwidth)
- **Pro**: $20/mes (1TB bandwidth)

### Netlify

- **Starter**: Gratis (100GB bandwidth)
- **Pro**: $19/mes (1TB bandwidth)

### Railway

- **Starter**: $5/mes (512MB RAM)
- **Pro**: $20/mes (2GB RAM)

### Heroku

- **Eco**: $5/mes (512MB RAM)
- **Basic**: $7/mes (512MB RAM)

### DigitalOcean

- **Basic**: $5/mes (512MB RAM)
- **Professional**: $12/mes (1GB RAM)

---

**¡Despliegue exitoso! 🚀**
