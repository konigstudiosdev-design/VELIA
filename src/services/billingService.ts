import { PlanId } from '../types'
import { getPlanDefinition } from './entitlementService'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

/**
 * Official VÉLIA Billing Architecture:
 * Initiates Stripe Checkout via Direct Official Payment Links with client_reference_id
 */
export async function initiateCheckoutSession(planId: PlanId, eventId: string): Promise<{
  checkoutUrl?: string
  sessionId?: string
}> {
  const plan = getPlanDefinition(planId)
  if (!plan) throw new Error('Plan comercial no válido.')

  if (planId === 'free') {
    throw new Error('El modo Borrador Gratuito no requiere pago.')
  }

  // 1. Direct Official Stripe Payment Links
  if (plan.stripePaymentLink) {
    const paymentUrl = `${plan.stripePaymentLink}?client_reference_id=${eventId || 'velia_event'}`
    if (typeof window !== 'undefined') {
      window.location.href = paymentUrl
    }
    return { checkoutUrl: paymentUrl }
  }

  // 2. Fallback to Firebase Cloud Function 'createStripeCheckoutSession'
  try {
    const createSessionFn = httpsCallable<
      { planId: PlanId; eventId: string; originUrl: string },
      { checkoutUrl?: string; sessionId?: string }
    >(functions, 'createStripeCheckoutSession')

    const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://velia.mx'
    const result = await createSessionFn({ planId, eventId, originUrl })

    if (result.data?.checkoutUrl) {
      if (typeof window !== 'undefined') {
        window.location.href = result.data.checkoutUrl
      }
      return { checkoutUrl: result.data.checkoutUrl, sessionId: result.data.sessionId }
    }
  } catch (err) {
    console.warn('Cloud Function checkout fallback:', err)
  }

  throw new Error('No se pudo generar la sesión de pago con Stripe.')
}
