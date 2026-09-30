import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../firebase'
import {
  PartnerProfile,
  PartnerClient,
  PartnerSale,
  PartnerCommission,
  PartnerSettings,
  PartnerAttribution,
  PartnerInvite,
  PartnerRole,
  PartnerStatus,
  PartnerTier,
  CommissionStatus,
  EventData,
  PurchaseRecord,
} from '../types'
import { createEventAndInvitation } from './eventService'

const DEFAULT_SETTINGS: PartnerSettings = {
  defaultCommissionRate: 40,
  attributionWindowDays: 30,
  minimumPayoutAmount: 500,
  tierRates: {
    partner: 40,
    pro: 45,
    studio: 50,
  },
  updatedAt: new Date().toISOString(),
}

const LOCAL_STORAGE_ATTRIBUTION_KEY = 'velia_partner_attribution'

// ─── REFERRAL ATTRIBUTION (LOCALSTORAGE) ──────────────────────────────────────

/**
 * Stores partner attribution in localStorage for a configurable duration (e.g. 30 days)
 */
export function saveReferralAttribution(
  partnerId: string,
  referralCode: string,
  referralSlug: string,
  windowDays = 30
): void {
  if (typeof window === 'undefined') return
  const now = Date.now()
  const expiresAt = now + windowDays * 24 * 60 * 60 * 1000

  const attribution: PartnerAttribution = {
    partnerId,
    referralCode,
    referralSlug,
    timestamp: now,
    expiresAt,
  }

  try {
    localStorage.setItem(LOCAL_STORAGE_ATTRIBUTION_KEY, JSON.stringify(attribution))
  } catch (err) {
    console.error('Error al guardar atribución de referido:', err)
  }
}

/**
 * Retrieves valid non-expired referral attribution from localStorage
 */
export function getStoredAttribution(): PartnerAttribution | null {
  if (typeof window === 'undefined') return null
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_ATTRIBUTION_KEY)
    if (!raw) return null
    const attr: PartnerAttribution = JSON.parse(raw)
    if (Date.now() > attr.expiresAt) {
      localStorage.removeItem(LOCAL_STORAGE_ATTRIBUTION_KEY)
      return null
    }
    return attr
  } catch {
    return null
  }
}

// ─── PARTNER SETTINGS (ADMIN & GLOBAL) ────────────────────────────────────────

/**
 * Gets global partner program settings from Firestore settings/partnerProgram
 */
export async function getPartnerSettings(): Promise<PartnerSettings> {
  try {
    const ref = doc(db, 'settings', 'partnerProgram')
    const snap = await getDoc(ref)
    if (snap.exists()) {
      return snap.data() as PartnerSettings
    }
  } catch (err) {
    console.warn('No se pudieron obtener los ajustes globales de Partners, usando valores por defecto:', err)
  }
  return DEFAULT_SETTINGS
}

/**
 * Updates global partner program settings (Admin only)
 */
export async function updatePartnerSettings(settings: Partial<PartnerSettings>): Promise<void> {
  const ref = doc(db, 'settings', 'partnerProgram')
  const current = await getPartnerSettings()
  const updated: PartnerSettings = {
    ...current,
    ...settings,
    updatedAt: new Date().toISOString(),
  }
  await setDoc(ref, updated, { merge: true })
}

// ─── PARTNER PROFILE & REGISTRATION ──────────────────────────────────────────

/**
 * Generates a clean referral code (e.g. MARIA10) and referral slug (e.g. maria-events)
 */
export function generateReferralIdentifiers(businessName: string): { code: string; slug: string } {
  const clean = businessName
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]/g, '')

  const shortName = clean.substring(0, 8).toUpperCase() || 'PARTNER'
  const randomNum = Math.floor(10 + Math.random() * 90)
  const code = `${shortName}${randomNum}`

  const slug = clean ? `${clean}-events` : `partner-${Date.now().toString(36)}`

  return { code, slug }
}

/**
 * Registers a new Partner application ("Quiero ser Partner")
 */
