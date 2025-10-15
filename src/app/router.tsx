import { createBrowserRouter, Navigate } from 'react-router-dom'

import { ErrorBoundary } from '@/app/ErrorBoundary'
import { ProtectedRoute } from '@/app/ProtectedRoute'
import { AppShell, AuthLayout } from '@/components/layout'
import { LoginPage, RegisterPage, DashboardPage, GroupDetailPage } from '@/pages'

const ErrorElement = () => (
  <ErrorBoundary>
    <div className="p-6">
      <h2 className="text-xl font-semibold">Ocurrió un error en la navegación</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Intenta volver al inicio o recargar la página.
      </p>
      <a href="/" className="mt-4 inline-flex rounded-md bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        Volver al inicio
      </a>
    </div>
  </ErrorBoundary>
)

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <AppShell />
      </ProtectedRoute>
    ),
    errorElement: <ErrorElement />,
    children: [
      { index: true, element: <Navigate to="/app" replace /> },
      { path: 'app', element: <DashboardPage /> },
      { path: 'groups/:groupId', element: <GroupDetailPage /> },
    ],
  },
  {
    element: <AuthLayout />,
    children: [
      { path: '/login', element: <LoginPage /> },
      { path: '/register', element: <RegisterPage /> },
    ],
  },
  { path: '*', element: <Navigate to="/app" replace /> },
])
