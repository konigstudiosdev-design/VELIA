import React from 'react'
import { EventData, InvitationSection, InvitationTheme } from '../../types'
import { normalizeInvitationSections } from '../../utils/normalizeInvitation'
import SectionRenderer from './SectionRenderer'

interface InvitationRendererProps {
  sections?: any[]
  eventData?: EventData
  theme?: InvitationTheme
  mode?: 'editor' | 'preview' | 'public'
  selectedSectionId?: string
  onSelectSectionId?: (id: string) => void
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
}

export default function InvitationRenderer({
  sections,
  eventData,
  theme,
  mode = 'public',
  selectedSectionId,
  onSelectSectionId,
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
      {normalizedSections.map(sec => {
        const isSelected = mode === 'editor' && selectedSectionId === sec.id
        return (
          <div
            key={sec.id}
            onClick={() => {
              if (mode === 'editor' && onSelectSectionId) {
                onSelectSectionId(sec.id)
              }
            }}
            className={`relative transition-all ${
              mode === 'editor'
                ? `cursor-pointer ${
                    isSelected
                      ? 'ring-2 ring-champagne bg-champagne/5 relative z-10 shadow-xs'
                      : 'hover:ring-1 hover:ring-beige/80'
                  }`
                : ''
            }`}
          >
            {mode === 'editor' && isSelected && (
              <div className="absolute top-2 right-2 z-30 bg-champagne text-brown font-body text-[0.58rem] tracking-wider uppercase px-2.5 py-0.5 rounded shadow-xs font-medium">
                {sec.type || 'Sección'}
              </div>
            )}

            <SectionRenderer
              section={sec}
              eventData={eventData}
              theme={activeTheme}
              mode={mode}
              onConfirmRsvp={onConfirmRsvp}
            />
          </div>
        )
      })}
    </div>
  )
}
