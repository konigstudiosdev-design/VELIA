import React, { useState } from 'react'
import { EventData, GuestItem } from '../../types'
import { buildWhatsAppShareUrl } from '../../services/eventService'
import { canAddGuest } from '../../services/entitlementService'
import UpgradeModal from '../billing/UpgradeModal'

interface GuestsTabProps {
  guests: GuestItem[]
  eventData?: EventData
  customSlug?: string
  onSaveGuest?: (guest: GuestItem) => void
  onDeleteGuest?: (guestId: string) => void
  onUpdateGuests?: (guests: GuestItem[]) => void
}

export default function GuestsTab({
  guests,
  eventData,
  customSlug = 'lucia-y-mateo',
  onSaveGuest,
  onDeleteGuest,
  onUpdateGuests,
}: GuestsTabProps) {
  const [search, setSearch] = useState('')
  const [filterRsvp, setFilterRsvp] = useState<'Todos' | 'Confirmado' | 'Pendiente' | 'Rechazado'>('Todos')
  const [filterGroup, setFilterGroup] = useState<string>('Todos')

  // Modals
  const [showAddModal, setShowAddModal] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [editingGuest, setEditingGuest] = useState<GuestItem | null>(null)
  const [copiedTokenId, setCopiedTokenId] = useState<string | null>(null)

  // Form states
  const [formName, setFormName] = useState('')
  const [formPhone, setFormPhone] = useState('')
  const [formEmail, setFormEmail] = useState('')
  const [formGroup, setFormGroup] = useState('Familia')
  const [formPasses, setFormPasses] = useState(2)
  const [formRsvp, setFormRsvp] = useState<'Confirmado' | 'Pendiente' | 'Rechazado'>('Pendiente')
  const [formTable, setFormTable] = useState('Mesa 1')
  const [formNotes, setFormNotes] = useState('')
  const [formDietary, setFormDietary] = useState('')

  const totalGuestsCount = guests.reduce((acc, g) => acc + g.passes, 0)
  const { allowed, maxGuests, planId } = canAddGuest(eventData, totalGuestsCount)

  const openAddModal = () => {
    if (!allowed) {
      setShowUpgradeModal(true)
      return
    }
    setEditingGuest(null)
    setFormName('')
    setFormPhone('')
    setFormEmail('')
    setFormGroup('Familia')
    setFormPasses(2)
    setFormRsvp('Pendiente')
    setFormTable('Mesa 1')
    setFormNotes('')
    setFormDietary('')
    setShowAddModal(true)
  }

  const openEditModal = (guest: GuestItem) => {
    setEditingGuest(guest)
    setFormName(guest.name)
    setFormPhone(guest.phone)
    setFormEmail(guest.email || '')
    setFormGroup(guest.group || 'Familia')
    setFormPasses(guest.passes)
    setFormRsvp(guest.rsvp)
    setFormTable(guest.table || 'Mesa 1')
    setFormNotes(guest.notes || '')
    setFormDietary(guest.dietaryNotes || '')
    setShowAddModal(true)
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName) return

    const guestData: GuestItem = {
      id: editingGuest ? editingGuest.id : `guest-${Date.now()}`,
      name: formName,
      phone: formPhone || '',
      email: formEmail,
      group: formGroup,
      passes: formPasses,
      confirmedGuests: editingGuest ? editingGuest.confirmedGuests : (formRsvp === 'Confirmado' ? formPasses : 0),
      rsvp: formRsvp,
      table: formTable,
      notes: formNotes,
      dietaryNotes: formDietary,
      token: editingGuest ? editingGuest.token : `g_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`,
    }

    if (onSaveGuest) {
      onSaveGuest(guestData)
    } else if (onUpdateGuests) {
      if (editingGuest) {
        onUpdateGuests(guests.map(g => (g.id === guestData.id ? guestData : g)))
      } else {
        onUpdateGuests([guestData, ...guests])
      }
    }

    setShowAddModal(false)
  }

  const handleDelete = (id: string) => {
    if (onDeleteGuest) {
      onDeleteGuest(id)
    } else if (onUpdateGuests) {
      onUpdateGuests(guests.filter(g => g.id !== id))
    }
  }

  const handleCopyPersonalLink = (guest: GuestItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://velia.mx'
    const personalUrl = `${origin}/e/${customSlug}?token=${guest.token}`
    navigator.clipboard.writeText(personalUrl).catch(() => {})
    setCopiedTokenId(guest.id)
    setTimeout(() => setCopiedTokenId(null), 2000)
  }

  const handleExportCSV = () => {
    const csvContent =
      'data:text/csv;charset=utf-8,' +
      [
        'Nombre,Teléfono,Email,Grupo,Pases,Confirmados,RSVP,Mesa,Token',
        ...guests.map(
          g =>
            `"${g.name}","${g.phone}","${g.email || ''}","${g.group || ''}",${g.passes},${g.confirmedGuests || 0},"${g.rsvp}","${g.table || ''}","${g.token}"`
        ),
      ].join('\n')
    const encodedUri = encodeURI(csvContent)
    const link = document.createElement('a')
    link.setAttribute('href', encodedUri)
    link.setAttribute('download', 'invitados_velia.csv')
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const groupsList = Array.from(new Set(guests.map(g => g.group).filter(Boolean)))

  const filteredGuests = guests.filter(g => {
    const matchSearch =
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.phone.includes(search) ||
      (g.email && g.email.toLowerCase().includes(search.toLowerCase()))
    const matchRsvp = filterRsvp === 'Todos' || g.rsvp === filterRsvp
    const matchGroup = filterGroup === 'Todos' || g.group === filterGroup
    return matchSearch && matchRsvp && matchGroup
  })

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 select-none">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
            Lista de Asistencia &amp; Pases ({totalGuestsCount} / {maxGuests} pases)
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
            Gestión de Invitados
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="border border-beige text-brown font-body text-xs px-4 py-2.5 rounded-full hover:bg-beige/40 transition-colors cursor-pointer flex items-center gap-2"
          >
            <span>📥</span>
            <span>Exportar CSV</span>
          </button>

          <button
            onClick={openAddModal}
            className="bg-brown text-ivory font-body font-medium text-xs px-5 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer flex items-center gap-2 shadow-xs"
          >
            <span>+</span>
            <span>Nuevo invitado</span>
          </button>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white border border-beige/80 rounded-2xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 shadow-xs">
        <div className="w-full md:w-64 relative">
          <input
            type="text"
            placeholder="Buscar por nombre, tel o email..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-ivory/50 border border-beige/80 rounded-xl text-xs text-brown font-body focus:outline-none focus:border-champagne"
          />
          <span className="absolute left-3 top-2.5 text-xs text-brown/40">🔍</span>
        </div>

        {groupsList.length > 0 && (
          <div className="flex items-center gap-2 w-full md:w-auto">
            <span className="font-body text-xs text-brown/50 flex-none">Grupo:</span>
            <select
              value={filterGroup}
              onChange={e => setFilterGroup(e.target.value)}
              className="px-3 py-1.5 bg-ivory border border-beige/80 rounded-xl text-xs text-brown font-body focus:outline-none"
            >
              <option value="Todos">Todos los grupos</option>
              {groupsList.map(grp => (
                <option key={grp} value={grp}>
                  {grp}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto">
          {(['Todos', 'Confirmado', 'Pendiente', 'Rechazado'] as const).map(f => (
            <button
              key={f}
              onClick={() => setFilterRsvp(f)}
              className={`font-body text-xs px-3.5 py-1.5 rounded-full transition-colors cursor-pointer whitespace-nowrap ${
                filterRsvp === f
                  ? 'bg-brown text-ivory font-medium'
                  : 'bg-ivory text-brown/60 hover:bg-beige/50'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Guests Table */}
      <div className="bg-white border border-beige/80 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brown text-ivory font-body text-[0.68rem] tracking-wider uppercase border-b border-brown/20">
                <th className="p-4 pl-6">Invitado</th>
                <th className="p-4">Contacto</th>
                <th className="p-4 text-center">Pases Reservados</th>
                <th className="p-4">RSVP</th>
                <th className="p-4">Mesa</th>
                <th className="p-4 pr-6 text-right">Acciones &amp; WhatsApp</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-beige/60 font-body text-xs text-brown">
              {filteredGuests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-brown/40 font-body text-xs">
                    No se encontraron invitados con estos criterios.
                  </td>
                </tr>
              ) : (
                filteredGuests.map(guest => {
                  const waUrl = buildWhatsAppShareUrl(
                    customSlug,
                    guest.name,
                    guest.token,
                    guest.phone
                  )

                  return (
                    <tr key={guest.id} className="hover:bg-ivory/50 transition-colors">
                      <td className="p-4 pl-6 font-medium text-brown">
                        <div className="flex items-center gap-2">
                          <span>{guest.name}</span>
                          {guest.group && (
                            <span className="text-[0.62rem] bg-beige/60 text-brown/70 px-2 py-0.5 rounded-full">
                              {guest.group}
                            </span>
                          )}
                        </div>
                        {guest.dietaryNotes && (
                          <span className="block text-[0.65rem] text-champagne font-normal mt-0.5">
                            🌿 {guest.dietaryNotes}
                          </span>
                        )}
                      </td>
                      <td className="p-4 text-brown/70">
                        <p>{guest.phone || 'Sin teléfono'}</p>
                        {guest.email && <p className="text-[0.65rem] text-brown/40">{guest.email}</p>}
                      </td>
                      <td className="p-4 text-center font-medium">
                        <span className="font-semibold text-brown">{guest.passes}</span>
                        {guest.rsvp === 'Confirmado' && (
                          <span className="block text-[0.62rem] text-emerald-700">
                            ({guest.confirmedGuests ?? guest.passes} confirmados)
                          </span>
                        )}
                      </td>
                      <td className="p-4">
                        <span
                          className={`font-body text-[0.68rem] font-medium px-2.5 py-1 rounded-full border ${
                            guest.rsvp === 'Confirmado'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : guest.rsvp === 'Pendiente'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-rose/20 text-brown border-rose/30'
                          }`}
                        >
                          {guest.rsvp}
                        </span>
                      </td>
                      <td className="p-4 text-brown/70 font-medium">
                        {guest.table || 'Sin asignar'}
                      </td>
                      <td className="p-4 pr-6 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <a
                            href={waUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white p-1.5 rounded-lg text-xs transition-colors"
                            title="Enviar pase personal por WhatsApp"
                            aria-label="Enviar pase por WhatsApp"
                          >
                            💬
                          </a>

                          <button
                            onClick={() => handleCopyPersonalLink(guest)}
                            className="bg-ivory border border-beige/80 hover:bg-beige/40 p-1.5 rounded-lg text-xs text-brown transition-colors cursor-pointer"
                            title="Copiar enlace con token personalizado"
                            aria-label="Copiar enlace del invitado"
                          >
                            {copiedTokenId === guest.id ? '✓' : '🔗'}
                          </button>

                          <button
                            onClick={() => openEditModal(guest)}
                            className="bg-ivory border border-beige/80 hover:bg-beige/40 p-1.5 rounded-lg text-xs text-brown transition-colors cursor-pointer"
                            title="Editar invitado"
                            aria-label="Editar invitado"
                          >
                            ✏️
                          </button>

                          <button
                            onClick={() => handleDelete(guest.id)}
                            className="text-rose hover:text-brown p-1.5 text-xs cursor-pointer"
                            title="Eliminar invitado"
                            aria-label="Eliminar invitado"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Guest Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-beige space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-beige/60">
              <h3 className="font-display text-2xl text-brown font-light">
                {editingGuest ? 'Editar Invitado' : 'Agregar Nuevo Invitado'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 cursor-pointer"
                aria-label="Cerrar modal"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Nombre Completo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. María González"
                  value={formName}
                  onChange={e => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none focus:border-champagne"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Teléfono WhatsApp
                  </label>
                  <input
                    type="text"
                    placeholder="+52 33 1234 5678"
                    value={formPhone}
                    onChange={e => setFormPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Correo Electrónico
                  </label>
                  <input
                    type="email"
                    placeholder="maria@correo.com"
                    value={formEmail}
                    onChange={e => setFormEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Grupo
                  </label>
                  <input
                    type="text"
                    placeholder="Familia, Amigos"
                    value={formGroup}
                    onChange={e => setFormGroup(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Pases Reservados
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={formPasses}
                    onChange={e => setFormPasses(parseInt(e.target.value) || 1)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Mesa
                  </label>
                  <input
                    type="text"
                    placeholder="Mesa 1"
                    value={formTable}
                    onChange={e => setFormTable(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Estado RSVP
                </label>
                <select
                  value={formRsvp}
                  onChange={e => setFormRsvp(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                >
                  <option value="Pendiente">Pendiente</option>
                  <option value="Confirmado">Confirmado</option>
                  <option value="Rechazado">Rechazado</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Restricciones Dietéticas / Alergias
                </label>
                <input
                  type="text"
                  placeholder="ej. Vegetariano, Vegano, Celíaco"
                  value={formDietary}
                  onChange={e => setFormDietary(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brown text-ivory font-body font-medium text-xs py-3 rounded-full hover:bg-ink transition-colors cursor-pointer mt-2"
              >
                {editingGuest ? 'Guardar Cambios' : 'Crear Invitado'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Upgrade Modal for guest limit */}
      {showUpgradeModal && (
        <UpgradeModal
          title="Límite de Invitados Alcanzado"
          description={`Tu plan actual (${planId.toUpperCase()}) tiene un límite de ${maxGuests} pases. Actualiza a un plan superior para registrar más invitados.`}
          recommendedPlanId="premium"
          onOpenPlans={() => setShowUpgradeModal(false)}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </div>
  )
}
