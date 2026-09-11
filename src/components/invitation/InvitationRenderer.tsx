import React from 'react'
import { EventData, InvitationSection, InvitationTheme } from '../../types'
import { normalizeInvitationSections } from '../../utils/normalizeInvitation'
import SectionRenderer from './SectionRenderer'

interface InvitationRendererProps {
  sections?: any[]
  eventData?: EventData
  theme?: InvitationTheme
  mode?: 'editor' | 'preview' | 'public'
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
}

export default function InvitationRenderer({
  sections,
  eventData,
  theme,
  mode = 'public',
  onConfirmRsvp,
}: InvitationRendererProps) {
  const normalizedSections: InvitationSection[] = normalizeInvitationSections(sections, eventData)

  const activeTheme = theme || {
    primaryColor: '#332B27',
    secondaryColor: '#C8A982',
    backgroundColor: '#FAF8F5',
    textColor: '#332B27',
    accentColor: '#C8A982',
    headingFont: 'Cormorant Garamond',
    bodyFont: 'Inter',
    buttonStyle: 'rounded-full' as const,
    borderRadius: '1rem',
    spacing: 'normal' as const,
  }

  return (
    <div
      className="min-h-screen text-brown antialiased transition-colors duration-300"
      style={{
        backgroundColor: activeTheme.backgroundColor,
        color: activeTheme.textColor,
        fontFamily: activeTheme.bodyFont,
      }}
    >
      {normalizedSections.map(sec => (
        <SectionRenderer
          key={sec.id}
          section={sec}
          eventData={eventData}
          theme={activeTheme}
          mode={mode}
          onConfirmRsvp={onConfirmRsvp}
        />
      ))}
    </div>
  )
}
