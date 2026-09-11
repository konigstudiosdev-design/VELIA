import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function MessageSection({ section, theme }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto text-center space-y-6">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Nuestra Historia'}
      </span>

      <div className="w-8 h-[0.5px] bg-champagne mx-auto" />

      <p
        className="font-display text-xl sm:text-2xl text-brown/90 font-light leading-relaxed italic"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        "{content.text || 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables.'}"
      </p>
    </div>
  )
}
