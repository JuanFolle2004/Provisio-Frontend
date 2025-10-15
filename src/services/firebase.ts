import { initializeApp } from 'firebase/app'
import { browserLocalPersistence, getAuth, setPersistence } from 'firebase/auth'

import { env } from '@/config/env'

const firebaseApp = initializeApp({
  apiKey: env.firebase.apiKey,
  authDomain: env.firebase.authDomain,
  projectId: env.firebase.projectId,
})

const auth = getAuth(firebaseApp)

void setPersistence(auth, browserLocalPersistence)

export { auth, firebaseApp }
