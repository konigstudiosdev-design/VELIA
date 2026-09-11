import React, { useState } from 'react'
import { EventData, Template } from '../types'
import InvitationRenderer from './invitation/InvitationRenderer'

interface PreviewViewProps {
  template: Template
  eventData: EventData
  onBackToGallery: () => void
  onEditData: () => void
  onConfirmUseTemplate: (template: Template) => void
}

export default function PreviewView({
  template,
  eventData,
  onBackToGallery,
  onEditData,
  onConfirmUseTemplate,
}: PreviewViewProps) {
  const [deviceMode, setDeviceMode] = useState<'desktop' | 'mobile'>('desktop')

  return (
    <div className="min-h-screen pt-24 pb-16 px-4 sm:px-6 bg-ivory flex flex-col items-center">
      <div className="w-full max-w-6xl">
        {/* Top Control Bar */}
        <div className="bg-white border border-beige/80 rounded-2xl p-4 sm:p-5 mb-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={onBackToGallery}
              className="font-body text-xs text-brown/60 hover:text-brown border border-beige px-3.5 py-2 rounded-full cursor-pointer flex items-center gap-1"
            >
              ← Volver
            </button>
            <div>
              <p className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase">
                Plantilla seleccionada
              </p>
              <h2 className="font-display text-xl text-brown font-light">
                {template.name} ({template.style})
              </h2>
            </div>
          </div>

          {/* Device toggle */}
          <div className="flex items-center bg-ivory border border-beige p-1 rounded-full">
            <button
              onClick={() => setDeviceMode('desktop')}
              className={`font-body text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                deviceMode === 'desktop'
                  ? 'bg-brown text-ivory font-medium shadow-xs'
                  : 'text-brown/60 hover:text-brown'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              Desktop
            </button>
            <button
              onClick={() => setDeviceMode('mobile')}
              className={`font-body text-xs px-4 py-1.5 rounded-full transition-all cursor-pointer flex items-center gap-1.5 ${
                deviceMode === 'mobile'
                  ? 'bg-brown text-ivory font-medium shadow-xs'
                  : 'text-brown/60 hover:text-brown'
              }`}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              Mobile
            </button>
          </div>

          {/* Primary Action Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={onEditData}
              className="font-body text-xs text-brown/70 border border-beige/80 px-4 py-2.5 rounded-full hover:bg-beige/30 transition-colors cursor-pointer"
            >
              Editar datos
            </button>
            <button
              onClick={() => onConfirmUseTemplate(template)}
              className="bg-brown text-ivory font-body font-medium text-xs px-6 py-2.5 rounded-full hover:bg-ink transition-all duration-300 shadow-md hover:scale-[1.02] cursor-pointer"
            >
              Usar este diseño
            </button>
          </div>
        </div>

        {/* Preview Frame Area */}
        <div className="flex justify-center items-center my-6">
          {deviceMode === 'desktop' ? (
            /* Desktop Mockup Frame */
            <div className="w-full bg-white border border-beige rounded-2xl overflow-hidden shadow-2xl transition-all duration-500">
              {/* Browser bar */}
              <div className="bg-ivory/80 px-4 py-3 border-b border-beige flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose/60" />
                  <span className="w-3 h-3 rounded-full bg-champagne/60" />
                  <span className="w-3 h-3 rounded-full bg-beige" />
                </div>
                <div className="bg-white border border-beige px-6 py-1 rounded-full text-[0.7rem] font-body text-brown/50">
                  {eventData.customSlug || 'velia.mx/e/lucia-y-mateo'}
                </div>
                <div className="w-12" />
              </div>

              {/* Desktop Render Content via Modular Renderer */}
              <div className="min-h-[550px] relative overflow-hidden bg-ivory/30">
                <InvitationRenderer
                  eventData={eventData}
                  mode="preview"
                />
              </div>
            </div>
          ) : (
            /* Mobile Mockup Frame */
            <div className="relative w-[320px] sm:w-[380px] bg-ink rounded-[40px] p-3 shadow-2xl border-4 border-brown/40 transition-all duration-500">
              {/* Phone notch */}
              <div className="absolute top-6 left-1/2 -translate-x-1/2 w-28 h-4 bg-ink rounded-full z-20 flex items-center justify-center">
                <div className="w-10 h-1 bg-brown/40 rounded-full" />
              </div>

              {/* Screen container */}
              <div className="bg-ivory rounded-[30px] overflow-hidden min-h-[580px] max-h-[660px] overflow-y-auto relative">
                <InvitationRenderer
                  eventData={eventData}
                  mode="preview"
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
