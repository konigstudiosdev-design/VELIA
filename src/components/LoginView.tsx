import React, { useState } from 'react'
import { AppView } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage } from '../services/authService'

interface LoginViewProps {
  onNavigate: (view: AppView) => void
  onLoginSuccess: (email: string) => void
}

export default function LoginView({ onNavigate, onLoginSuccess }: LoginViewProps) {
  const { login, loginGoogle, resetPass } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [infoMessage, setInfoMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      setError('Por favor completa todos los campos')
      return
    }
    setError('')
    setInfoMessage('')
    setSubmitting(true)
    try {
      const profile = await login(email, password)
      onLoginSuccess(profile.email)
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleLogin = async () => {
    setError('')
    setInfoMessage('')
    setSubmitting(true)
    try {
      const profile = await loginGoogle()
      onLoginSuccess(profile.email)
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleResetPassword = async () => {
    if (!email) {
      setError('Ingresa tu correo electrónico para enviarte las instrucciones de recuperación.')
      return
    }
    setError('')
    try {
      await resetPass(email)
      setInfoMessage(`Se ha enviado un enlace de recuperación a ${email}.`)
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
    }
  }

  return (
    <div className="h-screen pt-16 lg:pt-20 flex items-center justify-center px-4 bg-ivory overflow-hidden">
      <div className="w-full max-w-md my-auto">
        {/* Header card */}
        <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-sm relative">
          {/* Top emblem */}
          <div className="text-center mb-5">
            <span className="font-display text-xl tracking-[0.3em] text-brown font-light block mb-1">
              VÉLIA
            </span>
            <div className="w-6 h-[0.5px] bg-champagne mx-auto mb-2" />
            <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
              Bienvenido a VÉLIA
            </h1>
            <p className="font-body text-xs text-brown/50 mt-1">
              Ingresa a tu cuenta para administrar tus invitaciones.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded bg-rose/15 border border-rose/30 text-brown text-xs font-body text-center leading-tight">
              {error}
            </div>
          )}

          {infoMessage && (
            <div className="mb-4 p-2.5 rounded bg-champagne/20 border border-champagne/40 text-brown text-xs font-body text-center leading-tight">
              {infoMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label className="block font-body text-[0.7rem] tracking-[0.12em] text-brown/65 uppercase mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="font-body text-[0.7rem] tracking-[0.12em] text-brown/65 uppercase">
                  Contraseña
                </label>
                <button
                  type="button"
                  onClick={handleResetPassword}
                  className="font-body text-xs text-champagne hover:underline cursor-pointer"
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all duration-200"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brown text-ivory font-body font-medium text-sm py-2.5 rounded-full hover:bg-ink transition-all duration-300 shadow-sm hover:scale-[1.01] cursor-pointer disabled:opacity-50 mt-1"
            >
              {submitting ? 'Iniciando sesión...' : 'Entrar'}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-4 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-beige/80" />
            </div>
            <span className="relative bg-white px-3 font-body text-[0.68rem] text-brown/40 uppercase tracking-widest">
              o continúa con
            </span>
          </div>

          {/* Google login */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={submitting}
            className="w-full bg-white border border-beige/90 text-brown font-body text-sm font-medium py-2.5 rounded-full hover:bg-ivory/80 transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.29v3.15C3.26 21.3 7.31 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.29C.47 8.21 0 10.05 0 12s.47 3.79 1.29 5.42l3.99-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.58l3.99 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            Continuar con Google
          </button>

          {/* Bottom link */}
          <div className="mt-5 text-center pt-4 border-t border-beige/60">
            <p className="font-body text-xs text-brown/60">
              ¿No tienes una cuenta aún?{' '}
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="font-medium text-brown underline hover:text-champagne transition-colors"
              >
                Crear una cuenta
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
