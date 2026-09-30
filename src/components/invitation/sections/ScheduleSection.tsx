import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
}

export default function ScheduleSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const config = getEventTypeConfig(eventData?.eventType)

  const title = content.title || config.defaultSectionContents.schedule.title
  const items: any[] = content.items || config.defaultSectionContents.schedule.items

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-2xl mx-auto text-center space-y-8 sm:space-y-10">
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {title}
      </span>

      <div className="space-y-4 sm:space-y-6 relative before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[0.5px] before:bg-beige/80">
        {items.map((item, idx) => (
          <div key={idx} className="relative z-10 bg-ivory border border-beige/80 rounded-xl p-4 sm:p-5 shadow-xs max-w-md mx-auto">
            <span className="font-body text-xs font-semibold tracking-widest text-champagne uppercase block mb-1">
              {item.time}
            </span>
            <h4
              className="font-display text-base sm:text-lg text-brown font-light"
              style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
            >
              {item.title}
            </h4>
            {item.desc && <p className="font-body text-xs text-brown/60 mt-0.5 leading-relaxed">{item.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
