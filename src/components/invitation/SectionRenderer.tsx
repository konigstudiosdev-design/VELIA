import React from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../types'

import HeroSection from './sections/HeroSection'
import MessageSection from './sections/MessageSection'
import CountdownSection from './sections/CountdownSection'
import DateLocationSection from './sections/DateLocationSection'
import ScheduleSection from './sections/ScheduleSection'
import DressCodeSection from './sections/DressCodeSection'
import GallerySection from './sections/GallerySection'
import RsvpSection from './sections/RsvpSection'
import GiftsSection from './sections/GiftsSection'
import LodgingSection from './sections/LodgingSection'
import PlaylistSection from './sections/PlaylistSection'
import LocationSection from './sections/LocationSection'
import GuestbookSection from './sections/GuestbookSection'
import EventPhotosSection from './sections/EventPhotosSection'
import SeatingSection from './sections/SeatingSection'

interface SectionRendererProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
  mode?: 'editor' | 'preview' | 'public'
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
}

export default function SectionRenderer({
  section,
  eventData,
  theme,
  mode = 'public',
  onConfirmRsvp,
}: SectionRendererProps) {
  // Omit section if disabled
  if (!section.enabled) {
    return null
  }

  switch (section.type) {
    case 'hero':
      return <HeroSection section={section} eventData={eventData} theme={theme} mode={mode} />
    case 'message':
      return <MessageSection section={section} eventData={eventData} theme={theme} />
    case 'countdown':
      return <CountdownSection section={section} eventData={eventData} />
    case 'dateLocation':
      return <DateLocationSection section={section} eventData={eventData} theme={theme} />
    case 'schedule':
      return <ScheduleSection section={section} eventData={eventData} theme={theme} />
    case 'dressCode':
      return <DressCodeSection section={section} eventData={eventData} theme={theme} />
    case 'gallery':
      return <GallerySection section={section} />
    case 'rsvp':
      return <RsvpSection section={section} theme={theme} onConfirmRsvp={onConfirmRsvp} />
    case 'gifts':
      return <GiftsSection section={section} eventData={eventData} theme={theme} />
    case 'lodging':
      return <LodgingSection section={section} theme={theme} />
    case 'playlist':
      return <PlaylistSection section={section} theme={theme} />
    case 'location':
      return <LocationSection section={section} theme={theme} />
    case 'guestbook':
      return <GuestbookSection section={section} eventData={eventData} theme={theme} />
    case 'eventPhotos':
      return <EventPhotosSection section={section} />
    case 'seating':
      return <SeatingSection section={section} />
    default:
      if (mode === 'editor') {
        return (
          <div className="p-4 bg-rose/10 border border-rose/30 text-brown text-xs text-center">
            Sección de tipo "{section.type}" no reconocida.
          </div>
        )
      }
      return null
  }
}
