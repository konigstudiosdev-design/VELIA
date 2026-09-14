import React, { useState, useEffect } from 'react'

interface HowItWorksModalProps {
  onClose: () => void
  onStartCreate: () => void
}

export default function HowItWorksModal({ onClose, onStartCreate }: HowItWorksModalProps) {
  const [activeStep, setActiveStep] = useState(0)

  // Listen for Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  const steps = [
    {
      num: '01',
      badge: 'Paso 1',
      icon: '🎨',
      title: 'Elige tu plantilla & estilo',
      subtitle: 'Diseños creados por expertos editoriales',
      description: 'Selecciona la plantilla que mejor exprese la esencia de tu evento. Elige entre estilos Editoriales, Románticos, Minimalistas o de Lujo con tipografías y paletas de color cuidadosamente armonizadas.',
      highlights: [
        'Plantillas adaptadas para Bodas, XV años, Cumpleaños y Bautizos',
        'Cambia paletas de color y tipografías en un solo clic',
        'Visualización fluida en iPhone, Android y escritorio',
      ],
      mockup: (
        <div className="bg-ivory border border-beige rounded-2xl p-5 space-y-4 shadow-sm">
          <div className="flex justify-between items-center pb-2 border-b border-beige">
            <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase font-medium">
              Catálogo de Plantillas
            </span>
            <span className="font-body text-[0.6rem] text-brown/40">3 de 7 estilos</span>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            <div className="bg-white p-3 rounded-xl border border-champagne/40 text-center space-y-1.5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-champagne/20 text-brown font-display text-sm flex items-center justify-center mx-auto">
                M
              </div>
              <span className="font-display text-xs text-brown font-light block leading-none">Maison</span>
              <span className="font-body text-[0.55rem] text-champagne uppercase block">Editorial</span>
            </div>

            <div className="bg-white/60 p-3 rounded-xl border border-beige text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-rose/20 text-brown font-display text-sm flex items-center justify-center mx-auto">
                É
              </div>
              <span className="font-display text-xs text-brown/70 font-light block leading-none">Élan</span>
              <span className="font-body text-[0.55rem] text-brown/40 uppercase block">Minimal</span>
            </div>

            <div className="bg-white/60 p-3 rounded-xl border border-beige text-center space-y-1.5">
              <div className="w-8 h-8 rounded-full bg-beige text-brown font-display text-sm flex items-center justify-center mx-auto">
                A
              </div>
              <span className="font-display text-xs text-brown/70 font-light block leading-none">Amour</span>
              <span className="font-body text-[0.55rem] text-brown/40 uppercase block">Romántico</span>
            </div>
          </div>

          <div className="p-3 bg-white rounded-xl border border-beige/60 flex items-center justify-between text-xs font-body">
            <span className="text-brown/60">Paleta Activa:</span>
            <div className="flex gap-1.5">
              <span className="w-4 h-4 rounded-full bg-brown border border-white shadow-xs" />
              <span className="w-4 h-4 rounded-full bg-champagne border border-white shadow-xs" />
              <span className="w-4 h-4 rounded-full bg-ivory border border-beige shadow-xs" />
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '02',
      badge: 'Paso 2',
      icon: '✏️',
      title: 'Personaliza secciones en vivo',
      subtitle: 'Editor WYSIWYG simple e interactivo',
      description: 'Edita textos, sube tus fotografías, configura la cuenta regresiva, mapas de ubicación y horarios. Reordena u oculta secciones con total libertad sin complicaciones técnicas.',
      highlights: [
        'Editor visual con vista previa instantánea',
        'Arrastra y reordena secciones fácilmente',
        'Guardado automático continuo en la nube',
      ],
      mockup: (
        <div className="bg-white border border-beige rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-beige/60">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-body text-xs text-brown font-medium">Editor VÉLIA</span>
            </div>
            <span className="font-body text-[0.58rem] bg-ivory px-2 py-0.5 rounded border border-beige text-brown/50">
              Autoguardado ✓
            </span>
          </div>

          <div className="space-y-1.5">
            {[
              { name: 'Portada & Nombres', status: 'Activo', icon: '🖼️' },
              { name: 'Fecha & Ubicación (Maps)', status: 'Activo', icon: '📍' },
              { name: 'Mesa de Regalos & CLABE', status: 'Activo', icon: '🎁' },
              { name: 'Galería de Fotos', status: 'Activo', icon: '📸' },
            ].map((sec, idx) => (
              <div
                key={idx}
                className="p-2.5 bg-ivory/60 rounded-xl border border-beige/60 flex items-center justify-between text-xs font-body"
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm">{sec.icon}</span>
                  <span className="text-brown font-medium">{sec.name}</span>
                </div>
                <span className="text-[0.62rem] text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                  {sec.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      num: '03',
      badge: 'Paso 3',
      icon: '👥',
      title: 'Gestiona invitados & mesas',
      subtitle: 'Pases individuales con tokens seguros',
      description: 'Genera pases personalizados para cada invitado o familia. Asigna número de pases, mesas de recepción y consulta confirmaciones RSVP y restricciones dietéticas en tiempo real.',
      highlights: [
        'Confirmaciones RSVP y pases por invitado',
        'Organizador de mesas y lugares en vivo',
        'Estadísticas de asistencia en el Dashboard',
      ],
      mockup: (
        <div className="bg-ivory border border-beige rounded-2xl p-4 shadow-sm space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-beige/60">
            <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase">
              Lista de Asistencia
            </span>
            <span className="font-body text-xs font-semibold text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
              69% Confirmados
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-2.5 bg-white rounded-xl border border-beige/80 flex items-center justify-between text-xs font-body">
              <div>
                <span className="font-medium text-brown block">Familia Gómez</span>
                <span className="text-[0.6rem] text-brown/40">Mesa 2 · 4 pases</span>
              </div>
              <span className="text-[0.62rem] bg-emerald-50 text-emerald-800 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">
                Confirmado ✓
              </span>
            </div>

            <div className="p-2.5 bg-white rounded-xl border border-beige/80 flex items-center justify-between text-xs font-body">
              <div>
                <span className="font-medium text-brown block">Carlos &amp; Elena</span>
                <span className="text-[0.6rem] text-brown/40">Mesa 1 · 2 pases</span>
              </div>
              <span className="text-[0.62rem] bg-amber-50 text-amber-800 border border-amber-200 px-2 py-0.5 rounded-full font-semibold">
                Pendiente ⏳
              </span>
            </div>
          </div>
        </div>
      ),
    },
    {
      num: '04',
      badge: 'Paso 4',
      icon: '💬',
      title: 'Comparte por WhatsApp & publica',
      subtitle: 'Un enlace inolvidable en segundos',
      description: 'Envía las invitaciones con un clic directamente por WhatsApp. Cada invitado recibe un mensaje personalizado y accede a su invitación sin descargar aplicaciones adicionales.',
      highlights: [
        'Enlace personalizable velia.mx/e/tu-evento',
        'Mensajes preconfigurados para WhatsApp',
        'Acceso PWA instantáneo para cualquier teléfono',
      ],
      mockup: (
        <div className="bg-emerald-950 text-white rounded-2xl p-4 shadow-md space-y-2.5 font-body">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10 text-xs">
            <span className="text-base">💬</span>
            <span className="font-medium text-emerald-300">Mensaje de WhatsApp</span>
          </div>

          <div className="bg-emerald-900/60 p-3 rounded-xl border border-emerald-700/40 text-xs text-white/90 leading-relaxed">
            <p className="mb-1 font-medium text-emerald-200">¡Hola María!</p>
            <p className="text-[0.72rem] text-white/80">
              Queremos compartir contigo nuestra invitación especial. Puedes ver todos los detalles y confirmar tu asistencia aquí:
            </p>
            <span className="inline-block mt-1 text-champagne text-[0.7rem] underline font-mono">
              velia.mx/e/lucia-y-mateo?token=g_9a82f
            </span>
          </div>
        </div>
      ),
    },
  ]

  const currentStepData = steps[activeStep]

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-ink/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none"
    >
      <div
        onClick={e => e.stopPropagation()}
        className="bg-white rounded-3xl max-w-3xl w-full p-6 sm:p-10 shadow-2xl border border-beige relative my-6 animate-fade-up space-y-6"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown hover:bg-beige/40 transition-colors cursor-pointer"
          aria-label="Cerrar modal"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1.5 max-w-lg mx-auto">
          <span className="font-body text-[0.62rem] tracking-[0.3em] text-champagne uppercase font-medium">
            Guía Visual de Creación
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brown font-light leading-tight">
            ¿Cómo funciona VÉLIA?
          </h2>
          <p className="font-body text-xs text-brown/55">
            Crea una invitación digital inolvidable en 4 sencillos pasos.
          </p>
        </div>

        {/* Step Navigation Bar */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-2 p-1.5 bg-ivory rounded-2xl border border-beige/80">
          {steps.map((s, idx) => (
            <button
              key={s.num}
              onClick={() => setActiveStep(idx)}
              className={`py-2.5 px-2 rounded-xl text-xs font-body transition-all cursor-pointer flex flex-col sm:flex-row items-center justify-center gap-1.5 ${
                activeStep === idx
                  ? 'bg-brown text-ivory font-medium shadow-xs'
                  : 'text-brown/50 hover:text-brown hover:bg-white/60'
              }`}
            >
              <span className="text-sm">{s.icon}</span>
              <span className="hidden sm:inline font-display">{s.badge}</span>
              <span className="sm:hidden font-mono text-[0.65rem]">{s.num}</span>
            </button>
          ))}
        </div>

        {/* Step Body Grid */}
        <div className="grid md:grid-cols-2 gap-6 items-center pt-2">
          {/* Text Column */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-champagne font-bold bg-champagne/15 px-2.5 py-1 rounded-full border border-champagne/30">
                {currentStepData.num} / 04
              </span>
              <span className="font-body text-[0.65rem] text-brown/50 uppercase tracking-wider">
                {currentStepData.subtitle}
              </span>
            </div>

            <h3 className="font-display text-2xl sm:text-3xl text-brown font-light leading-snug">
              {currentStepData.title}
            </h3>

            <p className="font-body text-xs text-brown/65 leading-relaxed">
              {currentStepData.description}
            </p>

            <ul className="space-y-2 pt-1">
              {currentStepData.highlights.map((h, i) => (
                <li key={i} className="flex items-start gap-2 text-xs font-body text-brown/80">
                  <span className="text-champagne font-bold flex-none">✓</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Visual Mockup Column */}
          <div>{currentStepData.mockup}</div>
        </div>

        {/* Footer Controls & CTA */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-beige/60">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveStep(prev => Math.max(0, prev - 1))}
              disabled={activeStep === 0}
              className="font-body text-xs px-4 py-2 rounded-full border border-beige text-brown hover:bg-ivory disabled:opacity-30 cursor-pointer"
            >
              ← Anterior
            </button>

            <button
              onClick={() => setActiveStep(prev => Math.min(steps.length - 1, prev + 1))}
              disabled={activeStep === steps.length - 1}
              className="font-body text-xs px-4 py-2 rounded-full border border-beige text-brown hover:bg-ivory disabled:opacity-30 cursor-pointer"
            >
              Siguiente →
            </button>
          </div>

          <button
            onClick={() => {
              onClose()
              onStartCreate()
            }}
            className="w-full sm:w-auto bg-brown text-ivory font-body font-medium text-xs px-7 py-3 rounded-full hover:bg-ink transition-all cursor-pointer shadow-xs hover:scale-[1.02]"
          >
            Comenzar a crear mi invitación
          </button>
        </div>
      </div>
    </div>
  )
}
