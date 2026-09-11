import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function LodgingSection({ section, theme }: SectionProps) {
  const content = section.content || {}
  const hotels: any[] = content.hotels || [
    { name: 'Hotel Boutique Quinta Real', code: 'BODA-LUCIA-MATEO', discount: '15% Descuento', phone: '+52 55 1234 5678' },
    { name: 'Hotel Camino Real CDMX', code: 'VELIA2027', discount: 'Tarifa preferencial', phone: '+52 55 8765 4321' },
  ]

  return (
    <div className="py-20 px-6 max-w-3xl mx-auto text-center space-y-8">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Hospedaje Recomendado'}
      </span>

      <div className="grid sm:grid-cols-2 gap-4">
        {hotels.map((h, idx) => (
          <div key={idx} className="bg-white border border-beige/80 rounded-2xl p-6 text-left space-y-2">
            <span className="text-2xl block">🏨</span>
            <h4
              className="font-display text-lg text-brown font-light"
              style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
            >
              {h.name}
            </h4>
            {h.code && (
              <p className="font-body text-xs text-brown/70">
                Código de reserva: <span className="font-semibold text-champagne">{h.code}</span>
              </p>
            )}
            {h.discount && <p className="font-body text-xs text-emerald-700">{h.discount}</p>}
            {h.phone && <p className="font-body text-xs text-brown/50">Teléfono: {h.phone}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
