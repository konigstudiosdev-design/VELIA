import React, { useEffect, useState } from 'react'
import { EventData } from '../types'
import { useAuth } from '../contexts/AuthContext'
import { getUserEvents, deleteEventAndInvitation } from '../services/eventService'
import { isOwnerAdminUser } from '../services/entitlementService'

interface SavedInvitationsModalProps {
  currentEventId?: string
  onSelectEvent: (event: EventData) => void
  onCreateNewEvent: () => void
  onClose: () => void
}

export default function SavedInvitationsModal({
  currentEventId,
  onSelectEvent,
  onCreateNewEvent,
  onClose,
}: SavedInvitationsModalProps) {
  const { user, userProfile } = useAuth()
  const [events, setEvents] = useState<EventData[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)

  const isOwner = isOwnerAdminUser(user?.email || '', userProfile?.role)

  useEffect(() => {
    if (user?.uid) {
      setLoading(true)
      getUserEvents(user.uid)
        .then(data => {
          setEvents(data || [])
        })
        .catch(err => {
          console.error('Error al cargar invitaciones guardadas:', err)
        })
        .finally(() => {
          setLoading(false)
        })
    } else {
      setLoading(false)
    }
  }, [user?.uid])

  const handleDelete = async (evt: EventData) => {
    if (!user?.uid || !evt.id) return
    if (!window.confirm(`¿Estás seguro de eliminar la invitación "${evt.person1Name}"?`)) return

    setDeletingId(evt.id)
    try {
      await deleteEventAndInvitation(user.uid, evt.id, evt.invitationId)
      setEvents(prev => prev.filter(e => e.id !== evt.id))
    } catch (err) {
      console.error('Error al eliminar invitación:', err)
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-beige space-y-6 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-beige/60 flex-none">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
                Gestor de Invitaciones
              </span>
              {isOwner && (
                <span className="bg-amber-100 text-amber-900 border border-amber-300 font-body text-[0.58rem] font-semibold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  👑 Dueño König (Sin Costo)
                </span>
              )}
            </div>
            <h3 className="font-display text-2xl sm:text-3xl text-brown font-light mt-0.5">
              Mis Invitaciones Guardadas
            </h3>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-ivory border border-beige flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Info Banner */}
        <div className="bg-ivory border border-beige/80 rounded-2xl p-4 flex items-center justify-between gap-4 flex-none">
          <div className="text-left space-y-0.5">
            <p className="font-body text-xs font-medium text-brown">
              {isOwner
                ? 'Como dueño de la plataforma (König), puedes crear y guardar invitaciones ilimitadas sin costo.'
                : 'Todas tus invitaciones guardadas en tu cuenta están disponibles aquí.'}
            </p>
            <p className="font-body text-[0.65rem] text-brown/50">
              Selecciona una invitación para cargarla en el editor o crea una nueva.
            </p>
          </div>

          <button
            onClick={() => {
              onClose()
              onCreateNewEvent()
            }}
            className="bg-brown text-ivory font-body font-medium text-xs px-4 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer flex-none flex items-center gap-1.5 shadow-xs"
          >
            <span>+</span>
            <span>Nueva Invitación</span>
          </button>
        </div>

        {/* Events Grid / List */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {loading ? (
            <div className="text-center py-12 text-brown/50 font-body text-xs">
              Cargando tus invitaciones guardadas...
            </div>
          ) : events.length === 0 ? (
            <div className="text-center py-12 bg-ivory/50 border border-dashed border-beige rounded-2xl space-y-3">
              <span className="text-3xl block">📂</span>
              <p className="font-display text-xl text-brown font-light">
                Aún no tienes invitaciones guardadas
              </p>
              <p className="font-body text-xs text-brown/50 max-w-xs mx-auto">
                Crea tu primera invitación digital y se guardará automáticamente en tu cuenta.
              </p>
              <button
                onClick={() => {
                  onClose()
                  onCreateNewEvent()
                }}
                className="bg-brown text-ivory font-body text-xs font-medium px-6 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer"
              >
                Crear Invitación Ahora
              </button>
            </div>
          ) : (
            events.map(evt => {
              const isCurrent = evt.id === currentEventId
              const title = evt.person2Name
                ? `${evt.person1Name} & ${evt.person2Name}`
                : evt.person1Name || 'Mi Evento'

              return (
                <div
                  key={evt.id || evt.invitationId}
                  className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all ${
                    isCurrent
                      ? 'border-champagne bg-ivory/80 ring-2 ring-champagne/30 shadow-xs'
                      : 'border-beige/80 bg-white hover:border-champagne/60'
                  }`}
                >
                  <div className="space-y-1 text-left">
                    <div className="flex items-center gap-2">
                      <span className="font-body text-[0.6rem] font-medium tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-champagne/20 text-brown">
                        {evt.eventType}
                      </span>
                      <span
                        className={`font-body text-[0.58rem] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full ${
                          evt.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : evt.status === 'Paused'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-beige text-brown/60'
                        }`}
                      >
                        {evt.status === 'Published'
                          ? 'Publicada'
                          : evt.status === 'Paused'
                          ? 'Pausada'
                          : 'Borrador'}
                      </span>
                      {isCurrent && (
                        <span className="font-body text-[0.58rem] font-bold tracking-wider text-brown uppercase">
                          • En edición
                        </span>
                      )}
                    </div>

                    <h4 className="font-display text-xl text-brown font-light leading-snug">
                      {title}
                    </h4>

                    <p className="font-body text-xs text-brown/50">
                      {evt.date ? `Fecha: ${evt.date}` : ''}{evt.venue ? ` · ${evt.venue}` : ''}
                    </p>

                    {evt.customSlug && (
                      <p className="font-body text-[0.68rem] text-champagne font-mono">
                        velia.mx/e/{evt.customSlug}
                      </p>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-auto flex-wrap">
                    {evt.customSlug && (
                      <a
                        href={`/e/${evt.customSlug}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-body text-xs text-brown/70 border border-beige px-3.5 py-2 rounded-full hover:bg-ivory transition-colors"
                      >
                        👁️ Ver
                      </a>
                    )}

                    <button
                      onClick={() => {
                        onSelectEvent(evt)
                        onClose()
                      }}
                      className="bg-brown text-ivory font-body text-xs font-medium px-5 py-2 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs"
                    >
                      ✏️ Cargar y Editar
                    </button>

                    <button
                      onClick={() => handleDelete(evt)}
                      disabled={deletingId === evt.id}
                      title="Eliminar invitación"
                      className="p-2 text-rose hover:text-red-700 text-xs rounded-full hover:bg-rose/10 transition-colors cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              )
            })
          )}
        </div>
      </div>
    </div>
  )
}
