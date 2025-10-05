# 🤝 Guía de Contribución - Salon Flow

¡Gracias por tu interés en contribuir a Salon Flow! Esta guía te ayudará a entender cómo puedes contribuir al proyecto.

## 📋 Tabla de Contenidos

- [Código de Conducta](#código-de-conducta)
- [¿Cómo Contribuir?](#cómo-contribuir)
- [Configuración del Entorno](#configuración-del-entorno)
- [Proceso de Desarrollo](#proceso-de-desarrollo)
- [Estándares de Código](#estándares-de-código)
- [Proceso de Pull Request](#proceso-de-pull-request)
- [Reportar Bugs](#reportar-bugs)
- [Sugerir Mejoras](#sugerir-mejoras)

## 📜 Código de Conducta

### Nuestros Compromisos

Nos comprometemos a hacer de la participación en nuestro proyecto una experiencia libre de acoso para todos, independientemente de la edad, tamaño corporal, discapacidad visible o invisible, etnia, características sexuales, identidad y expresión de género, nivel de experiencia, educación, estatus socioeconómico, nacionalidad, apariencia personal, raza, religión o identidad y orientación sexual.

### Comportamiento Esperado

- Usar lenguaje acogedor e inclusivo
- Respetar diferentes puntos de vista y experiencias
- Aceptar críticas constructivas con gracia
- Enfocarse en lo que es mejor para la comunidad
- Mostrar empatía hacia otros miembros de la comunidad

### Comportamiento Inaceptable

- Uso de lenguaje o imágenes sexualizadas
- Trolling, comentarios insultantes o despectivos
- Acoso público o privado
- Publicar información privada de otros sin permiso
- Otras conductas inapropiadas en un entorno profesional

## 🚀 ¿Cómo Contribuir?

### Tipos de Contribuciones

1. **🐛 Reportar Bugs**

   - Usar el template de issues
   - Proporcionar información detallada
   - Incluir pasos para reproducir

2. **💡 Sugerir Mejoras**

   - Describir la funcionalidad deseada
   - Explicar el caso de uso
   - Considerar alternativas

3. **🔧 Contribuir Código**

   - Fork del repositorio
   - Crear rama feature
   - Implementar cambios
   - Crear Pull Request

4. **📚 Mejorar Documentación**

   - Corregir errores
   - Agregar ejemplos
   - Mejorar claridad

5. **🧪 Escribir Tests**
   - Unit tests
   - Integration tests
   - E2E tests

## ⚙️ Configuración del Entorno

### Prerrequisitos

- Node.js 18+
- npm o yarn
- Git
- Editor de código (VS Code recomendado)

### Pasos de Instalación

1. **Fork del repositorio**

   ```bash
   # En GitHub, hacer fork del repositorio
   # Luego clonar tu fork
   git clone https://github.com/tu-usuario/salon-scheduler.git
   cd salon-scheduler
   ```

2. **Configurar upstream**

   ```bash
   git remote add upstream https://github.com/original-repo/salon-scheduler.git
   ```

3. **Instalar dependencias**

   ```bash
   npm install
   ```

4. **Configurar base de datos**

   ```bash
   npm run prisma:generate
   npm run prisma:push
   npm run prisma:seed
   ```

5. **Ejecutar en desarrollo**
   ```bash
   npm run dev
   ```

### Configuración de VS Code

**Extensiones recomendadas:**

- ES7+ React/Redux/React-Native snippets
- Tailwind CSS IntelliSense
- Prisma
- TypeScript Importer
- ESLint
- Prettier

**Configuración (.vscode/settings.json):**

```json
{
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

## 🔄 Proceso de Desarrollo

### 1. Crear Rama

```bash
# Actualizar rama principal
git checkout main
git pull upstream main

# Crear nueva rama
git checkout -b feature/nombre-de-la-funcionalidad
# o
git checkout -b fix/descripcion-del-bug
# o
git checkout -b docs/mejora-en-documentacion
```

### 2. Desarrollar

```bash
# Hacer cambios
# Probar localmente
npm run dev
npm run lint
npm run build

# Hacer commits
git add .
git commit -m "feat: agregar nueva funcionalidad"
```

### 3. Sincronizar

```bash
# Antes de hacer push, sincronizar con upstream
git fetch upstream
git rebase upstream/main
```

### 4. Push y Pull Request

```bash
# Push a tu fork
git push origin feature/nombre-de-la-funcionalidad

# Crear Pull Request en GitHub
```

## 📏 Estándares de Código

### Convenciones de Naming

```typescript
// Variables y funciones: camelCase
const userName = 'john'
const getUserData = () => {}

// Componentes: PascalCase
export function UserProfile() {}

// Constantes: UPPER_SNAKE_CASE
const API_BASE_URL = 'https://api.example.com'

// Archivos: kebab-case
// user-profile.tsx
// api-client.ts
```

### Estructura de Commits

```bash
# Formato: tipo(scope): descripción
feat: agregar funcionalidad de notificaciones
fix: corregir error en validación de formulario
docs: actualizar guía de instalación
style: formatear código según estándares
refactor: simplificar lógica de cálculo
test: agregar tests para componente UserProfile
chore: actualizar dependencias

# Tipos:
# feat: nueva funcionalidad
# fix: corrección de bug
# docs: documentación
# style: formato, espacios
# refactor: refactorización
# test: pruebas
# chore: tareas de mantenimiento
```

### Estructura de Componentes

```typescript
// 1. Imports
import React, { useState, useEffect } from 'react'
import { ComponentProps } from './types'

// 2. Types/Interfaces
type ComponentState = {
  data: DataType[]
  loading: boolean
  error: string | null
}

// 3. Componente principal
export function Component({ prop1, prop2 }: ComponentProps) {
  // 4. Hooks
  const [state, setState] = useState<ComponentState>({
    data: [],
    loading: false,
    error: null,
  })

  // 5. Funciones
  const handleSubmit = async () => {
    // lógica
  }

  // 6. Render
  return <div className='component-container'>{/* JSX */}</div>
}
```

### Estilos con Tailwind

```typescript
// Usar clases de Tailwind consistentemente
<div className="rounded-2xl bg-white p-4 shadow-sm">
  <h2 className="text-lg font-semibold mb-3">Título</h2>
  <p className="text-sm text-gray-600">Descripción</p>
</div>

// Responsive design
<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
  {/* Contenido */}
</div>

// Estados
<button className="rounded-lg bg-primary px-4 py-2 text-white hover:bg-primary/90 disabled:opacity-50">
  Botón
</button>
```

## 🔍 Proceso de Pull Request

### Antes de Crear PR

- [ ] Código funciona correctamente
- [ ] Tests pasan (`npm run test`)
- [ ] Linting pasa (`npm run lint`)
- [ ] Build exitoso (`npm run build`)
- [ ] Documentación actualizada
- [ ] Commits descriptivos

### Template de PR

```markdown
## Descripción

Breve descripción de los cambios realizados.

## Tipo de Cambio

- [ ] Bug fix
- [ ] Nueva funcionalidad
- [ ] Breaking change
- [ ] Documentación

## Cambios Realizados

- Cambio 1
- Cambio 2
- Cambio 3

## Testing

- [ ] Tests unitarios agregados/actualizados
- [ ] Tests de integración
- [ ] Testing manual realizado

## Screenshots (si aplica)

[Agregar screenshots de la UI]

## Checklist

- [ ] Código sigue los estándares del proyecto
- [ ] Self-review completado
- [ ] Documentación actualizada
- [ ] Tests agregados/actualizados
```

### Review Process

1. **Automático**: CI/CD checks
2. **Manual**: Review de código
3. **Testing**: Verificar funcionalidad
4. **Aprobación**: Merge a main

## 🐛 Reportar Bugs

### Template de Bug Report

```markdown
## Descripción del Bug

Descripción clara y concisa del bug.

## Pasos para Reproducir

1. Ir a '...'
2. Hacer click en '...'
3. Scroll hasta '...'
4. Ver error

## Comportamiento Esperado

Descripción de lo que debería pasar.

## Comportamiento Actual

Descripción de lo que está pasando.

## Screenshots

Si aplica, agregar screenshots.

## Información Adicional

- OS: [e.g. Windows 10, macOS 12.0]
- Browser: [e.g. Chrome 91, Firefox 89]
- Versión: [e.g. 1.0.0]

## Logs
```

Pegar logs relevantes aquí

```

```

### Severidad de Bugs

- **🔴 Critical**: Aplicación no funciona
- **🟠 High**: Funcionalidad principal afectada
- **🟡 Medium**: Funcionalidad secundaria afectada
- **🟢 Low**: Mejora menor o cosmética

## 💡 Sugerir Mejoras

### Template de Feature Request

```markdown
## ¿Es tu feature request relacionada a un problema?

Descripción del problema. Ej: Siempre me frustra cuando [...]

## Describe la solución que te gustaría

Descripción clara y concisa de lo que quieres que pase.

## Describe alternativas consideradas

Descripción de soluciones alternativas que has considerado.

## Contexto adicional

Agregar cualquier otro contexto o screenshots sobre la feature request.
```

### Criterios para Features

- **Utilidad**: ¿Resuelve un problema real?
- **Usabilidad**: ¿Es fácil de usar?
- **Performance**: ¿Afecta la performance?
- **Mantenibilidad**: ¿Es fácil de mantener?
- **Compatibilidad**: ¿Rompe funcionalidad existente?

## 🧪 Testing

### Estrategia de Testing

```typescript
// Unit Tests
describe('Component', () => {
  it('should render correctly', () => {
    render(<Component />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })
})

// Integration Tests
describe('API Endpoint', () => {
  it('should create appointment', async () => {
    const response = await request(app)
      .post('/api/appointments')
      .send(validData)
      .expect(201)

    expect(response.body).toHaveProperty('id')
  })
})
```

### Cobertura de Tests

- **Unit Tests**: 80%+ cobertura
- **Integration Tests**: Endpoints críticos
- **E2E Tests**: Flujos principales

## 📚 Documentación

### Tipos de Documentación

1. **README**: Información general
2. **API Docs**: Endpoints y ejemplos
3. **Developer Guide**: Guía para desarrolladores
4. **Deployment Guide**: Guía de despliegue
5. **Contributing Guide**: Esta guía

### Estándares de Documentación

- **Claridad**: Lenguaje claro y conciso
- **Ejemplos**: Código de ejemplo cuando sea posible
- **Actualización**: Mantener documentación actualizada
- **Estructura**: Usar headers y listas apropiadamente

## 🏷️ Labels y Milestones

### Labels

- `bug`: Algo no funciona
- `enhancement`: Nueva funcionalidad
- `documentation`: Mejoras en documentación
- `good first issue`: Bueno para nuevos contribuidores
- `help wanted`: Se necesita ayuda
- `priority: high`: Alta prioridad
- `priority: medium`: Prioridad media
- `priority: low`: Baja prioridad

### Milestones

- `v1.0.0`: Primera versión estable
- `v1.1.0`: Mejoras menores
- `v2.0.0`: Versión mayor con breaking changes

## 🎯 Roadmap

### Próximas Funcionalidades

- [ ] Notificaciones push
- [ ] Integración con calendario
- [ ] Reportes avanzados
- [ ] Múltiples usuarios
- [ ] Sincronización en la nube
- [ ] App móvil nativa

### Contribuciones Deseadas

- **Frontend**: Mejoras en UI/UX
- **Backend**: Optimizaciones de API
- **Testing**: Más cobertura de tests
- **Documentación**: Guías y ejemplos
- **Performance**: Optimizaciones

## 📞 Contacto

- **Issues**: Usar GitHub Issues
- **Discussions**: GitHub Discussions
- **Email**: [email de contacto]
- **Discord**: [enlace al servidor]

## 🙏 Reconocimientos

Gracias a todos los contribuidores que han ayudado a hacer este proyecto posible:

- [Lista de contribuidores]

---

**¡Gracias por contribuir a Salon Flow! 🚀**
