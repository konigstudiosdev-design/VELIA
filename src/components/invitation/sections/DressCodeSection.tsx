import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function DressCodeSection({ section, theme }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-16 px-6 max-w-2xl mx-auto text-center space-y-4 bg-white border border-beige/80 rounded-3xl my-8">
      <span className="text-3xl text-champagne block">👔</span>
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Código de Vestimenta'}
      </span>
      <h3
        className="font-display text-2xl text-brown font-light"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        {content.code || 'Rigurosa Etiqueta / Formal'}
      </h3>
      <p className="font-body text-xs text-brown/70 max-w-md mx-auto leading-relaxed">
        {content.description || 'Mujeres: Vestido largo elegante · Hombres: Esmoquin o Traje oscuro.'}
      </p>
      {content.colorNote && (
        <p className="font-body text-[0.7rem] text-champagne italic pt-2">
          {content.colorNote}
        </p>
      )}
    </div>
  )
}
