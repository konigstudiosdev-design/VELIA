import React from 'react'

export default function HelpTab() {
  const faqs = [
    {
      q: '¿Cómo comparto mi invitación por WhatsApp?',
      a: 'Ve al inicio de tu panel de control o haz clic en "Publicar" y usa el botón directo "Compartir por WhatsApp". Se generará un mensaje personalizado con tu enlace.',
    },
    {
      q: '¿Mis invitados necesitan crear cuenta para confirmar su asistencia?',
      a: 'No, tus invitados sólo deben ingresar a tu enlace y completar el sencillo formulario RSVP en menos de 10 segundos.',
    },
    {
      q: '¿Puedo cambiar la plantilla de mi invitación después de publicarla?',
      a: 'Sí, puedes cambiar de plantilla o editar cualquier texto y fotografía en cualquier momento desde el Editor de Invitación.',
    },
  ]

  return (
    <div className="space-y-8 max-w-4xl mx-auto pb-12">
      <div>
        <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
          Soporte VÉLIA
        </span>
        <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
          Centro de Ayuda
        </h1>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-beige/80 rounded-2xl p-6 shadow-xs space-y-2">
            <h3 className="font-display text-xl text-brown font-light">
              {faq.q}
            </h3>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              {faq.a}
            </p>
          </div>
        ))}
      </div>

      <div className="bg-brown text-ivory rounded-2xl p-6 text-center space-y-3">
        <h3 className="font-display text-2xl font-light">¿Necesitas ayuda personalizada?</h3>
        <p className="font-body text-xs text-white/60">
          Nuestro equipo de concierge de eventos está disponible por WhatsApp.
        </p>
        <button
          onClick={() => alert('Conectando con Concierge VÉLIA...')}
          className="bg-champagne text-brown font-body font-medium text-xs px-6 py-2.5 rounded-full cursor-pointer"
        >
          Contactar Concierge
        </button>
      </div>
    </div>
  )
}
