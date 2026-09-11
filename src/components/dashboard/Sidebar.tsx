import React from 'react'
import { DashboardTab, EventData } from '../../types'
import { useAuth } from '../../contexts/AuthContext'

interface SidebarProps {
  currentTab: DashboardTab
  onSelectTab: (tab: DashboardTab) => void
  eventData: EventData
  onGoToLanding: () => void
}

export default function Sidebar({
  currentTab,
  onSelectTab,
  eventData,
  onGoToLanding,
}: SidebarProps) {
  const { userProfile, user, logout } = useAuth()

  const title =
    eventData.person2Name
      ? `${eventData.person1Name} & ${eventData.person2Name}`
      : eventData.person1Name || 'Lucía & Mateo'

  const userName = userProfile?.name || user?.displayName || 'Usuario VÉLIA'
  const userEmail = userProfile?.email || user?.email || 'usuario@velia.mx'
  const initials = userName
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()

  const handleLogout = async () => {
    try {
      await logout()
      onGoToLanding()
    } catch (err) {
      console.error('Error al cerrar sesión:', err)
    }
  }

  const mainNavItems: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'inicio', label: 'Inicio', icon: '🏠' },
    { id: 'editor', label: 'Mi invitación', icon: '🎨' },
    { id: 'invitados', label: 'Invitados', icon: '👥' },
    { id: 'rsvp', label: 'RSVP', icon: '✍️' },
    { id: 'mesas', label: 'Mesas', icon: '🍽️' },
    { id: 'regalos', label: 'Regalos', icon: '🎁' },
    { id: 'galeria', label: 'Galería', icon: '🖼️' },
    { id: 'estadisticas', label: 'Estadísticas', icon: '📊' },
  ]

  const secondaryNavItems: { id: DashboardTab; label: string; icon: string }[] = [
    { id: 'configuracion', label: 'Configuración', icon: '⚙️' },
    { id: 'ayuda', label: 'Ayuda', icon: '❓' },
  ]

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-brown text-ivory border-r border-brown/20 h-screen sticky top-0 z-40 select-none">
      {/* Brand & Event Switcher */}
      <div className="p-6 border-b border-ivory/10">
        <button
          onClick={onGoToLanding}
          className="text-left block w-full group cursor-pointer"
        >
          <span className="font-display text-2xl tracking-[0.28em] text-ivory font-light group-hover:text-champagne transition-colors">
            VÉLIA
          </span>
        </button>

        <div className="mt-4 p-3 bg-white/5 border border-white/10 rounded-xl flex items-center justify-between">
          <div className="truncate">
            <span className="font-body text-[0.58rem] tracking-[0.2em] text-champagne/70 uppercase block">
              Evento actual
            </span>
            <span className="font-display text-sm font-light text-white truncate block">
              {title}
            </span>
          </div>
          <span className="w-2 h-2 rounded-full bg-emerald-400 flex-none" />
        </div>
      </div>

      {/* Main Navigation */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
        <div className="px-3 mb-2">
          <span className="font-body text-[0.6rem] tracking-[0.25em] text-white/30 uppercase">
            Gestión
          </span>
        </div>

        {mainNavItems.map(item => {
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-champagne text-brown font-semibold shadow-xs'
                  : 'text-ivory/65 hover:text-ivory hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}

        <div className="my-4 h-[0.5px] bg-ivory/10" />

        <div className="px-3 mb-2">
          <span className="font-body text-[0.6rem] tracking-[0.25em] text-white/30 uppercase">
            Ajustes
          </span>
        </div>

        {secondaryNavItems.map(item => {
          const isActive = currentTab === item.id
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl font-body text-xs font-medium transition-all duration-200 cursor-pointer ${
                isActive
                  ? 'bg-champagne text-brown font-semibold shadow-xs'
                  : 'text-ivory/65 hover:text-ivory hover:bg-white/5'
              }`}
            >
              <span className="text-sm">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          )
        })}
      </div>

      {/* User Footer */}
      <div className="p-4 border-t border-ivory/10 bg-black/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-champagne text-brown font-display text-xs flex items-center justify-center font-bold">
            {initials}
          </div>
          <div className="truncate flex-1">
            <p className="font-body text-xs font-medium text-white truncate">
              {userName}
            </p>
            <p className="font-body text-[0.65rem] text-white/40 truncate">
              {userEmail}
            </p>
          </div>
          <button
            onClick={handleLogout}
            title="Cerrar sesión"
            className="text-white/40 hover:text-white p-1 text-xs cursor-pointer"
          >
            🚪
          </button>
        </div>
      </div>
    </aside>
  )
}
