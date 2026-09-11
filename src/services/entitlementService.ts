import { EventData, FeatureKey, PlanDefinition, PlanFeatures, PlanLimits, PlanId } from '../types'
import { PLAN_DEFINITIONS } from '../data/planDefinitions'

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
 * Returns effective limits and features for an event (prioritizing event.entitlementSnapshot)
 */
export function getEventEntitlements(event?: EventData): {
  limits: PlanLimits
  features: PlanFeatures
  planId: PlanId
} {
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
export function canUseFeature(event: EventData | undefined, feature: FeatureKey): boolean {
  const { features, planId } = getEventEntitlements(event)
  // Owner is allowed in free mode for editing/previewing, but feature gates present upgrade prompt for paid-only features
  if (event?.billingStatus === 'paid') {
    return features[feature] ?? true
  }
  return features[feature] ?? (planId !== 'free')
}

/**
 * Checks if an event can add more guests based on plan limits
 */
export function canAddGuest(event: EventData | undefined, currentGuestCount: number): {
  allowed: boolean
  maxGuests: number
  planId: PlanId
} {
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
export function canUploadPhoto(event: EventData | undefined, currentPhotoCount: number): {
  allowed: boolean
  maxPhotos: number
  planId: PlanId
} {
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
export function isPublicationExpired(event?: EventData): boolean {
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
export function canPublishEvent(event?: EventData): {
  canPublish: boolean
  reason?: string
} {
  if (!event) {
    return { canPublish: false, reason: 'Evento no encontrado.' }
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

  if (isPublicationExpired(event)) {
    return {
      canPublish: false,
      reason: 'La vigencia de publicación de tu plan ha expirado.',
    }
  }

  return { canPublish: true }
}
