/// <reference types="vite/client" />

import { Echo as EchoType } from 'laravel-echo'
import Pusher from 'pusher-js'

interface ImportMetaEnv {
  readonly VITE_API_URL: string
  readonly VITE_REVERB_APP_KEY: string
  readonly VITE_REVERB_HOST: string
  readonly VITE_REVERB_PORT: string
  readonly VITE_REVERB_SCHEME: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}

declare global {
  interface Window {
    Echo: EchoType
    Pusher: typeof Pusher
  }
}

export {}