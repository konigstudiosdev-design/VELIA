import React from 'react'
import { GuestItem, TableGroup, GalleryPhoto } from '../../types'

interface AnalyticsTabProps {
  guests?: GuestItem[]
  tables?: TableGroup[]
  photos?: GalleryPhoto[]
  viewsCount?: number
}

export default function AnalyticsTab({
  guests = [],
  tables = [],
  photos = [],
  viewsCount = 0,
}: AnalyticsTabProps) {
  // Compute real metrics
  const totalPasses = guests.reduce((acc, g) => acc + g.passes, 0)
  const confirmedGuestsCount = guests.filter(g => g.rsvp === 'Confirmado').reduce((acc, g) => acc + (g.confirmedGuests || g.passes), 0)
  const pendingGuestsCount = guests.filter(g => g.rsvp === 'Pendiente').reduce((acc, g) => acc + g.passes, 0)
  const declinedGuestsCount = guests.filter(g => g.rsvp === 'Rechazado').reduce((acc, g) => acc + g.passes, 0)

  const confirmedPct = totalPasses > 0 ? Math.round((confirmedGuestsCount / totalPasses) * 100) : 0
  const pendingPct = totalPasses > 0 ? Math.round((pendingGuestsCount / totalPasses) * 100) : 0
  const declinedPct = totalPasses > 0 ? Math.round((declinedGuestsCount / totalPasses) * 100) : 0

  const totalCapacity = tables.reduce((acc, t) => acc + t.capacity, 0)
  const occupiedSeats = guests.filter(g => g.table && g.table !== 'Sin asignar').reduce((acc, g) => acc + g.passes, 0)

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 select-none">
      <div>
        <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
          Métricas &amp; Rendimiento
        </span>
        <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
          Estadísticas Reales del Evento
        </h1>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Visitas Totales
          </span>
          <span className="font-display text-3xl text-brown font-light block">
            {viewsCount || '—'}
          </span>
          <span className="font-body text-[0.65rem] text-emerald-600 font-medium">
            Impresiones de la invitación
          </span>
        </div>

        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Pases Totales
          </span>
          <span className="font-display text-3xl text-brown font-light block">
            {totalPasses}
          </span>
          <span className="font-body text-[0.65rem] text-brown/40">
            {guests.length} contactos en lista
          </span>
        </div>

        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Pases Confirmados
          </span>
          <span className="font-display text-3xl text-emerald-800 font-light block">
            {confirmedGuestsCount}
          </span>
          <span className="font-body text-[0.65rem] text-emerald-600 font-medium">
            {confirmedPct}% del total
          </span>
        </div>

        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Asientos Asignados
          </span>
          <span className="font-display text-3xl text-brown font-light block">
            {occupiedSeats} / {totalCapacity || '—'}
          </span>
          <span className="font-body text-[0.65rem] text-champagne font-medium">
            En {tables.length} mesas
          </span>
        </div>
      </div>

      {/* RSVP Breakdown */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-6">
        <div>
          <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Desglose de Asistencia
          </span>
          <h3 className="font-display text-2xl text-brown font-light">
            Estado de Confirmación
          </h3>
        </div>

        <div className="space-y-4 max-w-xl">
          <div className="space-y-1">
            <div className="flex justify-between items-center font-body text-xs text-brown">
              <span className="font-medium text-emerald-800">Confirmados ({confirmedGuestsCount} pases)</span>
              <span className="text-emerald-700 font-semibold">{confirmedPct}%</span>
            </div>
            <div className="h-3 bg-ivory rounded-full overflow-hidden border border-beige/60">
              <div
                className="h-full rounded-full bg-emerald-600 transition-all duration-1000"
                style={{ width: `${confirmedPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center font-body text-xs text-brown">
              <span className="font-medium text-amber-800">Pendientes ({pendingGuestsCount} pases)</span>
              <span className="text-amber-700 font-semibold">{pendingPct}%</span>
            </div>
            <div className="h-3 bg-ivory rounded-full overflow-hidden border border-beige/60">
              <div
                className="h-full rounded-full bg-amber-500 transition-all duration-1000"
                style={{ width: `${pendingPct}%` }}
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center font-body text-xs text-brown">
              <span className="font-medium text-rose font-medium">Rechazados ({declinedGuestsCount} pases)</span>
              <span className="text-rose font-semibold">{declinedPct}%</span>
            </div>
            <div className="h-3 bg-ivory rounded-full overflow-hidden border border-beige/60">
              <div
                className="h-full rounded-full bg-rose transition-all duration-1000"
                style={{ width: `${declinedPct}%` }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
