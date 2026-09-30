import React, { useState, useRef, useEffect } from 'react'

interface CustomDatePickerProps {
  value: string // Format: YYYY-MM-DD
  onChange: (value: string) => void
  label?: string
  required?: boolean
}

const MONTH_NAMES_ES = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
]

const DAYS_SHORT_ES = ['Do', 'Lu', 'Ma', 'Mi', 'Ju', 'Vi', 'Sá']

/**
 * Formats YYYY-MM-DD to a human-readable Spanish string
 * e.g. "2026-10-05" -> "Sábado, 5 de Octubre de 2026"
 */
export function formatSpanishDate(dateStr: string): string {
  if (!dateStr || !dateStr.includes('-')) return ''
  const parts = dateStr.split('-')
  if (parts.length !== 3) return dateStr

  const year = parseInt(parts[0], 10)
  const month = parseInt(parts[1], 10) - 1
  const day = parseInt(parts[2], 10)

  const d = new Date(year, month, day)
  if (isNaN(d.getTime())) return dateStr

  const dayName = d.toLocaleDateString('es-MX', { weekday: 'long' })
  const capitalizedDay = dayName.charAt(0).toUpperCase() + dayName.slice(1)
  const monthName = MONTH_NAMES_ES[month] || ''

  return `${capitalizedDay}, ${day} de ${monthName} de ${year}`
}

