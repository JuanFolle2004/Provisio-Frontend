import { Outlet } from 'react-router-dom'

import { ThemeToggle } from '@/components/common/ThemeToggle'
import { UserMenu } from '@/components/layout/UserMenu'

export const AppShell = () => {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b">
        <div className="container flex h-16 items-center justify-between">
          <div>
            <p className="text-sm font-semibold text-primary">Provisio</p>
            <p className="text-xs text-muted-foreground">Organiza tus compras en equipo</p>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserMenu />
          </div>
        </div>
      </header>
      <main className="container flex flex-1 flex-col gap-6 py-6">
        <Outlet />
      </main>
    </div>
  )
}
