import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { configureEcho } from '@laravel/echo-react'
import Pusher from 'pusher-js'
import Echo from 'laravel-echo'
import { getAuthToken } from '@/config/api.ts'
console.log('🔧 Configurando Echo...')

configureEcho({
  broadcaster: "reverb",
  key: 'fnnapwcebppic6rrybz2',
  wsHost: 'localhost',
  wsPort: 8080,
  wssPort: 8080,
  forceTLS: false,
  enabledTransports: ['ws'],
  disableStats: true,
  authEndpoint: 'http://localhost/api/broadcasting/auth',
  auth: {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
      'Accept': 'application/json',
    }
  }
})
// ✅ Crear Echo manualmente
console.log('🔧 Creando Echo...')


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
