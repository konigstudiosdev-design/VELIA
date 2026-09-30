export type AppView =
  | 'landing'
  | 'login'
  | 'register'
  | 'onboarding'
  | 'summary'
  | 'templates'
  | 'preview'
  | 'creation'
  | 'dashboard'
  | 'partner_onboarding'
  | 'partner_dashboard'
  | 'admin_dashboard'

export type DashboardTab =
  | 'inicio'
  | 'editor'
  | 'invitados'
  | 'rsvp'
  | 'mesas'
  | 'regalos'
  | 'galeria'
  | 'estadisticas'
  | 'configuracion'
  | 'ayuda'

export type PartnerDashboardTab =
  | 'inicio'
  | 'clientes'
  | 'eventos'
  | 'invitaciones'
  | 'ventas'
  | 'comisiones'
  | 'referidos'
  | 'materiales'
  | 'perfil'
  | 'ayuda'

export type EventType =
  | 'Boda'
  | 'XV años'
  | 'Cumpleaños'
  | 'Baby shower'
  | 'Bautizo'
  | 'Graduación'
  | 'Aniversario'
  | 'Despedida'
  | 'Otro'

export type DesignStyle =
  | 'Editorial'
  | 'Romántico'
  | 'Minimalista'
  | 'Clásico'
  | 'Moderno'
  | 'Floral'
  | 'Luxury'

export type EventStatus = 'Draft' | 'Published' | 'Paused'

export type PlanId = 'free' | 'essential' | 'premium' | 'signature'

export type BillingType = 'free' | 'one_time' | 'subscription'

export type BillingStatus = 'free' | 'pending' | 'paid' | 'failed' | 'refunded' | 'canceled'

export type FeatureKey =
  | 'publicInvitation'
  | 'customSlug'
  | 'rsvp'
  | 'gifts'
  | 'seating'
  | 'gallery'
  | 'analytics'
  | 'playlist'
  | 'guestbook'
  | 'eventPhotos'
  | 'lodging'
  | 'whatsapp'
  | 'customBranding'

export interface PlanLimits {
  maxEvents: number
  maxGuests: number
  maxPhotos: number
  publicationDays: number // e.g. 30, 90, 365 or 0 for unlimited
}

export interface PlanFeatures {
  publicInvitation: boolean
  customSlug: boolean
  rsvp: boolean
  gifts: boolean
  seating: boolean
  gallery: boolean
  analytics: boolean
  playlist: boolean
  guestbook: boolean
  eventPhotos: boolean
  lodging: boolean
  whatsapp: boolean
  customBranding: boolean
}

export interface PlanDefinition {
  id: PlanId
  name: string
  price: number
  currency: string
  billingType: BillingType
  tagline: string
  featured?: boolean
  stripePaymentLink?: string
  limits: PlanLimits
  features: PlanFeatures
  featureBulletList: string[]
}

export interface PurchaseRecord {
  id: string
  userId: string
  eventId: string
  planId: PlanId
  amount: number
  currency: string
  provider: 'stripe'
  providerSessionId?: string
  providerPaymentId?: string
  status: BillingStatus
  partnerId?: string
  createdAt: string
  updatedAt: string
}

export type SectionType =
  | 'hero'
  | 'message'
  | 'countdown'
  | 'dateLocation'
  | 'schedule'
  | 'dressCode'
  | 'gallery'
  | 'rsvp'
  | 'gifts'
  | 'lodging'
  | 'playlist'
  | 'location'
  | 'guestbook'
  | 'eventPhotos'
  | 'seating'

export interface InvitationSection {
  id: string
  type: SectionType
  order: number
  enabled: boolean
  content: Record<string, any>
  settings: Record<string, any>
}

export interface InvitationTheme {
  primaryColor: string
  secondaryColor: string
  backgroundColor: string
  textColor: string
  accentColor: string
  headingFont: string
  bodyFont: string
  buttonStyle: 'rounded-full' | 'rounded-lg' | 'square'
  borderRadius: string
  spacing: 'compact' | 'normal' | 'relaxed'
}

export interface TemplateDefinition {
  id: string
  name: string
  category: EventType | 'Todos'
  style: DesignStyle
  tag: string
  img: string
  accent: string
  description: string
  theme: InvitationTheme
  defaultSections: InvitationSection[]
}

export interface UserProfile {
  uid: string
  name: string
  email: string
  photoURL?: string
  provider?: string
  role?: 'client' | 'partner' | 'admin'
  partnerId?: string
  planId?: PlanId
  billingStatus?: BillingStatus
  createdAt: string
  updatedAt: string
}

