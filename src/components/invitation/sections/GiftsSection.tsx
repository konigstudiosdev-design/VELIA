import React, { useState } from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function GiftsSection({ section, theme }: SectionProps) {
  const content = section.content || {}
  const [copied, setCopied] = useState(false)

  const handleCopyClabe = () => {
    if (content.clabe) {
      navigator.clipboard.writeText(content.clabe).catch(() => {})
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-8">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Mesa de Regalos'}
      </span>

      <p className="font-body text-xs text-brown/70 max-w-lg mx-auto leading-relaxed">
        {content.subtitle || 'Tu presencia es nuestro mejor regalo. Si deseas realizarnos un obsequio, ponemos a tu disposición:'}
      </p>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* Bank transfer */}
        {content.clabe && (
          <div className="bg-white border border-beige/80 rounded-2xl p-6 text-left space-y-2">
            <span className="text-xl block">💳</span>
            <span className="font-body text-[0.65rem] tracking-wider text-brown/50 uppercase block">Transferencia Bancaria</span>
            <p className="font-body text-xs font-semibold text-brown">{content.bank || 'BBVA Bancomer'}</p>
            <p className="font-body text-xs text-brown/60 truncate">Beneficiario: {content.beneficiary || 'Lucía & Mateo'}</p>
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
          <div className="bg-white border border-beige/80 rounded-2xl p-6 text-left space-y-3 flex flex-col justify-between">
            <div>
              <span className="text-xl block">🎁</span>
              <span className="font-body text-[0.65rem] tracking-wider text-brown/50 uppercase block">Mesa de Regalos Digital</span>
              <p className="font-body text-xs font-semibold text-brown mt-1">Lista de Deseos Liverpool / Sears</p>
            </div>
            <a
              href={content.wishlistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-center font-body text-xs font-medium bg-champagne text-brown py-2 px-4 rounded-full hover:bg-[#d4b990] transition-colors"
            >
              Ver Mesa de Regalos ↗
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
