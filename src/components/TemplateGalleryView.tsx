import React, { useState } from 'react'
import { DesignStyle, EventType, Template } from '../types'
import { TEMPLATES_DATA } from '../data/templates'

interface TemplateGalleryViewProps {
  initialCategory?: EventType
  initialStyle?: DesignStyle
  onSelectTemplate: (template: Template) => void
  onPreviewTemplate: (template: Template) => void
  onBackToSummary: () => void
}

type CategoryFilter =
  | 'Todos'
  | 'Bodas'
  | 'XV'
  | 'Cumpleaños'
  | 'Baby shower'
  | 'Bautizos'
  | 'Graduaciones'
  | 'Aniversarios'
  | 'Despedidas'
  | 'Otros'

type StyleFilter =
  | 'Todos'
  | 'Editorial'
  | 'Minimal'
  | 'Romántico'
  | 'Clásico'
  | 'Moderno'
  | 'Floral'
  | 'Luxury'

export default function TemplateGalleryView({
  initialCategory,
  initialStyle,
  onSelectTemplate,
  onPreviewTemplate,
  onBackToSummary,
}: TemplateGalleryViewProps) {
  // Map initial Category
  const getInitialCategoryFilter = (): CategoryFilter => {
    if (!initialCategory) return 'Todos'
    if (initialCategory === 'Boda') return 'Bodas'
    if (initialCategory === 'XV años') return 'XV'
    if (initialCategory === 'Cumpleaños') return 'Cumpleaños'
    if (initialCategory === 'Baby shower') return 'Baby shower'
    if (initialCategory === 'Bautizo') return 'Bautizos'
    if (initialCategory === 'Graduación') return 'Graduaciones'
    if (initialCategory === 'Aniversario') return 'Aniversarios'
    if (initialCategory === 'Despedida') return 'Despedidas'
    return 'Otros'
  }

  // Map initial Style
  const getInitialStyleFilter = (): StyleFilter => {
    if (!initialStyle) return 'Todos'
    if (initialStyle === 'Editorial') return 'Editorial'
    if (initialStyle === 'Minimalista') return 'Minimal'
    if (initialStyle === 'Romántico') return 'Romántico'
    if (initialStyle === 'Moderno') return 'Moderno'
    if (initialStyle === 'Clásico') return 'Clásico'
    if (initialStyle === 'Floral') return 'Floral'
    if (initialStyle === 'Luxury') return 'Luxury'
    return 'Todos'
  }

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>(getInitialCategoryFilter())
  const [styleFilter, setStyleFilter] = useState<StyleFilter>(getInitialStyleFilter())

  const categories: CategoryFilter[] = [
    'Todos',
    'Bodas',
    'XV',
    'Cumpleaños',
    'Baby shower',
    'Bautizos',
    'Graduaciones',
    'Aniversarios',
    'Despedidas',
    'Otros',
  ]

  const styles: StyleFilter[] = [
    'Todos',
    'Editorial',
    'Minimal',
    'Romántico',
    'Clásico',
    'Moderno',
    'Floral',
    'Luxury',
  ]

  // Filtering templates
  const filteredTemplates = TEMPLATES_DATA.filter(tpl => {
    // Category match
    let matchCat = true
    if (categoryFilter !== 'Todos') {
      if (categoryFilter === 'Bodas' && tpl.category !== 'Boda') matchCat = false
      else if (categoryFilter === 'XV' && tpl.category !== 'XV años') matchCat = false
      else if (categoryFilter === 'Cumpleaños' && tpl.category !== 'Cumpleaños') matchCat = false
      else if (categoryFilter === 'Baby shower' && tpl.category !== 'Baby shower') matchCat = false
      else if (categoryFilter === 'Bautizos' && tpl.category !== 'Bautizo') matchCat = false
      else if (categoryFilter === 'Graduaciones' && tpl.category !== 'Graduación') matchCat = false
      else if (categoryFilter === 'Aniversarios' && tpl.category !== 'Aniversario') matchCat = false
      else if (categoryFilter === 'Despedidas' && tpl.category !== 'Despedida') matchCat = false
      else if (categoryFilter === 'Otros' && tpl.category !== 'Otro') matchCat = false
    }

    // Style match
    let matchStyle = true
    if (styleFilter !== 'Todos') {
      if (styleFilter === 'Minimal' && tpl.style !== 'Minimalista') matchStyle = false
      else if (styleFilter !== 'Minimal' && tpl.style !== styleFilter) matchStyle = false
    }

    return matchCat && matchStyle
  })

  return (
    <div className="min-h-screen pt-28 pb-24 px-6 bg-ivory">
      <div className="max-w-7xl mx-auto">
        {/* Header section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-6 border-b border-beige/80 gap-4">
          <div>
            <button
              onClick={onBackToSummary}
              className="font-body text-xs text-brown/50 hover:text-brown mb-2 block cursor-pointer"
            >
              ← Volver al resumen
            </button>
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase block mb-1">
              Colección Editorial ({TEMPLATES_DATA.length} Diseños)
            </span>
            <h1 className="font-display text-4xl lg:text-5xl text-brown font-light">
              Galería de Plantillas
            </h1>
          </div>
          <p className="font-body text-xs text-brown/50 max-w-sm">
            Selecciona la plantilla que mejor exprese el espíritu de tu celebración.
          </p>
        </div>

        {/* Filter bar */}
        <div className="bg-white border border-beige/80 rounded-2xl p-5 mb-10 shadow-xs space-y-4">
          {/* Ocasión Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[0.68rem] tracking-[0.15em] text-brown/45 uppercase w-20 flex-none">
              Ocasión:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`font-body text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? 'bg-brown text-ivory font-medium'
                      : 'bg-ivory text-brown/65 hover:bg-beige/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="h-[0.5px] bg-beige/60" />

          {/* Estilo Filter */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-body text-[0.68rem] tracking-[0.15em] text-brown/45 uppercase w-20 flex-none">
              Estilo:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {styles.map(st => (
                <button
                  key={st}
                  onClick={() => setStyleFilter(st)}
                  className={`font-body text-xs px-3.5 py-1.5 rounded-full transition-all cursor-pointer ${
                    styleFilter === st
                      ? 'bg-champagne text-brown font-medium'
                      : 'bg-ivory text-brown/65 hover:bg-beige/50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Grid of Templates */}
        {filteredTemplates.length === 0 ? (
          <div className="bg-white border border-beige/80 rounded-2xl p-12 text-center my-8">
            <p className="font-display text-2xl text-brown font-light mb-2">
              No hay plantillas que coincidan con estos filtros.
            </p>
            <p className="font-body text-xs text-brown/50 mb-6">
              Prueba seleccionando "Todos" para explorar la colección completa de {TEMPLATES_DATA.length} diseños.
            </p>
            <button
              onClick={() => {
                setCategoryFilter('Todos')
                setStyleFilter('Todos')
              }}
              className="bg-brown text-ivory font-body text-xs px-6 py-2.5 rounded-full cursor-pointer"
            >
              Mostrar todas las plantillas
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {filteredTemplates.map(tpl => (
              <div
                key={tpl.id}
                className="group bg-white border border-beige/80 rounded-2xl overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  {/* Image container */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-beige/30">
                    <img
                      src={tpl.img}
                      alt={tpl.name}
                      onError={(e) => {
                        e.currentTarget.src = 'https://images.unsplash.com/photo-1519167758481-83f550bb49b3?w=800&h=1200&fit=crop&auto=format'
                      }}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-brown/20 group-hover:bg-brown/40 transition-colors duration-300" />

                    {/* Tag badge top left */}
                    <div className="absolute top-4 left-4 flex gap-1.5 flex-wrap">
                      <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown uppercase bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs">
                        {tpl.category}
                      </span>
                      <span className="font-body text-[0.6rem] tracking-[0.2em] text-brown uppercase bg-champagne/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-xs">
                        {tpl.style}
                      </span>
                    </div>

                    {/* Hover CTA: Vista previa */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <button
                        onClick={() => onPreviewTemplate(tpl)}
                        className="font-body text-xs tracking-[0.2em] text-brown uppercase bg-white px-6 py-3 rounded-full font-medium shadow-md hover:bg-ivory transition-transform transform group-hover:scale-105 cursor-pointer"
                      >
                        Vista previa
                      </button>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-display text-2xl text-brown font-light">
                        {tpl.name}
                      </h3>
                      <div
                        className="w-4 h-4 rounded-full border border-beige shadow-xs"
                        style={{ backgroundColor: tpl.accent }}
                      />
                    </div>
                    <p className="font-body text-xs text-brown/55 leading-relaxed mb-4">
                      {tpl.description}
                    </p>

                    <div className="flex flex-wrap gap-1.5">
                      {tpl.features.map(feat => (
                        <span
                          key={feat}
                          className="font-body text-[0.65rem] text-brown/60 bg-ivory border border-beige/60 px-2.5 py-0.5 rounded"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom button */}
                <div className="p-6 pt-0">
                  <button
                    onClick={() => onSelectTemplate(tpl)}
                    className="w-full bg-brown text-ivory font-body font-medium text-xs tracking-wider uppercase py-3.5 rounded-full hover:bg-ink transition-all duration-300 hover:scale-[1.01] cursor-pointer"
                  >
                    Usar este diseño
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
