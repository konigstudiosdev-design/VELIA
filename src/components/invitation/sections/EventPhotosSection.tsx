import React from 'react'
import { InvitationSection } from '../../../types'

interface SectionProps {
  section: InvitationSection
}

export default function EventPhotosSection({ section }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto text-center space-y-6">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Fotos del Evento'}
      </span>
      <p className="font-body text-xs text-brown/60">
        Las fotografías de la boda estarán disponibles en este apartado después de la celebración.
      </p>
    </div>
  )
}
