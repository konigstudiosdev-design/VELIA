import React, { useState } from 'react'
import { DesignStyle, EventData, EventType } from '../types'

interface OnboardingViewProps {
  initialData: EventData
  onComplete: (data: EventData) => void
}

const EVENT_TYPES: { type: EventType; subtitle: string; img: string; icon: string }[] = [
  {
    type: 'Boda',
    subtitle: 'El día más especial',
    img: 'https://images.unsplash.com/photo-1606490208247-b65be3d94cd1?w=500&h=500&fit=crop&auto=format',
    icon: '💍',
  },
  {
    type: 'XV años',
    subtitle: 'Una noche mágica',
    img: 'https://images.unsplash.com/photo-1763625639768-7282f4f0deb7?w=500&h=500&fit=crop&auto=format',
    icon: '👑',
  },
  {
    type: 'Cumpleaños',
    subtitle: 'Celebra a lo grande',
    img: 'https://images.unsplash.com/photo-1762918988304-97d4a5840a4a?w=500&h=500&fit=crop&auto=format',
    icon: '✨',
  },
  {
    type: 'Baby shower',
    subtitle: 'La bienvenida perfecta',
    img: 'https://images.unsplash.com/photo-1767070806009-152054f6edd5?w=500&h=500&fit=crop&auto=format',
    icon: '🧸',
  },
  {
    type: 'Bautizo',
    subtitle: 'Un momento sagrado',
    img: 'https://images.unsplash.com/photo-1566516171511-1c411a59c8ba?w=500&h=500&fit=crop&auto=format',
    icon: '🕊️',
  },
  {
    type: 'Graduación',
    subtitle: 'El inicio de todo',
    img: 'https://images.unsplash.com/photo-1623461487986-9400110de28e?w=500&h=500&fit=crop&auto=format',
    icon: '🎓',
  },
  {
    type: 'Aniversario',
    subtitle: 'Amor que perdura',
    img: 'https://images.unsplash.com/photo-1672288336066-8cd91b57b510?w=500&h=500&fit=crop&auto=format',
    icon: '🥂',
  },
  {
    type: 'Despedida',
    subtitle: 'Fiesta & viaje con amigos',
    img: 'https://images.unsplash.com/photo-1510812431401-41d2bd2722f3?w=500&h=500&fit=crop&auto=format',
    icon: '🌴',
  },
  {
    type: 'Otro',
    subtitle: 'Celebración personalizada',
    img: 'https://images.unsplash.com/photo-1519671482749-fd09be7ccebf?w=500&h=500&fit=crop&auto=format',
    icon: '🎉',
  },
]

const STYLES_DATA: {
  style: DesignStyle
  desc: string
  colors: string[]
  img: string
}[] = [
  {
    style: 'Editorial',
    desc: 'Sofisticado, vanguardista, composición alta moda.',
    colors: ['#332B27', '#C8A982', '#FAF8F4'],
    img: 'https://images.unsplash.com/photo-1763553113332-800519753e40?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Romántico',
    desc: 'Cálido, etéreo, detalles suaves y poéticos.',
    colors: ['#C9A5A0', '#E9DED2', '#FAF8F4'],
    img: 'https://images.unsplash.com/photo-1524650448000-02d0a2aeb6cb?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Minimalista',
    desc: 'Limpio, moderno, enfocado en lo esencial.',
    colors: ['#1C1B1A', '#E9DED2', '#FFFFFF'],
    img: 'https://images.unsplash.com/photo-1676027649792-9e6b014a0e2f?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Clásico',
    desc: 'Atemporal, refinado, elegancia tradicional.',
    colors: ['#332B27', '#C8A982', '#E9DED2'],
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Moderno',
    desc: 'Audaz, arquitectónico, líneas bien definidas.',
    colors: ['#1C1B1A', '#C8A982', '#E9DED2'],
    img: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Floral',
    desc: 'Orgánico, ilustrado, delicadamente botánico.',
    colors: ['#C9A5A0', '#C8A982', '#FAF8F4'],
    img: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=600&h=800&fit=crop&auto=format',
  },
  {
    style: 'Luxury',
    desc: 'Glamuroso, tonos nocturnos y acentos dorados.',
    colors: ['#1C1B1A', '#C8A982', '#332B27'],
    img: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&auto=format',
  },
]

