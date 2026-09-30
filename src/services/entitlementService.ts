import { EventData, FeatureKey, PlanDefinition, PlanFeatures, PlanLimits, PlanId } from '../types'
import { PLAN_DEFINITIONS } from '../data/planDefinitions'

/**
 * Checks if a user is the owner / admin of VELIA
 */
export function isOwnerAdminUser(userEmail?: string, userRole?: string): boolean {
  if (!userEmail && !userRole) return false
  const email = userEmail.toLowerCase()
  return (
    email === 'konigstudios.dev@gmail.com' ||
    email === 'eder.adr05@gmail.com' ||
    userRole === 'admin'
  )
}

/**
 * Returns the PlanDefinition for a given planId (defaults to 'free')
 */
export function getPlanDefinition(planId?: PlanId): PlanDefinition {
  if (planId && PLAN_DEFINITIONS[planId]) {
    return PLAN_DEFINITIONS[planId]
  }
  return PLAN_DEFINITIONS.free
}

/**
 * Returns effective limits and features for an event (prioritizing event.entitlementSnapshot and owner privileges)
 */
export function getEventEntitlements(
  event?: EventData,
  userEmail?: string,
  userRole?: string
): {
  limits: PlanLimits
  features: PlanFeatures
  planId: PlanId
} {
  if (isOwnerAdminUser(userEmail, userRole)) {
    return {
      limits: {
        maxEvents: 999,
        maxGuests: 999999,
        maxPhotos: 999999,
        publicationDays: 0,
      },
      features: PLAN_DEFINITIONS.signature.features,
      planId: 'signature',
    }
  }

  if (event?.entitlementSnapshot) {
    return {
      limits: event.entitlementSnapshot.limits,
      features: event.entitlementSnapshot.features,
      planId: event.planId || 'free',
    }
  }

  const def = getPlanDefinition(event?.planId)
  return {
    limits: def.limits,
    features: def.features,
    planId: def.id,
  }
}

/**
 * Checks if a specific boolean feature is enabled for an event
 */
export function canUseFeature(
  event: EventData | undefined,
  feature: FeatureKey,
  userEmail?: string,
  userRole?: string
): boolean {
  if (isOwnerAdminUser(userEmail, userRole) || event?.billingStatus === 'paid' || event?.planId === 'signature') {
    return true
  }

  const { features, planId } = getEventEntitlements(event)
  return features[feature] ?? (planId !== 'free')
}

/**
 * Checks if an event can add more guests based on plan limits
 */
export function canAddGuest(
  event: EventData | undefined,
  currentGuestCount: number,
  userEmail?: string,
  userRole?: string
): {
  allowed: boolean
  maxGuests: number
  planId: PlanId
} {
  if (isOwnerAdminUser(userEmail, userRole) || event?.billingStatus === 'paid' || event?.planId === 'signature') {
    return { allowed: true, maxGuests: 999999, planId: 'signature' }
  }

  const { limits, planId } = getEventEntitlements(event)
  return {
    allowed: currentGuestCount < limits.maxGuests,
    maxGuests: limits.maxGuests,
    planId,
  }
}

/**
 * Checks if an event can upload more gallery photos based on plan limits
 */
export function canUploadPhoto(
  event: EventData | undefined,
  currentPhotoCount: number,
  userEmail?: string,
  userRole?: string
): {
  allowed: boolean
  maxPhotos: number
  planId: PlanId
} {
  if (isOwnerAdminUser(userEmail, userRole) || event?.billingStatus === 'paid' || event?.planId === 'signature') {
    return { allowed: true, maxPhotos: 999999, planId: 'signature' }
  }

  const { limits, planId } = getEventEntitlements(event)
  return {
    allowed: currentPhotoCount < limits.maxPhotos,
    maxPhotos: limits.maxPhotos,
    planId,
  }
}

/**
 * Checks if publication duration has expired
 */
export function isPublicationExpired(event?: EventData, userEmail?: string, userRole?: string): boolean {
  if (isOwnerAdminUser(userEmail, userRole) || event?.billingStatus === 'paid' || event?.planId === 'signature') {
    return false
  }

  if (!event || !event.createdAt) return false
  const { limits } = getEventEntitlements(event)
  if (limits.publicationDays === 0) return false // 0 = unlimited

  const created = new Date(event.createdAt).getTime()
  const now = new Date().getTime()
  const daysDiff = (now - created) / (1000 * 60 * 60 * 24)

  return daysDiff > limits.publicationDays
}

/**
 * Determines whether an event is eligible for public publication
 */
export function canPublishEvent(
  event?: EventData,
  userEmail?: string,
  userRole?: string
): {
  canPublish: boolean
  reason?: string
} {
  if (!event) {
    return { canPublish: false, reason: 'Evento no encontrado.' }
  }

  if (isOwnerAdminUser(userEmail, userRole) || event.billingStatus === 'paid' || event.planId === 'signature') {
    return { canPublish: true }
  }

  const { planId, features } = getEventEntitlements(event)

  if (planId === 'free' && event.billingStatus !== 'paid') {
    return {
      canPublish: false,
      reason: 'Tu evento está en modo Borrador Gratuito. Elige un plan comercial para publicar tu enlace.',
    }
  }

  if (!features.publicInvitation) {
    return {
      canPublish: false,
      reason: 'El plan actual no incluye publicación pública.',
    }
  }

  if (isPublicationExpired(event, userEmail, userRole)) {
    return {
      canPublish: false,
      reason: 'La vigencia de publicación de tu plan ha expirado.',
    }
  }

  return { canPublish: true }
}
