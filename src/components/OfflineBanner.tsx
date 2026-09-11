import React, { useEffect, useState } from 'react'

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false)

  useEffect(() => {
    const handleOffline = () => setIsOffline(true)
    const handleOnline = () => setIsOffline(false)

    window.addEventListener('offline', handleOffline)
    window.addEventListener('online', handleOnline)

    // Initial check
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOffline(true)
    }

    return () => {
      window.removeEventListener('offline', handleOffline)
      window.removeEventListener('online', handleOnline)
    }
  }, [])

  if (!isOffline) return null

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-amber-600 text-white font-body text-xs text-center py-2 px-4 shadow-md flex items-center justify-center gap-2">
      <span className="text-base">📡</span>
      <span>Sin conexión a internet. Algunas funciones pueden estar limitadas hasta recuperar señal.</span>
    </div>
  )
}
