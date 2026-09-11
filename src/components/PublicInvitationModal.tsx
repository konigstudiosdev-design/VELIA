import React from 'react'
import { EventData, GuestItem, SectionConfig, Template } from '../types'
import PublicInvitationExperience from './PublicInvitationExperience'

interface PublicInvitationModalProps {
  eventData: EventData
  template: Template
  sections?: SectionConfig[]
  guests?: GuestItem[]
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
  onAddActivity?: (text: string, icon: string) => void
  onClose: () => void
}

export default function PublicInvitationModal({
  eventData,
  template,
  sections,
  guests,
  onConfirmRsvp,
  onAddActivity,
  onClose,
}: PublicInvitationModalProps) {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-ivory">
      <PublicInvitationExperience
        eventData={eventData}
        template={template}
        sections={sections}
        guests={guests}
        onConfirmRsvp={onConfirmRsvp}
        onAddActivity={onAddActivity}
        onClose={onClose}
      />
    </div>
  )
}
