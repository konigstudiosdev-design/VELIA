# VÉLIA — Guía de Arquitectura de Monetización (Stripe Checkout Oficial)

## 1. Arquitectura Oficial de Pagos

VÉLIA utiliza **EXCLUSIVAMENTE** la arquitectura basada en Firebase Cloud Functions y Stripe Checkout Sessions para procesar pagos y asignar capacidades comerciales de forma segura.

```
┌──────────────────┐       httpsCallable        ┌────────────────────────────┐
│  VÉLIA Frontend  │ ─────────────────────────> │ Firebase Cloud Function    │
│     (React 19)   │                            │ createStripeCheckoutSession│
└──────────────────┘                            └────────────────────────────┘
         │                                                     │
         │ Redirección Checkout                                │ Stripe API
         ▼                                                     ▼
┌──────────────────┐                             ┌────────────────────────────┐
│ Stripe Checkout  │ ──────────────────────────> │    Stripe Payment Engine   │
└──────────────────┘                             └────────────────────────────┘
                                                               │
                                                               │ Webhook Signature
                                                               ▼
┌──────────────────┐    Firestore Transaction    ┌────────────────────────────┐
│  Firestore DB    │ <────────────────────────── │ Firebase Cloud Function    │
│ (events, paid)   │                             │        stripeWebhook       │
└──────────────────┘                             └────────────────────────────┘
```

---

## 2. Flujo de Datos & Autoridad Server-Side

1. **Frontend:** Invoca `initiateCheckoutSession(planId, eventId)`. Solamente envía `{ planId, eventId }`. **No envía precios, importes ni monedas.**
2. **Cloud Function (`createStripeCheckoutSession`):**
   * Valida la identidad del usuario (`context.auth.uid`).
   * Verifica la propiedad del evento (`events/{eventId}.ownerId == uid`).
   * Determina el precio e importe en el servidor a partir de `PLAN_CATALOG`.
   * Registra una compra en estado `pending` en `users/{uid}/purchases/{purchaseId}`.
   * Devuelve la URL oficial de la Checkout Session de Stripe.
3. **Webhook (`stripeWebhook`):**
   * Recibe el evento `checkout.session.completed`.
   * Valida la firma `Stripe-Signature` con `STRIPE_WEBHOOK_SECRET`.
   * Verifica idempotencia en `stripeEvents/{eventId}`.
   * Inyecta el `entitlementSnapshot` generado server-side hacia `events/{eventId}` y actualiza `billingStatus: 'paid'`.

---

## 3. Estado de Payment Links

Los enlaces directos de pago (*Stripe Payment Links* `https://buy.stripe.com/...`) son recursos promocionales opcionales para campañas externas de marketing. **No forman parte del flujo de compra interno dentro de VÉLIA.**

---

## 4. Variables de Entorno Requeridas en Servidor (`functions/.env`)

```env
STRIPE_SECRET_KEY=sk_test_51...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_ESSENTIAL=price_1P...
STRIPE_PRICE_PREMIUM=price_1P...
STRIPE_PRICE_SIGNATURE=price_1P...
```
