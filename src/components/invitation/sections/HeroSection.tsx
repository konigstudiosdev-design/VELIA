import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
  mode?: 'editor' | 'preview' | 'public'
}

export default function HeroSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const settings = section.settings || {}

  const config = getEventTypeConfig(eventData?.eventType)
  const isCouple = config.allowedFields.person2Name
  const names = content.title || (isCouple && eventData?.person2Name ? `${eventData.person1Name} & ${eventData.person2Name}` : eventData?.person1Name) || `Mi ${config.displayName}`
  const subtitle = content.subtitle || config.fieldLabels.heroSubtitle
  const dateStr = content.date || eventData?.date || ''
  const locationStr = content.location || eventData?.location || config.defaultSectionContents.hero.locationDefault
  const bgImage = content.imageUrl || 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=1200&h=1600&fit=crop&auto=format'
  const overlayOpacity = settings.overlayOpacity ?? 0.45

  return (
    <div className="relative min-h-[80vh] sm:min-h-[85vh] flex items-center justify-center overflow-hidden bg-brown text-ivory text-center px-4 sm:px-6 py-16 sm:py-24 select-none">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={names}
          onError={(e) => {
            e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=1200&h=1600&fit=crop&auto=format'
          }}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-brown"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content Card */}
      <div className="relative z-10 w-full max-w-xl mx-auto space-y-4 sm:space-y-6">
        <p className="font-body text-[0.7rem] sm:text-sm tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase font-light leading-relaxed">
          {subtitle}
        </p>

        <h1
          className="font-display text-2xl sm:text-5xl lg:text-7xl text-white font-light leading-snug tracking-wide max-w-full px-2"
          style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond', wordBreak: 'normal', overflowWrap: 'break-word' }}
        >
          {names}
        </h1>

        <div className="w-12 sm:w-16 h-[0.5px] bg-champagne mx-auto" />

        {dateStr && (
          <p className="font-body text-xs sm:text-base text-white/90 tracking-[0.2em] sm:tracking-[0.25em] uppercase font-light">
            {dateStr}
          </p>
        )}

        {locationStr && (
          <p className="font-body text-[0.7rem] sm:text-xs text-white/70 tracking-[0.15em] sm:tracking-[0.2em] uppercase font-light">
            {locationStr}
          </p>
        )}

        {content.tagline && (
          <p className="font-body text-xs text-white/70 italic pt-1 max-w-md mx-auto leading-relaxed">
            "{content.tagline}"
          </p>
        )}
      </div>
    </div>
  )
}
