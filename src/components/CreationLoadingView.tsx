import React, { useEffect, useState } from 'react'

interface CreationLoadingViewProps {
  onCreationComplete: () => void
}

export default function CreationLoadingView({
  onCreationComplete,
}: CreationLoadingViewProps) {
  const [stage, setStage] = useState<'loading' | 'ready'>('loading')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // Animate progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval)
          setStage('ready')
          return 100
        }
        return prev + 5
      })
    }, 110)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen pt-24 pb-20 px-6 bg-ivory flex items-center justify-center">
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
              Ajustando tipografía, paleta de colores y maquetación editorial personalizada.
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

            <p className="font-body text-xs text-brown/60 mb-8 leading-relaxed max-w-xs mx-auto">
              Tu enlace personalizado ha sido generado y tu panel de control ya se encuentra habilitado.
            </p>

            <button
              onClick={onCreationComplete}
              className="bg-brown text-ivory font-body font-medium text-sm px-10 py-4 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Personalizar invitación
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
