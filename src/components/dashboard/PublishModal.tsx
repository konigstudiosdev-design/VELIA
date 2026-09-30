import React, { useState } from 'react'
import { EventData, EventStatus } from '../../types'
import { cleanSlug, updateInvitationStatus } from '../../services/eventService'
import { isOwnerAdminUser } from '../../services/entitlementService'
import { useAuth } from '../../contexts/AuthContext'
import ShareInvitation from '../ShareInvitation'

interface PublishModalProps {
  eventData: EventData
  onUpdateStatus?: (status: EventStatus) => void
  onClose: () => void
  onOpenPublicView: () => void
}

export default function PublishModal({
  eventData,
  onUpdateStatus,
  onClose,
  onOpenPublicView,
}: PublishModalProps) {
  const { user, userProfile } = useAuth()
  const [publishing, setSubmitting] = useState(false)
  const [publishedSuccess, setPublishedSuccess] = useState(eventData.status === 'Published')

  const isOwner = isOwnerAdminUser(user?.email || '', userProfile?.role)
  const slug = cleanSlug(eventData.customSlug)
  const isPublished = eventData.status === 'Published'

  // Pre-publish checklist verification
  const checklist = [
    { label: 'Nombre del evento / festejados', ok: Boolean(eventData.person1Name) },
    { label: 'Fecha del evento', ok: Boolean(eventData.date) },
    { label: 'Lugar / Ubicación configurada', ok: Boolean(eventData.location || eventData.venue) },
    { label: 'Plantilla & Diseño seleccionados', ok: Boolean(eventData.selectedTemplateId) },
    { label: 'Confirmación RSVP habilitada', ok: true },
  ]

  const allChecklistOk = checklist.every(item => item.ok)

  const handlePublish = async () => {
    if (!eventData.ownerId || !eventData.id || !eventData.invitationId) return

    setSubmitting(true)
    try {
      await updateInvitationStatus(
        eventData.ownerId,
        eventData.id,
        eventData.invitationId,
        'Published'
      )
      if (onUpdateStatus) {
        onUpdateStatus('Published')
      }
      setPublishedSuccess(true)
    } catch (err) {
      console.error('Error al publicar invitación:', err)
    } finally {
      setSubmitting(false)
    }
  }

  if (publishedSuccess) {
    return (
      <ShareInvitation
        customSlug={slug}
        onClose={onClose}
      />
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-beige text-center relative animate-fade-up space-y-6 select-none">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
        >
          ✕
        </button>

        <div className="w-14 h-14 rounded-full bg-champagne/20 border border-champagne/40 text-brown flex items-center justify-center text-2xl mx-auto">
          ✨
        </div>

        <div>
          {isOwner ? (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-body text-[0.62rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wider inline-block mb-2">
              👑 Cuenta Dueño (König) · Publicación Gratuita
            </span>
          ) : (
            <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
              Confirmación de Publicación
            </span>
          )}
          <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
            ¿Todo listo para publicar?
          </h3>
          <p className="font-body text-xs text-brown/55 mt-1">
            Tu invitación estará activa públicamente y lista para recibir a tus invitados.
          </p>
        </div>

        {/* Checklist */}
        <div className="bg-ivory border border-beige/80 rounded-2xl p-4 text-left space-y-2">
          <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Lista de Verificación
          </span>
          {checklist.map((item, idx) => (
            <div key={idx} className="flex items-center gap-2.5 text-xs font-body text-brown">
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${item.ok ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'}`}>
                {item.ok ? '✓' : '!'}
              </span>
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        <button
          onClick={handlePublish}
          disabled={publishing || !allChecklistOk}
          className="w-full bg-brown text-ivory font-body font-medium text-xs py-3.5 rounded-full hover:bg-ink transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
        >
          {publishing ? 'Publicando...' : 'Publicar invitación ahora'}
        </button>
      </div>
    </div>
  )
}
