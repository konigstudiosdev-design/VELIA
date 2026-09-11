import React from 'react'
import { EventData } from '../types'

interface SummaryViewProps {
  eventData: EventData
  onEditOnboarding: () => void
  onChooseDesign: () => void
}

export default function SummaryView({
  eventData,
  onEditOnboarding,
  onChooseDesign,
}: SummaryViewProps) {
  // Format display date
  const formatDate = (dateStr: string) => {
    if (!dateStr) return '18 septiembre 2027'
    try {
      const parts = dateStr.split('-')
      if (parts.length === 3) {
        const year = parts[0]
        const monthNum = parseInt(parts[1], 10)
        const day = parseInt(parts[2], 10)
        const months = [
          'enero',
          'febrero',
          'marzo',
          'abril',
          'mayo',
          'junio',
          'julio',
          'agosto',
          'septiembre',
          'octubre',
          'noviembre',
          'diciembre',
        ]
        return `${day} ${months[monthNum - 1]} ${year}`
      }
    } catch (e) {
      // fallback
    }
    return dateStr
  }

  // Compute event display title
  const getEventTitle = () => {
    if (eventData.eventType === 'Boda' && eventData.person2Name) {
      return `Boda de ${eventData.person1Name} & ${eventData.person2Name}`
    }
    if (eventData.eventType === 'Aniversario' && eventData.person2Name) {
      return `Aniversario de ${eventData.person1Name} & ${eventData.person2Name}`
    }
    if (eventData.eventType === 'Cumpleaños' && eventData.age) {
      return `Cumpleaños de ${eventData.person1Name} (${eventData.age} años)`
    }
    return `${eventData.eventType} de ${eventData.person1Name}`
  }

  return (
    <div className="min-h-screen pt-28 pb-20 px-6 bg-ivory flex items-center justify-center">
      <div className="w-full max-w-xl text-center">
        <span className="font-body text-[0.65rem] tracking-[0.38em] text-champagne uppercase block mb-3">
          Siguiente paso
        </span>

        <h1 className="font-display text-4xl lg:text-5xl text-brown font-light leading-tight mb-8">
          Tu invitación está a punto de comenzar.
        </h1>

        {/* Resumen Card */}
        <div className="bg-white border border-beige/90 rounded-2xl p-8 lg:p-10 shadow-sm relative text-left mb-8">
          <div className="flex justify-between items-center pb-6 border-b border-beige/60">
            <div>
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-brown/40 uppercase block mb-1">
                Resumen de tu evento
              </span>
              <h2 className="font-display text-2xl lg:text-3xl text-brown font-light">
                {getEventTitle()}
              </h2>
            </div>
            <button
              onClick={onEditOnboarding}
              className="font-body text-xs text-champagne hover:underline cursor-pointer flex-none"
            >
              Editar datos
            </button>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-6 text-center">
            <div className="bg-ivory/50 border border-beige/50 rounded-xl p-4">
              <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/45 uppercase block mb-1">
                Evento
              </span>
              <p className="font-display text-lg text-brown font-light">
                {eventData.eventType}
              </p>
            </div>

            <div className="bg-ivory/50 border border-beige/50 rounded-xl p-4">
              <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/45 uppercase block mb-1">
                Fecha
              </span>
              <p className="font-display text-lg text-brown font-light">
                {formatDate(eventData.date)}
              </p>
            </div>

            <div className="bg-ivory/50 border border-beige/50 rounded-xl p-4">
              <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/45 uppercase block mb-1">
                Estilo
              </span>
              <p className="font-display text-lg text-brown font-light">
                {eventData.style}
              </p>
            </div>
          </div>
        </div>

        {/* Action button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onChooseDesign}
            className="w-full sm:w-auto bg-brown text-ivory font-body font-medium text-sm px-10 py-4 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
          >
            Elegir diseño
          </button>
        </div>
      </div>
    </div>
  )
}