export default function CustomDatePicker({
  value,
  onChange,
  label = 'Fecha del evento',
  required = false,
}: CustomDatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false)
  const popoverRef = useRef<HTMLDivElement>(null)

  // Default to today if empty
  const today = new Date()
  const defaultYear = today.getFullYear()
  const defaultMonth = today.getMonth() + 1
  const defaultDay = today.getDate()

  // Parse YYYY-MM-DD
  let currentYear = defaultYear
  let currentMonth = defaultMonth
  let currentDay = defaultDay

  if (value && value.includes('-')) {
    const p = value.split('-')
    if (p.length === 3) {
      currentYear = parseInt(p[0], 10) || defaultYear
      currentMonth = parseInt(p[1], 10) || defaultMonth
      currentDay = parseInt(p[2], 10) || defaultDay
    }
  }

  const [viewYear, setViewYear] = useState(currentYear)
  const [viewMonth, setViewMonth] = useState(currentMonth - 1)

  useEffect(() => {
    if (value && value.includes('-')) {
      const p = value.split('-')
      if (p.length === 3) {
        setViewYear(parseInt(p[0], 10) || defaultYear)
        setViewMonth((parseInt(p[1], 10) || defaultMonth) - 1)
      }
    }
  }, [value])

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target as Node)) {
        setShowCalendar(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const updateDate = (y: number, m: number, d: number) => {
    const formattedY = y.toString().padStart(4, '0')
    const formattedM = m.toString().padStart(2, '0')
    const formattedD = d.toString().padStart(2, '0')
    onChange(`${formattedY}-${formattedM}-${formattedD}`)
  }

  const handleDayChange = (newDay: number) => {
    const maxDays = new Date(currentYear, currentMonth, 0).getDate()
    const validDay = Math.min(newDay, maxDays)
    updateDate(currentYear, currentMonth, validDay)
  }

  const handleMonthChange = (newMonth: number) => {
    const maxDays = new Date(currentYear, newMonth, 0).getDate()
    const validDay = Math.min(currentDay, maxDays)
    updateDate(currentYear, newMonth, validDay)
  }

  const handleYearChange = (newYear: number) => {
    const maxDays = new Date(newYear, currentMonth, 0).getDate()
    const validDay = Math.min(currentDay, maxDays)
    updateDate(newYear, currentMonth, validDay)
  }

  // Days grid calculation
  const firstDayOfMonth = new Date(viewYear, viewMonth, 1).getDay()
  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate()

  const daysGrid = []
  for (let i = 0; i < firstDayOfMonth; i++) daysGrid.push(null)
  for (let d = 1; d <= daysInMonth; d++) daysGrid.push(d)

  const yearOptions = Array.from({ length: 15 }, (_, i) => today.getFullYear() - 1 + i)
  const dayOptions = Array.from({ length: 31 }, (_, i) => i + 1)

  const formattedLabel = value ? formatSpanishDate(value) : ''

  return (
    <div ref={popoverRef} className="space-y-1.5 select-none relative">
      {label && (
        <label className="block font-body text-[0.7rem] tracking-[0.12em] text-brown/65 uppercase">
          {label} {required && <span className="text-rose-700">*</span>}
        </label>
      )}

      {/* Synchronized 3-Segment Selector + Calendar Toggle Button */}
      <div className="grid grid-cols-[1fr_1.4fr_1fr_auto] gap-2 items-center">
        {/* Day Dropdown */}
        <div className="relative">
          <select
            value={currentDay}
            onChange={e => handleDayChange(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-ivory/60 border border-beige/80 rounded-xl text-brown font-body text-xs font-medium focus:outline-none focus:border-champagne focus:bg-white cursor-pointer"
          >
            {dayOptions.map(d => (
              <option key={d} value={d}>
                Día {d}
              </option>
            ))}
          </select>
        </div>

        {/* Month Dropdown */}
        <div className="relative">
          <select
            value={currentMonth}
            onChange={e => handleMonthChange(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-ivory/60 border border-beige/80 rounded-xl text-brown font-body text-xs font-medium focus:outline-none focus:border-champagne focus:bg-white cursor-pointer"
          >
            {MONTH_NAMES_ES.map((m, idx) => (
              <option key={m} value={idx + 1}>
                {m}
              </option>
            ))}
          </select>
        </div>

        {/* Year Dropdown */}
        <div className="relative">
          <select
            value={currentYear}
            onChange={e => handleYearChange(Number(e.target.value))}
            className="w-full px-3 py-2.5 bg-ivory/60 border border-beige/80 rounded-xl text-brown font-body text-xs font-medium focus:outline-none focus:border-champagne focus:bg-white cursor-pointer"
          >
            {yearOptions.map(y => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>

        {/* Toggle Visual Calendar Button */}
        <button
          type="button"
          onClick={() => setShowCalendar(!showCalendar)}
          className={`px-3 py-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-center ${
            showCalendar
              ? 'bg-brown text-ivory border-brown shadow-xs'
              : 'bg-ivory/60 border-beige/80 text-brown hover:border-champagne hover:bg-white'
          }`}
          title="Abrir calendario visual"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </button>
      </div>

      {/* Formatted Date Banner Display */}
      {formattedLabel && (
        <p className="font-display text-xs text-champagne font-medium tracking-wide pt-0.5">
          ✨ {formattedLabel}
        </p>
      )}

      {/* Visual Calendar Popover */}
      {showCalendar && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-beige/80 rounded-2xl p-4 shadow-xl animate-fade-up max-w-xs mx-auto">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-beige/60">
            <button
              type="button"
              onClick={() => {
                if (viewMonth === 0) {
                  setViewMonth(11)
                  setViewYear(prev => prev - 1)
                } else {
                  setViewMonth(prev => prev - 1)
                }
              }}
              className="w-7 h-7 rounded-full bg-ivory border border-beige/60 text-brown hover:bg-beige/50 flex items-center justify-center text-xs cursor-pointer"
            >
              ‹
            </button>

            <span className="font-display text-sm text-brown font-medium uppercase tracking-wider">
              {MONTH_NAMES_ES[viewMonth]} {viewYear}
            </span>

            <button
              type="button"
              onClick={() => {
                if (viewMonth === 11) {
                  setViewMonth(0)
                  setViewYear(prev => prev + 1)
                } else {
                  setViewMonth(prev => prev + 1)
                }
              }}
              className="w-7 h-7 rounded-full bg-ivory border border-beige/60 text-brown hover:bg-beige/50 flex items-center justify-center text-xs cursor-pointer"
            >
              ›
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center mb-1">
            {DAYS_SHORT_ES.map(d => (
              <span key={d} className="font-body text-[0.6rem] text-brown/40 uppercase font-medium">
                {d}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {daysGrid.map((d, idx) => {
              if (d === null) return <div key={`empty_${idx}`} className="h-7" />

              const isSelected =
                currentYear === viewYear &&
                currentMonth === viewMonth + 1 &&
                currentDay === d

              return (
                <button
                  key={`day_${d}`}
                  type="button"
                  onClick={() => {
                    updateDate(viewYear, viewMonth + 1, d)
                    setShowCalendar(false)
                  }}
                  className={`h-7 w-7 rounded-full flex items-center justify-center font-body text-xs mx-auto cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-brown text-ivory font-semibold shadow-xs'
                      : 'text-brown hover:bg-champagne/20'
                  }`}
                >
                  {d}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