export interface EventData {
  id?: string
  ownerId?: string
  invitationId?: string
  partnerId?: string
  partnerClientId?: string
  eventType: EventType
  person1Name: string
  person2Name?: string
  age?: string
  yearsToCelebrate?: string
  date: string
  location?: string
  venue?: string
  style: DesignStyle
  selectedTemplateId: string
  customSlug: string
  status: EventStatus
  planId?: PlanId
  billingStatus?: BillingStatus
  purchaseId?: string
  entitlementSnapshot?: {
    limits: PlanLimits
    features: PlanFeatures
  }
  viewsCount?: number
  createdAt?: string
  updatedAt?: string
}

export interface InvitationData {
  id: string
  eventId: string
  ownerId: string
  templateId: string
  slug: string
  status: EventStatus
  theme?: InvitationTheme
  sections: InvitationSection[]
  eventData?: EventData
  publishedAt?: string | null
  createdAt: string
  updatedAt: string
}

export interface GuestItem {
  id: string
  invitationId?: string
  name: string
  phone: string
  email?: string
  group?: string
  passes: number
  confirmedGuests?: number
  rsvp: 'Confirmado' | 'Pendiente' | 'Rechazado'
  table: string
  notes?: string
  dietaryNotes?: string
  token: string
  createdAt?: string
  updatedAt?: string
}

export interface TableGroup {
  id: string
  invitationId?: string
  name: string
  number?: number
  capacity: number
  assignedGuestIds?: string[]
  notes?: string
  createdAt?: string
  updatedAt?: string
}

export interface GiftItem {
  id: string
  invitationId?: string
  title: string
  description?: string
  image?: string
  price?: number
  url?: string
  category: 'transfer' | 'wishlist' | 'physical' | 'external'
  enabled: boolean
  clabe?: string
  bank?: string
  beneficiary?: string
  createdAt?: string
  updatedAt?: string
}

export interface GalleryPhoto {
  id: string
  invitationId?: string
  url: string
  name?: string
  enabled: boolean
  createdAt?: string
}

export interface Template {
  id: string
  name: string
  category: EventType | 'Todos'
  style: DesignStyle
  tag: string
  img: string
  accent: string
  description: string
  fontFamily: string
  features: string[]
}

// ─── PARTNERS SYSTEM TYPES ───────────────────────────────────────────────────

export type PartnerRole =
  | 'wedding_planner'
  | 'event_planner'
  | 'organizer'
  | 'venue'
  | 'photographer'
  | 'decorator'
  | 'agency'
  | 'other'

export type PartnerTier = 'partner' | 'pro' | 'studio'

export type PartnerStatus = 'pending' | 'active' | 'suspended' | 'rejected'

export type CommissionStatus = 'pending' | 'approved' | 'paid' | 'cancelled' | 'refunded'

export interface PartnerProfile {
  partnerId: string
  userId: string
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
  status: PartnerStatus
  tier: PartnerTier
  commissionRate: number
  referralCode: string
  referralSlug: string
  paymentMethodData?: {
    accountHolderName?: string
    bankName?: string
    clabeNumber?: string
    paymentMethodType?: 'spei' | 'stripe' | 'other'
    notes?: string
  }
  createdAt: string
  updatedAt: string
}

export interface PartnerClient {
  id: string
  partnerId: string
  firstName: string
  lastName: string
  email: string
  phone: string
  whatsapp?: string
  eventType: EventType
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface PartnerSale {
  id: string
  partnerId: string
  partnerUserId: string
  clientId?: string
  clientName?: string
  eventId: string
  eventName?: string
  invitationId?: string
  planId: PlanId
  planName: string
  amount: number
  currency: string
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  createdAt: string
  paidAt?: string
}

export interface PartnerCommission {
  id: string
  saleId: string
  partnerId: string
  partnerUserId: string
  clientId?: string
  clientName?: string
  eventId: string
  eventName?: string
  planId: PlanId
  saleAmount: number
  commissionRate: number
  commissionAmount: number
  status: CommissionStatus
  createdAt: string
  approvedAt?: string
  paidAt?: string
}

export interface PartnerAttribution {
  partnerId: string
  referralCode: string
  referralSlug: string
  timestamp: number
  expiresAt: number
}

export interface PartnerSettings {
  defaultCommissionRate: number
  attributionWindowDays: number
  minimumPayoutAmount: number
  tierRates: {
    partner: number
    pro: number
    studio: number
  }
  updatedAt: string
}

export interface PartnerInvite {
  id: string
  code: string
  businessName?: string
  email?: string
  commissionRate: number
  tier: PartnerTier
  createdBy: string
  used: boolean
  usedByPartnerId?: string
  usedByUserId?: string
  createdAt: string
  expiresAt: string
}

export * from './data/mockData'
