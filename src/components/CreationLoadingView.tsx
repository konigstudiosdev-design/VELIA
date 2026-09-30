import React, { useEffect, useState, useRef } from 'react'

interface CreationLoadingViewProps {
  onCreateEvent: () => Promise<void>
  onProceedToDashboard: () => void
}

export default function CreationLoadingView({
  onCreateEvent,
  onProceedToDashboard,
}: CreationLoadingViewProps) {
  const [stage, setStage] = useState<'loading' | 'ready'>('loading')
  const [progress, setProgress] = useState(0)
  const [creationDone, setCreationDone] = useState(false)
  const createdRef = useRef(false)

  // 1. Run creation in background immediately on mount
  useEffect(() => {
    if (!createdRef.current) {
      createdRef.current = true
      onCreateEvent()
        .then(() => {
          setCreationDone(true)
        })
        .catch(() => {
          setCreationDone(true)
        })
    }
  }, [onCreateEvent])

  // 2. Animate progress bar smoothly
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStage('ready')
          return 100
        }
        return prev + 10
      })
    }, 100)

    return () => clearInterval(interval)
  }, [])

  // 3. Auto-navigate to dashboard once ready AND creation is done
  useEffect(() => {
    if (stage === 'ready' && creationDone) {
      const redirectTimer = setTimeout(() => {
        onProceedToDashboard()
      }, 700)
      return () => clearTimeout(redirectTimer)
    }
  }, [stage, creationDone, onProceedToDashboard])

  const handleManualProceed = () => {
    onProceedToDashboard()
  }

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-ivory flex items-center justify-center select-none">
      <div className="w-full max-w-md text-center">
        {/* Emblem animation */}
        <div className="relative w-24 h-24 mx-auto mb-8 flex items-center justify-center">
          <div
            className={`absolute inset-0 rounded-full border border-champagne/40 transition-all duration-1000 ${
              stage === 'loading' ? 'animate-ping opacity-25' : 'scale-110 opacity-60'
            }`}
          />
          <div className="w-16 h-16 rounded-full bg-white border border-beige/90 shadow-md flex items-center justify-center">
            {stage === 'loading' ? (
              <span className="font-display text-xl text-brown font-light animate-pulse">
                V
              </span>
            ) : (
              <span className="text-2xl text-champagne animate-bounce">
                ✓
              </span>
            )}
          </div>
        </div>

        {stage === 'loading' ? (
          <div>
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block mb-2">
              Procesando
            </span>

            <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mb-3">
              Estamos preparando tu invitación…
            </h1>

            <p className="font-body text-xs text-brown/50 mb-8 leading-relaxed max-w-xs mx-auto">
              {progress < 40
                ? 'Aplicando tipografía y paleta editorial...'
                : progress < 80
                ? 'Configurando secciones y mapa del evento...'
                : 'Finalizando enlace personalizado...'}
            </p>

            {/* Progress Bar */}
            <div className="w-64 h-1 bg-beige/80 rounded-full mx-auto overflow-hidden mb-3">
              <div
                className="h-full bg-brown transition-all duration-150 rounded-full"
                style={{ width: `${progress}%` }}
              />
            </div>

            <p className="font-body text-[0.65rem] text-brown/40 tracking-wider">
              {progress}%
            </p>
          </div>
        ) : (
          <div className="animate-fade-up">
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block mb-2">
              ¡Completado!
            </span>

            <h1 className="font-display text-4xl lg:text-5xl text-brown font-light mb-4">
              Tu invitación está lista.
            </h1>

            <p className="font-body text-xs text-brown/60 mb-6 leading-relaxed max-w-xs mx-auto">
              Entrando a tu panel de control...
            </p>

            <button
              onClick={handleManualProceed}
              className="bg-brown text-ivory font-body font-medium text-sm px-10 py-4 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer flex items-center justify-center gap-2 mx-auto"
            >
              <span>Personalizar invitación</span>
              <span className="text-xs">→</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
