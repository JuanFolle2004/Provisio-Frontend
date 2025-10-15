import { RouterProvider } from 'react-router-dom'

import { ErrorBoundary } from '@/app/ErrorBoundary'
import { AppProviders } from '@/app/providers'
import { router } from '@/app/router'

const App = () => {
  return (
    <ErrorBoundary>
      <AppProviders>
        <RouterProvider router={router} />
      </AppProviders>
    </ErrorBoundary>
  )
}

export default App
