import React, { useState } from 'react'
import { EventData, EventStatus } from '../../types'
import { cleanSlug, updateInvitationStatus } from '../../services/eventService'

interface SettingsTabProps {
  eventData: EventData
  onUpdateEventData: (data: EventData) => void
}

export default function SettingsTab({
  eventData,
  onUpdateEventData,
}: SettingsTabProps) {
  const [slug, setSlug] = useState(cleanSlug(eventData.customSlug))
  const [status, setStatus] = useState<EventStatus>(eventData.status)
  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newSlug = cleanSlug(slug)
      if (eventData.ownerId && eventData.id && eventData.invitationId && status !== eventData.status) {
        await updateInvitationStatus(eventData.ownerId, eventData.id, eventData.invitationId, status)
      }
      onUpdateEventData({
        ...eventData,
        customSlug: newSlug,
        status,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Error al guardar ajustes:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleTogglePause = async () => {
    if (!eventData.ownerId || !eventData.id || !eventData.invitationId) return
    const nextStatus: EventStatus = eventData.status === 'Published' ? 'Paused' : 'Published'
    setSubmitting(true)
    try {
      await updateInvitationStatus(eventData.ownerId, eventData.id, eventData.invitationId, nextStatus)
      setStatus(nextStatus)
      onUpdateEventData({
        ...eventData,
        status: nextStatus,
      })
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      console.error('Error al cambiar estado de publicación:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
          Ajustes del Evento
        </span>
        <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
          Configuración
        </h1>
      </div>

      {/* Publication Status Card */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
              Estado Actual
            </span>
            <h3 className="font-display text-2xl text-brown font-light flex items-center gap-2">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  status === 'Published'
                    ? 'bg-emerald-500'
                    : status === 'Paused'
                    ? 'bg-amber-500'
                    : 'bg-brown/40'
                }`}
              />
              {status === 'Published'
                ? 'Publicada y Activa'
                : status === 'Paused'
                ? 'Pausada'
                : 'Borrador'}
            </h3>
          </div>

          {status === 'Published' ? (
            <button
              onClick={handleTogglePause}
              disabled={submitting}
              className="border border-amber-300 bg-amber-50 text-amber-900 font-body text-xs font-medium px-5 py-2.5 rounded-full hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Pausar invitación
            </button>
          ) : status === 'Paused' ? (
            <button
              onClick={handleTogglePause}
              disabled={submitting}
              className="bg-emerald-600 text-white font-body text-xs font-medium px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              Reanudar publicación
            </button>
          ) : null}
        </div>

        <p className="font-body text-xs text-brown/60 leading-relaxed">
          {status === 'Published'
            ? 'Cualquier persona con tu enlace personalizado puede acceder a ver tu invitación y confirmar su asistencia.'
            : status === 'Paused'
            ? 'La invitación no estará disponible públicamente pero todos tus datos se conservan intactos. Puedes volver a publicarla cuando quieras.'
            : 'Tu invitación aún no ha sido publicada. Solo tú puedes verla en el editor y preview.'}
        </p>
      </div>

      {/* Main Settings Form */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div>
            <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
              URL Personalizada (Slug)
            </label>
            <div className="flex items-center gap-2">
              <span className="font-body text-xs text-brown/50 bg-ivory border border-beige px-3 py-3 rounded-lg flex-none">
                velia.mx/e/
              </span>
              <input
                type="text"
                value={slug}
                onChange={e => setSlug(e.target.value)}
                className="flex-1 px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
              Cambiar Estado de Publicación
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as EventStatus)}
              className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none"
            >
              <option value="Published">Publicada (Acceso público activo)</option>
              <option value="Draft">Borrador (Solo visible en tu panel)</option>
              <option value="Paused">Pausada (Acceso suspendido temporalmente)</option>
            </select>
          </div>

          <div className="pt-4 border-t border-beige/60 flex items-center justify-between">
            {saved ? (
              <span className="font-body text-xs text-emerald-600 font-medium">
                ✓ Ajustes guardados correctamente
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-brown text-ivory font-body font-medium text-xs px-8 py-3 rounded-full hover:bg-ink transition-colors cursor-pointer disabled:opacity-50"
            >
              {submitting ? 'Guardando...' : 'Guardar cambios'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
