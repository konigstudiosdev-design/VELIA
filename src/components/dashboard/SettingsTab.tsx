import React, { useState } from 'react'
import { EventData, EventStatus, EventType } from '../../types'
import { cleanSlug, updateInvitationStatus } from '../../services/eventService'
import { getEventTypeConfig } from '../../config/eventTypeConfig'
import CustomDatePicker from '../CustomDatePicker'

interface SettingsTabProps {
  eventData: EventData
  onUpdateEventData: (data: EventData) => void
  onConvertToPartner?: () => void
}

const EVENT_TYPE_OPTIONS: EventType[] = [
  'Boda',
  'XV años',
  'Cumpleaños',
  'Baby shower',
  'Bautizo',
  'Graduación',
  'Aniversario',
  'Despedida',
  'Otro',
]

export default function SettingsTab({
  eventData,
  onUpdateEventData,
  onConvertToPartner,
}: SettingsTabProps) {
  const [eventType, setEventType] = useState<EventType>(eventData.eventType || 'Boda')
  const [person1Name, setPerson1Name] = useState(eventData.person1Name || '')
  const [person2Name, setPerson2Name] = useState(eventData.person2Name || '')
  const [age, setAge] = useState(eventData.age || '')
  const [yearsToCelebrate, setYearsToCelebrate] = useState(eventData.yearsToCelebrate || '')
  const [date, setDate] = useState(eventData.date || '')
  const [venue, setVenue] = useState(eventData.venue || '')
  const [location, setLocation] = useState(eventData.location || '')
  const [slug, setSlug] = useState(cleanSlug(eventData.customSlug))
  const [status, setStatus] = useState<EventStatus>(eventData.status)

  const [submitting, setSubmitting] = useState(false)
  const [saved, setSaved] = useState(false)

  const config = getEventTypeConfig(eventType)

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    try {
      const newSlug = cleanSlug(slug)
      if (eventData.ownerId && eventData.id && eventData.invitationId && status !== eventData.status) {
        await updateInvitationStatus(eventData.ownerId, eventData.id, eventData.invitationId, status)
      }

      const updated: EventData = {
        ...eventData,
        eventType,
        person1Name,
        person2Name: config.allowedFields.person2Name ? person2Name : '',
        age: config.allowedFields.age ? age : '',
        yearsToCelebrate: config.allowedFields.yearsToCelebrate ? yearsToCelebrate : '',
        date,
        venue,
        location,
        customSlug: newSlug,
        status,
      }

      onUpdateEventData(updated)
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
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
    <div className="space-y-8 max-w-4xl mx-auto pb-12 select-none">
      <div>
        <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
          Ajustes del Evento
        </span>
        <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
          Configuración General
        </h1>
        <p className="font-body text-xs text-brown/55 mt-1">
          Modifica los datos principales de tu celebración directamente desde tu panel sin salirte del editor.
        </p>
      </div>

      {/* Publication Status Card */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
              Estado de Publicación
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
              type="button"
              className="border border-amber-300 bg-amber-50 text-amber-900 font-body text-xs font-medium px-5 py-2.5 rounded-full hover:bg-amber-100 transition-colors cursor-pointer"
            >
              Pausar invitación
            </button>
          ) : status === 'Paused' ? (
            <button
              onClick={handleTogglePause}
              disabled={submitting}
              type="button"
              className="bg-emerald-600 text-white font-body text-xs font-medium px-5 py-2.5 rounded-full hover:bg-emerald-700 transition-colors cursor-pointer shadow-xs"
            >
              Reanudar publicación
            </button>
          ) : null}
        </div>

        <p className="font-body text-xs text-brown/60 leading-relaxed">
          {status === 'Published'
            ? 'Tu invitación está visible públicamente con tu enlace personalizado. Tus invitados pueden acceder y confirmar asistencia.'
            : status === 'Paused'
            ? 'La invitación no estará disponible públicamente pero todos tus datos se conservan intactos.'
            : 'Tu invitación es un borrador y solo se puede ver dentro de tu panel de control.'}
        </p>
      </div>

      {/* Main Event Data Editing Form */}
      <div className="bg-white border border-beige/80 rounded-2xl p-6 lg:p-8 shadow-xs">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="pb-4 border-b border-beige/60">
            <h3 className="font-display text-xl text-brown font-light">
              Datos de la Celebración
            </h3>
            <p className="font-body text-xs text-brown/50 mt-0.5">
              Tus cambios se reflejarán instantáneamente en tu tarjeta e invitación.
            </p>
          </div>

          {/* Event Type Dropdown */}
          <div>
            <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
              Tipo de Evento
            </label>
            <select
              value={eventType}
              onChange={e => setEventType(e.target.value as EventType)}
              className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
            >
              {EVENT_TYPE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>
          </div>

          {/* Names and Dynamic Fields */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
                {config.fieldLabels.person1Name}
              </label>
              <input
                type="text"
                required
                value={person1Name}
                onChange={e => setPerson1Name(e.target.value)}
                placeholder="ej. Lucía / Fernanda"
                className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
              />
            </div>

            {config.allowedFields.person2Name && (
              <div>
                <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
                  {config.fieldLabels.person2Name || 'Nombre persona 2'}
                </label>
                <input
                  type="text"
                  required
                  value={person2Name}
                  onChange={e => setPerson2Name(e.target.value)}
                  placeholder="ej. Mateo / Alejandro"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                />
              </div>
            )}

            {config.allowedFields.age && (
              <div>
                <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
                  {config.fieldLabels.age || 'Edad a cumplir'}
                </label>
                <input
                  type="number"
                  value={age}
                  onChange={e => setAge(e.target.value)}
                  placeholder="ej. 15"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                />
              </div>
            )}

            {config.allowedFields.yearsToCelebrate && (
              <div>
                <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
                  {config.fieldLabels.yearsToCelebrate || 'Años a celebrar'}
                </label>
                <input
                  type="number"
                  value={yearsToCelebrate}
                  onChange={e => setYearsToCelebrate(e.target.value)}
                  placeholder="ej. 25"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                />
              </div>
            )}
          </div>

          {/* Date & Location */}
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <CustomDatePicker
                label="Fecha del Evento"
                value={date}
                onChange={setDate}
              />
            </div>

            <div>
              <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
                Salón / Lugar
              </label>
              <input
                type="text"
                value={venue}
                onChange={e => setVenue(e.target.value)}
                placeholder="ej. Hacienda Real de Gala"
                className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
              />
            </div>
          </div>

          <div>
            <label className="block font-body text-[0.72rem] tracking-wider text-brown/60 uppercase mb-2">
              Dirección Completa
            </label>
            <input
              type="text"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="ej. Carretera Libre Km 24, CDMX"
              className="w-full px-4 py-3 bg-ivory/50 border border-beige rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
            />
          </div>

          {/* Custom Slug */}
          <div className="pt-4 border-t border-beige/60">
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

          {/* Save Action Bar */}
          <div className="pt-4 border-t border-beige/60 flex items-center justify-between">
            {saved ? (
              <span className="font-body text-xs text-emerald-600 font-medium flex items-center gap-1">
                <span>✓</span>
                <span>¡Ajustes e información guardados correctamente!</span>
              </span>
            ) : (
              <span />
            )}

            <button
              type="submit"
              disabled={submitting}
              className="bg-brown text-ivory font-body font-medium text-xs px-8 py-3.5 rounded-full hover:bg-ink transition-colors cursor-pointer disabled:opacity-50 shadow-xs"
            >
              {submitting ? 'Guardando...' : 'Guardar Cambios'}
            </button>
          </div>
        </form>
      </div>

      {/* Partner B2B Conversion Card */}
      {onConvertToPartner && (
        <div className="bg-gradient-to-r from-brown via-ink to-black text-ivory rounded-2xl p-6 lg:p-8 shadow-md border border-champagne/30 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="space-y-1 text-left">
            <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium block">
              Programa VÉLIA para Profesionales
            </span>
            <h3 className="font-display text-2xl text-white font-light">
              ¿Eres Wedding Planner u Organizador de Eventos?
            </h3>
            <p className="font-body text-xs text-white/70 max-w-lg leading-relaxed">
              Convierte VÉLIA en tu herramienta profesional. Crea y administra invitaciones para tus clientes, gestiona sus eventos y recibe comisiones por cada venta.
            </p>
          </div>

          <button
            type="button"
            onClick={onConvertToPartner}
            className="bg-champagne hover:bg-[#d4b990] text-brown font-body font-medium text-xs px-6 py-3.5 rounded-full transition-all cursor-pointer flex-none shadow-xs text-center"
          >
            Conocer VÉLIA para Profesionales →
          </button>
        </div>
      )}
    </div>
  )
}
