import React, { useState, useEffect } from 'react'
import { EventData, Template } from '../types'
import InvitationRenderer from './invitation/InvitationRenderer'
import { submitPublicRsvpWithToken } from '../services/eventService'

interface PublicInvitationExperienceProps {
  eventData: EventData
  template: Template
  sections?: any[]
  guestToken?: string
  currentGuest?: {
    token: string
    invitationId: string
    guestId: string
    guestName: string
    passes: number
    confirmedGuests: number
    rsvp: 'Confirmado' | 'Pendiente' | 'Rechazado'
    dietaryNotes?: string
    notes?: string
  } | null
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
  onClose?: () => void
}

export default function PublicInvitationExperience({
  eventData,
  sections,
  guestToken,
  currentGuest,
  onConfirmRsvp,
  onClose,
}: PublicInvitationExperienceProps) {
  const [activeGuest, setActiveGuest] = useState(currentGuest || null)
  const [rsvpStatus, setRsvpStatus] = useState<'Confirmado' | 'Rechazado'>('Confirmado')
  const [confirmedCount, setConfirmedCount] = useState<number>(currentGuest?.passes || 1)
  const [dietary, setDietary] = useState<string>(currentGuest?.dietaryNotes || '')
  const [notes, setNotes] = useState<string>(currentGuest?.notes || '')
  const [submitting, setSubmitting] = useState<boolean>(false)
  const [submitted, setSubmitted] = useState<boolean>(
    currentGuest?.rsvp === 'Confirmado' || currentGuest?.rsvp === 'Rechazado'
  )

  useEffect(() => {
    if (currentGuest) {
      setActiveGuest(currentGuest)
      setConfirmedCount(currentGuest.passes)
      if (currentGuest.rsvp === 'Confirmado' || currentGuest.rsvp === 'Rechazado') {
        setSubmitted(true)
      }
    }
  }, [currentGuest])

  const handlePersonalRsvpSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!activeGuest || !activeGuest.token) return

    setSubmitting(true)
    try {
      await submitPublicRsvpWithToken(
        activeGuest.token,
        rsvpStatus,
        confirmedCount,
        dietary,
        notes
      )
      if (onConfirmRsvp) {
        onConfirmRsvp(activeGuest.guestId, rsvpStatus, dietary)
      }
      setSubmitted(true)
    } catch (err) {
      console.error('Error al enviar respuesta RSVP:', err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="relative min-h-screen bg-ivory">
      {/* Floating Close Header if in Modal Mode */}
      {onClose && (
        <header className="fixed top-4 right-4 z-50">
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-full bg-brown/80 text-white backdrop-blur-md flex items-center justify-center text-sm hover:bg-brown shadow-lg transition-all cursor-pointer"
          >
            ✕
          </button>
        </header>
      )}

      {/* Personal Guest Token Welcome Banner */}
      {activeGuest && (
        <div className="bg-brown text-ivory px-6 py-4 border-b border-champagne/30 text-center relative z-40">
          <div className="max-w-2xl mx-auto space-y-1">
            <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block">
              Invitación Personalizada
            </span>
            <p className="font-display text-lg font-light text-white">
              ¡Hola <span className="font-semibold text-champagne">{activeGuest.guestName}</span>!
            </p>
            <p className="font-body text-xs text-white/70">
              Tienes <span className="font-semibold text-white">{activeGuest.passes}</span>{' '}
              {activeGuest.passes === 1 ? 'pase reservado' : 'pases reservados'} para nuestro evento.
            </p>
          </div>
        </div>
      )}

      {/* Modular Unified Renderer */}
      <InvitationRenderer
        sections={sections}
        eventData={eventData}
        mode="public"
        onConfirmRsvp={onConfirmRsvp}
      />

      {/* Personal Token Interactive RSVP Bar */}
      {activeGuest && eventData.invitationId && (
        <div className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-md border-t border-beige shadow-2xl p-4 sm:p-6">
          <div className="max-w-xl mx-auto space-y-4">
            {submitted ? (
              <div className="text-center p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl">
                <p className="font-body text-xs font-semibold">
                  ✓ ¡Gracias {activeGuest.guestName}! Tu respuesta fue registrada ({activeGuest.rsvp === 'Confirmado' ? `${confirmedCount} pases` : 'Declinado'}).
                </p>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase block">
                      Confirmación de Asistencia
                    </span>
                    <p className="font-display text-base text-brown font-light">
                      {activeGuest.guestName} ({activeGuest.passes} pases disponibles)
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('Confirmado')}
                      className={`font-body text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                        rsvpStatus === 'Confirmado'
                          ? 'bg-emerald-600 text-white font-medium shadow-xs'
                          : 'border border-beige text-brown/60'
                      }`}
                    >
                      ✓ Asistiré
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpStatus('Rechazado')}
                      className={`font-body text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer ${
                        rsvpStatus === 'Rechazado'
                          ? 'bg-rose text-white font-medium shadow-xs'
                          : 'border border-beige text-brown/60'
                      }`}
                    >
                      ✕ No podré asistir
                    </button>
                  </div>
                </div>

                <form onSubmit={handlePersonalRsvpSubmit} className="space-y-3 pt-1">
                  {rsvpStatus === 'Confirmado' && (
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Pases a utilizar
                        </label>
                        <select
                          value={confirmedCount}
                          onChange={e => setConfirmedCount(Number(e.target.value))}
                          className="w-full px-3 py-1.5 bg-ivory border border-beige/80 rounded-xl text-xs text-brown font-body focus:outline-none"
                        >
                          {Array.from({ length: activeGuest.passes }, (_, i) => i + 1).map(num => (
                            <option key={num} value={num}>
                              {num} {num === 1 ? 'Persona' : 'Personas'}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Restricciones dietéticas
                        </label>
                        <input
                          type="text"
                          placeholder="ej. Vegetariano, Ninguna"
                          value={dietary}
                          onChange={e => setDietary(e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory border border-beige/80 rounded-xl text-xs text-brown font-body focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-brown text-ivory font-body text-xs font-medium py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {submitting ? 'Guardando respuesta...' : 'Enviar Respuesta RSVP'}
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
