import React, { useState } from 'react'
import { EventData, SectionConfig, ThemePreset, InvitationTheme, SectionType } from '../../types'
import { THEME_PRESETS } from '../../data/mockData'
import { getEventTypeConfig } from '../../config/eventTypeConfig'
import { getDefaultSections } from '../../data/templateDefinitions'
import { saveSectionsDraft, saveEventDataDraft, saveThemeDraft } from '../../utils/draftStorage'
import { saveInvitationSections } from '../../services/eventService'
import PhotoPickerModal from './PhotoPickerModal'
import InvitationRenderer from '../invitation/InvitationRenderer'

interface EditorTabProps {
  eventData: EventData
  sections: SectionConfig[]
  onUpdateSections: (sections: SectionConfig[]) => void
  onOpenPublicView: () => void
  onOpenPublishModal: () => void
  onOpenSavedInvitations?: () => void
  onSaveInvitation?: () => Promise<void> | void
}

const AVAILABLE_SECTION_TYPES: Array<{
  type: SectionType
  name: string
  icon: string
  defaultTitle: string
}> = [
  { type: 'hero', name: 'Portada', icon: '✨', defaultTitle: 'Nuestra Celebración' },
  { type: 'message', name: 'Mensaje / Historia', icon: '✉️', defaultTitle: 'Nuestra Invitación' },
  { type: 'countdown', name: 'Cuenta Regresiva', icon: '⏳', defaultTitle: 'Cuenta Regresiva' },
  { type: 'dateLocation', name: 'Cuándo & Dónde', icon: '⛪', defaultTitle: 'Cuándo & Dónde' },
  { type: 'schedule', name: 'Itinerario', icon: '🕒', defaultTitle: 'Itinerario del Evento' },
  { type: 'dressCode', name: 'Código de Vestimenta', icon: '👔', defaultTitle: 'Código de Vestimenta' },
  { type: 'gallery', name: 'Galería de Fotos', icon: '🖼️', defaultTitle: 'Galería de Recuerdos' },
  { type: 'gifts', name: 'Mesa de Regalos', icon: '🎁', defaultTitle: 'Mesa de Regalos' },
  { type: 'lodging', name: 'Hospedaje Recomendado', icon: '🏨', defaultTitle: 'Hospedaje Recomendado' },
  { type: 'playlist', name: 'Música & Playlist', icon: '🎵', defaultTitle: 'Música & Playlist' },
  { type: 'location', name: 'Ubicación & Mapa', icon: '📍', defaultTitle: 'Ubicación' },
  { type: 'guestbook', name: 'Libro de Firmas', icon: '✍️', defaultTitle: 'Libro de Firmas' },
  { type: 'eventPhotos', name: 'Fotos del Evento', icon: '📷', defaultTitle: 'Fotos del Evento' },
  { type: 'seating', name: 'Mesa / Asiento', icon: '🍽️', defaultTitle: 'Mesa / Asiento' },
]

