import React, { useState } from 'react'
import { EventData, FeatureKey } from '../../types'
import { canUseFeature } from '../../services/entitlementService'
import UpgradeModal from './UpgradeModal'

interface FeatureGateProps {
  eventData?: EventData
  feature: FeatureKey
  title?: string
  description?: string
  fallbackMode?: 'hide' | 'lock' | 'inline'
  onOpenPlans?: () => void
  children: React.ReactNode
}

export default function FeatureGate({
  eventData,
  feature,
  title,
  description,
  fallbackMode = 'lock',
  onOpenPlans,
  children,
}: FeatureGateProps) {
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const isAllowed = canUseFeature(eventData, feature)

  if (isAllowed) {
    return <>{children}</>
  }

  if (fallbackMode === 'hide') {
    return null
  }

  return (
    <>
      <div className="relative group">
        <div className="opacity-50 pointer-events-none select-none blur-[0.5px]">
          {children}
        </div>

        <div className="absolute inset-0 bg-white/70 backdrop-blur-xs rounded-2xl flex flex-col items-center justify-center p-4 text-center space-y-2 border border-beige shadow-xs z-10">
          <span className="text-2xl">🔒</span>
          <p className="font-display text-lg text-brown font-light">
            {title || 'Función Disponible en Plan Premium'}
          </p>
          <p className="font-body text-xs text-brown/60 max-w-xs">
            {description || 'Actualiza tu plan para desbloquear este módulo en tu invitación.'}
          </p>
          <button
            onClick={() => setShowUpgradeModal(true)}
            className="bg-brown text-ivory font-body text-xs font-medium px-5 py-2 rounded-full hover:bg-ink transition-colors cursor-pointer mt-1"
          >
            Desbloquear con Premium
          </button>
        </div>
      </div>

      {showUpgradeModal && (
        <UpgradeModal
          feature={feature}
          title={title}
          description={description}
          onOpenPlans={() => {
            setShowUpgradeModal(false)
            if (onOpenPlans) onOpenPlans()
          }}
          onClose={() => setShowUpgradeModal(false)}
        />
      )}
    </>
  )
}
