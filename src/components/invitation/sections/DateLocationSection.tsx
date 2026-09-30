import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
}

export default function DateLocationSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const config = getEventTypeConfig(eventData?.eventType)

  const ceremonyTitle = content.ceremonyTitle || config.fieldLabels.ceremonyTitle
  const receptionTitle = content.receptionTitle || config.fieldLabels.receptionTitle

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-4xl mx-auto text-center space-y-8 sm:space-y-12">
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Cuándo & Dónde'}
      </span>

      <div className="grid md:grid-cols-2 gap-5 sm:gap-8">
        {/* Ceremony */}
        <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <span className="text-2xl text-champagne block">⛪</span>
          <h3
            className="font-display text-xl sm:text-2xl text-brown font-light"
            style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
          >
            {ceremonyTitle}
          </h3>
          <p className="font-body text-xs tracking-widest text-champagne font-medium uppercase">
            {content.ceremonyTime || '16:00 HRS'}
          </p>
          <p className="font-body text-sm font-medium text-brown">
            {content.ceremonyPlace || config.defaultSectionContents.dateLocation.ceremonyPlace}
          </p>
          <p className="font-body text-xs text-brown/60 leading-relaxed">
            {content.ceremonyAddress || 'Av. Principal 120, CDMX'}
          </p>
        </div>

        {/* Reception */}
        <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-xs space-y-3">
          <span className="text-2xl text-champagne block">🥂</span>
          <h3
            className="font-display text-xl sm:text-2xl text-brown font-light"
            style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
          >
            {receptionTitle}
          </h3>
          <p className="font-body text-xs tracking-widest text-champagne font-medium uppercase">
            {content.receptionTime || '18:30 HRS'}
          </p>
          <p className="font-body text-sm font-medium text-brown">
            {content.receptionPlace || config.defaultSectionContents.dateLocation.receptionPlace}
          </p>
          <p className="font-body text-xs text-brown/60 leading-relaxed">
            {content.receptionAddress || 'Carretera Principal Km 24'}
          </p>
        </div>
      </div>
    </div>
  )
}