export async function registerPartner(
  userId: string,
  data: {
    firstName: string
    lastName: string
    businessName: string
    businessType: PartnerRole
    email: string
    phone: string
    whatsapp: string
    city: string
    instagram?: string
    website?: string
    description?: string
    inviteCode?: string
  }
): Promise<PartnerProfile> {
  const partnerId = `p_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  const { code, slug } = generateReferralIdentifiers(data.businessName)
  const settings = await getPartnerSettings()

  let initialStatus: PartnerStatus = 'pending'
  let customRate = settings.tierRates.partner || settings.defaultCommissionRate
  let customTier: PartnerTier = 'partner'

  // If invited by admin invite code, auto-approve
  if (data.inviteCode) {
    const invite = await validatePartnerInvite(data.inviteCode)
    if (invite) {
      initialStatus = 'active'
      customRate = invite.commissionRate || customRate
      customTier = invite.tier || customTier

      // Mark invite as used
      const inviteRef = doc(db, 'partnerInvites', invite.id)
      await updateDoc(inviteRef, {
        used: true,
        usedByPartnerId: partnerId,
        usedByUserId: userId,
        usedAt: new Date().toISOString(),
      })
    }
  }

  const partnerProfile: PartnerProfile = {
    partnerId,
    userId,
    firstName: data.firstName,
    lastName: data.lastName,
    businessName: data.businessName,
    businessType: data.businessType,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp,
    city: data.city,
    instagram: data.instagram || '',
    website: data.website || '',
    description: data.description || '',
    status: initialStatus,
    tier: customTier,
    commissionRate: customRate,
    referralCode: code,
    referralSlug: slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Save in partners/{partnerId}
  await setDoc(doc(db, 'partners', partnerId), {
    ...partnerProfile,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  })

  // Update user profile in users/{userId}
  const userRef = doc(db, 'users', userId)
  await updateDoc(userRef, {
    role: 'partner',
    partnerId,
    updatedAt: new Date().toISOString(),
  })

  return partnerProfile
}

/**
 * Gets a partner profile by userId
 */
export async function getPartnerByUserId(userId: string): Promise<PartnerProfile | null> {
  try {
    const q = query(collection(db, 'partners'), where('userId', '==', userId))
    const snap = await getDocs(q)
    if (!snap.empty) {
      return snap.docs[0].data() as PartnerProfile
    }
  } catch (err) {
    console.error('Error al obtener perfil de partner:', err)
  }
  return null
}

/**
 * Gets an active partner profile by referral code or referral slug
 */
export async function getPartnerBySlugOrCode(slugOrCode: string): Promise<PartnerProfile | null> {
  try {
    const term = slugOrCode.trim().toLowerCase()

    // Try by referralSlug
    const qSlug = query(
      collection(db, 'partners'),
      where('referralSlug', '==', term),
      where('status', '==', 'active')
    )
    const snapSlug = await getDocs(qSlug)
    if (!snapSlug.empty) {
      return snapSlug.docs[0].data() as PartnerProfile
    }

    // Try by referralCode (case-insensitive search)
    const qCode = query(
      collection(db, 'partners'),
      where('referralCode', '==', slugOrCode.trim().toUpperCase()),
      where('status', '==', 'active')
    )
    const snapCode = await getDocs(qCode)
    if (!snapCode.empty) {
      return snapCode.docs[0].data() as PartnerProfile
    }
  } catch (err) {
    console.error('Error al resolver partner por slug/código:', err)
  }
  return null
}

/**
 * Updates non-sensitive fields in partner profile
 */
export async function updatePartnerProfile(
  partnerId: string,
  data: Partial<PartnerProfile>
): Promise<void> {
  const ref = doc(db, 'partners', partnerId)
  const allowedKeys: (keyof PartnerProfile)[] = [
    'businessName',
    'phone',
    'whatsapp',
    'city',
    'instagram',
    'website',
    'description',
    'paymentMethodData',
  ]

  const updateData: Record<string, any> = { updatedAt: new Date().toISOString() }
  for (const key of allowedKeys) {
    if (data[key] !== undefined) {
      updateData[key] = data[key]
    }
  }

  await updateDoc(ref, updateData)
}

// ─── PARTNER CLIENTS ──────────────────────────────────────────────────────────

/**
 * Creates a new client under partners/{partnerId}/clients/{clientId}
 */
export async function createPartnerClient(
  partnerId: string,
  data: {
    firstName: string
    lastName: string
    email: string
    phone: string
    whatsapp?: string
    eventType: any
    notes?: string
  }
): Promise<PartnerClient> {
  const clientId = `c_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  const client: PartnerClient = {
    id: clientId,
    partnerId,
    firstName: data.firstName,
    lastName: data.lastName,
    email: data.email,
    phone: data.phone,
    whatsapp: data.whatsapp || data.phone,
    eventType: data.eventType,
    notes: data.notes || '',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const clientRef = doc(db, 'partners', partnerId, 'clients', clientId)
  await setDoc(clientRef, {
    ...client,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  })

  return client
}

/**
 * Gets all clients for a given partner
 */
export async function getPartnerClients(partnerId: string): Promise<PartnerClient[]> {
  try {
    const clientsRef = collection(db, 'partners', partnerId, 'clients')
    const snap = await getDocs(clientsRef)
    return snap.docs.map(doc => doc.data() as PartnerClient)
  } catch (err) {
    console.error('Error al obtener clientes del partner:', err)
    return []
  }
}

/**
 * Updates a partner client
 */
export async function updatePartnerClient(
  partnerId: string,
  clientId: string,
  data: Partial<PartnerClient>
): Promise<void> {
  const clientRef = doc(db, 'partners', partnerId, 'clients', clientId)
  await updateDoc(clientRef, {
    ...data,
    updatedAt: new Date().toISOString(),
  })
}

// ─── PARTNER EVENTS & INVITATIONS ─────────────────────────────────────────────

/**
 * Creates an event and invitation associated with a Partner and Partner Client
 */
export async function createPartnerEvent(
  partnerUserId: string,
  partnerId: string,
  clientId: string,
  eventData: EventData
): Promise<{ eventId: string; invitationId: string }> {
  const enhancedData: EventData = {
    ...eventData,
    partnerId,
    partnerClientId: clientId,
  }

  return await createEventAndInvitation(partnerUserId, enhancedData)
}

/**
 * Gets all events associated with a given partnerId
 */
export async function getPartnerEvents(partnerId: string): Promise<EventData[]> {
  try {
    const q = query(collection(db, 'events'), where('partnerId', '==', partnerId))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() } as EventData))
  } catch (err) {
    console.error('Error al obtener eventos del partner:', err)
    return []
  }
}