export default function EditorTab({
  eventData,
  sections = [],
  onUpdateSections,
  onOpenPublicView,
  onOpenPublishModal,
  onOpenSavedInvitations,
}: EditorTabProps) {
  const config = getEventTypeConfig(eventData?.eventType)

  // Ensure sections array is never empty
  const rawSections = Array.isArray(sections) && sections.length > 0 ? sections.filter(Boolean) : (getDefaultSections(eventData) as any)

  // Filter out sections forbidden for this event type
  const availableSections = rawSections.filter((s: any) => {
    if (!s) return false
    const secType = s.type || s.id
    if (!config?.forbiddenSections) return true
    return !config.forbiddenSections.includes(secType)
  })

  const [selectedSectionId, setSelectedSectionId] = useState<string>(
    availableSections[0]?.id || 'portada'
  )
  const [deviceFormat, setDeviceFormat] = useState<'desktop' | 'tablet' | 'mobile'>('mobile')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'justSaved'>('saved')
  const [activeRightTab, setActiveRightTab] = useState<'properties' | 'theme'>('properties')

  // Theme State
  const [activeTheme, setActiveTheme] = useState<InvitationTheme>(
    eventData?.theme || {
      primaryColor: '#332B27',
      secondaryColor: '#C8A982',
      backgroundColor: '#FAF8F5',
      textColor: '#332B27',
      accentColor: '#C8A982',
      headingFont: 'Cormorant Garamond',
      bodyFont: 'Inter',
      buttonStyle: 'rounded-full',
      borderRadius: '1rem',
      spacing: 'normal',
    }
  )

  // Modals state
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [photoPickerTarget, setPhotoPickerTarget] = useState<'section' | 'gallery'>('section')
  const [showAddSectionModal, setShowAddSectionModal] = useState(false)

  // Selected Section object
  const selectedSection =
    availableSections.find((s: any) => s && s.id === selectedSectionId) || availableSections[0] || rawSections[0]

  // Trigger Save Feedback
  const triggerSaving = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('justSaved')
      setTimeout(() => setSaveStatus('saved'), 2000)
    }, 500)
  }

  // Manual Save Handler
  const handleManualSave = async () => {
    setSaveStatus('saving')
    try {
      saveSectionsDraft(rawSections)
      saveEventDataDraft(eventData)
      saveThemeDraft(activeTheme)

      if (eventData?.invitationId) {
        await saveInvitationSections(eventData.invitationId, rawSections)
      }

      if (onSaveInvitation) {
        await onSaveInvitation()
      }

      setSaveStatus('justSaved')
      setTimeout(() => setSaveStatus('saved'), 2500)
    } catch (err) {
      console.error('Error al guardar la invitación:', err)
      setSaveStatus('saved')
    }
  }

  // Update Section Handler
  const updateCurrentSection = (updatedProps: Partial<SectionConfig>) => {
    if (!selectedSection) return
    const newSections = rawSections.map((s: any) => {
      if (s && s.id === selectedSection.id) {
        const existingContent = s.content && typeof s.content === 'object' ? s.content : {}
        const newContent = updatedProps.content !== undefined ? updatedProps.content : existingContent

        return {
          ...s,
          ...updatedProps,
          content: typeof newContent === 'object' ? { ...existingContent, ...newContent } : newContent,
        }
      }
      return s
    })
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Toggle section visibility
  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSections = rawSections.map((s: any) => {
      if (s && s.id === id) {
        return {
          ...s,
          visible: s.visible !== undefined ? !s.visible : false,
          enabled: s.enabled !== undefined ? !s.enabled : false,
        }
      }
      return s
    })
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Move section up
  const moveSectionUp = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (index === 0) return
    const newSections = [...availableSections]
    const temp = newSections[index - 1]
    newSections[index - 1] = newSections[index]
    newSections[index] = temp
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Move section down
  const moveSectionDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (index === availableSections.length - 1) return
    const newSections = [...availableSections]
    const temp = newSections[index + 1]
    newSections[index + 1] = newSections[index]
    newSections[index] = temp
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Delete section
  const handleDeleteSection = (id: string) => {
    if (rawSections.length <= 1) return
    const newSections = rawSections.filter((s: any) => s && s.id !== id)
    onUpdateSections(newSections)
    if (selectedSectionId === id) {
      setSelectedSectionId(newSections[0]?.id || '')
    }
    triggerSaving()
  }

  // Add section handler
  const handleAddNewSection = (secDef: typeof AVAILABLE_SECTION_TYPES[0]) => {
    const newId = `sec_${secDef.type}_${Date.now()}`
    const newSec: any = {
      id: newId,
      type: secDef.type,
      name: secDef.name,
      icon: secDef.icon,
      visible: true,
      enabled: true,
      order: availableSections.length + 1,
      title: secDef.defaultTitle,
      content: {
        title: secDef.defaultTitle,
        text: 'Escribe aquí la información para tus invitados.',
      },
      alignment: 'center',
    }
    onUpdateSections([...rawSections, newSec])
    setSelectedSectionId(newId)
    setShowAddSectionModal(false)
    triggerSaving()
  }

  // Schedule items editor helpers
  const handleAddScheduleItem = () => {
    if (!selectedSection) return
    const currentContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    const currentItems: any[] = Array.isArray(currentContent.items) ? currentContent.items : [
      { time: '16:00 HRS', title: 'Misa / Ceremonia', desc: 'Lugar principal' },
    ]
    const newItems = [...currentItems, { time: '19:00 HRS', title: 'Nueva Actividad', desc: 'Descripción del evento' }]
    updateCurrentSection({ content: { ...currentContent, items: newItems } })
  }

  const handleUpdateScheduleItem = (index: number, field: string, val: string) => {
    if (!selectedSection) return
    const currentContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    const currentItems: any[] = Array.isArray(currentContent.items) ? currentContent.items : []
    const newItems = currentItems.map((item, i) => (i === index ? { ...item, [field]: val } : item))
    updateCurrentSection({ content: { ...currentContent, items: newItems } })
  }

  const handleDeleteScheduleItem = (index: number) => {
    if (!selectedSection) return
    const currentContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    const currentItems: any[] = Array.isArray(currentContent.items) ? currentContent.items : []
    const newItems = currentItems.filter((_, i) => i !== index)
    updateCurrentSection({ content: { ...currentContent, items: newItems } })
  }

  // Gallery photos editor helpers
  const handleAddGalleryPhoto = (photoUrl: string) => {
    if (!selectedSection) return
    const currentContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    const currentImages: string[] = Array.isArray(currentContent.images) ? currentContent.images : []
    updateCurrentSection({ content: { ...currentContent, images: [photoUrl, ...currentImages] } })
  }

  const handleDeleteGalleryPhoto = (index: number) => {
    if (!selectedSection) return
    const currentContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    const currentImages: string[] = Array.isArray(currentContent.images) ? currentContent.images : []
    const newImages = currentImages.filter((_, i) => i !== index)
    updateCurrentSection({ content: { ...currentContent, images: newImages } })
  }

  const getSectionContentValue = (field: string, fallback = '') => {
    if (!selectedSection) return fallback
    if (selectedSection.content && typeof selectedSection.content === 'object') {
      const val = (selectedSection.content as any)[field]
      if (typeof val === 'string' || typeof val === 'number') return String(val)
      if (val === null || val === undefined) return fallback
    }
    const topVal = (selectedSection as any)[field]
    if (typeof topVal === 'string' || typeof topVal === 'number') return String(topVal)
    return fallback
  }

  const updateSectionContentField = (field: string, value: any) => {
    if (!selectedSection) return
    const existingContent = selectedSection.content && typeof selectedSection.content === 'object' ? selectedSection.content : {}
    updateCurrentSection({
      [field]: value,
      content: { ...existingContent, [field]: value },
    })
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-ivory select-none">
      {/* Top Editor Toolbar */}
      <div className="bg-white border-b border-beige/80 px-4 py-3 flex items-center justify-between gap-4 flex-none z-20 shadow-xs">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl text-brown font-light">
            Editor de Invitación
          </span>
          <span className="bg-champagne/30 text-brown font-body text-[0.62rem] font-medium px-2.5 py-0.5 rounded-full uppercase tracking-wider">
            {config?.displayName || 'Evento'}
          </span>

          {/* Save Status Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-ivory border border-beige/80">
            {saveStatus === 'saving' && (
              <>
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                <span className="font-body text-xs text-brown/60">Guardando…</span>
              </>
            )}
            {saveStatus === 'justSaved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span className="font-body text-xs text-emerald-800 font-medium">Cambios guardados</span>
              </>
            )}
            {saveStatus === 'saved' && (
              <>
                <span className="w-2 h-2 rounded-full bg-champagne" />
                <span className="font-body text-xs text-brown/50">Guardado</span>
              </>
            )}
          </div>
        </div>

        {/* Center Device Mode Toggles */}
        <div className="hidden md:flex items-center bg-ivory border border-beige p-1 rounded-full">
          <button
            onClick={() => setDeviceFormat('desktop')}
            className={`font-body text-xs px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              deviceFormat === 'desktop' ? 'bg-brown text-ivory font-medium' : 'text-brown/50'
            }`}
          >
            Desktop
          </button>
          <button
            onClick={() => setDeviceFormat('tablet')}
            className={`font-body text-xs px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              deviceFormat === 'tablet' ? 'bg-brown text-ivory font-medium' : 'text-brown/50'
            }`}
          >
            Tablet
          </button>
          <button
            onClick={() => setDeviceFormat('mobile')}
            className={`font-body text-xs px-3.5 py-1 rounded-full transition-all cursor-pointer ${
              deviceFormat === 'mobile' ? 'bg-brown text-ivory font-medium' : 'text-brown/50'
            }`}
          >
            Mobile
          </button>
        </div>

        {/* Right Action buttons */}
        <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
          {onOpenSavedInvitations && (
            <button
              onClick={onOpenSavedInvitations}
              className="font-body text-xs text-brown border border-beige/80 px-3.5 py-2 rounded-full hover:bg-beige/30 transition-colors cursor-pointer flex items-center gap-1.5"
            >
              <span>📂</span>
              <span className="hidden sm:inline">Mis Invitaciones</span>
            </button>
          )}

          <button
            type="button"
            onClick={handleManualSave}
            disabled={saveStatus === 'saving'}
            className="bg-emerald-700 hover:bg-emerald-800 text-white font-body font-medium text-xs px-4 py-2 rounded-full transition-all cursor-pointer shadow-xs flex items-center gap-1.5 disabled:opacity-60"
            title="Guardar cambios de la invitación"
          >
            <span>{saveStatus === 'saving' ? '⏳' : saveStatus === 'justSaved' ? '✓' : '💾'}</span>
            <span>{saveStatus === 'saving' ? 'Guardando...' : saveStatus === 'justSaved' ? '¡Guardado!' : 'Guardar'}</span>
          </button>

          <button
            onClick={onOpenPublicView}
            className="font-body text-xs text-brown border border-beige/80 px-4 py-2 rounded-full hover:bg-beige/30 transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>👁️</span>
            <span className="hidden sm:inline">Vista previa</span>
          </button>

          <button
            onClick={onOpenPublishModal}
            className="bg-brown text-ivory font-body font-medium text-xs px-6 py-2 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs"
          >
            Publicar
          </button>
        </div>
      </div>

      {/* Main 3-Panel Workspace */}
      <div className="flex-1 flex overflow-hidden">
        {/* ── LEFT PANEL: SECTIONS LIST ─────────────────────────────────────── */}
        <div className="w-64 border-r border-beige/80 bg-white flex flex-col flex-none z-10">
          <div className="p-4 border-b border-beige/60 flex items-center justify-between">
            <div>
              <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block">
                Navegación
              </span>
              <h3 className="font-display text-lg text-brown font-light">
                Secciones
              </h3>
            </div>
            <button
              onClick={() => setShowAddSectionModal(true)}
              className="bg-brown text-ivory font-body font-medium text-xs px-3 py-1.5 rounded-full hover:bg-ink transition-colors cursor-pointer"
            >
              + Sección
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {availableSections.map((sec: any, idx: number) => {
              const isSelected = sec.id === selectedSection?.id
              const isVisible = sec.visible !== false && sec.enabled !== false
              return (
                <div
                  key={sec.id}
                  onClick={() => setSelectedSectionId(sec.id)}
                  className={`group flex items-center justify-between p-2.5 rounded-xl border text-xs font-body transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-brown text-ivory border-brown shadow-xs font-medium'
                      : 'bg-ivory/50 border-beige/60 hover:bg-white text-brown/80'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="text-brown/30 text-xs">⋮⋮</span>
                    <span className="text-sm">{sec.icon || '✨'}</span>
                    <span className="truncate">{sec.name || sec.type || sec.id}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    <button
                      type="button"
                      onClick={e => moveSectionUp(idx, e)}
                      disabled={idx === 0}
                      title="Mover arriba"
                      className="hover:text-champagne p-0.5 text-[10px] disabled:opacity-20 cursor-pointer"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={e => moveSectionDown(idx, e)}
                      disabled={idx === availableSections.length - 1}
                      title="Mover abajo"
                      className="hover:text-champagne p-0.5 text-[10px] disabled:opacity-20 cursor-pointer"
                    >
                      ▼
                    </button>

                    <button
                      type="button"
                      onClick={e => toggleVisibility(sec.id, e)}
                      title={isVisible ? 'Ocultar sección' : 'Mostrar sección'}
                      className={`p-1 text-xs rounded cursor-pointer ${
                        isVisible ? 'text-emerald-600' : 'text-brown/30'
                      }`}
                    >
                      {isVisible ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CENTER PANEL: LIVE PREVIEW & CANVAS ──────────────────────────── */}
        <div className="flex-1 bg-beige/20 p-6 overflow-y-auto flex items-center justify-center relative">
          <div
            className={`bg-white rounded-[32px] border-4 border-brown/30 shadow-2xl transition-all duration-300 overflow-hidden ${
              deviceFormat === 'mobile'
                ? 'w-[340px] h-[620px]'
                : deviceFormat === 'tablet'
                ? 'w-[520px] h-[640px]'
                : 'w-[780px] h-[640px]'
            }`}
          >
            {/* Real Live Invitation Renderer inside Canvas Frame */}
            <div className="h-full overflow-y-auto bg-ivory">
              <InvitationRenderer
                sections={availableSections}
                eventData={eventData}
                theme={activeTheme}
                mode="editor"
                selectedSectionId={selectedSection?.id}
                onSelectSectionId={id => setSelectedSectionId(id)}
              />
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: PROPERTIES INSPECTOR & THEME ────────────────────── */}
        <div className="w-80 border-l border-beige/80 bg-white flex flex-col flex-none z-10">
          {/* Header Tabs */}
          <div className="grid grid-cols-2 border-b border-beige/80 bg-ivory/50">
            <button
              onClick={() => setActiveRightTab('properties')}
              className={`py-3 font-body text-xs font-medium transition-colors cursor-pointer ${
                activeRightTab === 'properties'
                  ? 'bg-white text-brown border-b-2 border-brown'
                  : 'text-brown/50 hover:text-brown'
              }`}
            >
              Propiedades
            </button>

            <button
              onClick={() => setActiveRightTab('theme')}
              className={`py-3 font-body text-xs font-medium transition-colors cursor-pointer ${
                activeRightTab === 'theme'
                  ? 'bg-white text-brown border-b-2 border-brown'
                  : 'text-brown/50 hover:text-brown'
              }`}
            >
              Tema &amp; Estilo
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-6">
            {activeRightTab === 'properties' && selectedSection ? (
              <>
                {/* Selected Section Header */}
                <div className="flex items-center justify-between pb-4 border-b border-beige/60">
                  <div>
                    <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block">
                      Sección Seleccionada
                    </span>
                    <h3 className="font-display text-xl text-brown font-light flex items-center gap-2">
                      <span>{selectedSection.icon || '✨'}</span>
                      <span>{selectedSection.name || (selectedSection as any).type}</span>
                    </h3>
                  </div>

                  <button
                    onClick={e => toggleVisibility(selectedSection.id, e)}
                    className={`font-body text-xs px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                      selectedSection.visible !== false && (selectedSection as any).enabled !== false
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : 'bg-ivory text-brown/50 border-beige'
                    }`}
                  >
                    {selectedSection.visible !== false && (selectedSection as any).enabled !== false ? 'Visible' : 'Oculta'}
                  </button>
                </div>

                {/* Form Controls tailored per section */}
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                      Título de la Sección
                    </label>
                    <input
                      type="text"
                      value={selectedSection.title || getSectionContentValue('title')}
                      onChange={e => {
                        updateCurrentSection({ title: e.target.value })
                        updateSectionContentField('title', e.target.value)
                      }}
                      className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                    />
                  </div>

                  {/* Subtitle Input */}
                  <div>
                    <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                      Subtítulo / Encabezado
                    </label>
                    <input
                      type="text"
                      value={selectedSection.subtitle || getSectionContentValue('subtitle')}
                      onChange={e => {
                        updateCurrentSection({ subtitle: e.target.value })
                        updateSectionContentField('subtitle', e.target.value)
                      }}
                      className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                    />
                  </div>

                  {/* Specific Controls for Hero / Portada */}
                  {(selectedSection.id === 'portada' || (selectedSection as any).type === 'hero') && (
                    <>
                      <div>
                        <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                          Slogan / Frase Especial
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('tagline')}
                          onChange={e => updateSectionContentField('tagline', e.target.value)}
                          placeholder="Con la bendición de nuestros padres..."
                          className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                          Fecha
                        </label>
                        <input
                          type="text"
                          value={selectedSection.date || getSectionContentValue('date') || eventData?.date || ''}
                          onChange={e => {
                            updateCurrentSection({ date: e.target.value })
                            updateSectionContentField('date', e.target.value)
                          }}
                          className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                        />
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <label className="font-body text-[0.68rem] tracking-wider text-brown/60 uppercase">
                            Oscurecimiento Imagen
                          </label>
                          <span className="font-body text-xs text-brown/50">
                            {selectedSection.overlayOpacity || 35}%
                          </span>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="80"
                          value={selectedSection.overlayOpacity || 35}
                          onChange={e => updateCurrentSection({ overlayOpacity: parseInt(e.target.value) })}
                          className="w-full accent-brown"
                        />
                      </div>
                    </>
                  )}

                  {/* Specific Controls for DateLocation / Ubicación */}
                  {(selectedSection.id === 'ubicacion' || (selectedSection as any).type === 'dateLocation' || (selectedSection as any).type === 'location') && (
                    <div className="space-y-3 pt-2 border-t border-beige/60">
                      <span className="font-body text-[0.65rem] tracking-[0.2em] text-brown/40 uppercase block">
                        Detalles de Ceremonia & Recepción
                      </span>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Título Ceremonia / Misa
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('ceremonyTitle', config?.fieldLabels?.ceremonyTitle || 'Ceremonia')}
                          onChange={e => updateSectionContentField('ceremonyTitle', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                            Hora Misa
                          </label>
                          <input
                            type="text"
                            value={getSectionContentValue('ceremonyTime', '16:00 HRS')}
                            onChange={e => updateSectionContentField('ceremonyTime', e.target.value)}
                            className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                            Iglesia / Lugar
                          </label>
                          <input
                            type="text"
                            value={getSectionContentValue('ceremonyPlace', 'Parroquia de San José')}
                            onChange={e => updateSectionContentField('ceremonyPlace', e.target.value)}
                            className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Título Recepción / Fiesta
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('receptionTitle', config?.fieldLabels?.receptionTitle || 'Recepción')}
                          onChange={e => updateSectionContentField('receptionTitle', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                            Hora Recepción
                          </label>
                          <input
                            type="text"
                            value={getSectionContentValue('receptionTime', '18:30 HRS')}
                            onChange={e => updateSectionContentField('receptionTime', e.target.value)}
                            className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                          />
                        </div>

                        <div>
                          <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                            Salón / Hacienda
                          </label>
                          <input
                            type="text"
                            value={getSectionContentValue('receptionPlace', 'Hacienda Real')}
                            onChange={e => updateSectionContentField('receptionPlace', e.target.value)}
                            className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Dirección Completa
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('location', eventData?.location || '')}
                          onChange={e => {
                            updateCurrentSection({ location: e.target.value })
                            updateSectionContentField('location', e.target.value)
                            updateSectionContentField('receptionAddress', e.target.value)
                          }}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Schedule Dynamic Editor */}
                  {(selectedSection.id === 'itinerario' || (selectedSection as any).type === 'schedule') && (
                    <div className="space-y-3 pt-2 border-t border-beige/60">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-[0.65rem] tracking-[0.2em] text-brown/40 uppercase block">
                          Programa del Evento
                        </span>
                        <button
                          type="button"
                          onClick={handleAddScheduleItem}
                          className="text-[0.65rem] font-body text-brown hover:underline cursor-pointer font-medium"
                        >
                          + Agregar
                        </button>
                      </div>

                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {((selectedSection?.content && typeof selectedSection.content === 'object' && Array.isArray((selectedSection.content as any).items) ? (selectedSection.content as any).items : config?.defaultSectionContents?.schedule?.items) || []).map((item: any, idx: number) => (
                          <div key={idx} className="p-2.5 bg-ivory/60 border border-beige/80 rounded-xl space-y-1.5">
                            <div className="flex items-center justify-between gap-2">
                              <input
                                type="text"
                                value={item.time}
                                onChange={e => handleUpdateScheduleItem(idx, 'time', e.target.value)}
                                className="w-24 px-2 py-1 bg-white border border-beige/60 rounded text-[0.65rem] font-body font-semibold text-champagne"
                              />
                              <button
                                type="button"
                                onClick={() => handleDeleteScheduleItem(idx)}
                                className="text-rose hover:text-red-700 text-xs cursor-pointer px-1"
                              >
                                ✕
                              </button>
                            </div>

                            <input
                              type="text"
                              value={item.title}
                              onChange={e => handleUpdateScheduleItem(idx, 'title', e.target.value)}
                              placeholder="Título de la actividad"
                              className="w-full px-2 py-1 bg-white border border-beige/60 rounded text-xs font-body text-brown font-medium"
                            />

                            <input
                              type="text"
                              value={item.desc || ''}
                              onChange={e => handleUpdateScheduleItem(idx, 'desc', e.target.value)}
                              placeholder="Lugar / Detalles"
                              className="w-full px-2 py-1 bg-white border border-beige/60 rounded text-[0.68rem] font-body text-brown/60"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Dress Code Editor */}
                  {(selectedSection.id === 'dresscode' || (selectedSection as any).type === 'dressCode') && (
                    <div className="space-y-3 pt-2 border-t border-beige/60">
                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Etiqueta
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('code', config?.fieldLabels?.dressCodeDefault || 'Formal')}
                          onChange={e => updateSectionContentField('code', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Descripción Vestimenta
                        </label>
                        <textarea
                          rows={2}
                          value={getSectionContentValue('description', config?.defaultSectionContents?.dressCode?.description || '')}
                          onChange={e => updateSectionContentField('description', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Nota sobre Colores
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('colorNote', config?.fieldLabels?.dressCodeNote || '')}
                          onChange={e => updateSectionContentField('colorNote', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Gallery Photos Editor */}
                  {(selectedSection.id === 'galeria' || (selectedSection as any).type === 'gallery') && (
                    <div className="space-y-3 pt-2 border-t border-beige/60">
                      <div className="flex items-center justify-between">
                        <span className="font-body text-[0.65rem] tracking-[0.2em] text-brown/40 uppercase block">
                          Fotografías de la Galería
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setPhotoPickerTarget('gallery')
                            setShowPhotoPicker(true)
                          }}
                          className="text-[0.65rem] font-body text-brown hover:underline cursor-pointer font-medium"
                        >
                          + Agregar Foto
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2 max-h-48 overflow-y-auto p-1">
                        {((selectedSection?.content && typeof selectedSection.content === 'object' && Array.isArray((selectedSection.content as any).images) ? (selectedSection.content as any).images : [])).map((imgUrl: string, idx: number) => (
                          <div key={idx} className="relative group aspect-square rounded-lg overflow-hidden border border-beige">
                            <img src={imgUrl} className="w-full h-full object-cover" />
                            <button
                              type="button"
                              onClick={() => handleDeleteGalleryPhoto(idx)}
                              className="absolute top-1 right-1 bg-brown/80 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                            >
                              ✕
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Gifts / Regalos Editor */}
                  {(selectedSection.id === 'regalos' || (selectedSection as any).type === 'gifts') && (
                    <div className="space-y-3 pt-2 border-t border-beige/60">
                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Banco
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('bank', 'BBVA Bancomer')}
                          onChange={e => updateSectionContentField('bank', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          Beneficiario
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('beneficiary', eventData?.person1Name || '')}
                          onChange={e => updateSectionContentField('beneficiary', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          CLABE Interbancaria
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('clabe', '012180015488921102')}
                          onChange={e => updateSectionContentField('clabe', e.target.value)}
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>

                      <div>
                        <label className="block font-body text-[0.62rem] text-brown/60 uppercase mb-1">
                          URL Mesa Digital (Liverpool/Sears)
                        </label>
                        <input
                          type="text"
                          value={getSectionContentValue('wishlistUrl', '')}
                          onChange={e => updateSectionContentField('wishlistUrl', e.target.value)}
                          placeholder="https://www.liverpool.com.mx..."
                          className="w-full px-3 py-1.5 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                        />
                      </div>
                    </div>
                  )}

                  {/* Main Text Area Content fallback for text sections */}
                  {['mensaje', 'sec_message', 'libro', 'sec_guestbook', 'playlist', 'sec_playlist'].includes((selectedSection as any).type || selectedSection.id) && (
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Contenido del texto
                      </label>
                      <textarea
                        rows={4}
                        value={selectedSection.content?.text || (typeof selectedSection.content === 'string' ? selectedSection.content : '')}
                        onChange={e => {
                          updateCurrentSection({ content: e.target.value })
                          updateSectionContentField('text', e.target.value)
                        }}
                        className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                      />
                    </div>
                  )}

                  {/* Image Selector for Hero / Gallery */}
                  {(selectedSection.id === 'portada' || (selectedSection as any).type === 'hero') && (
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Imagen Principal
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setPhotoPickerTarget('section')
                          setShowPhotoPicker(true)
                        }}
                        className="w-full border border-dashed border-beige/90 bg-ivory/50 py-3 rounded-lg text-xs font-body text-brown/60 hover:bg-ivory hover:text-brown transition-colors cursor-pointer flex items-center justify-center gap-2"
                      >
                        <span>📷</span>
                        <span>Seleccionar imagen</span>
                      </button>
                    </div>
                  )}

                  {/* TEXT EDITOR TOOLS: Alignment, Weight, Italic, Color */}
                  <div className="pt-4 border-t border-beige/60 space-y-3">
                    <span className="font-body text-[0.65rem] tracking-[0.2em] text-brown/40 uppercase block">
                      Formato de Texto
                    </span>

                    {/* Alignment buttons */}
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-brown/50 w-16">Alineación:</span>
                      <div className="flex gap-1 bg-ivory border border-beige p-1 rounded-lg">
                        {(['left', 'center', 'right'] as const).map(align => (
                          <button
                            key={align}
                            type="button"
                            onClick={() => updateCurrentSection({ alignment: align })}
                            className={`px-3 py-1 rounded text-xs capitalize font-body cursor-pointer ${
                              selectedSection.alignment === align
                                ? 'bg-brown text-ivory font-medium'
                                : 'text-brown/60'
                            }`}
                          >
                            {align === 'left' ? 'Izq' : align === 'center' ? 'Centro' : 'Der'}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Bold & Italic Toggles */}
                    <div className="flex items-center gap-2">
                      <span className="font-body text-xs text-brown/50 w-16">Estilo:</span>
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentSection({
                            fontWeight: selectedSection.fontWeight === 'bold' ? 'normal' : 'bold',
                          })
                        }
                        className={`px-3 py-1 border rounded text-xs font-bold font-body cursor-pointer ${
                          selectedSection.fontWeight === 'bold'
                            ? 'bg-brown text-ivory border-brown'
                            : 'bg-white border-beige text-brown'
                        }`}
                      >
                        B
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          updateCurrentSection({
                            fontItalic: !selectedSection.fontItalic,
                          })
                        }
                        className={`px-3 py-1 border rounded text-xs italic font-body cursor-pointer ${
                          selectedSection.fontItalic
                            ? 'bg-brown text-ivory border-brown'
                            : 'bg-white border-beige text-brown'
                        }`}
                      >
                        I
                      </button>
                    </div>

                    {/* Color Swatches */}
                    <div>
                      <span className="font-body text-xs text-brown/50 block mb-1">Color de Texto:</span>
                      <div className="flex gap-2">
                        {['#332B27', '#FFFFFF', '#C8A982', '#C9A5A0', '#1C1B1A'].map(color => (
                          <button
                            key={color}
                            type="button"
                            onClick={() => updateCurrentSection({ textColor: color })}
                            className="w-6 h-6 rounded-full border border-beige shadow-xs hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Delete Section Option */}
                  {rawSections.length > 1 && (
                    <div className="pt-4 border-t border-beige/60 text-center">
                      <button
                        type="button"
                        onClick={() => handleDeleteSection(selectedSection.id)}
                        className="font-body text-xs text-rose hover:text-red-700 hover:underline cursor-pointer flex items-center justify-center gap-1.5 mx-auto"
                      >
                        <span>🗑️</span>
                        <span>Eliminar esta sección</span>
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              /* THEME PANEL TABS & PRESETS */
              <div className="space-y-6">
                <div>
                  <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block mb-1">
                    Presets de Diseño
                  </span>
                  <h3 className="font-display text-xl text-brown font-light mb-4">
                    Temas Editoriales
                  </h3>

                  <div className="space-y-3">
                    {THEME_PRESETS.map(preset => {
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setActiveTheme({
                              ...activeTheme,
                              headingFont: preset.fontFamily,
                              primaryColor: preset.primaryColor,
                              accentColor: preset.accentColor,
                            })
                            triggerSaving()
                          }}
                          className="p-3.5 rounded-2xl border border-beige/80 bg-white hover:border-champagne/50 flex items-center justify-between cursor-pointer transition-all hover:shadow-xs"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={preset.imgPreview}
                              alt={preset.name}
                              className="w-10 h-10 rounded-full object-cover border border-beige"
                            />
                            <div>
                              <p className="font-display text-sm text-brown font-light">
                                {preset.name}
                              </p>
                              <span className="font-body text-[0.65rem] text-brown/50">
                                {preset.fontFamily}
                              </span>
                            </div>
                          </div>

                          <div className="flex gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-beige shadow-xs"
                              style={{ backgroundColor: preset.primaryColor }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-beige shadow-xs"
                              style={{ backgroundColor: preset.accentColor }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                {/* Typography Customizer */}
                <div className="pt-4 border-t border-beige/60 space-y-3">
                  <span className="font-body text-[0.65rem] tracking-[0.2em] text-brown/40 uppercase block">
                    Tipografía de Encabezados
                  </span>
                  <select
                    value={activeTheme.headingFont}
                    onChange={e => {
                      setActiveTheme({ ...activeTheme, headingFont: e.target.value })
                      triggerSaving()
                    }}
                    className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none"
                  >
                    <option value="Cormorant Garamond">Cormorant Garamond (Editorial)</option>
                    <option value="Cinzel">Cinzel (Clásico / Monograma)</option>
                    <option value="Inter">Inter (Moderna / Minimal)</option>
                    <option value="Playfair Display">Playfair Display (Elegante)</option>
                    <option value="Montserrat">Montserrat (Contemporánea)</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal: Add New Section */}
      {showAddSectionModal && (
        <div className="fixed inset-0 z-50 bg-ink/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-beige space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-beige/60">
              <div>
                <span className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase block">
                  Agregar Sección
                </span>
                <h3 className="font-display text-2xl text-brown font-light">
                  Selecciona una Sección
                </h3>
              </div>
              <button
                onClick={() => setShowAddSectionModal(false)}
                className="w-8 h-8 rounded-full bg-ivory border border-beige flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto p-1">
              {AVAILABLE_SECTION_TYPES.filter(
                st => !config?.forbiddenSections?.includes(st.type)
              ).map(secDef => (
                <button
                  key={secDef.type}
                  type="button"
                  onClick={() => handleAddNewSection(secDef)}
                  className="p-3 bg-ivory/50 border border-beige/80 rounded-2xl text-left hover:bg-white hover:border-champagne hover:shadow-xs transition-all cursor-pointer flex items-center gap-3"
                >
                  <span className="text-xl">{secDef.icon}</span>
                  <div>
                    <p className="font-display text-sm text-brown font-light leading-snug">
                      {secDef.name}
                    </p>
                    <span className="font-body text-[0.6rem] text-brown/40">
                      {secDef.defaultTitle}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Photo Picker Modal */}
      {showPhotoPicker && (
        <PhotoPickerModal
          onClose={() => setShowPhotoPicker(false)}
          onSelectPhoto={photoUrl => {
            if (photoPickerTarget === 'gallery') {
              handleAddGalleryPhoto(photoUrl)
            } else {
              updateCurrentSection({ imageUrl: photoUrl })
              updateSectionContentField('imageUrl', photoUrl)
            }
            setShowPhotoPicker(false)
          }}
        />
      )}
    </div>
  )
}
