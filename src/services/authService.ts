import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  sendPasswordResetEmail,
  User as FirebaseUser,
  updateProfile,
} from 'firebase/auth'
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { UserProfile } from '../types'

const googleProvider = new GoogleAuthProvider()

/**
 * Creates or updates the user profile document in Firestore: users/{uid}
 */
export async function syncUserProfile(user: FirebaseUser, displayName?: string): Promise<UserProfile> {
  const userRef = doc(db, 'users', user.uid)
  const snap = await getDoc(userRef)

  const name = displayName || user.displayName || user.email?.split('@')[0] || 'Usuario'
  const photoURL = user.photoURL || ''
  const provider = user.providerData[0]?.providerId || 'password'

  if (!snap.exists()) {
    const newProfile: UserProfile = {
      uid: user.uid,
      name,
      email: user.email || '',
      photoURL,
      provider,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }
    await setDoc(userRef, {
      ...newProfile,
      createdAtServer: serverTimestamp(),
      updatedAtServer: serverTimestamp(),
    })
    return newProfile
  } else {
    const existing = snap.data() as UserProfile
    let needsUpdate = false
    const updatedFields: Partial<UserProfile> = {}

    if (displayName && displayName !== existing.name) {
      updatedFields.name = displayName
      needsUpdate = true
    }
    if (photoURL && photoURL !== existing.photoURL) {
      updatedFields.photoURL = photoURL
      needsUpdate = true
    }

    if (needsUpdate) {
      const updatedProfile = {
        ...existing,
        ...updatedFields,
        updatedAt: new Date().toISOString(),
      }
      await setDoc(userRef, {
        ...updatedProfile,
        updatedAtServer: serverTimestamp(),
      }, { merge: true })
      return updatedProfile
    }
    return existing
  }
}

/**
 * Translates Firebase auth errors into user-friendly Spanish messages
 */
export function getAuthErrorMessage(error: any): string {
  const code = error?.code || ''
  switch (code) {
    case 'auth/email-already-in-use':
      return 'Este correo electrónico ya está registrado. Intenta iniciar sesión.'
    case 'auth/invalid-email':
      return 'El correo electrónico no es válido.'
    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Correo electrónico o contraseña incorrectos.'
    case 'auth/weak-password':
      return 'La contraseña debe tener al menos 6 caracteres.'
    case 'auth/popup-closed-by-user':
      return 'El inicio de sesión con Google fue cancelado.'
    case 'auth/network-request-failed':
      return 'Error de red. Por favor verifica tu conexión a internet.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.'
    default:
      return error?.message || 'Ocurrió un error con la autenticación. Reintenta por favor.'
  }
}

/**
 * Registers a new user with Email + Password
 */
export async function registerWithEmail(name: string, email: string, pass: string): Promise<UserProfile> {
  const cred = await createUserWithEmailAndPassword(auth, email, pass)
  if (name) {
    await updateProfile(cred.user, { displayName: name })
  }
  return await syncUserProfile(cred.user, name)
}

/**
 * Logs in with Email + Password
 */
export async function loginWithEmail(email: string, pass: string): Promise<UserProfile> {
  const cred = await signInWithEmailAndPassword(auth, email, pass)
  return await syncUserProfile(cred.user)
}

/**
 * Logs in or Registers with Google Provider
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  const cred = await signInWithPopup(auth, googleProvider)
  return await syncUserProfile(cred.user)
}

/**
 * Sends Password Reset Email
 */
export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email)
}

/**
 * Logs out current user
 */
export async function logoutUser(): Promise<void> {
  await signOut(auth)
}