// ─── SALES & COMMISSIONS ──────────────────────────────────────────────────────

/**
 * Calculates and idempotently registers a sale and commission record for a partner
 */
export async function processPartnerSale(
  purchase: PurchaseRecord,
  partnerId: string,
  clientId?: string
): Promise<PartnerCommission | null> {
  try {
    const saleId = `sale_${purchase.id}`
    const commissionId = `comm_${purchase.id}`

    const commRef = doc(db, 'commissions', commissionId)
    const existingSnap = await getDoc(commRef)
    if (existingSnap.exists()) {
      return existingSnap.data() as PartnerCommission
    }

    // Fetch partner profile to get custom rate
    const partnerRef = doc(db, 'partners', partnerId)
    const partnerSnap = await getDoc(partnerRef)
    if (!partnerSnap.exists()) return null

    const partner = partnerSnap.data() as PartnerProfile
    const rate = partner.commissionRate || 15
    const commissionAmount = Math.round(purchase.amount * (rate / 100) * 100) / 100

    const commissionRecord: PartnerCommission = {
      id: commissionId,
      saleId,
      partnerId,
      partnerUserId: partner.userId,
      clientId: clientId || '',
      eventId: purchase.eventId,
      planId: purchase.planId,
      saleAmount: purchase.amount,
      commissionRate: rate,
      commissionAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    }

    // Save sales doc
    const saleRef = doc(db, 'sales', saleId)
    await setDoc(saleRef, {
      id: saleId,
      partnerId,
      partnerUserId: partner.userId,
      clientId: clientId || '',
      eventId: purchase.eventId,
      planId: purchase.planId,
      amount: purchase.amount,
      currency: purchase.currency || 'MXN',
      commissionRate: rate,
      commissionAmount,
      status: 'pending',
      createdAt: new Date().toISOString(),
    })

    // Save commissions doc
    await setDoc(commRef, commissionRecord)

    return commissionRecord
  } catch (err) {
    console.error('Error al procesar comisión de venta para partner:', err)
    return null
  }
}

