import React, { useState, useEffect } from 'react'
import { EventData, AppView, PartnerProfile, PartnerStatus, PartnerTier, PartnerRole, PartnerSettings, PartnerCommission, PartnerInvite } from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import SavedInvitationsModal from '../SavedInvitationsModal'
import {
  getAdminPartners,
  updatePartnerStatus,
  updatePartnerCommissionRate,
  getPartnerSettings,
  updatePartnerSettings,
  updateCommissionStatus,
  createPartnerInviteLink,
  getAdminPartnerInvites,
  createPartnerDirectlyByAdmin,
} from '../../services/partnerService'
import { collection, getDocs } from 'firebase/firestore'
import { db } from '../../firebase'

interface AdminDashboardViewProps {
  onNavigate: (view: AppView) => void
  onSelectEventToEdit?: (event: EventData) => void
}

const BUSINESS_TYPES: { label: string; value: PartnerRole }[] = [
  { label: 'Wedding Planner', value: 'wedding_planner' },
  { label: 'Event Planner', value: 'event_planner' },
  { label: 'Organizador de XV Años / Eventos Social', value: 'organizer' },
  { label: 'Salón de Eventos / Jardin / Venue', value: 'venue' },
  { label: 'Fotógrafo / Cineasta de Bodas', value: 'photographer' },
  { label: 'Decorador / Diseñador Floral', value: 'decorator' },
  { label: 'Agencia de Eventos', value: 'agency' },
  { label: 'Otro profesional de eventos', value: 'other' },
]

async function fetchWithTimeout<T>(promise: Promise<T>, fallback: T, timeoutMs = 1200): Promise<T> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => resolve(fallback), timeoutMs)
    promise
      .then((res) => {
        clearTimeout(timer)
        resolve(res)
      })
      .catch(() => {
        clearTimeout(timer)
        resolve(fallback)
      })
  })
}

