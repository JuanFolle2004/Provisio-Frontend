import { useState } from 'react'
import { toast } from 'sonner'

import { logout } from '@/api/auth'
import { Button } from '@/components/ui/button'
import { useAuthStore } from '@/store/authStore'

export const UserMenu = () => {
  const user = useAuthStore((state) => state.user)
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    try {
      setIsLoading(true)
      await logout()
      toast.success('Sesión cerrada correctamente')
    } catch (error) {
      console.error(error)
      toast.error('No pudimos cerrar tu sesión, intenta nuevamente')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex items-center gap-3">
      <div className="text-right text-sm">
        <p className="font-medium leading-none">{user?.displayName ?? 'Usuario'}</p>
        <p className="text-xs text-muted-foreground">{user?.email}</p>
      </div>
      <Button size="sm" variant="outline" onClick={handleLogout} disabled={isLoading}>
        {isLoading ? 'Cerrando…' : 'Cerrar sesión'}
      </Button>
    </div>
  )
}