/**
 * Gets sales log for a partner
 */
export async function getPartnerSales(partnerId: string): Promise<PartnerSale[]> {
  try {
    const q = query(collection(db, 'sales'), where('partnerId', '==', partnerId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data() as PartnerSale)
  } catch (err) {
    console.error('Error al obtener ventas del partner:', err)
    return []
  }
}

/**
 * Gets commissions log for a partner
 */
export async function getPartnerCommissions(partnerId: string): Promise<PartnerCommission[]> {
  try {
    const q = query(collection(db, 'commissions'), where('partnerId', '==', partnerId))
    const snap = await getDocs(q)
    return snap.docs.map(d => d.data() as PartnerCommission)
  } catch (err) {
    console.error('Error al obtener comisiones del partner:', err)
    return []
  }
}

/**
 * Computes live partner performance metrics
 */
export async function getPartnerMetrics(partnerId: string) {
  const clients = await getPartnerClients(partnerId)
  const events = await getPartnerEvents(partnerId)
  const sales = await getPartnerSales(partnerId)
  const commissions = await getPartnerCommissions(partnerId)

  const now = new Date()
  const currentMonth = now.getMonth()
  const currentYear = now.getFullYear()

  let totalSalesAmount = 0
  let monthlySalesAmount = 0
  let totalCommissionAmount = 0
  let pendingCommissionAmount = 0
  let approvedCommissionAmount = 0
  let paidCommissionAmount = 0

  sales.forEach(s => {
    totalSalesAmount += s.amount || 0
    const d = new Date(s.createdAt)
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      monthlySalesAmount += s.amount || 0
    }
  })

  commissions.forEach(c => {
    totalCommissionAmount += c.commissionAmount || 0
    if (c.status === 'pending') pendingCommissionAmount += c.commissionAmount || 0
    if (c.status === 'approved') approvedCommissionAmount += c.commissionAmount || 0
    if (c.status === 'paid') paidCommissionAmount += c.commissionAmount || 0
  })

  return {
    totalClients: clients.length,
    activeEvents: events.length,
    totalSalesCount: sales.length,
    totalSalesAmount,
    monthlySalesAmount,
    totalCommissionAmount,
    pendingCommissionAmount,
    approvedCommissionAmount,
    paidCommissionAmount,
  }
}

// ─── ADMIN MANAGEMENT ────────────────────────────────────────────────────────

/**
 * Gets all partner applications for Admin panel
 */
export async function getAdminPartners(): Promise<PartnerProfile[]> {
  try {
    const snap = await getDocs(collection(db, 'partners'))
    return snap.docs.map(d => d.data() as PartnerProfile)
  } catch (err) {
    console.error('Error al obtener partners para admin:', err)
    return []
  }
}

/**
 * Updates a partner's application status (pending, active, suspended, rejected)
 */
