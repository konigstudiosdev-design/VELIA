import React from 'react'
import { InvitationSection } from '../../../types'

interface SectionProps {
  section: InvitationSection
}

export default function GallerySection({ section }: SectionProps) {
  const content = section.content || {}
  const images: string[] = content.images || [
    'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=800&fit=crop&auto=format',
    'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop&auto=format',
  ]

  return (
    <div className="py-20 px-6 max-w-5xl mx-auto text-center space-y-8">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Galería de Fotos'}
      </span>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {images.map((imgUrl, idx) => (
          <div key={idx} className="relative overflow-hidden rounded-2xl bg-beige group aspect-3/4">
            <img
              src={imgUrl}
              alt={`Galería ${idx + 1}`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        ))}
      </div>
    </div>
  )
}
