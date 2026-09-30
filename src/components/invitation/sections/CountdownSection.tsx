import React, { useState, useEffect } from 'react'
import { InvitationSection, EventData } from '../../../types'

interface SectionProps {
  section: InvitationSection
  eventData?: EventData
}

export default function CountdownSection({ section, eventData }: SectionProps) {
  const content = section.content || {}
  const targetDateStr = content.targetDate || eventData?.date || '2027-09-18T16:00:00'

  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isFinished, setIsFinished] = useState(false)

  useEffect(() => {
    const calculateTimeLeft = () => {
      const target = new Date(targetDateStr).getTime()
      const now = new Date().getTime()
      const diff = target - now

      if (diff > 0) {
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / 1000 / 60) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        })
        setIsFinished(false)
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 })
        setIsFinished(true)
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)
    return () => clearInterval(timer)
  }, [targetDateStr])

  return (
    <div className="py-12 sm:py-16 px-4 sm:px-6 bg-brown text-ivory text-center select-none">
      <div className="max-w-2xl mx-auto space-y-6 sm:space-y-8">
        <span className="font-body text-[0.6rem] sm:text-[0.65rem] tracking-[0.25em] sm:tracking-[0.35em] text-champagne/80 uppercase block">
          {content.title || 'Cuenta Regresiva'}
        </span>

        {isFinished ? (
          <div className="p-6 sm:p-8 bg-white/5 border border-white/10 rounded-2xl max-w-md mx-auto space-y-2">
            <span className="text-3xl block">🎉</span>
            <h3 className="font-display text-2xl sm:text-3xl text-white font-light">¡Hoy es el gran día!</h3>
            <p className="font-body text-xs text-champagne/80">Gracias por acompañarnos en esta celebración inolvidable.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-6">
            {[
              { label: 'Días', val: timeLeft.days },
              { label: 'Horas', val: timeLeft.hours },
              { label: 'Minutos', val: timeLeft.minutes },
              { label: 'Segundos', val: timeLeft.seconds },
            ].map(item => (
              <div key={item.label} className="bg-white/5 border border-white/10 rounded-2xl p-3 sm:p-6 backdrop-blur-xs flex flex-col items-center justify-center">
                <span className="font-display text-2xl sm:text-5xl text-white font-light block leading-none">
                  {String(item.val).padStart(2, '0')}
                </span>
                <span className="font-body text-[0.55rem] sm:text-[0.6rem] tracking-[0.12em] sm:tracking-[0.2em] text-champagne/70 uppercase mt-1.5 sm:mt-2 block truncate w-full text-center">
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