export default function OnboardingView({ initialData, onComplete }: OnboardingViewProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1)

  // Form states
  const [eventType, setEventType] = useState<EventType>(initialData.eventType || 'Boda')
  const [person1Name, setPerson1Name] = useState(initialData.person1Name || 'Lucía')
  const [person2Name, setPerson2Name] = useState(initialData.person2Name || 'Mateo')
  const [age, setAge] = useState(initialData.age || '30')
  const [yearsToCelebrate, setYearsToCelebrate] = useState(initialData.yearsToCelebrate || '10')
  const [date, setDate] = useState(initialData.date || '2027-09-18')
  const [style, setStyle] = useState<DesignStyle>(initialData.style || 'Editorial')

  const handleNextStep1 = () => {
    setStep(2)
  }

  const handleNextStep2 = (e: React.FormEvent) => {
    e.preventDefault()
    setStep(3)
  }

  const handleFinish = () => {
    // Generate dynamic slug based on names
    let slug = 'evento'
    if (eventType === 'Boda' || eventType === 'Aniversario') {
      slug = `${person1Name.toLowerCase().trim()}-y-${person2Name.toLowerCase().trim()}`
    } else {
      slug = `${person1Name.toLowerCase().trim()}-${eventType.toLowerCase().replace(/\s+/g, '')}`
    }
    slug = slug.replace(/[^a-z0-9-]/g, '') || 'mi-evento'

    const updatedData: EventData = {
      ...initialData,
      eventType,
      person1Name,
      person2Name: eventType === 'Boda' || eventType === 'Aniversario' ? person2Name : undefined,
      age: eventType === 'Cumpleaños' ? age : undefined,
      yearsToCelebrate: eventType === 'Aniversario' ? yearsToCelebrate : undefined,
      date,
      style,
      customSlug: `velia.mx/e/${slug}`,
    }

    onComplete(updatedData)
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-ivory">
      <div className="max-w-4xl mx-auto">
        {/* Progress Bar & Header */}
        <div className="mb-10 text-center">
          <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block mb-2">
            Paso {step} de 3
          </span>

          <div className="w-48 h-1 bg-beige/80 rounded-full mx-auto mb-6 overflow-hidden">
            <div
              className="h-full bg-champagne transition-all duration-500 rounded-full"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {step === 1 && (
            <div>
              <h1 className="font-display text-4xl lg:text-5xl text-brown font-light">
                ¿Qué estás celebrando?
              </h1>
              <p className="font-body text-sm text-brown/55 mt-2">
                Selecciona la ocasión para personalizar los detalles de tu invitación.
              </p>
            </div>
          )}

          {step === 2 && (
            <div>
              <h1 className="font-display text-4xl lg:text-5xl text-brown font-light">
                Cuéntanos un poco más.
              </h1>
              <p className="font-body text-sm text-brown/55 mt-2">
                Ingresa la información básica de tu {eventType.toLowerCase()}.
              </p>
            </div>
          )}

          {step === 3 && (
            <div>
              <h1 className="font-display text-4xl lg:text-5xl text-brown font-light">
                ¿Qué estilo imaginas?
              </h1>
              <p className="font-body text-sm text-brown/55 mt-2">
                Elige la atmósfera y dirección estética que deseas para tu invitación.
              </p>
            </div>
          )}
        </div>

        {/* ── STEP 1: EVENT TYPE ─────────────────────────────────────────────── */}
        {step === 1 && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 lg:gap-5 mb-10">
              {EVENT_TYPES.map(item => {
                const isSelected = eventType === item.type
                return (
                  <button
                    key={item.type}
                    type="button"
                    onClick={() => setEventType(item.type)}
                    className={`group relative overflow-hidden rounded-2xl border text-left p-4 lg:p-5 transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-champagne bg-white ring-2 ring-champagne/40 shadow-md scale-[1.02]'
                        : 'border-beige/80 bg-white/70 hover:border-champagne/60 hover:bg-white'
                    }`}
                  >
                    <div className="relative aspect-video rounded-xl overflow-hidden mb-3 bg-beige/40">
                      <img
                        src={item.img}
                        alt={item.type}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-brown/15" />
                      <span className="absolute top-2 right-2 text-lg bg-white/80 backdrop-blur-sm rounded-full w-7 h-7 flex items-center justify-center">
                        {item.icon}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-display text-xl text-brown font-light leading-snug">
                          {item.type}
                        </h3>
                        <p className="font-body text-[0.68rem] text-brown/50 mt-0.5">
                          {item.subtitle}
                        </p>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-full border flex items-center justify-center transition-colors ${
                          isSelected
                            ? 'bg-brown border-brown text-ivory'
                            : 'border-beige text-transparent'
                        }`}
                      >
                        ✓
                      </div>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleNextStep1}
                className="bg-brown text-ivory font-body font-medium text-sm px-10 py-3.5 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
              >
                Continuar
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 2: DYNAMIC EVENT DETAILS ─────────────────────────────────── */}
        {step === 2 && (
          <div className="max-w-xl mx-auto bg-white border border-beige/80 rounded-2xl p-8 lg:p-10 shadow-sm">
            <form onSubmit={handleNextStep2} className="space-y-5">
              {/* Conditional fields based on eventType */}
              {eventType === 'Boda' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                        Nombre de la persona 1
                      </label>
                      <input
                        type="text"
                        required
                        value={person1Name}
                        onChange={e => setPerson1Name(e.target.value)}
                        placeholder="ej. Lucía"
                        className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                        Nombre de la persona 2
                      </label>
                      <input
                        type="text"
                        required
                        value={person2Name}
                        onChange={e => setPerson2Name(e.target.value)}
                        placeholder="ej. Mateo"
                        className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {eventType === 'Cumpleaños' && (
                <>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                        Nombre del festejado/a
                      </label>
                      <input
                        type="text"
                        required
                        value={person1Name}
                        onChange={e => setPerson1Name(e.target.value)}
                        placeholder="ej. Sofía"
                        className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                        Edad a cumplir
                      </label>
                      <input
                        type="number"
                        required
                        value={age}
                        onChange={e => setAge(e.target.value)}
                        placeholder="ej. 30"
                        className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                      />
                    </div>
                  </div>
                </>
              )}

              {eventType === 'XV años' && (
                <div>
                  <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                    Nombre de la quinceañera
                  </label>
                  <input
                    type="text"
                    required
                    value={person1Name}
                    onChange={e => setPerson1Name(e.target.value)}
                    placeholder="ej. Valeria"
                    className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                  />
                </div>
              )}

              {eventType === 'Aniversario' && (
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                      Nombre persona 1
                    </label>
                    <input
                      type="text"
                      required
                      value={person1Name}
                      onChange={e => setPerson1Name(e.target.value)}
                      placeholder="ej. Carmen"
                      className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                    />
                  </div>
                  <div>
                    <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                      Nombre persona 2
                    </label>
                    <input
                      type="text"
                      required
                      value={person2Name}
                      onChange={e => setPerson2Name(e.target.value)}
                      placeholder="ej. Alejandro"
                      className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                    />
                  </div>
                </div>
              )}

              {['Baby shower', 'Bautizo', 'Graduación', 'Despedida', 'Otro'].includes(eventType) && (
                <div>
                  <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                    {eventType === 'Baby shower'
                      ? 'Nombre del bebé / mamita'
                      : eventType === 'Bautizo'
                      ? 'Nombre del bautizado/a'
                      : eventType === 'Graduación'
                      ? 'Nombre del graduado/a'
                      : 'Nombre del anfitrión / evento'}
                  </label>
                  <input
                    type="text"
                    required
                    value={person1Name}
                    onChange={e => setPerson1Name(e.target.value)}
                    placeholder="ej. Camila"
                    className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                  />
                </div>
              )}

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.15em] text-brown/65 uppercase mb-1.5">
                  Fecha del evento
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white"
                />
              </div>

              {/* Note */}
              <div className="pt-2 text-center">
                <p className="font-body text-xs text-brown/45 italic">
                  * Puedes cambiar estos datos después en cualquier momento.
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-beige/60">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="font-body text-xs text-brown/60 hover:text-brown px-4 py-2"
                >
                  ← Atrás
                </button>
                <button
                  type="submit"
                  className="bg-brown text-ivory font-body font-medium text-sm px-8 py-3 rounded-full hover:bg-ink transition-all duration-300 shadow-sm cursor-pointer"
                >
                  Continuar
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP 3: STYLE PREVIEWS ─────────────────────────────────────────── */}
        {step === 3 && (
          <div>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-10">
              {STYLES_DATA.map(st => {
                const isSelected = style === st.style
                return (
                  <button
                    key={st.style}
                    type="button"
                    onClick={() => setStyle(st.style)}
                    className={`group text-left border rounded-2xl overflow-hidden bg-white transition-all duration-300 cursor-pointer ${
                      isSelected
                        ? 'border-champagne ring-2 ring-champagne/40 shadow-lg scale-[1.02]'
                        : 'border-beige/80 hover:border-champagne/60 hover:shadow-sm'
                    }`}
                  >
                    <div className="relative aspect-[3/4] overflow-hidden bg-beige/40">
                      <img
                        src={st.img}
                        alt={st.style}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-brown/80 via-transparent to-transparent" />
                      <div className="absolute bottom-3 left-3 right-3 text-ivory">
                        <span className="font-display text-2xl font-light block leading-none">
                          {st.style}
                        </span>
                        <div className="flex gap-1.5 mt-2">
                          {st.colors.map((c, i) => (
                            <span
                              key={i}
                              className="w-3.5 h-3.5 rounded-full border border-white/60 shadow-xs"
                              style={{ backgroundColor: c }}
                            />
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="p-3.5 bg-white">
                      <p className="font-body text-[0.7rem] text-brown/65 leading-relaxed">
                        {st.desc}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            <div className="flex items-center justify-between max-w-xl mx-auto pt-4">
              <button
                type="button"
                onClick={() => setStep(2)}
                className="font-body text-xs text-brown/60 hover:text-brown px-4 py-2"
              >
                ← Atrás
              </button>
              <button
                type="button"
                onClick={handleFinish}
                className="bg-brown text-ivory font-body font-medium text-sm px-10 py-3.5 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
              >
                Ver resumen
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