export default function AdminDashboardView({ onNavigate, onSelectEventToEdit }: AdminDashboardViewProps) {
  const { user, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<'partners' | 'invites' | 'commissions' | 'settings'>('partners')
  const [partners, setPartners] = useState<PartnerProfile[]>([])
  const [invites, setInvites] = useState<PartnerInvite[]>([])
  const [allCommissions, setAllCommissions] = useState<PartnerCommission[]>([])
  const [settings, setSettings] = useState<PartnerSettings | null>(null)
  const [loading, setLoading] = useState(true)

  // Saved Invitations Modal State
  const [showSavedModal, setShowSavedModal] = useState(false)

  // Status Filter
  const [statusFilter, setStatusFilter] = useState<'all' | PartnerStatus>('all')

  // Edit Partner Rate Modal
  const [selectedPartner, setSelectedPartner] = useState<PartnerProfile | null>(null)
  const [editRate, setEditRate] = useState<number>(40)
  const [editTier, setEditTier] = useState<PartnerTier>('partner')
  const [savingPartner, setSavingPartner] = useState(false)

  // Generate Invite Modal
  const [showGenerateInviteModal, setShowQrModal] = useState(false)
  const [inviteBusinessName, setInviteBusinessName] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRate, setInviteRate] = useState(45)
  const [inviteTier, setInviteTier] = useState<PartnerTier>('pro')
  const [generatedInviteLink, setGeneratedInviteLink] = useState('')
  const [generatingInvite, setGeneratingInvite] = useState(false)

  // Create Direct Partner Modal
  const [showDirectPartnerModal, setShowDirectPartnerModal] = useState(false)
  const [directFirst, setDirectFirst] = useState('')
  const [directLast, setDirectLast] = useState('')
  const [directBusinessName, setDirectBusinessName] = useState('')
  const [directType, setDirectType] = useState<PartnerRole>('wedding_planner')
  const [directEmail, setDirectEmail] = useState('')
  const [directPhone, setDirectPhone] = useState('')
  const [directCity, setDirectCity] = useState('')
  const [directRate, setDirectRate] = useState(45)
  const [directTier, setDirectTier] = useState<PartnerTier>('pro')
  const [creatingDirect, setCreatingDirect] = useState(false)

  // Edit Settings Form State
  const [defaultRate, setDefaultRate] = useState(40)
  const [attributionWindow, setAttributionWindow] = useState(30)
  const [minPayout, setMinPayout] = useState(500)
  const [savingSettings, setSavingSettings] = useState(false)
  const [settingsMsg, setSettingsMsg] = useState('')

  const loadData = async () => {
    try {
      const [pts, setts, invs, commSnap] = await Promise.all([
        fetchWithTimeout(getAdminPartners(), [], 1200),
        fetchWithTimeout(getPartnerSettings(), null, 1200),
        fetchWithTimeout(getAdminPartnerInvites(), [], 1200),
        fetchWithTimeout(getDocs(collection(db, 'commissions')), null, 1200),
      ])

      const comms = commSnap ? commSnap.docs.map(d => d.data() as PartnerCommission) : []

      setPartners(pts || [])
      setInvites(invs || [])
      setAllCommissions(comms)
      if (setts) {
        setSettings(setts)
        setDefaultRate(setts.defaultCommissionRate)
        setAttributionWindow(setts.attributionWindowDays)
        setMinPayout(setts.minimumPayoutAmount)
      }
    } catch (err) {
      console.error('Error al cargar panel de administración:', err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadData()
    const timer = setTimeout(() => setLoading(false), 800)
    return () => clearTimeout(timer)
  }, [])

  const handleStatusChange = async (partnerId: string, newStatus: PartnerStatus) => {
    try {
      await updatePartnerStatus(partnerId, newStatus)
      await loadData()
    } catch (err) {
      console.error('Error al actualizar estado de partner:', err)
    }
  }

  const handleSaveRateTier = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedPartner) return
    setSavingPartner(true)
    try {
      await updatePartnerCommissionRate(selectedPartner.partnerId, editRate, editTier)
      setSelectedPartner(null)
      await loadData()
    } catch (err) {
      console.error('Error al actualizar tasa de comisión:', err)
    } finally {
      setSavingPartner(false)
    }
  }

  const handleGenerateInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setGeneratingInvite(true)
    try {
      const invite = await createPartnerInviteLink(user.uid, {
        businessName: inviteBusinessName,
        email: inviteEmail,
        commissionRate: inviteRate,
        tier: inviteTier,
      })

      if (invite) {
        setInvites(prev => [invite, ...prev])
        const link = `https://velia.mx/partner-onboarding?invite=${invite.code}`
        setGeneratedInviteLink(link)
      }
      setGeneratingInvite(false)
      loadData()
    } catch (err) {
      console.error('Error al generar enlace de invitación:', err)
      setGeneratingInvite(false)
    }
  }

  const handleCreateDirectPartnerSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user || !directFirst || !directLast || !directBusinessName || !directEmail) return
    setCreatingDirect(true)

    try {
      const newPartner = await createPartnerDirectlyByAdmin(user.uid, {
        firstName: directFirst,
        lastName: directLast,
        businessName: directBusinessName,
        businessType: directType,
        email: directEmail,
        phone: directPhone,
        city: directCity,
        commissionRate: directRate,
        tier: directTier,
      })

      if (newPartner) {
        setPartners(prev => [newPartner, ...prev])
      }
      setShowDirectPartnerModal(false)
      setDirectFirst('')
      setDirectLast('')
      setDirectBusinessName('')
      setDirectEmail('')
      setDirectPhone('')
      setDirectCity('')
      setCreatingDirect(false)

      loadData()
    } catch (err) {
      console.error('Error al crear partner directo:', err)
      setCreatingDirect(false)
    }
  }

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault()
    setSavingSettings(true)
    setSettingsMsg('')
    try {
      await updatePartnerSettings({
        defaultCommissionRate: defaultRate,
        attributionWindowDays: attributionWindow,
        minimumPayoutAmount: minPayout,
      })
      setSettingsMsg('Ajustes globales guardados con éxito.')
    } catch (err) {
      console.error('Error al guardar ajustes globales:', err)
      setSettingsMsg('Error al guardar ajustes.')
    } finally {
      setSavingSettings(false)
    }
  }

  const handleCommissionStatusChange = async (commissionId: string, newStatus: any) => {
    try {
      await updateCommissionStatus(commissionId, newStatus)
      await loadData()
    } catch (err) {
      console.error('Error al actualizar estado de comisión:', err)
    }
  }

  const copyToClipboard = (text: string, msg = 'Copiado al portapapeles.') => {
    navigator.clipboard.writeText(text)
    alert(msg)
  }

  const filteredPartners = statusFilter === 'all'
    ? partners
    : partners.filter(p => p.status === statusFilter)

  // Aggregated Stats
  const totalPartnerRevenue = allCommissions.reduce((acc, c) => acc + (c.saleAmount || 0), 0)
  const totalPendingCommissions = allCommissions.filter(c => c.status === 'pending').reduce((acc, c) => acc + (c.commissionAmount || 0), 0)
  const totalPaidCommissions = allCommissions.filter(c => c.status === 'paid').reduce((acc, c) => acc + (c.commissionAmount || 0), 0)

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-ivory font-body text-xs text-brown/60">
        Cargando Panel del Dueño de VÉLIA...
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-ivory p-6 lg:p-12">
      {/* Top Header Bar */}
      <header className="fixed inset-x-0 top-0 z-50 bg-ivory/96 backdrop-blur-md border-b border-beige/60">
        <div className="max-w-7xl mx-auto px-6 lg:px-12 flex items-center justify-between h-16">
          <button
            onClick={() => onNavigate('landing')}
            className="font-display text-2xl tracking-[0.28em] text-brown font-light cursor-pointer"
          >
            VÉLIA
          </button>
          <div className="flex items-center gap-3 text-xs font-body">
            <span className="text-brown/60 font-mono hidden sm:inline">{user?.email || 'konigstudios.dev@gmail.com'} (Dueño)</span>
            <button
              onClick={() => setShowSavedModal(true)}
              className="bg-champagne text-brown font-body text-xs px-3.5 py-1.5 rounded-full hover:bg-[#d4b990] cursor-pointer font-medium shadow-xs flex items-center gap-1"
            >
              <span>📂</span>
              <span>Mis Invitaciones (König)</span>
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto space-y-8">

        {/* Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-beige/80 pb-6">
          <div>
            <span className="font-display text-xs tracking-[0.3em] uppercase text-champagne block mb-1">
              PANEL DEL DUEÑO DE VÉLIA
            </span>
            <h1 className="font-display text-3xl sm:text-4xl text-brown font-light">
              Gestión de Partners y Aprobaciones
            </h1>
            <p className="font-body text-xs text-brown/50 mt-1">
              Revisa solicitudes, aprueba accesos, genera enlaces de invitación exclusivos y administra comisiones.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onNavigate('onboarding')}
              className="bg-brown text-ivory font-body text-xs px-4 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer flex items-center gap-1.5 shadow-xs font-medium"
            >
              <span>✨ Crear Invitación Gratuita</span>
            </button>

            <button
              onClick={() => setShowDirectPartnerModal(true)}
              className="bg-champagne text-brown font-body text-xs px-4 py-2.5 rounded-full hover:bg-[#d4b990] transition-all cursor-pointer flex items-center gap-1.5 shadow-xs font-medium"
            >
              <span>👤 Crear Acceso Personal Directo</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex gap-2 border-b border-beige/60 pb-3 overflow-x-auto">
          <button
            onClick={() => setActiveTab('partners')}
            className={`px-4 py-2 rounded-full font-body text-xs cursor-pointer transition-all ${
              activeTab === 'partners' ? 'bg-brown text-ivory shadow-xs' : 'bg-white border border-beige text-brown/70 hover:text-brown'
            }`}
          >
            Solicitudes & Partners ({partners.length})
          </button>

          <button
            onClick={() => setActiveTab('invites')}
            className={`px-4 py-2 rounded-full font-body text-xs cursor-pointer transition-all ${
              activeTab === 'invites' ? 'bg-brown text-ivory shadow-xs' : 'bg-white border border-beige text-brown/70 hover:text-brown'
            }`}
          >
            Enlaces de Invitación ({invites.length})
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`px-4 py-2 rounded-full font-body text-xs cursor-pointer transition-all ${
              activeTab === 'commissions' ? 'bg-brown text-ivory shadow-xs' : 'bg-white border border-beige text-brown/70 hover:text-brown'
            }`}
          >
            Comisiones y Pagos SPEI ({allCommissions.length})
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-2 rounded-full font-body text-xs cursor-pointer transition-all ${
              activeTab === 'settings' ? 'bg-brown text-ivory shadow-xs' : 'bg-white border border-beige text-brown/70 hover:text-brown'
            }`}
          >
            Ajustes Globales
          </button>
        </div>

        {/* Global Overview Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
            <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
              Partners Registrados
            </span>
            <span className="font-display text-2xl sm:text-3xl text-brown font-medium block">
              {partners.length}
            </span>
            <span className="font-body text-[0.68rem] text-amber-800 mt-1 block">
              {partners.filter(p => p.status === 'pending').length} pendientes por revisar
            </span>
          </div>

          <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
            <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
              Ingresos Vía Partners
            </span>
            <span className="font-display text-2xl sm:text-3xl text-brown font-medium block">
              ${totalPartnerRevenue.toLocaleString('es-MX')} MXN
            </span>
            <span className="font-body text-[0.7rem] text-brown/50 mt-1 block">
              Ventas de invitaciones
            </span>
          </div>

          <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
            <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
              Comisiones Por Pagar
            </span>
            <span className="font-display text-2xl sm:text-3xl text-amber-800 font-medium block">
              ${totalPendingCommissions.toLocaleString('es-MX')} MXN
            </span>
            <span className="font-body text-[0.7rem] text-amber-700 mt-1 block">
              Pendientes de transferencia
            </span>
          </div>

          <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
            <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
              Comisiones Liquidadas
            </span>
            <span className="font-display text-2xl sm:text-3xl text-emerald-800 font-medium block">
              ${totalPaidCommissions.toLocaleString('es-MX')} MXN
            </span>
            <span className="font-body text-[0.7rem] text-emerald-700 mt-1 block">
              Transferidas vía SPEI
            </span>
          </div>
        </div>

        {/* Tab 1: PARTNERS LIST */}
        {activeTab === 'partners' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex gap-2 font-body text-xs">
                {(['all', 'pending', 'active', 'suspended', 'rejected'] as const).map(st => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-3.5 py-1.5 rounded-full capitalize cursor-pointer transition-colors ${
                      statusFilter === st ? 'bg-brown text-ivory font-medium' : 'bg-white border border-beige text-brown/70 hover:text-brown'
                    }`}
                  >
                    {st === 'all' ? 'Todos' : st === 'pending' ? 'Pendientes de Aprobación' : st === 'active' ? 'Activos' : st}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-xs">
                  <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem]">
                    <tr>
                      <th className="p-4">Negocio / Partner</th>
                      <th className="p-4">Contacto</th>
                      <th className="p-4">Código / Slug</th>
                      <th className="p-4">Tasa Comisión</th>
                      <th className="p-4">Estado</th>
                      <th className="p-4 text-right">Acciones de Dueño</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige/60 text-brown">
                    {filteredPartners.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-brown/50">
                          No hay solicitudes o partners registrados en este estado.
                        </td>
                      </tr>
                    ) : (
                      filteredPartners.map(p => (
                        <tr key={p.partnerId} className="hover:bg-ivory/30">
                          <td className="p-4 font-medium">
                            {p.businessName}
                            <span className="block text-[0.68rem] text-brown/50 font-normal">
                              {p.firstName} {p.lastName} • {p.businessType}
                            </span>
                          </td>
                          <td className="p-4">
                            <div>{p.email}</div>
                            <div className="text-brown/50 text-[0.68rem]">{p.phone} ({p.city})</div>
                          </td>
                          <td className="p-4">
                            <span className="font-mono bg-ivory px-2 py-0.5 rounded border border-beige text-[0.68rem]">
                              {p.referralCode}
                            </span>
                            <span className="block text-[0.65rem] text-brown/50">/p/{p.referralSlug}</span>
                          </td>
                          <td className="p-4 font-medium">
                            {p.commissionRate}%
                            <span className="block text-[0.65rem] text-brown/50 uppercase">{p.tier}</span>
                          </td>
                          <td className="p-4">
                            <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium uppercase ${
                              p.status === 'active'
                                ? 'bg-emerald-100 text-emerald-800'
                                : p.status === 'pending'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose/15 text-brown'
                            }`}>
                              {p.status === 'active' ? 'Activo' : p.status === 'pending' ? 'Pendiente' : p.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-2">
                            {p.status === 'pending' && (
                              <>
                                <button
                                  onClick={() => handleStatusChange(p.partnerId, 'active')}
                                  className="bg-emerald-700 text-white px-3 py-1 rounded-full text-[0.68rem] hover:bg-emerald-800 cursor-pointer font-medium"
                                >
                                  Aprobar Acceso
                                </button>
                                <button
                                  onClick={() => handleStatusChange(p.partnerId, 'rejected')}
                                  className="bg-rose/20 text-rose-900 border border-rose/30 px-3 py-1 rounded-full text-[0.68rem] hover:bg-rose/30 cursor-pointer"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}
                            {p.status === 'active' && (
                              <button
                                onClick={() => handleStatusChange(p.partnerId, 'suspended')}
                                className="bg-amber-700 text-white px-3 py-1 rounded-full text-[0.68rem] hover:bg-amber-800 cursor-pointer"
                              >
                                Suspender
                              </button>
                            )}
                            <button
                              onClick={() => {
                                setSelectedPartner(p)
                                setEditRate(p.commissionRate)
                                setEditTier(p.tier)
                              }}
                              className="bg-brown text-ivory px-3 py-1 rounded-full text-[0.68rem] hover:bg-ink cursor-pointer"
                            >
                              Ajustar Tasa
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: INVITES LIST */}
        {activeTab === 'invites' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-display text-xl text-brown font-light">
                  Enlaces e Invitaciones Exclusivas Generadas
                </h3>
                <p className="font-body text-xs text-brown/50">
                  Historial de enlaces de invitación emitidos directamente por el dueño.
                </p>
              </div>

              <button
                onClick={() => {
                  setGeneratedInviteLink('')
                  setShowQrModal(true)
                }}
                className="bg-brown text-ivory font-body text-xs px-4 py-2.5 rounded-full hover:bg-ink cursor-pointer"
              >
                + Nuevo Enlace
              </button>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left font-body text-xs">
                  <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem]">
                    <tr>
                      <th className="p-4">Código Invitación</th>
                      <th className="p-4">Negocio / Email</th>
                      <th className="p-4">Tasa & Tier Asignado</th>
                      <th className="p-4">Estado Enlace</th>
                      <th className="p-4 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-beige/60 text-brown">
                    {invites.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-8 text-center text-brown/50">
                          Aún no has generado enlaces de invitación exclusivos.
                        </td>
                      </tr>
                    ) : (
                      invites.map(inv => {
                        const inviteUrl = `https://velia.mx/partner-onboarding?invite=${inv.code}`
                        return (
                          <tr key={inv.id}>
                            <td className="p-4 font-mono font-medium">{inv.code}</td>
                            <td className="p-4">
                              {inv.businessName || 'Cualquier Partner'}
                              {inv.email && <span className="block text-[0.65rem] text-brown/50">{inv.email}</span>}
                            </td>
                            <td className="p-4 font-medium">
                              {inv.commissionRate}% comisión
                              <span className="block text-[0.65rem] text-brown/50 uppercase">{inv.tier}</span>
                            </td>
                            <td className="p-4">
                              <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium uppercase ${
                                inv.used ? 'bg-beige/80 text-brown/60' : 'bg-emerald-100 text-emerald-800'
                              }`}>
                                {inv.used ? 'Usado' : 'Disponible'}
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              {!inv.used && (
                                <>
                                  <button
                                    onClick={() => copyToClipboard(inviteUrl, 'Enlace de invitación copiado.')}
                                    className="bg-brown text-ivory px-3 py-1 rounded-full text-[0.68rem] hover:bg-ink cursor-pointer"
                                  >
                                    Copiar Link
                                  </button>
                                  <button
                                    onClick={() => {
                                      const text = `Hola, te invito formalmente a unirte como Partner exclusivo de VÉLIA. Registra tu acceso aquí: ${inviteUrl}`
                                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                                    }}
                                    className="bg-emerald-700 text-white px-3 py-1 rounded-full text-[0.68rem] hover:bg-emerald-800 cursor-pointer"
                                  >
                                    WhatsApp
                                  </button>
                                </>
                              )}
                            </td>
                          </tr>
                        )
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tab 3: COMMISSIONS MANAGEMENT */}
        {activeTab === 'commissions' && (
          <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left font-body text-xs">
                <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem]">
                  <tr>
                    <th className="p-4">ID / Fecha</th>
                    <th className="p-4">Partner</th>
                    <th className="p-4">Venta</th>
                    <th className="p-4">Comisión</th>
                    <th className="p-4">Estado</th>
                    <th className="p-4 text-right">Acciones Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-beige/60 text-brown">
                  {allCommissions.map(c => (
                    <tr key={c.id}>
                      <td className="p-4">
                        <span className="font-mono text-[0.68rem] block">{c.id}</span>
                        <span className="text-[0.65rem] text-brown/50">
                          {new Date(c.createdAt).toLocaleDateString('es-MX')}
                        </span>
                      </td>
                      <td className="p-4 font-mono">{c.partnerId}</td>
                      <td className="p-4">${c.saleAmount} MXN ({c.planId})</td>
                      <td className="p-4 font-medium text-brown">${c.commissionAmount} MXN ({c.commissionRate}%)</td>
                      <td className="p-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium uppercase ${
                          c.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : c.status === 'approved'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-2">
                        {c.status !== 'paid' && (
                          <button
                            onClick={() => handleCommissionStatusChange(c.id, 'paid')}
                            className="bg-emerald-800 text-white px-3 py-1 rounded-full text-[0.68rem] hover:bg-emerald-900 cursor-pointer font-medium"
                          >
                            Marcar como Pagado (SPEI)
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 4: GLOBAL SETTINGS */}
        {activeTab === 'settings' && (
          <div className="bg-white border border-beige/80 rounded-2xl p-8 shadow-sm max-w-xl">
            <h3 className="font-display text-xl text-brown font-light mb-4 pb-3 border-b border-beige/60">
              Ajustes Globales del Programa de Partners
            </h3>

            {settingsMsg && (
              <div className="mb-4 p-3 bg-champagne/20 border border-champagne/40 rounded-lg text-xs font-body text-brown">
                {settingsMsg}
              </div>
            )}

            <form onSubmit={handleSaveSettings} className="space-y-4 font-body text-xs">
              <div>
                <label className="block text-brown/70 uppercase mb-1">
                  Tasa de Comisión por Defecto (%)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={defaultRate}
                  onChange={e => setDefaultRate(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 uppercase mb-1">
                  Ventana de Atribución de Referidos (Días)
                </label>
                <input
                  type="number"
                  required
                  min={1}
                  max={180}
                  value={attributionWindow}
                  onChange={e => setAttributionWindow(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 uppercase mb-1">
                  Monto Mínimo para Retiro SPEI (MXN)
                </label>
                <input
                  type="number"
                  required
                  min={100}
                  value={minPayout}
                  onChange={e => setMinPayout(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <button
                type="submit"
                disabled={savingSettings}
                className="bg-brown text-ivory px-6 py-3 rounded-full font-medium hover:bg-ink cursor-pointer disabled:opacity-50 mt-2"
              >
                {savingSettings ? 'Guardando...' : 'Guardar Ajustes Globales'}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* Modal: Generate Exclusive Partner Invite Link */}
      {showGenerateInviteModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4 font-body text-xs">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg relative space-y-4">
            <h3 className="font-display text-2xl text-brown font-light">
              Generar Enlace de Invitación Exclusivo
            </h3>
            <p className="text-brown/60">
              Genera un enlace de invitación pre-aprobado para invitar directamente a un Wedding Planner o agencia.
            </p>

            {generatedInviteLink ? (
              <div className="space-y-4 bg-ivory p-4 rounded-xl border border-beige">
                <span className="text-emerald-800 font-medium block">
                  ✓ ¡Enlace de Invitación Generado con Éxito!
                </span>
                <div className="p-3 bg-white border border-beige rounded-lg font-mono text-[0.72rem] text-brown break-all">
                  {generatedInviteLink}
                </div>
                <div className="flex gap-2 pt-2">
                  <button
                    onClick={() => copyToClipboard(generatedInviteLink, '¡Enlace copiado!')}
                    className="flex-1 bg-brown text-ivory py-2.5 rounded-full font-medium cursor-pointer"
                  >
                    Copiar Enlace
                  </button>
                  <button
                    onClick={() => {
                      const text = `Hola, te invito formalmente a unirte como Partner exclusivo de VÉLIA. Registra tu acceso aquí: ${generatedInviteLink}`
                      window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank')
                    }}
                    className="bg-emerald-700 text-white px-4 py-2.5 rounded-full font-medium cursor-pointer"
                  >
                    WhatsApp
                  </button>
                </div>
                <button
                  onClick={() => setShowQrModal(false)}
                  className="w-full text-center text-brown/60 hover:text-brown pt-2 cursor-pointer block"
                >
                  Cerrar
                </button>
              </div>
            ) : (
              <form onSubmit={handleGenerateInviteSubmit} className="space-y-3">
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Nombre Comercial (Opcional)</label>
                  <input
                    type="text"
                    value={inviteBusinessName}
                    onChange={e => setInviteBusinessName(e.target.value)}
                    placeholder="Ej. María Fernández Weddings"
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brown/70 uppercase mb-1">Correo Electrónico (Opcional)</label>
                  <input
                    type="email"
                    value={inviteEmail}
                    onChange={e => setInviteEmail(e.target.value)}
                    placeholder="contacto@mariaweddings.com"
                    className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-brown/70 uppercase mb-1">Tasa de Comisión (%)</label>
                    <input
                      type="number"
                      required
                      min={1}
                      max={50}
                      value={inviteRate}
                      onChange={e => setInviteRate(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-brown/70 uppercase mb-1">Nivel (Tier)</label>
                    <select
                      value={inviteTier}
                      onChange={e => setInviteTier(e.target.value as PartnerTier)}
                      className="w-full px-3.5 py-2.5 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                    >
                      <option value="partner">Partner (40%)</option>
                      <option value="pro">Partner Pro (45%)</option>
                      <option value="studio">Partner Studio (50%)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-4 flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowQrModal(false)}
                    className="px-4 py-2 text-brown/60 hover:text-brown cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={generatingInvite}
                    className="bg-brown text-ivory px-5 py-2.5 rounded-full hover:bg-ink cursor-pointer disabled:opacity-50"
                  >
                    {generatingInvite ? 'Generando...' : 'Generar Enlace Exclusivo'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* Modal: Create Direct Partner Access */}
      {showDirectPartnerModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4 font-body text-xs">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 max-w-lg w-full shadow-lg relative space-y-4">
            <h3 className="font-display text-2xl text-brown font-light">
              Crear Acceso Personal Directo
            </h3>
            <p className="text-brown/60">
              Crea un perfil pre-aprobado y activo directamente para un Partner estratégico.
            </p>

            <form onSubmit={handleCreateDirectPartnerSubmit} className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={directFirst}
                    onChange={e => setDirectFirst(e.target.value)}
                    placeholder="Lucía"
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={directLast}
                    onChange={e => setDirectLast(e.target.value)}
                    placeholder="Fernández"
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brown/70 uppercase mb-1">Nombre Comercial del Negocio *</label>
                <input
                  type="text"
                  required
                  value={directBusinessName}
                  onChange={e => setDirectBusinessName(e.target.value)}
                  placeholder="Ej. Lucía Fernández Wedding Planner"
                  className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Tipo de Negocio</label>
                  <select
                    value={directType}
                    onChange={e => setDirectType(e.target.value as PartnerRole)}
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  >
                    {BUSINESS_TYPES.map(bt => (
                      <option key={bt.value} value={bt.value}>{bt.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-brown/70 uppercase mb-1">Ciudad *</label>
                  <input
                    type="text"
                    required
                    value={directCity}
                    onChange={e => setDirectCity(e.target.value)}
                    placeholder="CDMX"
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Correo Electrónico *</label>
                  <input
                    type="email"
                    required
                    value={directEmail}
                    onChange={e => setDirectEmail(e.target.value)}
                    placeholder="lucia@mariaweddings.com"
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brown/70 uppercase mb-1">Teléfono</label>
                  <input
                    type="tel"
                    value={directPhone}
                    onChange={e => setDirectPhone(e.target.value)}
                    placeholder="55 1234 5678"
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown/70 uppercase mb-1">Tasa de Comisión (%)</label>
                  <input
                    type="number"
                    required
                    min={1}
                    max={50}
                    value={directRate}
                    onChange={e => setDirectRate(Number(e.target.value))}
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-brown/70 uppercase mb-1">Nivel (Tier)</label>
                  <select
                    value={directTier}
                    onChange={e => setDirectTier(e.target.value as PartnerTier)}
                    className="w-full px-3.5 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  >
                    <option value="partner">Partner (40%)</option>
                    <option value="pro">Partner Pro (45%)</option>
                    <option value="studio">Partner Studio (50%)</option>
                  </select>
                </div>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowDirectPartnerModal(false)}
                  className="px-4 py-2 text-brown/60 hover:text-brown cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={creatingDirect}
                  className="bg-brown text-ivory px-6 py-2.5 rounded-full hover:bg-ink cursor-pointer disabled:opacity-50"
                >
                  {creatingDirect ? 'Creando...' : 'Crear Partner Activo'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Partner Commission Rate */}
      {selectedPartner && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg relative font-body text-xs">
            <h3 className="font-display text-xl text-brown font-light mb-1">
              Ajustar Tasa de Comisión
            </h3>
            <p className="text-brown/50 mb-4">
              Partner: {selectedPartner.businessName}
            </p>

            <form onSubmit={handleSaveRateTier} className="space-y-4">
              <div>
                <label className="block text-brown/70 uppercase mb-1">Nivel (Tier)</label>
                <select
                  value={editTier}
                  onChange={e => setEditTier(e.target.value as PartnerTier)}
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                >
                  <option value="partner">Partner (40%)</option>
                  <option value="pro">Partner Pro (45%)</option>
                  <option value="studio">Partner Studio (50%)</option>
                </select>
              </div>

              <div>
                <label className="block text-brown/70 uppercase mb-1">Porcentaje de Comisión (%)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={50}
                  value={editRate}
                  onChange={e => setEditRate(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedPartner(null)}
                  className="px-4 py-2 text-brown/60 hover:text-brown cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={savingPartner}
                  className="bg-brown text-ivory px-5 py-2 rounded-full hover:bg-ink cursor-pointer disabled:opacity-50"
                >
                  {savingPartner ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Saved Invitations Modal (König) */}
      {showSavedModal && (
        <SavedInvitationsModal
          onSelectEvent={(evt) => {
            if (onSelectEventToEdit) {
              onSelectEventToEdit(evt)
            } else {
              onNavigate('dashboard')
            }
          }}
          onCreateNewEvent={() => onNavigate('onboarding')}
          onClose={() => setShowSavedModal(false)}
        />
      )}
    </div>
  )
}
