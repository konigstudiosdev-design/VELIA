import React, { useState } from 'react'
import { AppView, PartnerRole, PartnerProfile } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import { registerPartner } from '../../services/partnerService'

interface PartnerOnboardingViewProps {
  onNavigate: (view: AppView) => void
  onSuccess: (partner: PartnerProfile) => void
}

const BUSINESS_TYPES: { label: string; value: PartnerRole }[] = [
  { label: 'Wedding Planner', value: 'wedding_planner' },
  { label: 'Event Planner', value: 'event_planner' },
  { label: 'Organizador de XV Años / Eventos Social', value: 'organizer' },
  { label: 'Salón de Eventos / Jardín / Venue', value: 'venue' },
  { label: 'Fotógrafo / Cineasta de Bodas', value: 'photographer' },
  { label: 'Decorador / Diseñador Floral', value: 'decorator' },
  { label: 'Agencia de Eventos', value: 'agency' },
  { label: 'Otro profesional de eventos', value: 'other' },
]

export default function PartnerOnboardingView({
  onNavigate,
  onSuccess,
}: PartnerOnboardingViewProps) {
  const { user } = useAuth()

  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [businessName, setBusinessName] = useState('')
  const [businessType, setBusinessType] = useState<PartnerRole>('wedding_planner')
  const [email, setEmail] = useState(user?.email || '')
  const [phone, setPhone] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  const [city, setCity] = useState('')
  const [instagram, setInstagram] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [acceptTerms, setAcceptTerms] = useState(false)

  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [submittedPartner, setSubmittedPartner] = useState<PartnerProfile | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      onNavigate('login')
      return
    }

    if (!firstName || !lastName || !businessName || !email || !phone || !city) {
      setError('Por favor completa todos los campos requeridos.')
      return
    }

    if (!acceptTerms) {
      setError('Debes aceptar los términos del Programa de Partners de VÉLIA.')
      return
    }

    setError('')
    setSubmitting(true)

    try {
      const searchParams = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '')
      const inviteCode = searchParams.get('invite') || ''

      const partner = await registerPartner(user.uid, {
        firstName,
        lastName,
        businessName,
        businessType,
        email,
        phone,
        whatsapp: whatsapp || phone,
        city,
        instagram,
        website,
        description,
        inviteCode,
      })

      setSubmittedPartner(partner)
      onSuccess(partner)
    } catch (err: any) {
      console.error('Error al registrar Partner:', err)
      setError(err?.message || 'Ocurrió un error al enviar tu solicitud. Intenta de nuevo.')
    } finally {
      setSubmitting(false)
    }
  }

  if (submittedPartner) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-6 bg-ivory">
        <div className="w-full max-w-xl bg-white border border-beige/80 rounded-2xl p-8 sm:p-12 shadow-sm text-center">
          <div className="w-16 h-16 bg-champagne/20 text-brown rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <span className="font-display text-xs tracking-[0.3em] uppercase text-champagne block mb-2">
            Solicitud Recibida
          </span>
          <h1 className="font-display text-3xl sm:text-4xl text-brown font-light mb-4">
            ¡Bienvenido al Programa de Partners VÉLIA!
          </h1>
          <p className="font-body text-sm text-brown/70 leading-relaxed mb-6 max-w-md mx-auto">
            Hemos registrado la solicitud de <strong className="text-brown">{submittedPartner.businessName}</strong>. Tu código de referido asignado es <span className="font-mono bg-ivory px-2 py-0.5 rounded border border-beige font-semibold text-brown">{submittedPartner.referralCode}</span>.
          </p>
          <div className="p-4 rounded-xl bg-ivory/60 border border-beige/80 text-left text-xs font-body text-brown/70 space-y-2 mb-8">
            <div className="flex items-center justify-between">
              <span>Estado actual:</span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800 font-medium">
                Pendiente de Aprobación
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Enlace de referido:</span>
              <span className="font-mono text-brown font-medium">velia.mx/p/{submittedPartner.referralSlug}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Tasa de comisión inicial:</span>
              <span className="font-medium text-brown">{submittedPartner.commissionRate}% por evento</span>
            </div>
          </div>
          <p className="font-body text-xs text-brown/50 mb-8">
            Puedes acceder desde ahora a tu Panel de Partner para explorar las herramientas y preparar a tus clientes.
          </p>
          <button
            onClick={() => onNavigate('partner_dashboard')}
            className="w-full sm:w-auto bg-brown text-ivory font-body font-medium text-sm px-8 py-3.5 rounded-full hover:bg-ink transition-all duration-300 shadow-sm cursor-pointer"
          >
            Ir a mi Panel de Partner
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-28 pb-20 bg-ivory">
      <div className="max-w-4xl mx-auto px-6 lg:px-12">

        {/* Hero Header */}
        <div className="text-center mb-12">
          <span className="font-body text-[0.68rem] tracking-[0.38em] text-champagne uppercase font-medium block mb-2">
            Programa de Profesionales
          </span>
          <h1 className="font-display text-3xl sm:text-5xl text-brown font-light leading-tight mb-4">
            Diseña experiencias extraordinarias para tus clientes con VÉLIA Partners
          </h1>
          <p className="font-body text-sm sm:text-base text-brown/60 max-w-2xl mx-auto leading-relaxed">
            Ofrece invitaciones digitales premium dentro de tus paquetes de organización de eventos y genera comisiones exclusivas por cada proyecto.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid sm:grid-cols-3 gap-6 mb-12">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center text-brown mb-4 font-display font-medium text-base">
              40%-50%
            </div>
            <h3 className="font-display text-lg text-brown font-medium mb-1">
              Comisión por Evento
            </h3>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              Gana entre el 40% y el 50% de comisión directa por cada invitación contratada para tus eventos o mediante tu enlace.
            </p>
          </div>

          <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center text-brown mb-4 font-display font-medium text-lg">
              💼
            </div>
            <h3 className="font-display text-lg text-brown font-medium mb-1">
              Panel de Control
            </h3>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              Administra múltiples clientes, eventos e invitaciones desde un solo lugar centralizado.
            </p>
          </div>

          <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-champagne/15 flex items-center justify-center text-brown mb-4 font-display font-medium text-lg">
              ✨
            </div>
            <h3 className="font-display text-lg text-brown font-medium mb-1">
              Kit de Ventas & QR
            </h3>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              Recibe material promocional premium, enlaces con atribución y soporte personalizado.
            </p>
          </div>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-beige/80 rounded-2xl p-8 sm:p-12 shadow-sm">
          <div className="border-b border-beige/60 pb-6 mb-8">
            <h2 className="font-display text-2xl text-brown font-light">
              Registro de Solicitud de Partner
            </h2>
            <p className="font-body text-xs text-brown/50 mt-1">
              Ingresa los datos de tu negocio o agencia. La revisión toma menos de 24 horas.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose/15 border border-rose/30 text-brown text-xs font-body text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Personal Names */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Nombre *
                </label>
                <input
                  type="text"
                  required
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  placeholder="María"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Apellido *
                </label>
                <input
                  type="text"
                  required
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  placeholder="Fernández"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Business info */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Nombre comercial del Negocio *
                </label>
                <input
                  type="text"
                  required
                  value={businessName}
                  onChange={e => setBusinessName(e.target.value)}
                  placeholder="María Fernández Wedding Planner"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Tipo de Negocio *
                </label>
                <select
                  value={businessType}
                  onChange={e => setBusinessType(e.target.value as PartnerRole)}
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                >
                  {BUSINESS_TYPES.map(bt => (
                    <option key={bt.value} value={bt.value}>
                      {bt.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Contact info */}
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Correo electrónico *
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="contacto@mariaevents.com"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  placeholder="55 1234 5678"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  WhatsApp
                </label>
                <input
                  type="tel"
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  placeholder="55 1234 5678"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Location & Social */}
            <div className="grid sm:grid-cols-3 gap-5">
              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Ciudad / Ubicación *
                </label>
                <input
                  type="text"
                  required
                  value={city}
                  onChange={e => setCity(e.target.value)}
                  placeholder="Ciudad de México"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Instagram
                </label>
                <input
                  type="text"
                  value={instagram}
                  onChange={e => setInstagram(e.target.value)}
                  placeholder="@mariaweddings"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>

              <div>
                <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                  placeholder="https://mariaevents.com"
                  className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all"
                />
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block font-body text-[0.72rem] tracking-[0.12em] text-brown/70 uppercase mb-2">
                Cuéntanos brevemente sobre tu negocio y el promedio de eventos anuales
              </label>
              <textarea
                rows={3}
                value={description}
                onChange={e => setDescription(e.target.value)}
                placeholder="Somos una agencia enfocada en bodas destino, organizamos un promedio de 15 a 20 bodas al año..."
                className="w-full px-4 py-3 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Checkbox terms */}
            <div className="pt-2">
              <label className="flex items-start gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={acceptTerms}
                  onChange={e => setAcceptTerms(e.target.checked)}
                  className="mt-1 rounded border-beige text-champagne focus:ring-champagne accent-brown cursor-pointer"
                />
                <span className="font-body text-xs text-brown/70 leading-relaxed">
                  Acepto los términos y condiciones del programa VÉLIA Partners y confirmo que la información proporcionada es verídica.
                </span>
              </label>
            </div>

            {/* Submit CTA */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-beige/60">
              <button
                type="button"
                onClick={() => onNavigate('landing')}
                className="font-body text-xs text-brown/60 hover:text-brown transition-colors cursor-pointer"
              >
                Volver al inicio
              </button>

              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto bg-brown text-ivory font-body font-medium text-sm px-10 py-3.5 rounded-full hover:bg-ink transition-all duration-300 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {submitting ? 'Enviando solicitud...' : 'Enviar Solicitud de Partner'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
