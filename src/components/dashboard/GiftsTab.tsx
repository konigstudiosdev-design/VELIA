import React, { useState } from 'react'
import { GiftItem } from '../../types'
import { saveGiftItem, deleteGiftItem } from '../../services/eventService'

interface GiftsTabProps {
  gifts?: GiftItem[]
  invitationId?: string
}

export default function GiftsTab({ gifts = [], invitationId }: GiftsTabProps) {
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingGift, setEditingGift] = useState<GiftItem | null>(null)

  // Form states
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<'transfer' | 'wishlist' | 'physical' | 'external'>('wishlist')
  const [clabe, setClabe] = useState('')
  const [bank, setBank] = useState('')
  const [beneficiary, setBeneficiary] = useState('')
  const [url, setUrl] = useState('')

  const openAddModal = () => {
    setEditingGift(null)
    setTitle('')
    setDescription('')
    setCategory('wishlist')
    setClabe('')
    setBank('')
    setBeneficiary('')
    setUrl('')
    setShowAddModal(true)
  }

  const openEditModal = (gift: GiftItem) => {
    setEditingGift(gift)
    setTitle(gift.title)
    setDescription(gift.description || '')
    setCategory(gift.category)
    setClabe(gift.clabe || '')
    setBank(gift.bank || '')
    setBeneficiary(gift.beneficiary || '')
    setUrl(gift.url || '')
    setShowAddModal(true)
  }

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title || !invitationId) return

    const giftData: GiftItem = {
      id: editingGift ? editingGift.id : `gift_${Date.now()}`,
      invitationId,
      title,
      description,
      category,
      enabled: editingGift ? editingGift.enabled : true,
      clabe,
      bank,
      beneficiary,
      url,
      updatedAt: new Date().toISOString(),
    }

    try {
      await saveGiftItem(invitationId, giftData)
      setShowAddModal(false)
    } catch (err: any) {
      alert(err.message || 'Error al guardar regalo.')
    }
  }

  const handleToggleEnabled = async (gift: GiftItem) => {
    if (!invitationId) return
    try {
      await saveGiftItem(invitationId, {
        ...gift,
        enabled: !gift.enabled,
      })
    } catch (err) {
      console.error('Error al cambiar visibilidad del regalo:', err)
    }
  }

  const handleDelete = async (giftId: string) => {
    if (!invitationId) return
    try {
      await deleteGiftItem(invitationId, giftId)
    } catch (err) {
      console.error('Error al eliminar regalo:', err)
    }
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
            Mesa de Regalos &amp; Cuentas
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
            Listas de Deseos
          </h1>
        </div>

        {invitationId && (
          <button
            onClick={openAddModal}
            className="bg-brown text-ivory font-body font-medium text-xs px-5 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer flex items-center gap-2 self-start sm:self-auto"
          >
            <span>+</span>
            <span>Agregar regalo o lista</span>
          </button>
        )}
      </div>

      {/* Gifts List */}
      <div className="grid md:grid-cols-2 gap-6">
        {gifts.length === 0 ? (
          <div className="md:col-span-2 bg-white border border-beige/80 rounded-3xl p-10 text-center space-y-3">
            <span className="text-4xl block">🎁</span>
            <h3 className="font-display text-2xl text-brown font-light">
              No has configurado regalos todavía
            </h3>
            <p className="font-body text-xs text-brown/50 max-w-md mx-auto">
              Agrega una lista de Liverpool, Sears, Amazon o tus datos de transferencia bancaria para que aparezcan en tu invitación.
            </p>
            {invitationId && (
              <button
                onClick={openAddModal}
                className="bg-brown text-ivory font-body text-xs px-6 py-2.5 rounded-full hover:bg-ink transition-colors cursor-pointer mt-2"
              >
                + Configurar primer regalo
              </button>
            )}
          </div>
        ) : (
          gifts.map(gift => (
            <div
              key={gift.id}
              className={`bg-white border rounded-3xl p-6 shadow-xs space-y-4 flex flex-col justify-between transition-all ${
                gift.enabled ? 'border-beige/80' : 'border-beige/40 opacity-60'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl">
                    {gift.category === 'transfer'
                      ? '💳'
                      : gift.category === 'wishlist'
                      ? '🏬'
                      : '🎁'}
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleEnabled(gift)}
                      className={`font-body text-[0.62rem] uppercase tracking-wider font-semibold px-2.5 py-1 rounded-full border cursor-pointer ${
                        gift.enabled
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-ivory text-brown/40 border-beige/60'
                      }`}
                    >
                      {gift.enabled ? 'Público ✓' : 'Oculto 🙈'}
                    </button>

                    <button
                      onClick={() => openEditModal(gift)}
                      className="text-brown/40 hover:text-brown p-1 text-xs cursor-pointer"
                      title="Editar regalo"
                    >
                      ✏️
                    </button>

                    <button
                      onClick={() => handleDelete(gift.id)}
                      className="text-brown/30 hover:text-rose p-1 text-xs cursor-pointer"
                      title="Eliminar regalo"
                    >
                      ✕
                    </button>
                  </div>
                </div>

                <h3 className="font-display text-2xl text-brown font-light">
                  {gift.title}
                </h3>

                {gift.description && (
                  <p className="font-body text-xs text-brown/60 leading-relaxed">
                    {gift.description}
                  </p>
                )}

                {gift.category === 'transfer' && gift.clabe && (
                  <div className="p-3.5 bg-ivory rounded-2xl border border-beige/60 space-y-1">
                    <p className="font-body text-[0.62rem] text-brown/40 uppercase">
                      {gift.bank || 'Banco'} · Beneficiario: {gift.beneficiary || 'Nombres'}
                    </p>
                    <p className="font-body text-xs font-mono text-brown truncate select-all">
                      CLABE: {gift.clabe}
                    </p>
                  </div>
                )}

                {gift.url && (
                  <a
                    href={gift.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block font-body text-xs text-champagne font-medium hover:underline truncate"
                  >
                    Ver enlace ↗
                  </a>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add / Edit Gift Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-beige space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-beige/60">
              <h3 className="font-display text-2xl text-brown font-light">
                {editingGift ? 'Editar Regalo' : 'Agregar Regalo'}
              </h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Categoría
                </label>
                <select
                  value={category}
                  onChange={e => setCategory(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                >
                  <option value="wishlist">Mesa de Regalos (Liverpool, Sears, Amazon)</option>
                  <option value="transfer">Transferencia Bancaria (CLABE)</option>
                  <option value="physical">Lluvia de Sobres / Efectivo</option>
                  <option value="external">Enlace Externo</option>
                </select>
              </div>

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Título de la Lista / Regalo *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej. Mesa de Regalos Liverpool"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none focus:border-champagne"
                />
              </div>

              {category === 'transfer' ? (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Banco
                      </label>
                      <input
                        type="text"
                        placeholder="BBVA / Banamex"
                        value={bank}
                        onChange={e => setBank(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Beneficiario
                      </label>
                      <input
                        type="text"
                        placeholder="Lucía y Mateo"
                        value={beneficiary}
                        onChange={e => setBeneficiary(e.target.value)}
                        className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                      CLABE Interbancaria (18 dígitos)
                    </label>
                    <input
                      type="text"
                      placeholder="012180015488921102"
                      value={clabe}
                      onChange={e => setClabe(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body font-mono focus:outline-none"
                    />
                  </div>
                </>
              ) : (
                <div>
                  <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                    Enlace URL de la Lista
                  </label>
                  <input
                    type="url"
                    placeholder="https://www.liverpool.com.mx/..."
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                  />
                </div>
              )}

              <div>
                <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                  Instrucciones o Mensaje (Opcional)
                </label>
                <textarea
                  rows={3}
                  placeholder="Escribe un mensaje para tus invitados sobre esta opción de regalo..."
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-xl text-xs text-brown font-body focus:outline-none"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-brown text-ivory font-body font-medium text-xs py-3 rounded-full hover:bg-ink transition-colors cursor-pointer mt-2"
              >
                {editingGift ? 'Guardar Cambios' : 'Crear Regalo'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