export async function updatePartnerStatus(
  partnerId: string,
  status: PartnerStatus
): Promise<void> {
  const ref = doc(db, 'partners', partnerId)
  await updateDoc(ref, {
    status,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Customizes a partner's commission rate and tier (Admin)
 */
export async function updatePartnerCommissionRate(
  partnerId: string,
  commissionRate: number,
  tier: PartnerTier
): Promise<void> {
  const ref = doc(db, 'partners', partnerId)
  await updateDoc(ref, {
    commissionRate,
    tier,
    updatedAt: new Date().toISOString(),
  })
}

/**
 * Updates a commission record status (Admin: approved, paid, cancelled)
 */
export async function updateCommissionStatus(
  commissionId: string,
  status: CommissionStatus
): Promise<void> {
  const ref = doc(db, 'commissions', commissionId)
  const updateData: Record<string, any> = {
    status,
    updatedAt: new Date().toISOString(),
  }
  if (status === 'approved') updateData.approvedAt = new Date().toISOString()
  if (status === 'paid') updateData.paidAt = new Date().toISOString()

  await updateDoc(ref, updateData)
}

// ─── ADMIN PARTNER INVITES & DIRECT CREATION ─────────────────────────────────

/**
 * Creates an exclusive Partner Invite link by Admin
 */
export async function createPartnerInviteLink(
  adminUserId: string,
  options: {
    businessName?: string
    email?: string
    commissionRate?: number
    tier?: PartnerTier
    expiryDays?: number
  }
): Promise<PartnerInvite> {
  const inviteId = `inv_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  const code = `INV-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  const now = Date.now()
  const expiryDays = options.expiryDays || 30

  const invite: PartnerInvite = {
    id: inviteId,
    code,
    businessName: options.businessName || '',
    email: options.email || '',
    commissionRate: options.commissionRate || 40,
    tier: options.tier || 'partner',
    createdBy: adminUserId,
    used: false,
    createdAt: new Date().toISOString(),
    expiresAt: new Date(now + expiryDays * 24 * 60 * 60 * 1000).toISOString(),
  }

  // Save invite in background without blocking function return
  setDoc(doc(db, 'partnerInvites', inviteId), invite).catch(err => console.warn('Guardando invitación en segundo plano:', err))
  return invite
}

/**
 * Validates a partner invite code
 */
export async function validatePartnerInvite(code: string): Promise<PartnerInvite | null> {
  try {
    const q = query(
      collection(db, 'partnerInvites'),
      where('code', '==', code.trim().toUpperCase()),
      where('used', '==', false)
    )
    const snap = await getDocs(q)
    if (!snap.empty) {
      const invite = snap.docs[0].data() as PartnerInvite
      if (new Date(invite.expiresAt).getTime() > Date.now()) {
        return invite
      }
    }
  } catch (err) {
    console.error('Error al validar código de invitación:', err)
  }
  return null
}

/**
 * Gets all partner invite links for admin
 */
export async function getAdminPartnerInvites(): Promise<PartnerInvite[]> {
  try {
    const snap = await getDocs(collection(db, 'partnerInvites'))
    return snap.docs.map(d => d.data() as PartnerInvite)
  } catch (err) {
    console.error('Error al obtener invitaciones de admin:', err)
    return []
  }
}

/**
 * Directly creates a pre-approved Active Partner profile by Admin
 */
export async function createPartnerDirectlyByAdmin(
  adminUserId: string,
  data: {
    firstName: string
    lastName: string
    businessName: string
    businessType: PartnerRole
    email: string
    phone: string
    city: string
    commissionRate: number
    tier: PartnerTier
  }
): Promise<PartnerProfile> {
  const partnerId = `p_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`
  const { code, slug } = generateReferralIdentifiers(data.businessName)

  const partnerProfile: PartnerProfile = {
    partnerId,
    userId: `pending_user_${partnerId}`,
    firstName: data.firstName,
    lastName: data.lastName,
    businessName: data.businessName,
    businessType: data.businessType,
    email: data.email,
    phone: data.phone,
    whatsapp: data.phone,
    city: data.city,
    status: 'active', // Pre-approved active status
    tier: data.tier || 'partner',
    commissionRate: data.commissionRate || 40,
    referralCode: code,
    referralSlug: slug,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  // Save partner in background without blocking function return
  setDoc(doc(db, 'partners', partnerId), {
    ...partnerProfile,
    createdByAdmin: adminUserId,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  }).catch(err => console.warn('Guardando partner en segundo plano:', err))

  return partnerProfile
}
