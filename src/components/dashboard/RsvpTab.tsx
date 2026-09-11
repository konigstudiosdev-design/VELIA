import React from 'react'
import { GuestItem } from '../../types'

interface RsvpTabProps {
  guests: GuestItem[]
}

export default function RsvpTab({ guests }: RsvpTabProps) {
  const confirmed = guests.filter(g => g.rsvp === 'Confirmado')
  const pending = guests.filter(g => g.rsvp === 'Pendiente')
  const declined = guests.filter(g => g.rsvp === 'Rechazado')

  const totalPasses = guests.reduce((a, b) => a + b.passes, 0) || 156
  const confirmedPasses = confirmed.reduce((a, b) => a + b.passes, 0)
  const pendingPasses = pending.reduce((a, b) => a + b.passes, 0)
  const declinedPasses = declined.reduce((a, b) => a + b.passes, 0)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      <div>
        <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
          Métricas de Asistencia
        </span>
        <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
          Panel de RSVP
        </h1>
      </div>

      {/* Cards breakdown */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-emerald-50/70 border border-emerald-200 p-6 rounded-2xl shadow-xs">
          <span className="text-2xl block mb-2">✅</span>
          <span className="font-display text-4xl text-emerald-900 block font-light">
            {confirmedPasses}
          </span>
          <span className="font-body text-xs font-medium text-emerald-700 uppercase tracking-wider">
            Confirmados ({confirmed.length} respuestas)
          </span>
        </div>

        <div className="bg-amber-50/70 border border-amber-200 p-6 rounded-2xl shadow-xs">
          <span className="text-2xl block mb-2">⏳</span>
          <span className="font-display text-4xl text-amber-900 block font-light">
            {pendingPasses}
          </span>
          <span className="font-body text-xs font-medium text-amber-700 uppercase tracking-wider">
            Pendientes ({pending.length} respuestas)
          </span>
        </div>

        <div className="bg-rose/15 border border-rose/30 p-6 rounded-2xl shadow-xs">
          <span className="text-2xl block mb-2">❌</span>
          <span className="font-display text-4xl text-brown block font-light">
            {declinedPasses}
          </span>
          <span className="font-body text-xs font-medium text-brown/60 uppercase tracking-wider">
            Rechazados ({declined.length} respuestas)
          </span>
        </div>
      </div>

      {/* Breakdown chart */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-4">
        <h3 className="font-display text-2xl text-brown font-light">
          Distribución Porcentual
        </h3>

        <div className="h-4 bg-ivory rounded-full overflow-hidden flex">
          <div
            className="bg-emerald-500 h-full transition-all duration-500"
            style={{ width: `${(confirmedPasses / totalPasses) * 100}%` }}
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${(pendingPasses / totalPasses) * 100}%` }}
          />
          <div
            className="bg-rose h-full transition-all duration-500"
            style={{ width: `${(declinedPasses / totalPasses) * 100}%` }}
          />
        </div>

        <div className="flex flex-wrap items-center justify-between font-body text-xs text-brown/60 pt-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500" />
            <span>Confirmados: {Math.round((confirmedPasses / totalPasses) * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-400" />
            <span>Pendientes: {Math.round((pendingPasses / totalPasses) * 100)}%</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose" />
            <span>Rechazados: {Math.round((declinedPasses / totalPasses) * 100)}%</span>
          </div>
        </div>
      </div>

      {/* Responses List */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-xs">
        <h3 className="font-display text-2xl text-brown font-light mb-4">
          Respuestas Registradas
        </h3>

        <div className="divide-y divide-beige/60 font-body text-xs">
          {guests.map(g => (
            <div key={g.id} className="py-3.5 flex items-center justify-between">
              <div>
                <p className="font-medium text-brown">{g.name}</p>
                <p className="text-brown/50 text-[0.7rem]">{g.phone} · {g.passes} pases</p>
              </div>

              <span
                className={`px-3 py-1 rounded-full font-medium ${
                  g.rsvp === 'Confirmado'
                    ? 'bg-emerald-50 text-emerald-800'
                    : g.rsvp === 'Pendiente'
                    ? 'bg-amber-50 text-amber-800'
                    : 'bg-rose/20 text-brown'
                }`}
              >
                {g.rsvp}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
