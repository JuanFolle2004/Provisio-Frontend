import { Outlet } from 'react-router-dom'

export const AuthLayout = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/20 p-6">
      <div className="w-full max-w-md space-y-6 rounded-2xl border bg-background p-8 shadow-sm">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Provisio</h1>
          <p className="text-sm text-muted-foreground">Organiza tus compras compartidas de forma sencilla.</p>
        </div>
        <Outlet />
      </div>
    </div>
  )
}
