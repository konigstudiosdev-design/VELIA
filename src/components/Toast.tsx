import React, { useEffect } from 'react'

export interface ToastMessage {
  id: string
  type: 'success' | 'error' | 'info'
  text: string
}

interface ToastProps {
  toasts: ToastMessage[]
  onDismiss: (id: string) => void
}

export default function ToastContainer({ toasts, onDismiss }: ToastProps) {
  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 max-w-sm w-full px-4 pointer-events-none select-none">
      {toasts.map(t => (
        <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  )
}

function ToastItem({ toast, onDismiss }: { toast: ToastMessage; onDismiss: (id: string) => void }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onDismiss(toast.id)
    }, 4000)
    return () => clearTimeout(timer)
  }, [toast.id, onDismiss])

  return (
    <div
      className={`pointer-events-auto flex items-center justify-between p-4 rounded-2xl shadow-xl border text-xs font-body animate-fade-up ${
        toast.type === 'success'
          ? 'bg-brown text-ivory border-champagne/40'
          : toast.type === 'error'
          ? 'bg-rose-900 text-white border-rose-700'
          : 'bg-white text-brown border-beige'
      }`}
    >
      <div className="flex items-center gap-2.5 truncate">
        <span className="text-base">
          {toast.type === 'success' ? '✓' : toast.type === 'error' ? '⚠️' : 'ℹ️'}
        </span>
        <span className="truncate">{toast.text}</span>
      </div>

      <button
        onClick={() => onDismiss(toast.id)}
        className="ml-3 text-white/50 hover:text-white text-xs cursor-pointer p-1"
        aria-label="Cerrar notificación"
      >
        ✕
      </button>
    </div>
  )
}
