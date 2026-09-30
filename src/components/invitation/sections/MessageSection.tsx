import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
}

export default function MessageSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const config = getEventTypeConfig(eventData?.eventType)

  const title = content.title || config.fieldLabels.messageTitle
  const text = content.text || config.fieldLabels.messageDefaultText

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto text-center space-y-6">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {title}
      </span>

      <div className="w-8 h-[0.5px] bg-champagne mx-auto" />

      <p
        className="font-display text-xl sm:text-2xl text-brown/90 font-light leading-relaxed italic"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        "{text}"
      </p>
    </div>
  )
}
