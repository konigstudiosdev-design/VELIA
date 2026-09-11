import { InvitationSection, SectionType } from '../types'
import { getDefaultSections } from '../data/templateDefinitions'

/**
 * Normalizes legacy or partial invitation sections into structured InvitationSection[]
 */
export function normalizeInvitationSections(rawSections?: any[], eventData?: any): InvitationSection[] {
  if (!rawSections || !Array.isArray(rawSections) || rawSections.length === 0) {
    return getDefaultSections(eventData)
  }

  // Check if sections already match the new model (has type & content)
  if (rawSections[0] && typeof rawSections[0].type === 'string' && rawSections[0].content) {
    return (rawSections as InvitationSection[])
      .map((sec, idx) => ({
        ...sec,
        order: typeof sec.order === 'number' ? sec.order : idx,
        enabled: sec.enabled !== undefined ? sec.enabled : (sec as any).visible !== false,
      }))
      .sort((a, b) => a.order - b.order)
  }

  // Map legacy SectionConfig[] format to new InvitationSection[]
  const defaults = getDefaultSections(eventData)
  const mappedSections: InvitationSection[] = rawSections.map((legacySec, idx) => {
    let type: SectionType = 'message'
    const legacyId = (legacySec.id || '').toLowerCase()

    if (legacyId.includes('portada') || legacyId.includes('hero')) type = 'hero'
    else if (legacyId.includes('mensaje')) type = 'message'
    else if (legacyId.includes('cuenta') || legacyId.includes('timer')) type = 'countdown'
    else if (legacyId.includes('fecha') || legacyId.includes('lugar')) type = 'dateLocation'
    else if (legacyId.includes('itinerario') || legacyId.includes('horario')) type = 'schedule'
    else if (legacyId.includes('vestimenta') || legacyId.includes('dress')) type = 'dressCode'
    else if (legacyId.includes('galeria') || legacyId.includes('fotos')) type = 'gallery'
    else if (legacyId.includes('rsvp') || legacyId.includes('pases')) type = 'rsvp'
    else if (legacyId.includes('regalo') || legacyId.includes('gift')) type = 'gifts'
    else if (legacyId.includes('hospedaje') || legacyId.includes('hotel')) type = 'lodging'
    else if (legacyId.includes('playlist') || legacyId.includes('musica')) type = 'playlist'
    else if (legacyId.includes('ubicacion') || legacyId.includes('mapa')) type = 'location'
    else if (legacyId.includes('firma') || legacyId.includes('libro')) type = 'guestbook'

    const defaultMatch = defaults.find(d => d.type === type) || defaults[0]

    return {
      id: legacySec.id || `sec_${type}_${idx}`,
      type,
      order: typeof legacySec.order === 'number' ? legacySec.order : idx,
      enabled: legacySec.visible !== false && legacySec.enabled !== false,
      content: {
        ...defaultMatch.content,
        title: legacySec.title || defaultMatch.content.title,
        subtitle: legacySec.subtitle || defaultMatch.content.subtitle,
        text: legacySec.content || defaultMatch.content.text,
        imageUrl: legacySec.imageUrl || defaultMatch.content.imageUrl,
        date: legacySec.date || defaultMatch.content.date,
        location: legacySec.location || defaultMatch.content.location,
      },
      settings: {
        ...defaultMatch.settings,
        alignment: legacySec.alignment || defaultMatch.settings.alignment || 'center',
        overlayOpacity: legacySec.overlayOpacity || defaultMatch.settings.overlayOpacity || 0.4,
      },
    }
  })

  return mappedSections.sort((a, b) => a.order - b.order)
}
