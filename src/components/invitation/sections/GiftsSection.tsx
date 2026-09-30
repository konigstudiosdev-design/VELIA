import React, { useState } from 'react'
import { InvitationSection, EventData, InvitationTheme } from '../../../types'
import { getEventTypeConfig } from '../../../config/eventTypeConfig'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
  theme?: InvitationTheme
}

export default function GiftsSection({ section, eventData, theme }: SectionProps) {
  const content = section.content || {}
  const config = getEventTypeConfig(eventData?.eventType)
  const [copied, setCopied] = useState(false)

  const title = content.title || config.fieldLabels.giftsTitle
  const subtitle = content.subtitle || config.fieldLabels.giftsSubtitle

  const isCouple = config.allowedFields.person2Name
  const beneficiaryName = content.beneficiary || (isCouple && eventData?.person2Name ? `${eventData.person1Name} & ${eventData.person2Name}` : eventData?.person1Name) || `Festejado(a)`

  const handleCopyClabe = () => {
    if (content.clabe) {
      navigator.clipboard.writeText(content.clabe).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="py-12 sm:py-20 px-4 sm:px-6 max-w-2xl mx-auto text-center space-y-6 sm:space-y-8">
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {title}
      </span>

      <p className="font-body text-xs text-brown/70 max-w-lg mx-auto leading-relaxed">
        {subtitle}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Bank transfer */}
        {content.clabe && (
          <div className="bg-white border border-beige/80 rounded-2xl p-5 sm:p-6 text-left space-y-2 shadow-xs">
            <span className="text-xl block">💳</span>
            <span className="font-body text-[0.6rem] tracking-wider text-brown/50 uppercase block">Transferencia Bancaria</span>
            <p className="font-body text-xs font-semibold text-brown">{content.bank || 'BBVA Bancomer'}</p>
            <p className="font-body text-xs text-brown/60 truncate">Beneficiario: {beneficiaryName}</p>
            <p className="font-body text-xs font-mono bg-ivory p-2 rounded border border-beige/60 truncate select-all">
              CLABE: {content.clabe}
            </p>
            <button
              onClick={handleCopyClabe}
              className="font-body text-[0.68rem] text-champagne font-medium hover:underline cursor-pointer"
            >
              {copied ? '¡CLABE Copiada!' : 'Copiar CLABE'}
            </button>
          </div>
        )}

        {/* Wishlist Link */}
        {content.wishlistUrl && (
          <div className="bg-white border border-beige/80 rounded-2xl p-5 sm:p-6 text-left space-y-3 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-xl block">🎁</span>
              <span className="font-body text-[0.6rem] tracking-wider text-brown/50 uppercase block">Mesa de Regalos Digital</span>
              <p className="font-body text-xs font-semibold text-brown mt-1">Lista de Deseos Liverpool / Sears</p>
            </div>
            <a
              href={content.wishlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center font-body text-xs font-medium bg-champagne text-brown py-2.5 px-4 rounded-full hover:bg-[#d4b990] transition-colors mt-2"
            >
              Ver Mesa de Regalos ↗
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
