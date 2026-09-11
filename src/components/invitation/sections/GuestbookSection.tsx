import React, { useState } from 'react'
import { InvitationSection, InvitationTheme } from '../../../types'

interface SectionProps {
  section: InvitationSection
  theme?: InvitationTheme
}

export default function GuestbookSection({ section, theme }: SectionProps) {
  const content = section.content || {}
  const [messages, setMessages] = useState([
    { id: '1', name: 'Familia González', text: '¡Muchas felicidades! Que Dios bendiga su matrimonio siempre.' },
    { id: '2', name: 'Carlos y Sofía', text: 'Estamos muy emocionados de acompañarlos en su gran día. ¡Un fuerte abrazo!' },
  ])
  const [author, setAuthor] = useState('')
  const [msgText, setMsgText] = useState('')

  const handleAddMessage = (e: React.FormEvent) => {
    e.preventDefault()
    if (!author || !msgText) return
    setMessages(prev => [{ id: `msg_${Date.now()}`, name: author, text: msgText }, ...prev])
    setAuthor('')
    setMsgText('')
  }

  return (
    <div className="py-20 px-6 max-w-2xl mx-auto text-center space-y-8">
      <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block">
        {content.title || 'Libro de Firmas'}
      </span>

      <p className="font-body text-xs text-brown/60">
        {content.subtitle || 'Déjanos un mensaje con tus buenos deseos para esta nueva etapa.'}
      </p>

      {/* Message Form */}
      <form onSubmit={handleAddMessage} className="bg-white border border-beige rounded-2xl p-6 text-left space-y-3 shadow-xs">
        <div>
          <label className="block font-body text-[0.65rem] uppercase tracking-wider text-brown/60 mb-1">Tu Nombre</label>
          <input
            type="text"
            required
            value={author}
            onChange={e => setAuthor(e.target.value)}
            placeholder="Ej. María y Fernando"
            className="w-full px-3.5 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
          />
        </div>
        <div>
          <label className="block font-body text-[0.65rem] uppercase tracking-wider text-brown/60 mb-1">Tu Mensaje</label>
          <textarea
            required
            rows={3}
            value={msgText}
            onChange={e => setMsgText(e.target.value)}
            placeholder="Escribe tus buenos deseos..."
            className="w-full px-3.5 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-brown text-ivory font-body text-xs font-medium py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer"
        >
          Publicar Mensaje
        </button>
      </form>

      {/* Messages List */}
      <div className="space-y-3 text-left">
        {messages.map(m => (
          <div key={m.id} className="bg-ivory border border-beige/60 rounded-xl p-4 space-y-1">
            <p className="font-body text-xs font-semibold text-brown">{m.name}</p>
            <p className="font-body text-xs text-brown/70 italic">"{m.text}"</p>
          </div>
        ))}
      </div>
    </div>
  )
}
