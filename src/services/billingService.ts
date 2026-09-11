import { PlanId } from '../types'
import { getPlanDefinition } from './entitlementService'
import { httpsCallable } from 'firebase/functions'
import { functions } from '../firebase'

/**
 * Official VÉLIA Billing Architecture:
 * Initiates Stripe Checkout Session exclusively via Firebase Cloud Function
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

  // Call official Firebase Cloud Function 'createStripeCheckoutSession'
  const createSessionFn = httpsCallable<
    { planId: PlanId; eventId: string; originUrl: string },
    { checkoutUrl?: string; sessionId?: string }
  >(functions, 'createStripeCheckoutSession')

  const originUrl = typeof window !== 'undefined' ? window.location.origin : 'https://velia.mx'
  const result = await createSessionFn({ planId, eventId, originUrl })

  if (result.data?.checkoutUrl) {
    window.location.href = result.data.checkoutUrl
    return { checkoutUrl: result.data.checkoutUrl, sessionId: result.data.sessionId }
  }

  throw new Error('No se pudo generar la sesión de pago con Stripe.')
}
