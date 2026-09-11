import React from 'react'
import { FeatureKey, PlanId } from '../../types'
import { getPlanDefinition } from '../../services/entitlementService'

interface UpgradeModalProps {
  feature?: FeatureKey
  title?: string
  description?: string
  recommendedPlanId?: PlanId
  onOpenPlans: () => void
  onClose: () => void
}

export default function UpgradeModal({
  feature,
  title,
  description,
  recommendedPlanId = 'premium',
  onOpenPlans,
  onClose,
}: UpgradeModalProps) {
  const recommendedPlan = getPlanDefinition(recommendedPlanId)

  return (
    <div className="fixed inset-0 z-50 bg-ink/75 backdrop-blur-xs flex items-center justify-center p-4 select-none">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-beige text-center relative animate-fade-up space-y-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-ivory flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
        >
          ✕
        </button>

        <div className="w-14 h-14 rounded-full bg-champagne/20 border border-champagne/40 text-brown flex items-center justify-center text-2xl mx-auto">
          💎
        </div>

        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase block mb-1">
            Función Premium
          </span>
          <h3 className="font-display text-2xl sm:text-3xl text-brown font-light">
            {title || `Disponible en Plan ${recommendedPlan.name}`}
          </h3>
          <p className="font-body text-xs text-brown/60 mt-2 leading-relaxed">
            {description ||
              `Esta función requiere el plan ${recommendedPlan.name} para ser activada en tu invitación.`}
          </p>
        </div>

        {/* Highlight Plan Card */}
        <div className="bg-ivory border border-beige/80 rounded-2xl p-4 text-left space-y-2">
          <div className="flex justify-between items-center">
            <span className="font-display text-lg text-brown font-light">
              Plan {recommendedPlan.name}
            </span>
            <span className="font-display text-lg text-brown font-semibold">
              ${recommendedPlan.price} {recommendedPlan.currency}
            </span>
          </div>
          <p className="font-body text-[0.68rem] text-brown/55">
            {recommendedPlan.tagline}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              onClose()
              onOpenPlans()
            }}
            className="w-full bg-brown text-ivory font-body font-medium text-xs py-3 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs"
          >
            Ver Planes &amp; Precios
          </button>
          <button
            onClick={onClose}
            className="w-full sm:w-auto border border-beige text-brown/60 hover:text-brown font-body text-xs px-5 py-3 rounded-full transition-colors cursor-pointer"
          >
            Ahora no
          </button>
        </div>
      </div>
    </div>
  )
}
