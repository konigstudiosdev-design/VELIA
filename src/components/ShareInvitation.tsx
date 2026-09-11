import React, { useState } from 'react'
import { buildWhatsAppShareUrl, cleanSlug } from '../services/eventService'

interface ShareInvitationProps {
  customSlug: string
  guestName?: string
  token?: string
  phone?: string
  onClose?: () => void
}

export default function ShareInvitation({
  customSlug,
  guestName,
  token,
  phone,
  onClose,
}: ShareInvitationProps) {
  const [copied, setCopied] = useState(false)

  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://velia.mx'
  const shareUrl = token
    ? `${origin}/e/${cleanSlug(customSlug)}?token=${token}`
    : `${origin}/e/${cleanSlug(customSlug)}`

  const waUrl = buildWhatsAppShareUrl(customSlug, guestName, token, phone)

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl).catch(() => {})
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-beige text-center relative animate-fade-up space-y-6">
        {onClose && (
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
          >
            ✕
          </button>
        )}

        <div className="w-14 h-14 rounded-full bg-champagne/20 border border-champagne/40 text-brown flex items-center justify-center text-2xl mx-auto">
          💌
        </div>

        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
            Compartir Invitación
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
            {guestName ? `Pase para ${guestName}` : 'Enlace General del Evento'}
          </h3>
          <p className="font-body text-xs text-brown/55 mt-1">
            {token
              ? 'Este enlace contiene el token seguro personalizado para este invitado.'
              : 'Comparte este enlace para que tus invitados consulten los detalles del evento.'}
          </p>
        </div>

        {/* URL Box */}
        <div className="bg-ivory border border-beige/80 rounded-2xl p-3.5 flex items-center justify-between gap-3">
          <span className="font-body text-xs font-medium text-brown truncate select-all">
            {shareUrl}
          </span>
          <button
            onClick={handleCopy}
            className={`font-body text-xs font-medium px-4 py-2 rounded-xl transition-all flex-none cursor-pointer ${
              copied
                ? 'bg-emerald-600 text-white'
                : 'bg-brown text-ivory hover:bg-ink'
            }`}
          >
            {copied ? '¡Copiado!' : 'Copiar'}
          </button>
        </div>

        {/* Share Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <a
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-body text-xs font-medium px-6 py-3 rounded-full flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <span>Compartir por WhatsApp</span>
          </a>

          <a
            href={shareUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto border border-brown/30 hover:border-brown text-brown font-body text-xs font-medium px-6 py-3 rounded-full transition-colors cursor-pointer"
          >
            Abrir enlace
          </a>
        </div>
      </div>
    </div>
  )
}
