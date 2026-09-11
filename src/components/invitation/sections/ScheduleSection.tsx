import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function ScheduleSection({ section, theme }: SectionProps) {
  const content = section.content || {}
  const items: any[] = content.items || [
    { time: '16:00 HRS', title: 'Misa de Acción de Gracias', desc: 'Parroquia de San José' },
    { time: '18:00 HRS', title: 'Cóctel de Bienvenida', desc: 'Jardín Principal de la Hacienda' },
    { time: '19:30 HRS', title: 'Cena & Brindis', desc: 'Gran Salón' },
    { time: '21:00 HRS', title: 'Apertura de Pista', desc: 'Música en vivo y baile' },
  ]

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-10">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Itinerario'}
      </span>

      <div className="space-y-6 relative before:absolute before:inset-y-0 before:left-1/2 before:-translate-x-1/2 before:w-[0.5px] before:bg-beige/80">
        {items.map((item, idx) => (
          <div key={idx} className="relative z-10 bg-ivory border border-beige/80 rounded-xl p-5 shadow-xs max-w-md mx-auto">
            <span className="font-body text-xs font-semibold tracking-widest text-champagne uppercase block mb-1">
              {item.time}
            </span>
            <h4
              className="font-display text-lg text-brown font-light"
              style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
            >
              {item.title}
            </h4>
            {item.desc && <p className="font-body text-xs text-brown/50 mt-0.5">{item.desc}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
