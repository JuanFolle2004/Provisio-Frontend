const requiredEnv = [
  'VITE_FIREBASE_API_KEY',
  'VITE_AUTH_DOMAIN',
  'VITE_PROJECT_ID',
] as const

const missing = requiredEnv.filter((key) => typeof import.meta.env[key] === 'undefined')

if (missing.length) {
  // eslint-disable-next-line no-console
  console.warn(
    `[env] Missing environment variables: ${missing.join(
      ', ',
    )}. Authentication features may not work as expected.`,
  )
}

export const env = {
  firebase: {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY ?? '',
    authDomain: import.meta.env.VITE_AUTH_DOMAIN ?? '',
    projectId: import.meta.env.VITE_PROJECT_ID ?? '',
  },
  backendBaseUrl:
    import.meta.env.VITE_BACKEND_BASE_URL ?? import.meta.env.BACKEND_BASE_URL ?? 'http://localhost:3333',
} as const
