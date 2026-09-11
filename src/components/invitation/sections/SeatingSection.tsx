import React from 'react'
import { InvitationSection } from '../../../types'

interface SectionProps {
  section: InvitationSection
}

export default function SeatingSection({ section }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-16 px-6 max-w-md mx-auto text-center space-y-4 bg-white border border-beige rounded-2xl">
      <span className="text-2xl block">🍽️</span>
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Mesa / Asiento'}
      </span>
      <p className="font-body text-xs text-brown/70">
        Tu número de mesa estará disponible aquí días antes del evento.
      </p>
    </div>
  )
}
