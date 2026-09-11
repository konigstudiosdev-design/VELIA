import React, { useState, useEffect, useRef } from 'react'
import {
  ActivityItem,
  DashboardTab,
  EventData,
  GuestItem,
  SectionConfig,
  TableGroup,
  GiftItem,
  GalleryPhoto,
  Template,
} from '../types'
import { INITIAL_ACTIVITIES, INITIAL_GUESTS, INITIAL_SECTIONS } from '../data/mockData'
import {
  subscribeGuests,
  subscribeActivities,
  subscribeTables,
  subscribeGifts,
  subscribeGalleryPhotos,
  saveInvitationSections,
  saveGuest as saveGuestToFirestore,
  deleteGuest as deleteGuestFromFirestore,
  updateRsvpStatus,
} from '../services/eventService'

import Sidebar from './dashboard/Sidebar'
import MobileNav from './dashboard/MobileNav'
import HomeTab from './dashboard/HomeTab'
import EditorTab from './dashboard/EditorTab'
import GuestsTab from './dashboard/GuestsTab'
import RsvpTab from './dashboard/RsvpTab'
import TablesTab from './dashboard/TablesTab'
import GiftsTab from './dashboard/GiftsTab'
import GalleryTab from './dashboard/GalleryTab'
import AnalyticsTab from './dashboard/AnalyticsTab'
import SettingsTab from './dashboard/SettingsTab'
import HelpTab from './dashboard/HelpTab'
import PublicInvitationModal from './PublicInvitationModal'
import PublishModal from './dashboard/PublishModal'

interface DashboardViewProps {
  eventData: EventData
  template: Template
  onUpdateEventData: (data: EventData) => void
  onSaveGuest?: (guest: GuestItem) => void
  onDeleteGuest?: (guestId: string) => void
  onChangeTemplate: () => void
  onEditOnboarding: () => void
  onGoToLanding: () => void
}

