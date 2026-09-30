import React, { createContext, useContext, useEffect, useState } from 'react'
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../firebase'
import { UserProfile } from '../types'
import {
  loginWithEmail,
  registerWithEmail,
  loginWithGoogle,
  handleGoogleRedirectResult,
  logoutUser,
  resetPassword,
  syncUserProfile,
} from '../services/authService'

interface AuthContextType {
  user: FirebaseUser | null
  userProfile: UserProfile | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, pass: string) => Promise<UserProfile>
  register: (name: string, email: string, pass: string) => Promise<UserProfile>
  loginGoogle: () => Promise<UserProfile>
  logout: () => Promise<void>
  resetPass: (email: string) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<FirebaseUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    // Process redirect result asynchronously without blocking initial load
    handleGoogleRedirectResult().then((redirectProfile) => {
      if (redirectProfile) {
        setUserProfile(redirectProfile)
      }
    }).catch(err => console.error('Error procesando redirección de Google:', err))

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setUser(fbUser)

      if (fbUser) {
        try {
          const profile = await syncUserProfile(fbUser)
          setUserProfile(profile)
        } catch (err) {
          console.error('Error al sincronizar perfil de usuario:', err)
        }
      } else {
        setUserProfile(null)
      }

      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const login = async (email: string, pass: string) => {
    const profile = await loginWithEmail(email, pass)
    setUserProfile(profile)
    return profile
  }

  const register = async (name: string, email: string, pass: string) => {
    const profile = await registerWithEmail(name, email, pass)
    setUserProfile(profile)
    return profile
  }

  const loginGoogle = async () => {
    const profile = await loginWithGoogle()
    if (profile) {
      setUserProfile(profile)
    }
    return profile
  }

  const logout = async () => {
    await logoutUser()
    setUser(null)
    setUserProfile(null)
  }

  const resetPass = async (email: string) => {
    await resetPassword(email)
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        userProfile,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        loginGoogle,
        logout,
        resetPass,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth debe ser utilizado dentro de un AuthProvider')
  }
  return context
}
