import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function DateLocationSection({ section, theme }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-20 px-6 max-w-4xl mx-auto text-center space-y-12">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Cuándo & Dónde'}
      </span>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Ceremony */}
        <div className="bg-white border border-beige/80 rounded-2xl p-8 shadow-xs space-y-3">
          <span className="text-2xl text-champagne block">⛪</span>
          <h3
            className="font-display text-2xl text-brown font-light"
            style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
          >
            {content.ceremonyTitle || 'Ceremonia'}
          </h3>
          <p className="font-body text-xs tracking-widest text-champagne font-medium uppercase">
            {content.ceremonyTime || '16:00 HRS'}
          </p>
          <p className="font-body text-sm font-medium text-brown">
            {content.ceremonyPlace || 'Parroquia de San José'}
          </p>
          <p className="font-body text-xs text-brown/60">
            {content.ceremonyAddress || 'Av. Revolución 120, CDMX'}
          </p>
        </div>

        {/* Reception */}
        <div className="bg-white border border-beige/80 rounded-2xl p-8 shadow-xs space-y-3">
          <span className="text-2xl text-champagne block">🥂</span>
          <h3
            className="font-display text-2xl text-brown font-light"
            style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
          >
            {content.receptionTitle || 'Recepción'}
          </h3>
          <p className="font-body text-xs tracking-widest text-champagne font-medium uppercase">
            {content.receptionTime || '18:30 HRS'}
          </p>
          <p className="font-body text-sm font-medium text-brown">
            {content.receptionPlace || 'Hacienda Villa Escondida'}
          </p>
          <p className="font-body text-xs text-brown/60">
            {content.receptionAddress || 'Carretera Libre a Toluca Km 24'}
          </p>
        </div>
      </div>
    </div>
  )
}
