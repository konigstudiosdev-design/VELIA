import React, { useState } from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
  onConfirmRsvp?: (guestId: string, status: 'Confirmado' | 'Rechazado', dietary?: string) => void
}

export default function RsvpSection({ section, theme, onConfirmRsvp }: SectionProps) {
  const content = section.content || {}
  const [guestName, setGuestName] = useState('')
  const [passes, setPasses] = useState(2)
  const [dietary, setDietary] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!guestName) return
    if (onConfirmRsvp) {
      onConfirmRsvp(`guest_${Date.now()}`, 'Confirmado', dietary)
    }
    setSubmitted(true)
  }

  return (
    <div className="py-20 px-6 max-w-xl mx-auto text-center space-y-6 bg-white border border-beige rounded-3xl shadow-sm my-8">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Confirmación RSVP'}
      </span>

      <h3
        className="font-display text-2xl text-brown font-light"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        {content.subtitle || 'Por favor confirma tu presencia'}
      </h3>

      {submitted ? (
        <div className="p-6 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl space-y-2">
          <p className="font-body text-sm font-semibold">¡Gracias por confirmar tu asistencia!</p>
          <p className="font-body text-xs text-emerald-600">Hemos registrado tus datos correctamente.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4 text-left pt-2">
          <div>
            <label className="block font-body text-[0.68rem] tracking-wider text-brown/65 uppercase mb-1">
              Nombre Completo
            </label>
            <input
              type="text"
              required
              value={guestName}
              onChange={e => setGuestName(e.target.value)}
              placeholder="Ej. Ana García"
              className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-xl text-brown text-xs font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <div>
            <label className="block font-body text-[0.68rem] tracking-wider text-brown/65 uppercase mb-1">
              Número de Pases Confirmados
            </label>
            <select
              value={passes}
              onChange={e => setPasses(Number(e.target.value))}
              className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-xl text-brown text-xs font-body focus:outline-none focus:border-champagne"
            >
              <option value={1}>1 Pase</option>
              <option value={2}>2 Pases</option>
              <option value={3}>3 Pases</option>
              <option value={4}>4 Pases</option>
            </select>
          </div>

          <div>
            <label className="block font-body text-[0.68rem] tracking-wider text-brown/65 uppercase mb-1">
              Restricciones Alimentarias (Opcional)
            </label>
            <input
              type="text"
              value={dietary}
              onChange={e => setDietary(e.target.value)}
              placeholder="Ej. Vegetariano, Alergia a nueces"
              className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-xl text-brown text-xs font-body focus:outline-none focus:border-champagne"
            />
          </div>

          <button
            type="submit"
            className="w-full bg-brown text-ivory font-body text-xs font-medium py-3 rounded-full hover:bg-ink transition-colors cursor-pointer mt-2"
          >
            Confirmar Asistencia
          </button>
        </form>
      )}
    </div>
  )
}
