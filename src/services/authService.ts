import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  signInWithRedirect,
  getRedirectResult,
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
googleProvider.setCustomParameters({ prompt: 'select_account' })

/**
 * Creates or updates the user profile document in Firestore: users/{uid}
 * Returns user profile INSTANTLY to prevent UI freezing, persisting to Firestore asynchronously.
 */
export async function syncUserProfile(user: FirebaseUser, displayName?: string): Promise<UserProfile> {
  const name = displayName || user.displayName || user.email?.split('@')[0] || 'Usuario'
  const photoURL = user.photoURL || ''
  const provider = user.providerData[0]?.providerId || 'google.com'

  const isOwnerAdmin =
    user.email?.toLowerCase() === 'konigstudios.dev@gmail.com' ||
    user.email?.toLowerCase() === 'eder.adr05@gmail.com'

  const fallbackProfile: UserProfile = {
    uid: user.uid,
    name,
    email: user.email || '',
    photoURL,
    provider,
    role: isOwnerAdmin ? 'admin' : 'client',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  try {
    const userRef = doc(db, 'users', user.uid)

    // Fast 1-second timeout race against Firestore network read
    const timeoutPromise = new Promise<null>((resolve) => setTimeout(() => resolve(null), 1000))
    const snapPromise = getDoc(userRef)

    const snap = await Promise.race([snapPromise, timeoutPromise])

    if (!snap) {
      // Return fallback profile immediately if Firestore network takes > 1s
      return fallbackProfile
    }

    if (!snap.exists()) {
      // Save new user profile in background asynchronously without blocking UI return
      setDoc(userRef, {
        ...fallbackProfile,
        createdAtServer: serverTimestamp(),
        updatedAtServer: serverTimestamp(),
      }).catch(err => console.warn('Atención: guardando perfil nuevo en segundo plano:', err))

      return fallbackProfile
    } else {
      const existing = snap.data() as UserProfile
      let needsUpdate = false
      const updatedFields: Partial<UserProfile> = {}

      if (isOwnerAdmin && existing.role !== 'admin') {
        updatedFields.role = 'admin'
        needsUpdate = true
      }

      if (displayName && displayName !== existing.name) {
        updatedFields.name = displayName
        needsUpdate = true
      } else if (!existing.name && user.displayName) {
        updatedFields.name = user.displayName
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
        // Save profile updates in background asynchronously
        setDoc(userRef, {
          ...updatedProfile,
          updatedAtServer: serverTimestamp(),
        }, { merge: true }).catch(err => console.warn('Atención: actualizando perfil en segundo plano:', err))

        return updatedProfile
      }
      return existing
    }
  } catch (err) {
    console.warn('Sincronización con Firestore en segundo plano (usando perfil local):', err)
    return fallbackProfile
  }
}

/**
 * Translates Firebase auth errors into user-friendly Spanish messages
 */
export function getAuthErrorMessage(error: any): string {
  const code = error?.code || ''
  const message = error?.message || ''

  if (message.includes('offline') || code === 'unavailable') {
    return 'Conexión inestable con el servidor. Por favor verifica tu red e intenta de nuevo.'
  }

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
      return 'El inicio de sesión con Google fue cancelado por el usuario.'
    case 'auth/popup-blocked':
      return 'El navegador bloqueó la ventana emergente. Por favor permite las ventanas emergentes o reintenta.'
    case 'auth/cancelled-popup-request':
      return 'Se canceló la solicitud de inicio de sesión.'
    case 'auth/account-exists-with-different-credential':
      return 'Ya existe una cuenta vinculada con este correo usando otro método de acceso.'
    case 'auth/unauthorized-domain':
      return 'El dominio de la app no está autorizado en Firebase. Agrega velia.konigstudios.com en Firebase Console > Authentication > Settings > Authorized domains.'
    case 'auth/network-request-failed':
      return 'Error de red. Por favor verifica tu conexión a internet.'
    case 'auth/too-many-requests':
      return 'Demasiados intentos fallidos. Intenta de nuevo en unos minutos.'
    default:
      return message || 'Ocurrió un error con la autenticación. Reintenta por favor.'
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
 * Logs in or Registers with Google Provider (with fallback to redirect if popup fails)
 */
export async function loginWithGoogle(): Promise<UserProfile> {
  try {
    const cred = await signInWithPopup(auth, googleProvider)
    return await syncUserProfile(cred.user)
  } catch (error: any) {
    if (
      error?.code === 'auth/popup-blocked' ||
      error?.code === 'auth/operation-not-supported-in-this-environment'
    ) {
      await signInWithRedirect(auth, googleProvider)
      return new Promise<UserProfile>(() => {})
    }
    throw error
  }
}

/**
 * Handles redirect result from Google authentication if redirect flow was used
 */
export async function handleGoogleRedirectResult(): Promise<UserProfile | null> {
  try {
    const result = await getRedirectResult(auth)
    if (result?.user) {
      return await syncUserProfile(result.user)
    }
  } catch (err) {
    console.error('Error al procesar el resultado de redirección de Google:', err)
  }
  return null
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
