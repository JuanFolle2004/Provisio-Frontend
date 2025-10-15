# Provisio Frontend

Provisio es una aplicación web para organizar compras, tareas del hogar y chats entre grupos. Este repositorio contiene el frontend construido con React 18, Vite y TypeScript.

## Características principales

- Autenticación con Firebase (email/contraseña) y persistencia del token en Zustand.
- Router basado en `react-router-dom` con rutas protegidas y layouts diferenciados para auth y app.
- React Query para consumo del backend (REST) y cacheo de datos.
- Componentes UI con TailwindCSS + shadcn (botones, diálogos, tabs, etc.) y soporte de modo oscuro.
- Gestión de grupos: dashboard, detalle con tabs (Productos, Chat, Miembros, Configuración).
- Chat en tiempo real con `socket.io-client` y catálogo de productos reutilizables.

## Stack

- React 18 + Vite + TypeScript.
- TailwindCSS + shadcn/ui (componentes adaptados manualmente).
- React Router DOM v6.
- React Query (@tanstack) para llamadas al backend (`src/api`).
- Zustand para estado global de autenticación (`src/store`).
- Firebase Auth (email/password) (`src/services/firebase.ts`).
- socket.io-client para mensajes en vivo (`src/services/socket.ts`).
- ESLint + Prettier + Tailwind plugin, formateo consistente.

## Comenzar

1. **Clona el repositorio**
   ```bash
   git clone <url> provisio-frontend
   cd provisio-frontend
   ```

2. **Crea tu archivo de variables de entorno**
   ```bash
   cp .env.example .env.local
   ```
   Completa los valores con tu configuración de Firebase y la URL del backend.

3. **Instala dependencias**
   ```bash
   npm install
   ```
   > ⚠️ Si aparece `ENOSPC` es por falta de espacio en disco. Libera espacio y vuelve a ejecutar el comando para que se descarguen todas las dependencias listadas en `package.json`.

4. **Ejecuta el entorno de desarrollo**
   ```bash
   npm run dev
   ```

5. **Format y lint (opcional)**
   ```bash
   npm run lint
   npx prettier --check \"src/**/*.{ts,tsx}\"
   ```

## Scripts disponibles

- `npm run dev`: levanta el servidor de desarrollo de Vite.
- `npm run build`: compila el proyecto (TypeScript + bundle).
- `npm run preview`: sirve la versión compilada.
- `npm run lint`: ejecuta ESLint con la configuración incluida.

## Estructura relevante

```
src/
 ├─ api/                # Cliente REST y definiciones de dominio
 ├─ app/                # Router, proveedores globales y error boundary
 ├─ components/         # Componentes UI, layouts, módulos (chat, grupos)
 ├─ config/             # Carga de variables de entorno
 ├─ hooks/              # Hooks personalizados (auth guard, sockets)
 ├─ pages/              # Páginas y vistas principales
 ├─ services/           # Firebase y socket.io
 ├─ store/              # Zustand store (auth)
 └─ lib/                # Utilidades (cn, formatters)
```

## Variables de entorno

| Variable                | Descripción                                 |
| ----------------------- | ------------------------------------------- |
| `VITE_FIREBASE_API_KEY` | API Key del proyecto Firebase               |
| `VITE_AUTH_DOMAIN`      | Dominio de autenticación de Firebase        |
| `VITE_PROJECT_ID`       | ID del proyecto Firebase                    |
| `BACKEND_BASE_URL`      | URL base del backend (se reexpone para Vite)|
| `VITE_BACKEND_BASE_URL` | Mismo valor anterior, accesible en el cliente |

## Docker

El repositorio incluye un `Dockerfile` multi-stage que construye la aplicación y la sirve con Nginx.

```bash
docker build -t provisio-frontend .
docker run -p 4173:80 provisio-frontend
```

El contenedor expone la aplicación estática en el puerto 80; mapea a cualquier puerto disponible en tu host.

## Próximos pasos sugeridos

- Conectar las llamadas de `src/api` con un backend real (revisar rutas esperadas en cada función).
- Ajustar los nombres de eventos de Socket.IO según la implementación del servidor.
- Añadir validaciones adicionales y tests (unitarios o e2e) según sea necesario.
