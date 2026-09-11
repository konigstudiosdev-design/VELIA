import React from 'react'
import { BillingStatus } from '../../types'

interface PaymentStatusProps {
  status: BillingStatus
  onClose: () => void
}

export default function PaymentStatus({ status, onClose }: PaymentStatusProps) {
  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-beige text-center relative animate-fade-up space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
        >
          ✕
        </button>

        {status === 'paid' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center text-3xl mx-auto">
              ✓
            </div>
            <div>
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
                ¡Enhorabuena!
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
                ¡Pago Confirmado!
              </h3>
              <p className="font-body text-xs text-brown/60 mt-2 leading-relaxed">
                Tu plan comercial está activo y todas las capacidades han sido desbloqueadas para tu evento.
              </p>
            </div>
          </>
        ) : status === 'pending' ? (
          <>
            <div className="w-16 h-16 rounded-full bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center text-3xl mx-auto animate-pulse">
              ⏳
            </div>
            <div>
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
                Verificando Transacción
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
                Confirmando Pago...
              </h3>
              <p className="font-body text-xs text-brown/60 mt-2 leading-relaxed">
                Estamos procesando la respuesta con Stripe. En unos segundos tu plan se actualizará automáticamente.
              </p>
            </div>
          </>
        ) : (
          <>
            <div className="w-16 h-16 rounded-full bg-rose-50 border border-rose-200 text-rose-600 flex items-center justify-center text-3xl mx-auto">
              ⚠️
            </div>
            <div>
              <span className="font-body text-[0.62rem] tracking-[0.25em] text-rose-700 uppercase block mb-1">
                Aviso de Pago
              </span>
              <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
                {status === 'canceled' ? 'Pago Cancelado' : 'No se pudo completar el pago'}
              </h3>
              <p className="font-body text-xs text-brown/60 mt-2 leading-relaxed">
                {status === 'canceled'
                  ? 'Haz cancelado el proceso de pago. Tu evento continúa en su estado anterior.'
                  : 'Ocurrió un inconveniente al procesar tu tarjeta. Intenta nuevamente por favor.'}
              </p>
            </div>
          </>
        )}

        <button
          onClick={onClose}
          className="w-full bg-brown text-ivory font-body font-medium text-xs py-3 rounded-full hover:bg-ink transition-colors cursor-pointer"
        >
          Volver a mi Panel
        </button>
      </div>
    </div>
  )
}
