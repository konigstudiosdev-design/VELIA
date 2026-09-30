import React, { useState } from 'react'
import { DashboardTab, EventData } from '../../types'

interface MobileNavProps {
  currentTab: DashboardTab
  onSelectTab: (tab: DashboardTab) => void
  eventData: EventData
  onGoToLanding: () => void
}

export default function MobileNav({
  currentTab,
  onSelectTab,
  eventData,
  onGoToLanding,
}: MobileNavProps) {
  const [drawerOpen, setDrawerOpen] = useState(false)

  const handleSelect = (tab: DashboardTab) => {
    onSelectTab(tab)
    setDrawerOpen(false)
  }

  const allTabs: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'editor', label: 'Mi invitación', icon: '🎨' },
    { id: 'invitados', label: 'Invitados', icon: '👥' },
    { id: 'rsvp', label: 'RSVP', icon: '✍️' },
    { id: 'mesas', label: 'Mesas', icon: '🍽️' },
    { id: 'regalos', label: 'Regalos', icon: '🎁' },
    { id: 'galeria', label: 'Galería', icon: '🖼️' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
    { id: 'ayuda', label: 'Ayuda', icon: '❓' },
  ]

  return (
    <>
      {/* Mobile Top Header */}
      <div className="lg:hidden fixed top-0 inset-x-0 z-40 bg-brown text-ivory px-4 h-16 flex items-center justify-between border-b border-white/10 shadow-sm">
        <button
          onClick={() => onSelectTab('inicio')}
          className="font-display text-xl tracking-[0.25em] text-ivory font-light cursor-pointer"
        >
          VÉLIA
        </button>

        <div className="flex items-center gap-3">
          <span className="font-body text-xs text-champagne bg-white/10 px-2.5 py-1 rounded-full truncate max-w-[140px]">
            {eventData.person1Name || 'Mi Evento'}{eventData.person2Name ? ` & ${eventData.person2Name}` : ''}
          </span>

          <button
            onClick={() => setDrawerOpen(!drawerOpen)}
            className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-sm"
          >
            ☰
          </button>
        </div>
      </div>

      {/* Drawer Overlay & Content */}
      {drawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-brown w-72 h-full p-6 text-ivory flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                <span className="font-display text-2xl tracking-[0.25em] text-ivory">
                  VÉLIA
                </span>
                <button
                  onClick={() => setDrawerOpen(false)}
                  className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center text-xs"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-1">
                {allTabs.map(t => (
                  <button
                    key={t.id}
                    onClick={() => handleSelect(t.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-body text-xs text-left cursor-pointer ${
                      currentTab === t.id
                        ? 'bg-champagne text-brown font-semibold'
                        : 'text-ivory/70 hover:bg-white/5'
                    }`}
                  >
                    <span>{t.icon}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-white/10">
              <button
                onClick={onGoToLanding}
                className="w-full bg-white/10 hover:bg-white/20 text-ivory font-body text-xs py-2.5 rounded-full text-center"
              >
                Cerrar Sesión / Ir al Inicio
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-brown text-ivory border-t border-white/10 px-2 py-2 flex items-center justify-around select-none">
        <button
          onClick={() => onSelectTab('inicio')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[0.65rem] font-body ${
            currentTab === 'inicio' ? 'text-champagne font-bold' : 'text-ivory/60'
          }`}
        >
          <span className="text-base">🏠</span>
          <span>Inicio</span>
        </button>

        <button
          onClick={() => onSelectTab('editor')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[0.65rem] font-body ${
            currentTab === 'editor' ? 'text-champagne font-bold' : 'text-ivory/60'
          }`}
        >
          <span className="text-base">🎨</span>
          <span>Invitación</span>
        </button>

        <button
          onClick={() => onSelectTab('invitados')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[0.65rem] font-body ${
            currentTab === 'invitados' ? 'text-champagne font-bold' : 'text-ivory/60'
          }`}
        >
          <span className="text-base">👥</span>
          <span>Invitados</span>
        </button>

        <button
          onClick={() => onSelectTab('rsvp')}
          className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[0.65rem] font-body ${
            currentTab === 'rsvp' ? 'text-champagne font-bold' : 'text-ivory/60'
          }`}
        >
          <span className="text-base">✍️</span>
          <span>RSVP</span>
        </button>

        <button
          onClick={() => setDrawerOpen(true)}
          className="flex flex-col items-center gap-0.5 py-1 px-3 rounded-lg text-[0.65rem] font-body text-ivory/60"
        >
          <span className="text-base">☰</span>
          <span>Más</span>
        </button>
      </div>
    </>
  )
}
