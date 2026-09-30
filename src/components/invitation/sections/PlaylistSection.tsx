import React from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function PlaylistSection({ section, theme }: SectionProps) {
  const content = section.content || {}

  return (
    <div className="py-10 sm:py-16 px-4 sm:px-6 max-w-xl mx-auto text-center space-y-3 sm:space-y-4 bg-ivory border border-beige rounded-2xl sm:rounded-3xl my-6 sm:my-8 shadow-xs">
      <span className="text-2xl sm:text-3xl block">🎵</span>
      <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Música & Playlist'}
      </span>
      <h3
        className="font-display text-xl sm:text-2xl text-brown font-light"
        style={{ fontFamily: theme?.headingFont || 'Cormorant Garamond' }}
      >
        Sugiérenos tu canción favorita
      </h3>
      <p className="font-body text-xs text-brown/60 leading-relaxed max-w-md mx-auto">
        {content.subtitle || 'Queremos que la pista de baile no pare. Sugiere las canciones que te harán bailar.'}
      </p>
      {content.spotifyUrl && (
        <a
          href={content.spotifyUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 font-body text-xs font-medium bg-emerald-600 text-white px-6 py-2.5 rounded-full hover:bg-emerald-700 transition-colors mt-2"
        >
          <span>Abrir en Spotify</span> ↗
        </a>
      )}
    </div>
  )
}
