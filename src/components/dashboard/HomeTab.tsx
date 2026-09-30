import React, { useState } from 'react'
import { ActivityItem, DashboardTab, EventData, GuestItem } from '../../types'
import { getEventEntitlements, getPlanDefinition, isOwnerAdminUser } from '../../services/entitlementService'
import { getEventTypeConfig } from '../../config/eventTypeConfig'
import { cleanSlug } from '../../services/eventService'
import { useAuth } from '../../contexts/AuthContext'
import PlansModal from '../billing/PlansModal'

interface HomeTabProps {
  eventData: EventData
  guests: GuestItem[]
  activities: ActivityItem[]
  onSelectTab: (tab: DashboardTab) => void
  onOpenPublicView: () => void
  onOpenPublishModal: () => void
}

export default function HomeTab({
  eventData,
  guests,
  activities,
  onSelectTab,
  onOpenPublicView,
  onOpenPublishModal,
}: HomeTabProps) {
  const { user, userProfile } = useAuth()
  const isOwner = isOwnerAdminUser(user?.email || '', userProfile?.role)

  const [showPlansModal, setShowPlansModal] = useState(false)

  const { limits, planId } = getEventEntitlements(eventData, user?.email || '', userProfile?.role)
  const currentPlan = getPlanDefinition(planId)

  // Compute counts
  const totalGuests = guests.reduce((acc, g) => acc + g.passes, 0)
  const confirmed = guests.filter(g => g.rsvp === 'Confirmado').reduce((acc, g) => acc + (g.confirmedGuests || g.passes), 0)
  const pending = guests.filter(g => g.rsvp === 'Pendiente').reduce((acc, g) => acc + g.passes, 0)
  const declined = guests.filter(g => g.rsvp === 'Rechazado').reduce((acc, g) => acc + g.passes, 0)

  const confirmedPct = totalGuests > 0 ? Math.round((confirmed / totalGuests) * 100) : 0
  const pendingPct = totalGuests > 0 ? Math.round((pending / totalGuests) * 100) : 0
  const declinedPct = totalGuests > 0 ? Math.round((declined / totalGuests) * 100) : 0

  const config = getEventTypeConfig(eventData.eventType)
  const isCouple = config.allowedFields.person2Name
  const eventTitle =
    isCouple && eventData.person2Name
      ? `${eventData.eventType} de ${eventData.person1Name} & ${eventData.person2Name}`
      : `${eventData.eventType} de ${eventData.person1Name}`

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 select-none">
      {/* Welcome Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
            Panel Principal
          </span>
          <h1 className="font-display text-4xl lg:text-5xl text-brown font-light mt-1">
            Hola, {eventData.person1Name || 'Usuario'}.
          </h1>
          <p className="font-body text-sm text-brown/55 mt-1">
            Así va tu evento. Todo está funcionando perfectamente.
          </p>
        </div>

        {/* Active Plan Badge */}
        <div className="bg-white border border-beige/80 rounded-2xl p-3.5 shadow-xs flex items-center justify-between gap-4 self-start sm:self-auto">
          <div>
            <span className="font-body text-[0.58rem] tracking-[0.2em] text-brown/40 uppercase block font-medium">
              Plan Comercial
            </span>
            <p className="font-display text-lg text-brown font-light leading-none mt-0.5">
              {isOwner ? '👑 Signature (Dueño König)' : `Plan ${currentPlan.name}`}
            </p>
          </div>

          {isOwner ? (
            <span className="bg-amber-100 text-amber-900 border border-amber-300 font-body font-semibold text-[0.62rem] px-3.5 py-1.5 rounded-full uppercase tracking-wider">
              Acceso Ilimitado
            </span>
          ) : (
            <button
              onClick={() => setShowPlansModal(true)}
              className="bg-champagne hover:bg-[#d4b990] text-brown font-body font-medium text-xs px-4 py-2 rounded-full transition-colors cursor-pointer"
            >
              Mejorar Plan
            </button>
          )}
        </div>
      </div>

      {/* Main Event Highlight Card */}
      <div className="bg-brown text-ivory rounded-3xl p-6 lg:p-10 shadow-xl relative overflow-hidden">
        {/* Background graphic */}
        <div className="absolute top-0 right-0 -translate-y-12 translate-x-12 w-96 h-96 rounded-full bg-champagne/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-body text-[0.62rem] font-semibold px-3 py-1 rounded-full uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                {eventData.status === 'Published' ? 'PUBLICADA' : eventData.status.toUpperCase()}
              </span>
              <span className="font-body text-xs text-white/50">
                velia.mx/e/{cleanSlug(eventData.customSlug)}
              </span>
            </div>

            <h2 className="font-display text-3xl lg:text-4xl font-light text-white leading-snug">
              {eventTitle}
            </h2>

            <p className="font-body text-sm text-champagne/80 mt-1">
              📅 {eventData.date || '18 septiembre 2027'} · {eventData.location || 'CDMX'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={onOpenPublicView}
              className="bg-champagne text-brown font-body font-medium text-xs px-6 py-3 rounded-full hover:bg-[#d4b990] transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
            >
              Ver invitación
            </button>

            <button
              onClick={onOpenPublishModal}
              className="border border-white/25 text-white hover:border-white/50 font-body text-xs px-6 py-3 rounded-full transition-all cursor-pointer"
            >
              Compartir
            </button>
          </div>
        </div>
      </div>

      {/* Event Progress Checklist Card */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase block mb-1 font-medium">
              Estado de Avance
            </span>
            <h3 className="font-display text-2xl lg:text-3xl text-brown font-light">
              Tu evento está tomando forma.
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('editor')}
            className="font-body text-xs font-medium text-brown border border-beige px-4 py-2 rounded-full hover:bg-ivory transition-colors cursor-pointer"
          >
            Ir al Editor →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
          {/* Step 1: Información */}
          <div className="bg-ivory/60 border border-beige/70 rounded-xl p-3.5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold flex-none">
              ✓
            </span>
            <div>
              <p className="font-body text-xs font-semibold text-brown">Información</p>
              <span className="font-body text-[0.65rem] text-emerald-700">Completado</span>
            </div>
          </div>

          {/* Step 2: Diseño */}
          <div className="bg-ivory/60 border border-beige/70 rounded-xl p-3.5 flex items-center gap-3">
            <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-xs font-bold flex-none">
              ✓
            </span>
            <div>
              <p className="font-body text-xs font-semibold text-brown">Diseño</p>
              <span className="font-body text-[0.65rem] text-emerald-700">Completado</span>
            </div>
          </div>

          {/* Step 3: Invitados */}
          <div className={`border rounded-xl p-3.5 flex items-center gap-3 ${
            totalGuests > 0 ? 'bg-ivory/60 border-beige/70' : 'bg-white border-dashed border-beige'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-none ${
              totalGuests > 0 ? 'bg-emerald-100 text-emerald-800' : 'bg-ivory border border-beige text-brown/40'
            }`}>
              {totalGuests > 0 ? '✓' : '○'}
            </span>
            <div>
              <p className="font-body text-xs font-semibold text-brown">Invitados</p>
              <span className={`font-body text-[0.65rem] ${totalGuests > 0 ? 'text-emerald-700' : 'text-brown/40'}`}>
                {totalGuests > 0 ? `${totalGuests} agregados` : 'Pendiente'}
              </span>
            </div>
          </div>

          {/* Step 4: Publicación */}
          <div className={`border rounded-xl p-3.5 flex items-center gap-3 ${
            eventData.status === 'Published' ? 'bg-ivory/60 border-beige/70' : 'bg-white border-dashed border-beige'
          }`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-none ${
              eventData.status === 'Published' ? 'bg-emerald-100 text-emerald-800' : 'bg-ivory border border-beige text-brown/40'
            }`}>
              {eventData.status === 'Published' ? '✓' : '○'}
            </span>
            <div>
              <p className="font-body text-xs font-semibold text-brown">Publicación</p>
              <span className={`font-body text-[0.65rem] ${eventData.status === 'Published' ? 'text-emerald-700' : 'text-brown/40'}`}>
                {eventData.status === 'Published' ? 'Publicada' : 'Pendiente'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Plan Quota Usage Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Cupo de Pases
          </span>
          <p className="font-display text-2xl text-brown font-light">
            {isOwner ? `${totalGuests} (Ilimitados)` : `${totalGuests} / ${limits.maxGuests}`}
          </p>
          <div className="w-full h-1.5 bg-ivory rounded-full overflow-hidden border border-beige/60 mt-2">
            <div
              className="h-full bg-champagne rounded-full transition-all duration-500"
              style={{ width: `${isOwner ? 100 : Math.min(100, Math.round((totalGuests / limits.maxGuests) * 100))}%` }}
            />
          </div>
        </div>

        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Vigencia de Publicación
          </span>
          <p className="font-display text-2xl text-brown font-light">
            {isOwner ? 'Ilimitada (Dueño)' : limits.publicationDays === 0 ? 'Ilimitada' : `${limits.publicationDays} días`}
          </p>
          <span className="font-body text-[0.65rem] text-brown/40 mt-1 block">
            {isOwner ? 'Cuenta Dueño König' : `Plan ${currentPlan.name}`}
          </span>
        </div>

        <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-xs col-span-2 md:col-span-1">
          <span className="font-body text-[0.62rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
            Estado de Pago
          </span>
          <p className="font-display text-2xl text-brown font-light capitalize">
            {isOwner ? 'Ilimitado Gratuito' : eventData.billingStatus === 'paid' ? 'Pagado ✓' : 'Borrador Free'}
          </p>
          <span className="font-body text-[0.65rem] text-emerald-600 font-medium mt-1 block">
            {isOwner ? '✓ Acceso Dueño Activo' : eventData.billingStatus === 'paid' ? 'Licencia activa' : 'Requiere plan comercial'}
          </span>
        </div>
      </div>

      {/* Resumen RSVP + Chart */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-beige/60 gap-3">
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
              Estado General
            </span>
            <h3 className="font-display text-2xl text-brown font-light">
              Resumen de Confirmaciones (RSVP)
            </h3>
          </div>
          <button
            onClick={() => onSelectTab('rsvp')}
            className="font-body text-xs text-champagne hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>Ver detalle completo</span>
            <span>→</span>
          </button>
        </div>

        {/* Stats Grid & Custom Graph */}
        <div className="grid md:grid-cols-4 gap-6 items-center">
          <div className="md:col-span-3 grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            <div className="p-4 bg-ivory/50 rounded-2xl border border-beige/60">
              <span className="font-display text-3xl lg:text-4xl text-brown font-light block">
                {totalGuests}
              </span>
              <span className="font-body text-[0.65rem] text-brown/50 uppercase tracking-wider">
                Pases Totales
              </span>
            </div>

            <div className="p-4 bg-emerald-50/60 rounded-2xl border border-emerald-200/60">
              <span className="font-display text-3xl lg:text-4xl text-emerald-800 font-light block">
                {confirmed}
              </span>
              <span className="font-body text-[0.65rem] text-emerald-700 uppercase tracking-wider">
                Confirmados ({confirmedPct}%)
              </span>
            </div>

            <div className="p-4 bg-amber-50/60 rounded-2xl border border-amber-200/60">
              <span className="font-display text-3xl lg:text-4xl text-amber-800 font-light block">
                {pending}
              </span>
              <span className="font-body text-[0.65rem] text-amber-700 uppercase tracking-wider">
                Pendientes ({pendingPct}%)
              </span>
            </div>

            <div className="p-4 bg-rose/15 rounded-2xl border border-rose/30">
              <span className="font-display text-3xl lg:text-4xl text-brown font-light block">
                {declined}
              </span>
              <span className="font-body text-[0.65rem] text-brown/60 uppercase tracking-wider">
                Rechazados ({declinedPct}%)
              </span>
            </div>
          </div>

          <div className="flex flex-col items-center justify-center p-4 bg-ivory/40 rounded-2xl border border-beige/60">
            <div className="relative w-28 h-28 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                <path
                  className="text-beige"
                  strokeWidth="3.5"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
                <path
                  className="text-champagne"
                  strokeDasharray={`${confirmedPct}, 100`}
                  strokeWidth="3.5"
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="none"
                  d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                />
              </svg>
              <div className="absolute text-center">
                <span className="font-display text-2xl text-brown font-light block leading-none">
                  {confirmedPct}%
                </span>
                <span className="font-body text-[0.55rem] text-brown/50 uppercase">Asistencia</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Actividad Reciente */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs">
        <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
          Notificaciones en Vivo
        </span>
        <h3 className="font-display text-2xl text-brown font-light mb-6">
          Actividad Reciente
        </h3>

        <div className="space-y-4">
          {activities.map(act => (
            <div
              key={act.id}
              className="flex items-center justify-between p-4 bg-ivory/40 rounded-xl border border-beige/60 hover:bg-white transition-colors"
            >
              <div className="flex items-center gap-3">
                <span className="text-xl bg-white w-9 h-9 rounded-full flex items-center justify-center border border-beige/60 shadow-xs">
                  {act.icon}
                </span>
                <span className="font-body text-xs sm:text-sm text-brown font-medium">
                  {act.text}
                </span>
              </div>
              <span className="font-body text-[0.68rem] text-brown/40 flex-none ml-2">
                {act.time}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Plans Modal */}
      {showPlansModal && (
        <PlansModal
          currentPlanId={planId}
          eventId={eventData.id || ''}
          onClose={() => setShowPlansModal(false)}
        />
      )}
    </div>
  )
}
