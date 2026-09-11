// Standalone Type Definitions for Firebase Functions Compilation
export type CallableContext = {
  auth?: {
    uid: string
  }
}

// Server-side Plan Definitions & Entitlements Authority
export const PLAN_CATALOG: Record<string, {
  name: string
  price: number // Price in MXN
  currency: string
  priceIdEnvVar: string
  limits: { maxEvents: number; maxGuests: number; maxPhotos: number; publicationDays: number }
  features: Record<string, boolean>
}> = {
  essential: {
    name: 'Esencial',
    price: 399,
    currency: 'mxn',
    priceIdEnvVar: process.env.STRIPE_PRICE_ESSENTIAL || 'price_essential_test',
    limits: { maxEvents: 1, maxGuests: 50, maxPhotos: 15, publicationDays: 30 },
    features: {
      publicInvitation: true,
      customSlug: true,
      rsvp: true,
      gifts: true,
      seating: false,
      gallery: true,
      analytics: false,
      playlist: true,
      guestbook: true,
      eventPhotos: false,
      lodging: true,
      whatsapp: true,
      customBranding: false,
    },
  },
  premium: {
    name: 'Premium',
    price: 699,
    currency: 'mxn',
    priceIdEnvVar: process.env.STRIPE_PRICE_PREMIUM || 'price_premium_test',
    limits: { maxEvents: 1, maxGuests: 150, maxPhotos: 50, publicationDays: 90 },
    features: {
      publicInvitation: true,
      customSlug: true,
      rsvp: true,
      gifts: true,
      seating: true,
      gallery: true,
      analytics: true,
      playlist: true,
      guestbook: true,
      eventPhotos: true,
      lodging: true,
      whatsapp: true,
      customBranding: false,
    },
  },
  signature: {
    name: 'Signature',
    price: 999,
    currency: 'mxn',
    priceIdEnvVar: process.env.STRIPE_PRICE_SIGNATURE || 'price_signature_test',
    limits: { maxEvents: 3, maxGuests: 1000, maxPhotos: 200, publicationDays: 365 },
    features: {
      publicInvitation: true,
      customSlug: true,
      rsvp: true,
      gifts: true,
      seating: true,
      gallery: true,
      analytics: true,
      playlist: true,
      guestbook: true,
      eventPhotos: true,
      lodging: true,
      whatsapp: true,
      customBranding: true,
    },
  },
}

/**
 * Helper: Builds server-side Stripe Checkout Session payload
 */
export function buildStripeCheckoutPayload(
  userId: string,
  eventId: string,
  planId: string,
  purchaseId: string,
  baseUrl: string
) {
  const plan = PLAN_CATALOG[planId] || PLAN_CATALOG.essential

  return {
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [
      {
        price_data: {
          currency: plan.currency,
          product_data: {
            name: `VÉLIA — Plan ${plan.name}`,
            description: `Licencia de evento para VÉLIA`,
          },
          unit_amount: plan.price * 100, // Price in cents
        },
        quantity: 1,
      },
    ],
    metadata: {
      userId,
      eventId,
      planId,
      purchaseId,
    },
    success_url: `${baseUrl}/?payment=verify&session_id={CHECKOUT_SESSION_ID}&purchase_id=${purchaseId}`,
    cancel_url: `${baseUrl}/?payment=canceled&eventId=${eventId}`,
  }
}

/**
 * Helper: Builds server-side Entitlement Snapshot
 */
export function buildEntitlementSnapshot(planId: string) {
  const plan = PLAN_CATALOG[planId] || PLAN_CATALOG.essential
  return {
    limits: plan.limits,
    features: plan.features,
  }
}
