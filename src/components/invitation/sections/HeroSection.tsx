import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
  mode?: 'editor' | 'preview' | 'public'
}

export default function HeroSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const settings = section.settings || {}

  const names = content.title || (eventData?.person2Name ? `${eventData.person1Name} & ${eventData.person2Name}` : eventData?.person1Name) || 'Lucía & Mateo'
  const subtitle = content.subtitle || 'Nos casamos'
  const dateStr = content.date || eventData?.date || '18 · 09 · 2027'
  const locationStr = content.location || eventData?.location || 'Villa Escondida · CDMX'
  const bgImage = content.imageUrl || 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=1200&h=1600&fit=crop&auto=format'
  const overlayOpacity = settings.overlayOpacity ?? 0.45

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-brown text-ivory text-center px-6 py-20 select-none">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src={bgImage}
          alt={names}
          className="w-full h-full object-cover"
        />
        <div
          className="absolute inset-0 bg-brown"
          style={{ opacity: overlayOpacity }}
        />
      </div>

      {/* Content Card */}
      <div className="relative z-10 max-w-xl mx-auto space-y-6">
        <p className="font-body text-xs sm:text-sm tracking-[0.35em] text-champagne uppercase font-light">
          {subtitle}
        </p>

        <h1
          className="font-display text-4xl sm:text-6xl lg:text-7xl text-white font-light leading-tight tracking-wide"
          style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
        >
          {names}
        </h1>

        <div className="w-16 h-[0.5px] bg-champagne mx-auto" />

        <p className="font-body text-sm sm:text-base text-white/90 tracking-[0.25em] uppercase font-light">
          {dateStr}
        </p>

        <p className="font-body text-xs text-white/70 tracking-[0.2em] uppercase font-light">
          {locationStr}
        </p>

        {content.tagline && (
          <p className="font-body text-xs text-white/60 italic pt-2">
            "{content.tagline}"
          </p>
        )}
      </div>
    </div>
  )
}
