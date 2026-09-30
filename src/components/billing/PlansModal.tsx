import React, { useState } from 'react'
import { PlanId } from '../../types'
import { PLAN_DEFINITIONS } from '../../data/planDefinitions'
import { initiateCheckoutSession } from '../../services/billingService'

interface PlansModalProps {
  currentPlanId?: PlanId
  eventId?: string
  onSelectPlan?: (planId: PlanId) => void
  onClose: () => void
}

export default function PlansModal({
  currentPlanId = 'free',
  eventId = '',
  onSelectPlan,
  onClose,
}: PlansModalProps) {
  const [submittingPlan, setSubmittingPlan] = useState<PlanId | null>(null)

  const commercialPlans = [
    PLAN_DEFINITIONS.essential,
    PLAN_DEFINITIONS.signature,
  ]

  const handleChoosePlan = async (planId: PlanId) => {
    setSubmittingPlan(planId)
    try {
      if (onSelectPlan) {
        onSelectPlan(planId)
      }
      await initiateCheckoutSession(planId, eventId)
    } catch (err: any) {
      console.error('Checkout session creation:', err)
    } finally {
      setSubmittingPlan(null)
    }
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto select-none">
      <div className="bg-white rounded-3xl max-w-4xl w-full p-6 sm:p-10 shadow-2xl border border-beige relative my-8 animate-fade-up space-y-8">
        <button
          onClick={onClose}
          className="absolute top-5 right-5 w-9 h-9 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
        >
          ✕
        </button>

        <div className="text-center max-w-xl mx-auto space-y-2">
          <span className="font-body text-[0.62rem] tracking-[0.35em] text-champagne uppercase font-medium">
            Planes Comerciales VÉLIA
          </span>
          <h2 className="font-display text-3xl sm:text-4xl text-brown font-light">
            Elige el plan ideal para tu evento
          </h2>
          <p className="font-body text-xs text-brown/55">
            Pago único por evento · Sin mensualidades ocultas · Acceso completo a tu dashboard
          </p>
        </div>

        {/* Plans Grid (2 Plans) */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 items-stretch max-w-3xl mx-auto">
          {commercialPlans.map(plan => {
            const isCurrent = currentPlanId === plan.id
            const isSubmitting = submittingPlan === plan.id

            return (
              <div
                key={plan.id}
                className={`relative rounded-3xl p-6 sm:p-8 flex flex-col justify-between transition-all ${
                  plan.featured
                    ? 'bg-brown text-ivory shadow-2xl md:-translate-y-2 border-2 border-champagne'
                    : 'bg-ivory/50 border border-beige/80 text-brown'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 font-body text-[0.58rem] tracking-[0.25em] uppercase bg-champagne text-brown font-bold px-3.5 py-1 rounded-full whitespace-nowrap shadow-xs">
                    Opción Más Popular
                  </span>
                )}

                <div className="space-y-4">
                  <div>
                    <span className={`font-body text-[0.65rem] tracking-[0.25em] uppercase block ${plan.featured ? 'text-champagne' : 'text-brown/50'}`}>
                      {plan.name}
                    </span>
                    <p className={`font-body text-[0.7rem] mt-1 ${plan.featured ? 'text-white/70' : 'text-brown/60'}`}>
                      {plan.tagline}
                    </p>
                  </div>

                  <div className="flex items-baseline gap-1 py-2">
                    <span className={`font-display text-4xl sm:text-5xl font-light ${plan.featured ? 'text-white' : 'text-brown'}`}>
                      ${plan.price}
                    </span>
                    <span className={`font-body text-xs ${plan.featured ? 'text-white/50' : 'text-brown/40'}`}>
                      {plan.currency} · Pago único
                    </span>
                  </div>

                  <ul className="space-y-2.5 pt-2 border-t border-beige/40">
                    {plan.featureBulletList.map((bullet, idx) => (
                      <li key={idx} className={`font-body text-xs flex items-start gap-2 leading-relaxed ${plan.featured ? 'text-white/80' : 'text-brown/70'}`}>
                        <span className="text-champagne flex-none">—</span>
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6">
                  <button
                    onClick={() => handleChoosePlan(plan.id)}
                    disabled={isSubmitting || isCurrent}
                    className={`w-full font-body text-xs font-medium py-3.5 rounded-full transition-all cursor-pointer shadow-xs disabled:opacity-50 ${
                      plan.featured
                        ? 'bg-champagne text-brown hover:bg-[#d4b990]'
                        : 'bg-brown text-ivory hover:bg-ink'
                    }`}
                  >
                    {isCurrent
                      ? 'Plan Actual'
                      : isSubmitting
                      ? 'Procesando...'
                      : `Seleccionar Plan ${plan.name}`}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
