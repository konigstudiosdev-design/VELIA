import React, { useState } from 'react'
import { EventData, SectionConfig, ThemePreset } from '../../types'
import { THEME_PRESETS } from '../../data/mockData'
import PhotoPickerModal from './PhotoPickerModal'

interface EditorTabProps {
  eventData: EventData
  sections: SectionConfig[]
  onUpdateSections: (sections: SectionConfig[]) => void
  onOpenPublicView: () => void
  onOpenPublishModal: () => void
}

export default function EditorTab({
  eventData,
  sections,
  onUpdateSections,
  onOpenPublicView,
  onOpenPublishModal,
}: EditorTabProps) {
  const [selectedSectionId, setSelectedSectionId] = useState<string>('portada')
  const [deviceFormat, setDeviceFormat] = useState<'desktop' | 'tablet' | 'mobile'>('mobile')
  const [saveStatus, setSaveStatus] = useState<'saved' | 'saving' | 'justSaved'>('saved')
  const [activeRightTab, setActiveRightTab] = useState<'properties' | 'theme'>('properties')
  const [selectedTheme, setSelectedTheme] = useState<ThemePreset>(THEME_PRESETS[0])

  // Photo Picker Modal state
  const [showPhotoPicker, setShowPhotoPicker] = useState(false)
  const [photoPickerTarget, setPhotoPickerTarget] = useState<'section' | 'gallery'>('section')

  // Selected Section
  const selectedSection = sections.find(s => s.id === selectedSectionId) || sections[0]

  // Trigger Save Feedback
  const triggerSaving = () => {
    setSaveStatus('saving')
    setTimeout(() => {
      setSaveStatus('justSaved')
      setTimeout(() => setSaveStatus('saved'), 2000)
    }, 600)
  }

  // Update Section Handler
  const updateCurrentSection = (updatedProps: Partial<SectionConfig>) => {
    const newSections = sections.map(s => {
      if (s.id === selectedSectionId) {
        return { ...s, ...updatedProps }
      }
      return s
    })
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Toggle section visibility
  const toggleVisibility = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const newSections = sections.map(s => {
      if (s.id === id) {
        return { ...s, visible: !s.visible }
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
    const newSections = [...sections]
    const temp = newSections[index - 1]
    newSections[index - 1] = newSections[index]
    newSections[index] = temp
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Move section down
  const moveSectionDown = (index: number, e: React.MouseEvent) => {
    e.stopPropagation()
    if (index === sections.length - 1) return
    const newSections = [...sections]
    const temp = newSections[index + 1]
    newSections[index + 1] = newSections[index]
    newSections[index] = temp
    onUpdateSections(newSections)
    triggerSaving()
  }

  // Add section
  const handleAddSection = () => {
    const newId = `seccion-${Date.now()}`
    const newSec: SectionConfig = {
      id: newId,
      name: 'Nueva Sección',
      icon: '✨',
      visible: true,
      order: sections.length + 1,
      title: 'Título de la Sección',
      content: 'Escribe aquí la información para tus invitados.',
      alignment: 'center',
    }
    onUpdateSections([...sections, newSec])
    setSelectedSectionId(newId)
    triggerSaving()
  }

  return (
    <div className="flex flex-col h-[calc(100vh-5rem)] bg-ivory">
      {/* Top Editor Toolbar */}
      <div className="bg-white border-b border-beige/80 px-4 py-3 flex items-center justify-between gap-4 flex-none z-20">
        <div className="flex items-center gap-3">
          <span className="font-display text-xl text-brown font-light">
            Editor de Invitación
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
        <div className="flex items-center gap-2">
          <button
            onClick={onOpenPublicView}
            className="font-body text-xs text-brown border border-beige/80 px-4 py-2 rounded-full hover:bg-beige/30 transition-colors cursor-pointer"
          >
            Vista previa
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
        <div className="w-64 border-r border-beige/80 bg-white flex flex-col flex-none select-none z-10">
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
              onClick={handleAddSection}
              className="bg-ivory border border-beige text-brown font-body text-xs px-2.5 py-1 rounded-lg hover:bg-beige/40 cursor-pointer"
            >
              + Sección
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {sections.map((sec, idx) => {
              const isSelected = sec.id === selectedSectionId
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
                    <span className="text-sm">{sec.icon}</span>
                    <span className="truncate">{sec.name}</span>
                  </div>

                  <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                    {/* Reorder Up/Down */}
                    <button
                      type="button"
                      onClick={e => moveSectionUp(idx, e)}
                      disabled={idx === 0}
                      className="hover:text-champagne p-0.5 text-[10px] disabled:opacity-20"
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      onClick={e => moveSectionDown(idx, e)}
                      disabled={idx === sections.length - 1}
                      className="hover:text-champagne p-0.5 text-[10px] disabled:opacity-20"
                    >
                      ▼
                    </button>

                    {/* Visibility Toggle */}
                    <button
                      type="button"
                      onClick={e => toggleVisibility(sec.id, e)}
                      title={sec.visible ? 'Ocultar sección' : 'Mostrar sección'}
                      className={`p-1 text-xs rounded ${
                        sec.visible ? 'text-emerald-600' : 'text-brown/30'
                      }`}
                    >
                      {sec.visible ? '👁️' : '🙈'}
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── CENTER PANEL: LIVE PREVIEW ───────────────────────────────────── */}
        <div className="flex-1 bg-beige/20 p-6 overflow-y-auto flex items-center justify-center relative">
          <div
            className={`bg-white rounded-[32px] border-4 border-brown/30 shadow-2xl transition-all duration-300 overflow-hidden ${
              deviceFormat === 'mobile'
                ? 'w-[340px] h-[620px]'
                : deviceFormat === 'tablet'
                ? 'w-[520px] h-[640px]'
                : 'w-[780px] h-[640px]'
            }`}
            style={{ fontFamily: selectedTheme.fontFamily }}
          >
            {/* Inner Phone/Screen Scroll Container */}
            <div className="h-full overflow-y-auto p-4 space-y-6">
              {sections
                .filter(s => s.visible)
                .map(sec => {
                  const isSecSelected = sec.id === selectedSectionId
                  return (
                    <div
                      key={sec.id}
                      onClick={() => setSelectedSectionId(sec.id)}
                      className={`relative p-6 rounded-2xl transition-all cursor-pointer border ${
                        isSecSelected
                          ? 'ring-2 ring-champagne border-champagne bg-ivory/20 shadow-sm'
                          : 'border-transparent hover:border-beige'
                      }`}
                    >
                      {/* Selection Badge Overlay */}
                      {isSecSelected && (
                        <div className="absolute top-2 right-2 bg-champagne text-brown text-[0.58rem] font-body tracking-wider uppercase px-2 py-0.5 rounded shadow-xs">
                          {sec.name}
                        </div>
                      )}

                      {/* PORTADA Render */}
                      {sec.id === 'portada' && (
                        <div className="relative rounded-xl overflow-hidden h-72 flex items-center justify-center text-center p-6 text-white">
                          <img
                            src={sec.imageUrl}
                            alt="Portada"
                            className="absolute inset-0 w-full h-full object-cover"
                          />
                          <div
                            className="absolute inset-0 bg-brown"
                            style={{ opacity: (sec.overlayOpacity || 35) / 100 }}
                          />

                          <div className="relative z-10 space-y-2">
                            <p className="font-body text-[0.6rem] tracking-[0.3em] uppercase text-champagne">
                              {sec.subtitle || 'Con alegría te invitamos'}
                            </p>
                            <h1
                              className={`font-display font-light ${
                                sec.fontWeight === 'bold' ? 'font-bold' : ''
                              } ${sec.fontItalic ? 'italic' : ''}`}
                              style={{
                                fontSize:
                                  sec.fontSize === 'xl' ? '2.4rem' : sec.fontSize === 'lg' ? '2rem' : '1.5rem',
                                color: sec.textColor || '#FFFFFF',
                              }}
                            >
                              {sec.title || 'Lucía & Mateo'}
                            </h1>
                            <div className="w-10 h-[0.5px] bg-champagne mx-auto my-2" />
                            <p className="font-body text-xs tracking-widest uppercase">
                              {sec.date} · {sec.location}
                            </p>
                          </div>
                        </div>
                      )}

                      {/* MENSAJE Render */}
                      {sec.id === 'mensaje' && (
                        <div className="text-center space-y-2 py-4">
                          <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase block">
                            {sec.title}
                          </span>
                          <p className="font-body text-xs text-brown/70 leading-relaxed italic max-w-xs mx-auto">
                            "{sec.content}"
                          </p>
                        </div>
                      )}

                      {/* REGRESIVA Render */}
                      {sec.id === 'regresiva' && (
                        <div className="bg-brown text-ivory p-6 rounded-2xl text-center space-y-3">
                          <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase">
                            {sec.title}
                          </span>
                          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto text-center">
                            <div className="bg-white/10 p-2 rounded">
                              <span className="font-display text-xl block">180</span>
                              <span className="text-[0.55rem] uppercase opacity-60">Días</span>
                            </div>
                            <div className="bg-white/10 p-2 rounded">
                              <span className="font-display text-xl block">12</span>
                              <span className="text-[0.55rem] uppercase opacity-60">Hrs</span>
                            </div>
                            <div className="bg-white/10 p-2 rounded">
                              <span className="font-display text-xl block">45</span>
                              <span className="text-[0.55rem] uppercase opacity-60">Min</span>
                            </div>
                            <div className="bg-white/10 p-2 rounded">
                              <span className="font-display text-xl block">20</span>
                              <span className="text-[0.55rem] uppercase opacity-60">Seg</span>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* HISTORIA Render */}
                      {sec.id === 'historia' && (
                        <div className="space-y-3 text-center">
                          <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase">
                            {sec.title}
                          </span>
                          {sec.imageUrl && (
                            <img
                              src={sec.imageUrl}
                              alt="Historia"
                              className="w-full h-40 object-cover rounded-xl"
                            />
                          )}
                          <p className="font-body text-xs text-brown/70 leading-relaxed">
                            {sec.content}
                          </p>
                        </div>
                      )}

                      {/* ITINERARIO Render */}
                      {sec.id === 'itinerario' && (
                        <div className="bg-ivory/60 p-5 rounded-2xl border border-beige/60 text-center space-y-2">
                          <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase">
                            {sec.title}
                          </span>
                          <pre className="font-body text-xs text-brown/70 whitespace-pre-wrap leading-relaxed">
                            {sec.content}
                          </pre>
                        </div>
                      )}

                      {/* DRESSCODE Render */}
                      {sec.id === 'dresscode' && (
                        <div className="border border-beige p-5 rounded-2xl text-center space-y-1">
                          <span className="text-xl">👔</span>
                          <h4 className="font-display text-lg text-brown font-light">{sec.title}</h4>
                          <p className="font-body text-xs text-champagne font-medium">{sec.subtitle}</p>
                          <p className="font-body text-[0.7rem] text-brown/60 mt-1 whitespace-pre-line">{sec.content}</p>
                        </div>
                      )}

                      {/* GALERIA Render */}
                      {sec.id === 'galeria' && (
                        <div className="text-center space-y-3">
                          <span className="font-body text-[0.6rem] tracking-[0.25em] text-champagne uppercase">
                            {sec.title}
                          </span>
                          <div className="grid grid-cols-3 gap-1.5 rounded-xl overflow-hidden">
                            <img src={sections[0]?.imageUrl} className="aspect-square object-cover" />
                            <img src={sections[3]?.imageUrl} className="aspect-square object-cover" />
                            <img src={sections[0]?.imageUrl} className="aspect-square object-cover" />
                          </div>
                        </div>
                      )}

                      {/* UBICACION Render */}
                      {sec.id === 'ubicacion' && (
                        <div className="bg-white border border-beige/80 p-5 rounded-2xl text-center space-y-2">
                          <span className="text-xl">📍</span>
                          <h4 className="font-display text-lg text-brown font-light">{sec.venue || 'Villa Escondida'}</h4>
                          <p className="font-body text-xs text-brown/60">{sec.location}</p>
                          <button className="bg-brown text-ivory text-[0.65rem] font-body uppercase tracking-wider px-4 py-1.5 rounded-full mt-2">
                            Ver en Google Maps
                          </button>
                        </div>
                      )}

                      {/* REGALOS Render */}
                      {sec.id === 'regalos' && (
                        <div className="border border-beige p-5 rounded-2xl text-center space-y-2">
                          <span className="text-xl">🎁</span>
                          <h4 className="font-display text-lg text-brown font-light">{sec.title}</h4>
                          <p className="font-body text-xs text-brown/60">{sec.content}</p>
                          <p className="font-body text-xs font-medium text-champagne">{sec.subtitle}</p>
                        </div>
                      )}

                      {/* RSVP Render */}
                      {sec.id === 'rsvp' && (
                        <div className="bg-brown text-ivory p-6 rounded-2xl text-center space-y-3">
                          <h4 className="font-display text-xl font-light">{sec.title}</h4>
                          <p className="font-body text-[0.7rem] text-white/60">{sec.subtitle}</p>
                          <button className="w-full bg-champagne text-brown font-body text-xs uppercase tracking-wider font-medium py-2.5 rounded-full">
                            Confirmar Asistencia
                          </button>
                        </div>
                      )}

                      {/* Custom Fallback for other sections */}
                      {!['portada', 'mensaje', 'regresiva', 'historia', 'itinerario', 'dresscode', 'galeria', 'ubicacion', 'regalos', 'rsvp'].includes(sec.id) && (
                        <div className="p-4 bg-ivory border border-beige/60 rounded-xl text-center space-y-1">
                          <h4 className="font-display text-lg text-brown font-light">{sec.title}</h4>
                          <p className="font-body text-xs text-brown/60">{sec.content || sec.subtitle}</p>
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </div>
        </div>

        {/* ── RIGHT PANEL: PROPERTIES & INSPECTOR ──────────────────────────── */}
        <div className="w-80 border-l border-beige/80 bg-white flex flex-col flex-none select-none z-10">
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
            {activeRightTab === 'properties' ? (
              <>
                {/* Section Title Header */}
                <div className="flex items-center justify-between pb-4 border-b border-beige/60">
                  <div>
                    <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown/40 uppercase block">
                      Sección Seleccionada
                    </span>
                    <h3 className="font-display text-xl text-brown font-light flex items-center gap-2">
                      <span>{selectedSection.icon}</span>
                      <span>{selectedSection.name}</span>
                    </h3>
                  </div>

                  <button
                    onClick={e => toggleVisibility(selectedSection.id, e)}
                    className="font-body text-xs text-brown/60 bg-ivory border border-beige px-2.5 py-1 rounded-lg"
                  >
                    {selectedSection.visible ? 'Visible' : 'Oculta'}
                  </button>
                </div>

                {/* Form Controls for Selected Section */}
                <div className="space-y-4">
                  {/* Title Input */}
                  <div>
                    <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                      Título
                    </label>
                    <input
                      type="text"
                      value={selectedSection.title || ''}
                      onChange={e => updateCurrentSection({ title: e.target.value })}
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
                      value={selectedSection.subtitle || ''}
                      onChange={e => updateCurrentSection({ subtitle: e.target.value })}
                      className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                    />
                  </div>

                  {/* Date Input if applicable */}
                  {(selectedSection.id === 'portada' || selectedSection.id === 'regresiva') && (
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Fecha
                      </label>
                      <input
                        type="text"
                        value={selectedSection.date || ''}
                        onChange={e => updateCurrentSection({ date: e.target.value })}
                        className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                      />
                    </div>
                  )}

                  {/* Venue & Location Inputs */}
                  {selectedSection.id === 'ubicacion' && (
                    <>
                      <div>
                        <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                          Lugar / Salón
                        </label>
                        <input
                          type="text"
                          value={selectedSection.venue || ''}
                          onChange={e => updateCurrentSection({ venue: e.target.value })}
                          className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                        />
                      </div>
                      <div>
                        <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                          Dirección Completa
                        </label>
                        <input
                          type="text"
                          value={selectedSection.location || ''}
                          onChange={e => updateCurrentSection({ location: e.target.value })}
                          className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                        />
                      </div>
                    </>
                  )}

                  {/* Content Area / Text Editor */}
                  {['mensaje', 'historia', 'itinerario', 'dresscode', 'regalos', 'libro'].includes(selectedSection.id) && (
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Contenido del texto
                      </label>
                      <textarea
                        rows={4}
                        value={selectedSection.content || ''}
                        onChange={e => updateCurrentSection({ content: e.target.value })}
                        className="w-full px-3 py-2 bg-ivory/50 border border-beige/80 rounded-lg text-brown text-xs font-body focus:outline-none focus:border-champagne"
                      />
                    </div>
                  )}

                  {/* Image Selector */}
                  {['portada', 'historia', 'galeria'].includes(selectedSection.id) && (
                    <div>
                      <label className="block font-body text-[0.68rem] tracking-wider text-brown/60 uppercase mb-1">
                        Imagen Principal
                      </label>
                      <button
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

                  {/* Overlay opacity slider for Portada */}
                  {selectedSection.id === 'portada' && (
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
                  )}

                  {/* TEXT EDITOR TOOLS: Alignment, Size, Weight, Italic, Color */}
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
                            onClick={() => updateCurrentSection({ textColor: color })}
                            className="w-6 h-6 rounded-full border border-beige shadow-xs hover:scale-110 transition-transform cursor-pointer"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>
                    </div>
                  </div>
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
                      const isSelected = selectedTheme.id === preset.id
                      return (
                        <div
                          key={preset.id}
                          onClick={() => {
                            setSelectedTheme(preset)
                            triggerSaving()
                          }}
                          className={`p-3.5 rounded-2xl border flex items-center justify-between cursor-pointer transition-all ${
                            isSelected
                              ? 'border-champagne bg-ivory/60 ring-2 ring-champagne/30 shadow-xs'
                              : 'border-beige/80 bg-white hover:border-champagne/50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={preset.imgPreview}
                              alt={preset.name}
                              className="w-10 h-10 rounded-xl object-cover"
                            />
                            <div>
                              <h4 className="font-display text-lg text-brown font-light leading-none">
                                {preset.name}
                              </h4>
                              <p className="font-body text-[0.65rem] text-brown/50 mt-1">
                                {preset.fontFamily}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-1">
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white"
                              style={{ backgroundColor: preset.primaryColor }}
                            />
                            <span
                              className="w-3.5 h-3.5 rounded-full border border-white"
                              style={{ backgroundColor: preset.accentColor }}
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Photo Picker Modal */}
      {showPhotoPicker && (
        <PhotoPickerModal
          onSelectPhoto={imgUrl => {
            if (photoPickerTarget === 'section') {
              updateCurrentSection({ imageUrl: imgUrl })
            }
            setShowPhotoPicker(false)
          }}
          onClose={() => setShowPhotoPicker(false)}
        />
      )}
    </div>
  )
}
