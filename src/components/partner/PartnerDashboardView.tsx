import React, { useState, useEffect } from 'react'
import {
  AppView,
  PartnerProfile,
  PartnerClient,
  PartnerSale,
  PartnerCommission,
  PartnerDashboardTab,
  EventData,
  EventType,
  DesignStyle,
} from '../../types'
import { useAuth } from '../../contexts/AuthContext'
import {
  getPartnerByUserId,
  getPartnerClients,
  createPartnerClient,
  getPartnerEvents,
  createPartnerEvent,
  getPartnerSales,
  getPartnerCommissions,
  getPartnerMetrics,
  updatePartnerProfile,
} from '../../services/partnerService'
import { TEMPLATES_DATA } from '../../data/templates'
import SavedInvitationsModal from '../SavedInvitationsModal'

interface PartnerDashboardViewProps {
  onNavigate: (view: AppView) => void
  onSelectEventToEdit?: (event: EventData) => void
}

export default function PartnerDashboardView({
  onNavigate,
  onSelectEventToEdit,
}: PartnerDashboardViewProps) {
  const { user, userProfile, logout } = useAuth()

  const [activeTab, setActiveTab] = useState<PartnerDashboardTab>('inicio')
  const [partner, setPartner] = useState<PartnerProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // Data states
  const [clients, setClients] = useState<PartnerClient[]>([])
  const [events, setEvents] = useState<EventData[]>([])
  const [sales, setSales] = useState<PartnerSale[]>([])
  const [commissions, setCommissions] = useState<PartnerCommission[]>([])
  const [metrics, setMetrics] = useState<any>(null)

  // Modals & UI states
  const [showAddClientModal, setShowAddClientModal] = useState(false)
  const [showSavedModal, setShowSavedModal] = useState(false)
  const [showCreateEventModal, setShowCreateEventModal] = useState(false)
  const [showQrModal, setShowQrModal] = useState(false)
  const [selectedClientForEvent, setSelectedClientForEvent] = useState<PartnerClient | null>(null)

  // New Client Form State
  const [newClientFirst, setNewClientFirst] = useState('')
  const [newClientLast, setNewClientLast] = useState('')
  const [newClientEmail, setNewClientEmail] = useState('')
  const [newClientPhone, setNewClientPhone] = useState('')
  const [newClientEventType, setNewClientEventType] = useState<EventType>('Boda')
  const [newClientNotes, setNewClientNotes] = useState('')

  // New Event Form State
  const [newEventPerson1, setNewEventPerson1] = useState('')
  const [newEventPerson2, setNewEventPerson2] = useState('')
  const [newEventDate, setNewEventDate] = useState('')
  const [newEventLocation, setNewEventLocation] = useState('')
  const [newEventVenue, setNewEventVenue] = useState('')
  const [newEventType, setNewEventType] = useState<EventType>('Boda')
  const [newEventStyle, setNewEventStyle] = useState<DesignStyle>('Editorial')
  const [newEventTemplateId, setNewEventTemplateId] = useState('maison')

  // Payment info form state
  const [clabeHolder, setClabeHolder] = useState('')
  const [clabeBank, setClabeBank] = useState('')
  const [clabeNumber, setClabeNumber] = useState('')
  const [savingPayment, setSavingPayment] = useState(false)
  const [paymentMsg, setPaymentMsg] = useState('')

  // Load Partner data
  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }

    getPartnerByUserId(user.uid)
      .then(async (partnerData) => {
        if (partnerData) {
          setPartner(partnerData)
          if (partnerData.paymentMethodData) {
            setClabeHolder(partnerData.paymentMethodData.accountHolderName || '')
            setClabeBank(partnerData.paymentMethodData.bankName || '')
            setClabeNumber(partnerData.paymentMethodData.clabeNumber || '')
          }

          // Fetch partner dashboard resources
          const [cls, evs, sls, cms, mtr] = await Promise.all([
            getPartnerClients(partnerData.partnerId),
            getPartnerEvents(partnerData.partnerId),
            getPartnerSales(partnerData.partnerId),
            getPartnerCommissions(partnerData.partnerId),
            getPartnerMetrics(partnerData.partnerId),
          ])

          setClients(cls)
          setEvents(evs)
          setSales(sls)
          setCommissions(cms)
          setMetrics(mtr)
        }
      })
      .catch((err) => console.error('Error al cargar datos de Partner:', err))
      .finally(() => setLoading(false))
  }, [user])

  const refreshData = async (partnerId: string) => {
    const [cls, evs, sls, cms, mtr] = await Promise.all([
      getPartnerClients(partnerId),
      getPartnerEvents(partnerId),
      getPartnerSales(partnerId),
      getPartnerCommissions(partnerId),
      getPartnerMetrics(partnerId),
    ])
    setClients(cls)
    setEvents(evs)
    setSales(sls)
    setCommissions(cms)
    setMetrics(mtr)
  }

  const handleAddClientSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner || !newClientFirst || !newClientLast || !newClientEmail || !newClientPhone) return

    try {
      await createPartnerClient(partner.partnerId, {
        firstName: newClientFirst,
        lastName: newClientLast,
        email: newClientEmail,
        phone: newClientPhone,
        eventType: newClientEventType,
        notes: newClientNotes,
      })

      setShowAddClientModal(false)
      setNewClientFirst('')
      setNewClientLast('')
      setNewClientEmail('')
      setNewClientPhone('')
      setNewClientNotes('')
      await refreshData(partner.partnerId)
    } catch (err) {
      console.error('Error al agregar cliente:', err)
    }
  }

  const handleCreateEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner || !selectedClientForEvent || !newEventPerson1 || !newEventDate) return

    try {
      const slugCandidate = `${newEventPerson1.toLowerCase().replace(/[^a-z0-9]/g, '-')}-y-${(newEventPerson2 || 'evento').toLowerCase().replace(/[^a-z0-9]/g, '-')}`

      await createPartnerEvent(user!.uid, partner.partnerId, selectedClientForEvent.id, {
        eventType: newEventType,
        person1Name: newEventPerson1,
        person2Name: newEventPerson2,
        date: newEventDate,
        location: newEventLocation,
        venue: newEventVenue,
        style: newEventStyle,
        selectedTemplateId: newEventTemplateId,
        customSlug: slugCandidate,
        status: 'Draft',
        planId: 'free',
        billingStatus: 'free',
      })

      setShowCreateEventModal(false)
      setNewEventPerson1('')
      setNewEventPerson2('')
      setNewEventDate('')
      setNewEventLocation('')
      setNewEventVenue('')
      await refreshData(partner.partnerId)
    } catch (err) {
      console.error('Error al crear evento:', err)
    }
  }

  const handleSavePaymentData = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!partner) return
    setSavingPayment(true)
    setPaymentMsg('')

    try {
      await updatePartnerProfile(partner.partnerId, {
        paymentMethodData: {
          accountHolderName: clabeHolder,
          bankName: clabeBank,
          clabeNumber,
          paymentMethodType: 'spei',
        },
      })
      setPaymentMsg('Datos de depósito actualizados correctamente.')
    } catch (err) {
      console.error('Error al guardar datos de pago:', err)
      setPaymentMsg('Error al guardar datos. Intenta nuevamente.')
    } finally {
      setSavingPayment(false)
    }
  }

  const referralUrl = partner
    ? `https://velia.mx/p/${partner.referralSlug}`
    : 'https://velia.mx'

  const copyToClipboard = (text: string, msg: string) => {
    navigator.clipboard.writeText(text)
    alert(msg)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-28 flex items-center justify-center bg-ivory">
        <div className="text-center font-body text-sm text-brown/60">
          Cargando Panel de Partner VÉLIA...
        </div>
      </div>
    )
  }

  if (!partner) {
    return (
      <div className="min-h-screen pt-28 pb-16 flex items-center justify-center px-6 bg-ivory">
        <div className="max-w-md bg-white border border-beige/80 rounded-2xl p-8 text-center shadow-sm">
          <h2 className="font-display text-2xl text-brown font-light mb-3">
            Acceso a VÉLIA Partners
          </h2>
          <p className="font-body text-xs text-brown/60 mb-6">
            Aún no has registrado tu solicitud para el programa de Partners de VÉLIA.
          </p>
          <button
            onClick={() => onNavigate('partner_onboarding')}
            className="w-full bg-brown text-ivory font-body text-xs font-medium py-3 rounded-full hover:bg-ink transition-all cursor-pointer"
          >
            Quiero ser Partner
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-16 lg:pt-20 bg-ivory flex flex-col lg:flex-row">

      {/* Sidebar Navigation */}
      <aside className="w-full lg:w-64 bg-white border-b lg:border-b-0 lg:border-r border-beige/80 p-4 lg:p-6 flex-shrink-0">
        <div className="flex items-center justify-between lg:block mb-6">
          <div>
            <span className="font-display text-xs tracking-[0.25em] text-champagne uppercase block">
              PARTNER PORTAL
            </span>
            <h2 className="font-display text-lg text-brown font-medium truncate">
              {partner.businessName}
            </h2>
            <div className="mt-1 flex items-center gap-2">
              <span className={`text-[0.62rem] px-2 py-0.5 rounded-full font-body font-medium uppercase tracking-wider ${
                partner.status === 'active'
                  ? 'bg-emerald-100 text-emerald-800'
                  : partner.status === 'pending'
                  ? 'bg-amber-100 text-amber-800'
                  : 'bg-rose/15 text-brown'
              }`}>
                {partner.status === 'active' ? 'Partner Activo' : partner.status === 'pending' ? 'En Revisión' : partner.status}
              </span>
              <span className="text-[0.62rem] text-brown/50 font-body">
                Comisión: {partner.commissionRate}%
              </span>
            </div>
          </div>

          <button
            onClick={() => setShowSavedModal(true)}
            className="mt-3 w-full bg-brown text-ivory font-body text-xs font-medium py-2 px-3 rounded-full hover:bg-ink transition-colors cursor-pointer flex items-center justify-center gap-1.5 shadow-xs"
          >
            <span>📂</span>
            <span>Mis Invitaciones</span>
          </button>
        </div>

        {/* Tab Items */}
        <nav className="flex lg:flex-col overflow-x-auto gap-1 pb-2 lg:pb-0 scrollbar-none">
          {[
            { id: 'inicio', label: 'Inicio', icon: '📊' },
            { id: 'clientes', label: 'Clientes', icon: '👥' },
            { id: 'eventos', label: 'Eventos', icon: '📅' },
            { id: 'invitaciones', label: 'Invitaciones', icon: '💌' },
            { id: 'ventas', label: 'Ventas', icon: '💳' },
            { id: 'comisiones', label: 'Comisiones', icon: '💰' },
            { id: 'referidos', label: 'Referidos', icon: '🔗' },
            { id: 'materiales', label: 'Materiales', icon: '🎨' },
            { id: 'perfil', label: 'Perfil y Pagos', icon: '⚙️' },
            { id: 'ayuda', label: 'Ayuda', icon: '❓' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id as PartnerDashboardTab)}
              className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl font-body text-xs font-medium transition-all whitespace-nowrap cursor-pointer text-left ${
                activeTab === item.id
                  ? 'bg-brown text-ivory shadow-sm'
                  : 'text-brown/70 hover:bg-ivory hover:text-brown'
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="hidden lg:block mt-8 pt-6 border-t border-beige/60">
          <button
            onClick={() => onNavigate('landing')}
            className="w-full text-left font-body text-xs text-brown/60 hover:text-brown flex items-center gap-2 cursor-pointer"
          >
            <span>← Volver a VÉLIA</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-10 max-w-6xl mx-auto w-full">

        {/* Tab 1: INICIO */}
        {activeTab === 'inicio' && (
          <div className="space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-3xl text-brown font-light">
                  Buenos días, {partner.businessName || partner.firstName}
                </h1>
                <p className="font-body text-xs text-brown/50 mt-1">
                  Resumen general de rendimiento, clientes y eventos de {partner.businessName}.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowAddClientModal(true)}
                  className="bg-brown text-ivory font-body text-xs px-4 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer"
                >
                  + Nuevo Cliente
                </button>
              </div>
            </div>

            {/* Metrics cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
                <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
                  Ventas este mes
                </span>
                <span className="font-display text-2xl sm:text-3xl text-brown font-medium block">
                  ${metrics?.monthlySalesAmount?.toLocaleString('es-MX') || 0} MXN
                </span>
                <span className="font-body text-[0.7rem] text-emerald-700 mt-1 block">
                  {metrics?.totalSalesCount || 0} transacciones
                </span>
              </div>

              <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
                <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
                  Comisiones Generadas
                </span>
                <span className="font-display text-2xl sm:text-3xl text-brown font-medium block">
                  ${metrics?.totalCommissionAmount?.toLocaleString('es-MX') || 0} MXN
                </span>
                <span className="font-body text-[0.7rem] text-brown/50 mt-1 block">
                  Tasa actual: {partner.commissionRate}%
                </span>
              </div>

              <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
                <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
                  Comisiones Pendientes
                </span>
                <span className="font-display text-2xl sm:text-3xl text-amber-800 font-medium block">
                  ${metrics?.pendingCommissionAmount?.toLocaleString('es-MX') || 0} MXN
                </span>
                <span className="font-body text-[0.7rem] text-amber-700 mt-1 block">
                  En periodo de validación
                </span>
              </div>

              <div className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm">
                <span className="font-body text-[0.65rem] tracking-[0.15em] text-brown/50 uppercase block mb-1">
                  Comisiones Pagadas
                </span>
                <span className="font-display text-2xl sm:text-3xl text-emerald-800 font-medium block">
                  ${metrics?.paidCommissionAmount?.toLocaleString('es-MX') || 0} MXN
                </span>
                <span className="font-body text-[0.7rem] text-emerald-700 mt-1 block">
                  Depositado vía SPEI
                </span>
              </div>
            </div>

            {/* Overview Quick Stats & Referral Banner */}
            <div className="grid lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-beige/80 rounded-2xl p-6 shadow-sm space-y-4">
                <div className="flex justify-between items-center border-b border-beige/60 pb-3">
                  <h3 className="font-display text-lg text-brown font-medium">
                    Clientes y Eventos Activos
                  </h3>
                  <button
                    onClick={() => setActiveTab('clientes')}
                    className="font-body text-xs text-champagne hover:underline cursor-pointer"
                  >
                    Ver todos ({clients.length})
                  </button>
                </div>

                {clients.length === 0 ? (
                  <div className="text-center py-8 font-body text-xs text-brown/50">
                    Aún no has registrado clientes. Haz clic en "+ Nuevo Cliente" para comenzar.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {clients.slice(0, 4).map((cli) => {
                      const clientEvts = events.filter(e => e.partnerClientId === cli.id)
                      return (
                        <div
                          key={cli.id}
                          className="flex items-center justify-between p-3 rounded-xl bg-ivory/50 border border-beige/60 text-xs font-body"
                        >
                          <div>
                            <span className="font-medium text-brown block">
                              {cli.firstName} {cli.lastName}
                            </span>
                            <span className="text-brown/50">
                              {cli.eventType} • {cli.email}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="px-2 py-0.5 rounded-full bg-beige/80 text-brown/70 text-[0.65rem]">
                              {clientEvts.length} evento(s)
                            </span>
                            <button
                              onClick={() => {
                                setSelectedClientForEvent(cli)
                                setShowCreateEventModal(true)
                              }}
                              className="text-brown hover:text-champagne font-medium underline cursor-pointer"
                            >
                              + Evento
                            </button>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

              {/* Referral Banner */}
              <div className="bg-gradient-to-br from-brown to-ink text-ivory rounded-2xl p-6 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
                    TU ENLACE DE PARTNER
                  </span>
                  <h3 className="font-display text-xl text-white font-light mb-2">
                    Comparte VÉLIA con tus clientes
                  </h3>
                  <p className="font-body text-xs text-white/70 leading-relaxed mb-4">
                    Comparte tu enlace personalizado. Toda compra realizada a través de él te asignará automáticamente la comisión correspondiente.
                  </p>
                  <div className="p-3 bg-white/10 rounded-xl border border-white/15 text-xs font-mono break-all text-champagne mb-4">
                    {referralUrl}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => copyToClipboard(referralUrl, '¡Enlace de Partner copiado al portapapeles!')}
                    className="flex-1 bg-champagne text-brown font-body font-medium text-xs py-2.5 rounded-full hover:bg-white transition-colors cursor-pointer text-center"
                  >
                    Copiar Enlace
                  </button>
                  <button
                    onClick={() => setShowQrModal(true)}
                    className="bg-white/15 text-white font-body text-xs px-3 py-2.5 rounded-full hover:bg-white/25 transition-colors cursor-pointer"
                  >
                    QR
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Tab 2: CLIENTES */}
        {activeTab === 'clientes' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                  Clientes de {partner.businessName}
                </h1>
                <p className="font-body text-xs text-brown/50 mt-1">
                  Directorio de clientes atendidos para creación de invitaciones.
                </p>
              </div>

              <button
                onClick={() => setShowAddClientModal(true)}
                className="bg-brown text-ivory font-body text-xs px-5 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer"
              >
                + Registrar Cliente
              </button>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
              {clients.length === 0 ? (
                <div className="p-12 text-center font-body text-xs text-brown/50">
                  Aún no tienes clientes registrados. Agrega uno nuevo para iniciar sus eventos e invitaciones.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem] tracking-wider">
                      <tr>
                        <th className="p-4">Cliente</th>
                        <th className="p-4">Contacto</th>
                        <th className="p-4">Tipo Evento</th>
                        <th className="p-4">Eventos</th>
                        <th className="p-4 text-right">Acciones</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/60 text-brown">
                      {clients.map((cli) => {
                        const cliEvents = events.filter(e => e.partnerClientId === cli.id)
                        return (
                          <tr key={cli.id} className="hover:bg-ivory/30">
                            <td className="p-4 font-medium">
                              {cli.firstName} {cli.lastName}
                              {cli.notes && (
                                <span className="block text-[0.68rem] text-brown/50 font-normal truncate max-w-xs">
                                  {cli.notes}
                                </span>
                              )}
                            </td>
                            <td className="p-4">
                              <div>{cli.email}</div>
                              <div className="text-brown/50 text-[0.68rem]">{cli.phone}</div>
                            </td>
                            <td className="p-4">{cli.eventType}</td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 bg-beige/60 rounded-full text-[0.68rem]">
                                {cliEvents.length} eventos
                              </span>
                            </td>
                            <td className="p-4 text-right space-x-2">
                              <button
                                onClick={() => {
                                  setSelectedClientForEvent(cli)
                                  setShowCreateEventModal(true)
                                }}
                                className="bg-brown text-ivory px-3 py-1.5 rounded-full text-[0.68rem] hover:bg-ink cursor-pointer"
                              >
                                + Crear Evento
                              </button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 3: EVENTOS */}
        {activeTab === 'eventos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                  Eventos Gestionados
                </h1>
                <p className="font-body text-xs text-brown/50 mt-1">
                  Eventos creados para tus clientes.
                </p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              {events.length === 0 ? (
                <div className="col-span-2 bg-white border border-beige/80 rounded-2xl p-10 text-center font-body text-xs text-brown/50">
                  No hay eventos asociados. Crea un cliente e inicia un nuevo evento.
                </div>
              ) : (
                events.map((evt) => {
                  const client = clients.find(c => c.id === evt.partnerClientId)
                  return (
                    <div key={evt.id} className="bg-white border border-beige/80 rounded-2xl p-5 shadow-sm space-y-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <span className="text-[0.65rem] font-body tracking-wider text-champagne uppercase font-medium">
                            {evt.eventType} • {evt.style}
                          </span>
                          <h3 className="font-display text-lg text-brown font-medium">
                            {evt.person1Name} {evt.person2Name ? `& ${evt.person2Name}` : ''}
                          </h3>
                          {client && (
                            <span className="text-xs font-body text-brown/60 block">
                              Cliente: {client.firstName} {client.lastName}
                            </span>
                          )}
                        </div>
                        <span className={`px-2.5 py-0.5 rounded-full text-[0.62rem] font-body uppercase font-medium ${
                          evt.status === 'Published'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-beige/80 text-brown/70'
                        }`}>
                          {evt.status === 'Published' ? 'Publicado' : 'Borrador'}
                        </span>
                      </div>

                      <div className="text-xs font-body text-brown/70 space-y-1 pt-2 border-t border-beige/60">
                        <div>📅 Fecha: {evt.date}</div>
                        {evt.venue && <div>📍 Lugar: {evt.venue}</div>}
                        <div>🔗 Slug: <span className="font-mono text-brown">{evt.customSlug}</span></div>
                      </div>

                      <div className="pt-2 flex justify-between items-center">
                        <span className="text-[0.68rem] text-brown/50 font-body">
                          Plan: {evt.planId?.toUpperCase() || 'FREE'}
                        </span>
                        {onSelectEventToEdit && (
                          <button
                            onClick={() => onSelectEventToEdit(evt)}
                            className="text-xs font-body text-brown font-medium underline hover:text-champagne cursor-pointer"
                          >
                            Editar Invitación →
                          </button>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        )}

        {/* Tab 4: INVITACIONES */}
        {activeTab === 'invitaciones' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Invitaciones Digitales
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Visualización de las invitaciones digitales de tus eventos.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {events.map((evt) => {
                const tpl = TEMPLATES_DATA.find(t => t.id === evt.selectedTemplateId) || TEMPLATES_DATA[0]
                return (
                  <div key={evt.id} className="bg-white border border-beige/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="h-32 bg-ivory relative overflow-hidden">
                        <img
                          src={tpl.img}
                          alt={tpl.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full text-[0.62rem] font-body text-brown uppercase font-medium">
                          {tpl.name}
                        </div>
                      </div>

                      <div className="p-4 space-y-2">
                        <h3 className="font-display text-base text-brown font-medium">
                          {evt.person1Name} {evt.person2Name ? `& ${evt.person2Name}` : ''}
                        </h3>
                        <p className="font-body text-xs text-brown/60">
                          {evt.eventType} • {evt.date}
                        </p>
                        <div className="text-[0.68rem] font-mono text-champagne">
                          velia.mx/e/{evt.customSlug}
                        </div>
                      </div>
                    </div>

                    <div className="p-4 border-t border-beige/60 flex items-center justify-between">
                      <a
                        href={`/e/${evt.customSlug}`}
                        target="_blank"
                        rel="noreferrer"
                        className="font-body text-xs text-brown underline hover:text-champagne cursor-pointer"
                      >
                        Ver Invitación ↗
                      </a>
                      {onSelectEventToEdit && (
                        <button
                          onClick={() => onSelectEventToEdit(evt)}
                          className="font-body text-xs bg-brown text-ivory px-3 py-1.5 rounded-full hover:bg-ink cursor-pointer"
                        >
                          Administrar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Tab 5: VENTAS */}
        {activeTab === 'ventas' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Ventas de {partner.businessName}
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Historial de contrataciones de invitaciones realizadas por tus clientes.
              </p>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
              {sales.length === 0 ? (
                <div className="p-12 text-center font-body text-xs text-brown/50">
                  Aún no se han registrado ventas. Comparte tu enlace o ayuda a tus clientes a elegir su plan.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem]">
                      <tr>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Importe Venta</th>
                        <th className="p-4">% Comisión</th>
                        <th className="p-4 text-right">Comisión Ganada</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/60 text-brown">
                      {sales.map((s) => (
                        <tr key={s.id}>
                          <td className="p-4">{new Date(s.createdAt).toLocaleDateString('es-MX')}</td>
                          <td className="p-4 font-medium uppercase">{s.planId}</td>
                          <td className="p-4">${s.amount} MXN</td>
                          <td className="p-4">{s.commissionRate}%</td>
                          <td className="p-4 text-right font-medium text-emerald-800">
                            +${s.commissionAmount} MXN
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 6: COMISIONES */}
        {activeTab === 'comisiones' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Historial de Comisiones
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Estado de tus ganancias y transferencias bancarias programadas.
              </p>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl shadow-sm overflow-hidden">
              {commissions.length === 0 ? (
                <div className="p-12 text-center font-body text-xs text-brown/50">
                  No hay comisiones registradas actualmente.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left font-body text-xs">
                    <thead className="bg-ivory/80 border-b border-beige/80 text-brown/60 uppercase text-[0.65rem]">
                      <tr>
                        <th className="p-4">Fecha</th>
                        <th className="p-4">Plan</th>
                        <th className="p-4">Venta Total</th>
                        <th className="p-4">Tasa</th>
                        <th className="p-4">Monto Comisión</th>
                        <th className="p-4 text-right">Estado</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-beige/60 text-brown">
                      {commissions.map((c) => (
                        <tr key={c.id}>
                          <td className="p-4">{new Date(c.createdAt).toLocaleDateString('es-MX')}</td>
                          <td className="p-4 font-medium uppercase">{c.planId}</td>
                          <td className="p-4">${c.saleAmount} MXN</td>
                          <td className="p-4">{c.commissionRate}%</td>
                          <td className="p-4 font-medium text-brown">${c.commissionAmount} MXN</td>
                          <td className="p-4 text-right">
                            <span className={`px-2.5 py-0.5 rounded-full text-[0.65rem] font-medium uppercase ${
                              c.status === 'paid'
                                ? 'bg-emerald-100 text-emerald-800'
                                : c.status === 'approved'
                                ? 'bg-sky-100 text-sky-800'
                                : 'bg-amber-100 text-amber-800'
                            }`}>
                              {c.status === 'paid' ? 'Pagado' : c.status === 'approved' ? 'Aprobado' : 'Pendiente'}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Tab 7: REFERIDOS */}
        {activeTab === 'referidos' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Herramientas de Atribución de Referidos
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Tu enlace y código único de Partner.
              </p>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block font-body text-xs text-brown/60 uppercase tracking-wider mb-2">
                    Código Promocional
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-2xl text-brown font-semibold bg-ivory px-4 py-2 rounded-xl border border-beige">
                      {partner.referralCode}
                    </span>
                    <button
                      onClick={() => copyToClipboard(partner.referralCode, 'Código copiado.')}
                      className="bg-brown text-ivory font-body text-xs px-4 py-2.5 rounded-xl hover:bg-ink cursor-pointer"
                    >
                      Copiar
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block font-body text-xs text-brown/60 uppercase tracking-wider mb-2">
                    Enlace de Atribución Personalizado
                  </label>
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs text-brown bg-ivory px-3 py-2.5 rounded-xl border border-beige truncate flex-1">
                      {referralUrl}
                    </span>
                    <button
                      onClick={() => copyToClipboard(referralUrl, 'Enlace copiado.')}
                      className="bg-brown text-ivory font-body text-xs px-4 py-2.5 rounded-xl hover:bg-ink cursor-pointer"
                    >
                      Copiar
                    </button>
                  </div>
                </div>
              </div>

              <div className="pt-6 border-t border-beige/60">
                <h3 className="font-display text-lg text-brown font-medium mb-2">
                  ¿Cómo funciona la atribución?
                </h3>
                <p className="font-body text-xs text-brown/70 leading-relaxed max-w-2xl">
                  Cuando un cliente ingresa a VÉLIA usando tu enlace <span className="font-mono font-medium text-brown">/p/{partner.referralSlug}</span> o ingresa tu código <span className="font-mono font-medium text-brown">{partner.referralCode}</span>, el navegador guarda la atribución durante 30 días. Cualquier plan comercial contratado por ese cliente asignará automáticamente tu comisión del {partner.commissionRate}%.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Tab 8: MATERIALES */}
        {activeTab === 'materiales' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Material Promocional y Kit de Ventas
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Recursos gráficos y guías para recomendar VÉLIA a tus clientes.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="text-3xl">📱</div>
                <h3 className="font-display text-lg text-brown font-medium">
                  Historias & Instagram
                </h3>
                <p className="font-body text-xs text-brown/60 leading-relaxed">
                  Plantillas diseñadas para compartir en historias con tu enlace.
                </p>
                <button
                  onClick={() => copyToClipboard(referralUrl, 'Enlace para historias copiado.')}
                  className="font-body text-xs text-brown underline hover:text-champagne cursor-pointer block"
                >
                  Copiar Enlace
                </button>
              </div>

              <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="text-3xl">💬</div>
                <h3 className="font-display text-lg text-brown font-medium">
                  Mensaje de WhatsApp
                </h3>
                <p className="font-body text-xs text-brown/60 leading-relaxed">
                  Texto sugerido para enviar a tus parejas o clientes de eventos.
                </p>
                <button
                  onClick={() => {
                    const msg = `¡Hola! Te comparto la plataforma de invitaciones digitales VÉLIA que sugiero para tu evento: ${referralUrl}`
                    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank')
                  }}
                  className="font-body text-xs text-emerald-700 underline font-medium cursor-pointer block"
                >
                  Enviar por WhatsApp ↗
                </button>
              </div>

              <div className="bg-white border border-beige/80 rounded-2xl p-6 shadow-sm space-y-3">
                <div className="text-3xl">📄</div>
                <h3 className="font-display text-lg text-brown font-medium">
                  Guía Comercial
                </h3>
                <p className="font-body text-xs text-brown/60 leading-relaxed">
                  Aprende a integrar la invitación VÉLIA dentro de tus paquetes de organización.
                </p>
                <a
                  href="#ayuda"
                  onClick={() => setActiveTab('ayuda')}
                  className="font-body text-xs text-brown underline hover:text-champagne cursor-pointer block"
                >
                  Ver Guía →
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Tab 9: PERFIL Y PAGOS */}
        {activeTab === 'perfil' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Datos de Negocio y Depósito
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Configura tu cuenta CLABE para el depósito de comisiones.
              </p>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-sm max-w-xl">
              <h3 className="font-display text-lg text-brown font-medium mb-4 pb-3 border-b border-beige/60">
                Cuenta Bancaria para Transferencias SPEI
              </h3>

              {paymentMsg && (
                <div className="mb-4 p-3 rounded-lg bg-champagne/20 border border-champagne/40 text-brown text-xs font-body">
                  {paymentMsg}
                </div>
              )}

              <form onSubmit={handleSavePaymentData} className="space-y-4">
                <div>
                  <label className="block font-body text-xs text-brown/70 uppercase mb-1">
                    Titular de la cuenta
                  </label>
                  <input
                    type="text"
                    required
                    value={clabeHolder}
                    onChange={e => setClabeHolder(e.target.value)}
                    placeholder="Nombre del Titular o Razón Social"
                    className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs text-brown/70 uppercase mb-1">
                    Banco
                  </label>
                  <input
                    type="text"
                    required
                    value={clabeBank}
                    onChange={e => setClabeBank(e.target.value)}
                    placeholder="BBVA, Banorte, Santander, etc."
                    className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body focus:outline-none focus:border-champagne"
                  />
                </div>

                <div>
                  <label className="block font-body text-xs text-brown/70 uppercase mb-1">
                    Clabe Interbancaria (18 dígitos)
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={18}
                    value={clabeNumber}
                    onChange={e => setClabeNumber(e.target.value.replace(/[^0-9]/g, ''))}
                    placeholder="012180000000000000"
                    className="w-full px-4 py-2.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-sm font-body font-mono focus:outline-none focus:border-champagne"
                  />
                </div>

                <button
                  type="submit"
                  disabled={savingPayment}
                  className="bg-brown text-ivory font-body text-xs px-6 py-3 rounded-full hover:bg-ink transition-colors cursor-pointer disabled:opacity-50 mt-2"
                >
                  {savingPayment ? 'Guardando...' : 'Guardar Datos de Depósito'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Tab 10: AYUDA */}
        {activeTab === 'ayuda' && (
          <div className="space-y-6">
            <div>
              <h1 className="font-display text-2xl lg:text-3xl text-brown font-light">
                Centro de Ayuda para Partners
              </h1>
              <p className="font-body text-xs text-brown/50 mt-1">
                Preguntas frecuentes y soporte dedicado para profesionales.
              </p>
            </div>

            <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 shadow-sm space-y-6 max-w-3xl">
              <div className="space-y-4 font-body text-xs text-brown/80 leading-relaxed">
                <div>
                  <h4 className="font-display text-sm text-brown font-medium mb-1">
                    ¿Cuándo se pagan las comisiones?
                  </h4>
                  <p>
                    Las comisiones se aprueban tras el periodo de validación y se depositan los días 1 y 15 de cada mes mediante transferencia SPEI a tu cuenta bancaria registrada.
                  </p>
                </div>

                <div className="pt-3 border-t border-beige/60">
                  <h4 className="font-display text-sm text-brown font-medium mb-1">
                    ¿Puedo incluir la invitación VÉLIA dentro del cobro de mis propios servicios?
                  </h4>
                  <p>
                    ¡Sí! Puedes incluirla dentro de tu presupuesto comercial como un valor agregado y contratar el plan correspondiente a nombre de tu cliente desde tu panel.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Modal: Add Client */}
      {showAddClientModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg relative">
            <h3 className="font-display text-2xl text-brown font-light mb-4">
              Registrar Nuevo Cliente
            </h3>

            <form onSubmit={handleAddClientSubmit} className="space-y-3 font-body text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-brown/70 mb-1">Nombre *</label>
                  <input
                    type="text"
                    required
                    value={newClientFirst}
                    onChange={e => setNewClientFirst(e.target.value)}
                    placeholder="Lucía"
                    className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-brown/70 mb-1">Apellido *</label>
                  <input
                    type="text"
                    required
                    value={newClientLast}
                    onChange={e => setNewClientLast(e.target.value)}
                    placeholder="Fernández"
                    className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Correo Electrónico *</label>
                <input
                  type="email"
                  required
                  value={newClientEmail}
                  onChange={e => setNewClientEmail(e.target.value)}
                  placeholder="lucia@correo.com"
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Teléfono / WhatsApp *</label>
                <input
                  type="tel"
                  required
                  value={newClientPhone}
                  onChange={e => setNewClientPhone(e.target.value)}
                  placeholder="55 1234 5678"
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Tipo de Evento</label>
                <select
                  value={newClientEventType}
                  onChange={e => setNewClientEventType(e.target.value as EventType)}
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                >
                  {['Boda', 'XV años', 'Cumpleaños', 'Baby shower', 'Bautizo', 'Graduación', 'Aniversario', 'Despedida', 'Otro'].map(et => (
                    <option key={et} value={et}>{et}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Notas</label>
                <textarea
                  rows={2}
                  value={newClientNotes}
                  onChange={e => setNewClientNotes(e.target.value)}
                  placeholder="Notas adicionales sobre el cliente o fecha estimada..."
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none resize-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowAddClientModal(false)}
                  className="px-4 py-2 text-brown/60 hover:text-brown cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-brown text-ivory px-5 py-2 rounded-full hover:bg-ink cursor-pointer"
                >
                  Guardar Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Create Event */}
      {showCreateEventModal && selectedClientForEvent && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-beige/80 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-lg relative">
            <h3 className="font-display text-2xl text-brown font-light mb-1">
              Nuevo Evento
            </h3>
            <p className="font-body text-xs text-brown/50 mb-4">
              Cliente: {selectedClientForEvent.firstName} {selectedClientForEvent.lastName}
            </p>

            <form onSubmit={handleCreateEventSubmit} className="space-y-3 font-body text-xs">
              <div>
                <label className="block text-brown/70 mb-1">Nombre Anfitrión / Pareja *</label>
                <input
                  type="text"
                  required
                  value={newEventPerson1}
                  onChange={e => setNewEventPerson1(e.target.value)}
                  placeholder="Lucía"
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Segundo Anfitrión (Opcional)</label>
                <input
                  type="text"
                  value={newEventPerson2}
                  onChange={e => setNewEventPerson2(e.target.value)}
                  placeholder="Mateo"
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Fecha del Evento *</label>
                <input
                  type="date"
                  required
                  value={newEventDate}
                  onChange={e => setNewEventDate(e.target.value)}
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-brown/70 mb-1">Lugar / Salón</label>
                <input
                  type="text"
                  value={newEventVenue}
                  onChange={e => setNewEventVenue(e.target.value)}
                  placeholder="Hacienda San José"
                  className="w-full px-3 py-2 bg-ivory/50 border border-beige rounded-lg text-brown focus:outline-none"
                />
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setShowCreateEventModal(false)}
                  className="px-4 py-2 text-brown/60 hover:text-brown cursor-pointer"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-brown text-ivory px-5 py-2 rounded-full hover:bg-ink cursor-pointer"
                >
                  Crear Evento
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: QR */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-ink/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-beige/80 rounded-2xl p-8 max-w-sm w-full shadow-lg text-center relative">
            <h3 className="font-display text-xl text-brown font-medium mb-2">
              Código QR de Partner
            </h3>
            <p className="font-body text-xs text-brown/60 mb-6">
              Muestra este código a tus clientes para que abran directamente tu enlace de Partner.
            </p>

            <div className="p-4 bg-ivory rounded-xl border border-beige inline-block mb-6">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(referralUrl)}`}
                alt="QR Partner"
                className="w-48 h-48 mx-auto"
              />
            </div>

            <button
              onClick={() => setShowQrModal(false)}
              className="bg-brown text-ivory font-body text-xs px-6 py-2.5 rounded-full hover:bg-ink cursor-pointer w-full"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}

      {/* Saved Invitations Modal */}
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
