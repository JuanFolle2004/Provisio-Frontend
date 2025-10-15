import { useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { useAuthStore } from '@/store/authStore'

export const useAuthGuard = (redirectTo = '/login') => {
  const navigate = useNavigate()
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const hydrated = useAuthStore((state) => state.hydrated)

  useEffect(() => {
    if (!hydrated) return

    if (status === 'unauthenticated') {
      navigate(redirectTo, {
        replace: true,
        state: { from: location.pathname },
      })
    }
  }, [hydrated, status, navigate, redirectTo, location.pathname])

  return {
    isLoading: !hydrated || status === 'idle' || status === 'loading',
    isAuthenticated: status === 'authenticated',
  }
}