export default function DashboardView({
  eventData,
  template,
  onUpdateEventData,
  onSaveGuest,
  onDeleteGuest,
  onChangeTemplate,
  onEditOnboarding,
  onGoToLanding,
}: DashboardViewProps) {
  const [currentTab, setCurrentTab] = useState<DashboardTab>('inicio')
  const [sections, setSections] = useState<SectionConfig[]>(INITIAL_SECTIONS)
  const [guests, setGuests] = useState<GuestItem[]>(INITIAL_GUESTS)
  const [tables, setTables] = useState<TableGroup[]>([])
  const [gifts, setGifts] = useState<GiftItem[]>([])
  const [photos, setPhotos] = useState<GalleryPhoto[]>([])
  const [activities, setActivities] = useState<ActivityItem[]>(INITIAL_ACTIVITIES)

  // Modals
  const [showPublicModal, setShowPublicModal] = useState(false)
  const [showPublishModal, setShowPublishModal] = useState(false)

  // Autosave Ref
  const autosaveTimerRef = useRef<NodeJS.Timeout | null>(null)

  const invitationId = eventData.invitationId

  // Subscribe to real-time Firestore guests, tables, gifts, photos, and activities
  useEffect(() => {
    if (!invitationId) return

    const unsubGuests = subscribeGuests(invitationId, (updatedGuests) => {
      if (updatedGuests.length > 0) {
        setGuests(updatedGuests)
      }
    })

    const unsubTables = subscribeTables(invitationId, (updatedTables) => {
      setTables(updatedTables)
    })

    const unsubGifts = subscribeGifts(invitationId, (updatedGifts) => {
      setGifts(updatedGifts)
    })

    const unsubPhotos = subscribeGalleryPhotos(invitationId, (updatedPhotos) => {
      setPhotos(updatedPhotos)
    })

    const unsubActivities = subscribeActivities(invitationId, (updatedActivities) => {
      if (updatedActivities.length > 0) {
        setActivities(updatedActivities)
      }
    })

    return () => {
      unsubGuests()
      unsubTables()
      unsubGifts()
      unsubPhotos()
      unsubActivities()
    }
  }, [invitationId])

  // Autosave sections to Firestore when modified
  const handleUpdateSections = (newSections: SectionConfig[]) => {
    setSections(newSections)
    if (!invitationId) return

    if (autosaveTimerRef.current) {
      clearTimeout(autosaveTimerRef.current)
    }

    autosaveTimerRef.current = setTimeout(async () => {
      try {
        await saveInvitationSections(invitationId, newSections)
      } catch (err) {
        console.error('Error al guardar secciones en Firestore:', err)
      }
    }, 1000)
  }

  // Update Guests in Firestore
  const handleSaveSingleGuest = async (guest: GuestItem) => {
    if (invitationId) {
      try {
        await saveGuestToFirestore(invitationId, guest)
      } catch (err) {
        console.error('Error al guardar invitado:', err)
      }
    } else if (onSaveGuest) {
      onSaveGuest(guest)
    }
  }

  const handleDeleteSingleGuest = async (guestId: string) => {
    if (invitationId) {
      try {
        await deleteGuestFromFirestore(invitationId, guestId)
      } catch (err) {
        console.error('Error al eliminar invitado:', err)
      }
    } else if (onDeleteGuest) {
      onDeleteGuest(guestId)
    }
  }

  const handleUpdateGuestsArray = (updatedGuests: GuestItem[]) => {
    setGuests(updatedGuests)
    if (!invitationId) return

    updatedGuests.forEach(async (g) => {
      try {
        await saveGuestToFirestore(invitationId, g)
      } catch (err) {
        console.error('Error al guardar invitado:', err)
      }
    })
  }

  // Real-time RSVP confirm handler
  const handleConfirmRsvp = async (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => {
    setGuests(prevGuests =>
      prevGuests.map(g => {
        if (g.id === guestId) {
          return {
            ...g,
            rsvp: status,
            dietaryNotes: dietary || g.dietaryNotes,
          }
        }
        return g
      })
    )

    if (invitationId) {
      try {
        await updateRsvpStatus(invitationId, guestId, status, undefined, dietary)
      } catch (err) {
        console.error('Error al actualizar RSVP en Firestore:', err)
      }
    }
  }

  // Real-time activity log handler
  const handleAddActivity = (text: string, icon: string) => {
    const newAct: ActivityItem = {
      id: `act-${Date.now()}`,
      text,
      time: 'Justo ahora',
      icon,
      type: 'confirm',
    }
    setActivities(prev => [newAct, ...prev])
  }

  return (
    <div className="min-h-screen bg-ivory flex flex-col lg:flex-row">
      {/* Desktop Sidebar */}
      <Sidebar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        eventData={eventData}
        onGoToLanding={onGoToLanding}
      />

      {/* Mobile Header & Bottom Navigation */}
      <MobileNav
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        eventData={eventData}
        onGoToLanding={onGoToLanding}
      />

      {/* Main Workspace Area */}
      <main className="flex-1 lg:ml-0 pt-20 lg:pt-0 pb-20 lg:pb-0 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-10">
          {currentTab === 'inicio' && (
            <HomeTab
              eventData={eventData}
              guests={guests}
              activities={activities}
              onSelectTab={setCurrentTab}
              onOpenPublicView={() => setShowPublicModal(true)}
              onOpenPublishModal={() => setShowPublishModal(true)}
            />
          )}

          {currentTab === 'editor' && (
            <EditorTab
              eventData={eventData}
              sections={sections}
              onUpdateSections={handleUpdateSections}
              onOpenPublicView={() => setShowPublicModal(true)}
              onOpenPublishModal={() => setShowPublishModal(true)}
            />
          )}

          {currentTab === 'invitados' && (
            <GuestsTab
              guests={guests}
              customSlug={eventData.customSlug}
              onSaveGuest={handleSaveSingleGuest}
              onDeleteGuest={handleDeleteSingleGuest}
              onUpdateGuests={handleUpdateGuestsArray}
            />
          )}

          {currentTab === 'rsvp' && <RsvpTab guests={guests} />}

          {currentTab === 'mesas' && (
            <TablesTab
              guests={guests}
              tables={tables}
              invitationId={invitationId}
              onUpdateGuests={handleUpdateGuestsArray}
            />
          )}

          {currentTab === 'regalos' && (
            <GiftsTab
              gifts={gifts}
              invitationId={invitationId}
            />
          )}

          {currentTab === 'galeria' && (
            <GalleryTab
              photos={photos}
              invitationId={invitationId}
            />
          )}

          {currentTab === 'estadisticas' && (
            <AnalyticsTab
              guests={guests}
              tables={tables}
              photos={photos}
              viewsCount={(eventData as any).viewsCount || 0}
            />
          )}

          {currentTab === 'configuracion' && (
            <SettingsTab
              eventData={eventData}
              onUpdateEventData={onUpdateEventData}
            />
          )}

          {currentTab === 'ayuda' && <HelpTab />}
        </div>
      </main>

      {/* Fullscreen Public Invitation Modal */}
      {showPublicModal && (
        <PublicInvitationModal
          eventData={eventData}
          template={template}
          sections={sections}
          guests={guests}
          onConfirmRsvp={handleConfirmRsvp}
          onAddActivity={handleAddActivity}
          onClose={() => setShowPublicModal(false)}
        />
      )}

      {/* Publish Share Modal */}
      {showPublishModal && (
        <PublishModal
          eventData={eventData}
          onClose={() => setShowPublishModal(false)}
          onOpenPublicView={() => setShowPublicModal(true)}
        />
      )}
    </div>
  )
}
