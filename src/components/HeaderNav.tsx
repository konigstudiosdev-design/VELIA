import React from 'react'
import { AppView } from '../types'
import { useAuth } from '../contexts/AuthContext'

interface HeaderNavProps {
  currentView: AppView
  onNavigate: (view: AppView) => void
  userEmail?: string
}

export default function HeaderNav({ currentView, onNavigate, userEmail }: HeaderNavProps) {
  const { user, logout } = useAuth()

  if (currentView === 'dashboard') {
    return null
  }

  const isLanding = currentView === 'landing'

  const handleLogout = async () => {
    try {
      await logout()
      onNavigate('landing')
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  return (
    <header className="fixed inset-x-0 top-0 z-50 bg-ivory/96 backdrop-blur-md border-b border-beige/60 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16 lg:h-20">
        {/* Brand Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-3 text-left focus:outline-none group cursor-pointer"
        >
          <span className="font-display text-2xl lg:text-[1.7rem] tracking-[0.28em] text-brown font-light select-none group-hover:text-champagne transition-colors duration-200">
            VÉLIA
          </span>
          {!isLanding && (
            <span className="hidden sm:inline-block font-body text-[0.62rem] tracking-[0.2em] uppercase px-2.5 py-0.5 rounded-full bg-beige/60 text-brown/60 border border-beige">
              Invitaciones
            </span>
          )}
        </button>

        {/* Navigation context */}
        {isLanding ? (
          <>
            <nav className="hidden lg:flex items-center gap-9">
              <a
                href="#Plantillas"
                className="font-body text-[0.8125rem] tracking-wide text-brown/60 hover:text-brown transition-colors duration-200"
              >
                Plantillas
              </a>
              <a
                href="#Cómo funciona"
                className="font-body text-[0.8125rem] tracking-wide text-brown/60 hover:text-brown transition-colors duration-200"
              >
                Cómo funciona
              </a>
              <a
                href="#Funciones"
                className="font-body text-[0.8125rem] tracking-wide text-brown/60 hover:text-brown transition-colors duration-200"
              >
                Funciones
              </a>
              <a
                href="#Precios"
                className="font-body text-[0.8125rem] tracking-wide text-brown/60 hover:text-brown transition-colors duration-200"
              >
                Precios
              </a>
            </nav>

            <div className="flex items-center gap-4">
              {user ? (
                <>
                  <button
                    onClick={() => onNavigate('dashboard')}
                    className="font-body text-[0.8125rem] font-medium bg-brown text-ivory px-5 lg:px-6 py-2.5 rounded-full hover:bg-ink transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    Mi Panel
                  </button>
                  <button
                    onClick={handleLogout}
                    className="font-body text-xs text-brown/60 hover:text-brown transition-colors cursor-pointer"
                  >
                    Salir
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onNavigate('login')}
                    className="font-body text-[0.8125rem] text-brown/70 hover:text-brown px-3 py-2 transition-colors cursor-pointer"
                  >
                    Entrar
                  </button>
                  <button
                    onClick={() => onNavigate('register')}
                    className="font-body text-[0.8125rem] font-medium bg-brown text-ivory px-5 lg:px-6 py-2.5 rounded-full hover:bg-ink transition-all duration-300 hover:scale-[1.02] cursor-pointer"
                  >
                    Crear mi invitación
                  </button>
                </>
              )}
            </div>
          </>
        ) : (
          <div className="flex items-center gap-3 sm:gap-6">
            {(userEmail || user?.email) && (
              <span className="hidden md:inline-block font-body text-xs text-brown/50">
                {userEmail || user?.email}
              </span>
            )}

            {user && (
              <button
                onClick={handleLogout}
                className="font-body text-xs text-brown/60 hover:text-brown underline transition-colors cursor-pointer"
              >
                Cerrar sesión
              </button>
            )}

            <button
              onClick={() => onNavigate('landing')}
              className="font-body text-xs text-brown/60 hover:text-brown flex items-center gap-1.5 cursor-pointer"
            >
              <span>Volver al inicio</span>
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  )
}
