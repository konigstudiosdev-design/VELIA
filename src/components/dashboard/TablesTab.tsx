import React, { useState } from 'react'
import { GuestItem, TableGroup } from '../../types'
import { saveTableGroup, deleteTableGroup } from '../../services/eventService'

interface TablesTabProps {
  guests: GuestItem[]
  tables?: TableGroup[]
  invitationId?: string
  onUpdateGuests: (guests: GuestItem[]) => void
}

export default function TablesTab({
  guests,
  tables = [],
  invitationId,
  onUpdateGuests,
}: TablesTabProps) {
  const [selectedGuestId, setSelectedGuestId] = useState<string | null>(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [tableName, setTableName] = useState('')
  const [tableCapacity, setTableCapacity] = useState(10)
  const [tableNotes, setTableNotes] = useState('')

  // Default table list if no custom tables created
  const displayTables: TableGroup[] = tables.length > 0 ? tables : [
    { id: 'tbl_1', name: 'Mesa 1', capacity: 10 },
    { id: 'tbl_2', name: 'Mesa 2', capacity: 10 },
    { id: 'tbl_3', name: 'Mesa 3', capacity: 8 },
    { id: 'tbl_4', name: 'Mesa 4', capacity: 8 },
  ]

  const handleCreateTable = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!tableName) return

    const newTable: TableGroup = {
      id: `tbl_${Date.now()}`,
      name: tableName,
      capacity: tableCapacity,
      notes: tableNotes,
    }

    if (invitationId) {
      try {
        await saveTableGroup(invitationId, newTable)
      } catch (err) {
        console.error('Error al guardar mesa:', err)
      }
    }

    setTableName('')
    setTableCapacity(10)
    setTableNotes('')
    setShowAddModal(false)
  }

  const handleDeleteTable = async (tableId: string) => {
    if (invitationId) {
      try {
        await deleteTableGroup(invitationId, tableId)
      } catch (err) {
        console.error('Error al eliminar mesa:', err)
      }
    }
  }

  const handleMoveGuest = (guestId: string, newTableName: string) => {
    const targetTable = displayTables.find(t => t.name === newTableName)
    if (targetTable) {
      const currentAssigned = guests.filter(g => g.table === newTableName).reduce((acc, g) => acc + g.passes, 0)
      const movingGuest = guests.find(g => g.id === guestId)
      if (movingGuest && currentAssigned + movingGuest.passes > targetTable.capacity) {
        alert(`No se puede asignar: la mesa ${newTableName} superaría su capacidad de ${targetTable.capacity} lugares.`)
        return
      }
    }

    const newGuests = guests.map(g => {
      if (g.id === guestId) {
        return { ...g, table: newTableName }
      }
      return g
    })
    onUpdateGuests(newGuests)
    setSelectedGuestId(null)
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
            Distribución de Salón &amp; Asientos
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
            Organización de Mesas
          </h1>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="bg-brown text-ivory font-body font-medium text-xs px-5 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span>
          <span>Nueva mesa</span>
        </button>
      </div>

      {/* Visual Table Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayTables.map(tbl => {
          const tableGuests = guests.filter(g => g.table === tbl.name)
          const occupiedCount = tableGuests.reduce((acc, g) => acc + g.passes, 0)
          const isFull = occupiedCount >= tbl.capacity
          const isAlmostFull = occupiedCount >= tbl.capacity * 0.8 && !isFull

          // Visual seats indicator string e.g. ●●●●●○○○
          const occupiedDots = '●'.repeat(Math.min(occupiedCount, tbl.capacity))
          const emptyDots = '○'.repeat(Math.max(0, tbl.capacity - occupiedCount))

          return (
            <div
              key={tbl.id}
              className="bg-white border border-beige/80 rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between relative group"
            >
              <div>
                <div className="flex items-center justify-between border-b border-beige/60 pb-3 mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8 h-8 rounded-full bg-brown text-ivory flex items-center justify-center font-display text-sm font-light">
                      🍽️
                    </span>
                    <div>
                      <h3 className="font-display text-xl text-brown font-light">
                        {tbl.name}
                      </h3>
                      {tbl.notes && <p className="font-body text-[0.65rem] text-brown/50">{tbl.notes}</p>}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span
                      className={`font-body text-[0.68rem] font-medium px-2.5 py-1 rounded-full border ${
                        isFull
                          ? 'bg-rose/20 text-brown border-rose/30'
                          : isAlmostFull
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-emerald-50 text-emerald-800 border-emerald-200'
                      }`}
                    >
                      {occupiedCount} / {tbl.capacity}
                    </span>

                    {invitationId && (
                      <button
                        onClick={() => handleDeleteTable(tbl.id)}
                        className="text-brown/30 hover:text-rose p-1 text-xs transition-colors cursor-pointer"
                        title="Eliminar mesa"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {/* Visual Seats Indicators */}
                <div className="font-mono text-xs text-champagne tracking-widest text-center py-1 bg-ivory/50 rounded-xl border border-beige/50">
                  <span>{occupiedDots}</span>
                  <span className="opacity-30">{emptyDots}</span>
                </div>

                {/* Guests list for this table */}
                <div className="space-y-2 mt-4">
                  {tableGuests.length === 0 ? (
                    <p className="font-body text-xs text-brown/40 italic py-4 text-center">
                      Mesa vacía. Selecciona un invitado para asignarlo aquí.
                    </p>
                  ) : (
                    tableGuests.map(g => {
                      const isSelected = selectedGuestId === g.id
                      return (
                        <div
                          key={g.id}
                          onClick={() => setSelectedGuestId(isSelected ? null : g.id)}
                          className={`p-2.5 rounded-xl border text-xs font-body transition-all cursor-pointer flex items-center justify-between ${
                            isSelected
                              ? 'bg-brown text-ivory border-brown shadow-xs font-medium'
                              : 'bg-ivory/40 border-beige/60 hover:bg-ivory text-brown'
                          }`}
                        >
                          <div className="truncate">
                            <span>{g.name}</span>
                            <span className="text-[0.65rem] opacity-60 ml-2">
                              ({g.passes} {g.passes === 1 ? 'pase' : 'pases'})
                            </span>
                          </div>

                          {isSelected ? (
                            <span className="text-[0.62rem] bg-champagne text-brown font-bold px-2 py-0.5 rounded uppercase">
                              Seleccionado
                            </span>
                          ) : (
                            <button
                              onClick={e => {
                                e.stopPropagation()
                                handleMoveGuest(g.id, 'Sin asignar')
                              }}
                              className="text-[0.62rem] text-brown/40 hover:text-rose underline"
                            >
                              Quitar
                            </button>
                          )}
                        </div>
                      )
                    })
                  )}
                </div>
              </div>

              {/* Move Control when a guest is selected */}
              {selectedGuestId && (
                <div className="pt-3 border-t border-beige/60">
                  <button
                    onClick={() => handleMoveGuest(selectedGuestId, tbl.name)}
                    disabled={isFull}
                    className="w-full bg-champagne hover:bg-[#d4b990] text-brown font-body font-medium text-xs py-2.5 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
                  >
                    {isFull ? 'Mesa Llena' : `Asignar invitado a ${tbl.name}`}
                  </button>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-beige space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-beige/60">
              <h3 className="font-display text-2xl text-brown font-light">
                Agregar Nueva Mesa
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTable} className="space-y-4">
              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Nombre de la Mesa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mesa 5 / Familia Novia"
                  value={tableName}
                  onChange={e => setTableName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none focus:border-champagne"
                />
              </div>

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Capacidad de Lugares *
                </label>
                <input
                  type="number"
                  min="1"
                  max="20"
                  required
                  value={tableCapacity}
                  onChange={e => setTableCapacity(parseInt(e.target.value) || 1)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Notas de Ubicación (Opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Cerca de la pista de baile"
                  value={tableNotes}
                  onChange={e => setTableNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brown text-ivory font-body font-medium text-xs py-3 rounded-full hover:bg-ink transition-colors cursor-pointer mt-2"
              >
                Crear Mesa
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
