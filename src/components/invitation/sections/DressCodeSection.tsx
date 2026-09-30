import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
}

export default function DressCodeSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const config = getEventTypeConfig(eventData?.eventType)

  const title = content.title || config.fieldLabels.dressCodeTitle
  const code = content.code || config.fieldLabels.dressCodeDefault
  const description = content.description || config.defaultSectionContents.dressCode.description
  const colorNote = content.colorNote !== undefined ? content.colorNote : (config.fieldLabels.dressCodeNote || '')

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 max-w-2xl mx-auto text-center space-y-3 sm:space-y-4 bg-white border border-beige/80 rounded-2xl sm:rounded-3xl my-6 sm:my-8 shadow-xs">
      <span className="text-2xl sm:text-3xl text-champagne block">👔</span>
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {title}
      </span>
      <h3
        className="font-display text-xl sm:text-2xl text-brown font-light"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        {code}
      </h3>
      {description && (
        <p className="font-body text-xs text-brown/70 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {colorNote && (
        <p className="font-body text-[0.7rem] text-champagne italic pt-1 sm:pt-2 leading-relaxed">
          {colorNote}
        </p>
      )}
    </div>
  )
}
