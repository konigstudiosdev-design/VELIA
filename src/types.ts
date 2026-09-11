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
  planId?: PlanId
  billingStatus?: BillingStatus
  createdAt: string
  updatedAt: string
}

export interface EventData {
  id?: string
  ownerId?: string
  invitationId?: string
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

export * from './data/mockData'
