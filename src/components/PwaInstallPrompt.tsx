import React, { useEffect, useState } from 'react'

export default function PwaInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null)
  const [showPrompt, setShowPrompt] = useState(false)

  useEffect(() => {
    // Check if user previously dismissed
    const dismissed = localStorage.getItem('velia_pwa_dismissed')
    if (dismissed) return

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setShowPrompt(true)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt)
    }
  }, [])

  const handleInstall = async () => {
    if (!deferredPrompt) return
    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice
    if (outcome === 'accepted') {
      setShowPrompt(false)
    }
    setDeferredPrompt(null)
  }

  const handleDismiss = () => {
    setShowPrompt(false)
    try {
      localStorage.setItem('velia_pwa_dismissed', 'true')
    } catch (e) {
      // Storage restriction fallback
    }
  }

  if (!showPrompt) return null

  return (
    <div className="fixed bottom-6 left-6 z-50 max-w-sm w-full bg-brown text-ivory p-5 rounded-3xl border border-champagne/40 shadow-2xl space-y-3 animate-fade-up">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-champagne text-brown font-display text-lg flex items-center justify-center font-bold">
            V
          </div>
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase block">
              Aplicación Móvil
            </span>
            <h4 className="font-display text-lg font-light text-white leading-none">
              Instalar VÉLIA
            </h4>
          </div>
        </div>

        <button
          onClick={handleDismiss}
          className="text-white/40 hover:text-white p-1 text-xs cursor-pointer"
          aria-label="Cerrar aviso de instalación"
        >
          ✕
        </button>
      </div>

      <p className="font-body text-xs text-white/70 leading-relaxed">
        Ten tu espacio de organización de invitaciones siempre disponible en tu pantalla de inicio.
      </p>

      <div className="flex items-center justify-end gap-2 pt-1">
        <button
          onClick={handleDismiss}
          className="font-body text-xs text-white/60 hover:text-white px-4 py-2 rounded-full cursor-pointer"
        >
          Ahora no
        </button>

        <button
          onClick={handleInstall}
          className="bg-champagne text-brown font-body font-medium text-xs px-5 py-2 rounded-full hover:bg-[#d4b990] transition-colors cursor-pointer shadow-xs"
        >
          Instalar
        </button>
      </div>
    </div>
  )
}
