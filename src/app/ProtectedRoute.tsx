import { Navigate, useLocation } from 'react-router-dom'

import { Loader } from '@/components/common/Loader'
import { useAuthStore } from '@/store/authStore'

interface ProtectedRouteProps {
  children: React.ReactElement
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const location = useLocation()
  const status = useAuthStore((state) => state.status)
  const hydrated = useAuthStore((state) => state.hydrated)

  if (!hydrated || status === 'idle' || status === 'loading') {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader />
      </div>
    )
  }

  if (status !== 'authenticated') {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return children
}
