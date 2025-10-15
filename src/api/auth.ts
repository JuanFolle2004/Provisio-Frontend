import type { User } from 'firebase/auth'
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth'

import type { AuthUser } from '@/store/authStore'
import { useAuthStore } from '@/store/authStore'
import { auth } from '@/services/firebase'

export interface Credentials {
  email: string
  password: string
}

export interface RegistrationPayload extends Credentials {
  displayName: string
}

const mapUser = (user: User): AuthUser => ({
  uid: user.uid,
  email: user.email,
  displayName: user.displayName,
  photoURL: user.photoURL,
})

export const loginWithEmail = async ({ email, password }: Credentials) => {
  const credential = await signInWithEmailAndPassword(auth, email, password)
  const token = await credential.user.getIdToken()

  useAuthStore.getState().setAuth({
    user: mapUser(credential.user),
    token,
  })

  return credential.user
}

export const registerWithEmail = async ({ email, password, displayName }: RegistrationPayload) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password)

  await updateProfile(credential.user, { displayName })

  const token = await credential.user.getIdToken()

  useAuthStore.getState().setAuth({
    user: mapUser(credential.user),
    token,
  })

  return credential.user
}

export const logout = async () => {
  await signOut(auth)
  useAuthStore.getState().clear()
}
