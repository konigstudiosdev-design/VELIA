import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function LocationSection({ section, theme }: SectionProps) {
  const content = section.content || {}
  const address = content.address || 'Hacienda Villa Escondida · Carretera Libre a Toluca Km 24'
  const mapUrl = content.mapUrl || `https://maps.google.com/?q=${encodeURIComponent(address)}`

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-3xl mx-auto text-center space-y-4 sm:space-y-6">
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Ubicación'}
      </span>

      <h3
        className="font-display text-xl sm:text-2xl text-brown font-light"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        ¿Cómo llegar?
      </h3>

      <p className="font-body text-xs sm:text-sm text-brown/70 max-w-md mx-auto leading-relaxed">
        {address}
      </p>

      <a
        href={mapUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center justify-center gap-2 font-body text-xs font-medium border border-brown text-brown px-6 sm:px-8 py-3 rounded-full hover:bg-brown hover:text-ivory transition-colors mt-2"
      >
        <span>Abrir en Google Maps</span> 🗺️
      </a>
    </div>
  )
}
