import React, { useState } from 'react'
import { AppView } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { getAuthErrorMessage } from '../services/authService'

interface RegisterViewProps {
  onNavigate: (view: AppView) => void
  onRegisterSuccess: (name: string, email: string) => void
}

export default function RegisterView({ onNavigate, onRegisterSuccess }: RegisterViewProps) {
  const { register, loginGoogle } = useAuth()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name || !email || !password) {
      setError('Por favor completa todos los campos requeridos')
      return
    }
    if (password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres')
      return
    }
    if (!acceptTerms) {
      setError('Debes aceptar los términos y condiciones')
      return
    }
    setError('')
    setSubmitting(true)
    try {
      const profile = await register(name, email, password)
      onRegisterSuccess(profile.name, profile.email)
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  const handleGoogleRegister = async () => {
    setError('')
    setSubmitting(true)
    try {
      const profile = await loginGoogle()
      onRegisterSuccess(profile.name, profile.email)
    } catch (err: any) {
      setError(getAuthErrorMessage(err))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="h-screen pt-16 lg:pt-20 flex items-center justify-center px-4 bg-ivory overflow-hidden">
      <div className="w-full max-w-md my-auto">
        <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-7 shadow-sm relative">
          <div className="text-center mb-4">
            <span className="font-display text-xl tracking-[0.3em] text-brown font-light block mb-1">
              VÉLIA
            </span>
            <div className="w-6 h-[0.5px] bg-champagne mx-auto mb-2" />
            <h1 className="font-display text-2xl lg:text-[1.8rem] text-brown font-light leading-tight">
              Comencemos a crear algo especial.
            </h1>
            <p className="font-body text-xs text-brown/50 mt-1">
              Crea tu cuenta en menos de un minuto.
            </p>
          </div>

          {error && (
            <div className="mb-3 p-2.5 rounded bg-rose/15 border border-rose/30 text-brown text-xs font-body text-center leading-tight">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3">
            <div>
              <label className="block font-body text-[0.68rem] tracking-[0.12em] text-brown/65 uppercase mb-1">
                Nombre completo
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={e => setName(e.target.value)}
                placeholder="Lucía Fernández"
                className="w-full px-3.5 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block font-body text-[0.68rem] tracking-[0.12em] text-brown/65 uppercase mb-1">
                Correo electrónico
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="tu@correo.com"
                className="w-full px-3.5 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all duration-200"
              />
            </div>

            <div>
              <label className="block font-body text-[0.68rem] tracking-[0.12em] text-brown/65 uppercase mb-1">
                Contraseña
              </label>
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Mínimo 6 caracteres"
                className="w-full px-3.5 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all duration-200"
              />
            </div>

            <div className="pt-1">
              <label className="flex items-start gap-2.5 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-0.5 rounded border-beige text-champagne focus:ring-champagne accent-brown"
                />
                <span className="font-body text-[0.72rem] text-brown/60 leading-tight">
                  Acepto los términos y condiciones y la política de privacidad.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-brown text-ivory font-body font-medium text-sm py-2.5 rounded-full hover:bg-ink transition-all duration-300 shadow-sm hover:scale-[1.01] cursor-pointer mt-1 disabled:opacity-50"
            >
              {submitting ? 'Creando cuenta...' : 'Crear cuenta'}
            </button>
          </form>

          {/* Separator */}
          <div className="relative my-3 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-beige/80" />
            </div>
            <span className="relative bg-white px-3 font-body text-[0.68rem] text-brown/40 uppercase tracking-widest">
              o continúa con
            </span>
          </div>

          {/* Google */}
          <button
            type="button"
            onClick={handleGoogleRegister}
            disabled={submitting}
            className="w-full bg-white border border-beige/90 text-brown font-body text-sm font-medium py-2 rounded-full hover:bg-ivory/80 transition-colors flex items-center justify-center gap-2.5 cursor-pointer disabled:opacity-50"
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

          {/* Login prompt */}
          <div className="mt-4 text-center pt-3 border-t border-beige/60">
            <p className="font-body text-xs text-brown/60">
              ¿Ya tienes cuenta?{' '}
              <button
                type="button"
                onClick={() => onNavigate('login')}
                className="font-medium text-brown underline hover:text-champagne transition-colors"
              >
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
