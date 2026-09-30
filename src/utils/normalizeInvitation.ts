import { InvitationSection, SectionType } from '../types'
import { getDefaultSections } from '../data/templateDefinitions'
import { validateEventContent } from '../config/eventTypeConfig'

/**
 * Normalizes legacy or partial invitation sections into structured InvitationSection[],
 * and enforces eventType rules via validateEventContent.
 */
export function normalizeInvitationSections(rawSections?: any[], eventData?: any): InvitationSection[] {
  let sections: InvitationSection[] = []

  const validRaw = Array.isArray(rawSections) ? rawSections.filter(Boolean) : []

  if (validRaw.length === 0) {
    sections = getDefaultSections(eventData)
  } else {
    const defaults = getDefaultSections(eventData)

    sections = validRaw.map((secItem, idx) => {
      // If it's already a well-formed InvitationSection
      if (secItem && typeof secItem.type === 'string' && secItem.content && typeof secItem.content === 'object') {
        return {
          ...secItem,
          order: typeof secItem.order === 'number' ? secItem.order : idx,
          enabled: secItem.enabled !== undefined ? secItem.enabled : (secItem as any).visible !== false,
        }
      }

      // Legacy SectionConfig format
      let type: SectionType = (secItem.type as SectionType) || 'message'
      const legacyId = (secItem.id || '').toLowerCase()

      if (legacyId.includes('portada') || legacyId.includes('hero')) type = 'hero'
      else if (legacyId.includes('mensaje')) type = 'message'
      else if (legacyId.includes('cuenta') || legacyId.includes('timer') || legacyId.includes('regresiva')) type = 'countdown'
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
      const defaultContent = defaultMatch?.content || {}

      const secContent = typeof secItem.content === 'object' && secItem.content !== null ? secItem.content : {}
      const textVal = typeof secItem.content === 'string' ? secItem.content : secContent.text || defaultContent.text

      return {
        id: secItem.id || `sec_${type}_${idx}`,
        type,
        order: typeof secItem.order === 'number' ? secItem.order : idx,
        enabled: secItem.visible !== false && secItem.enabled !== false,
        content: {
          ...defaultContent,
          ...secContent,
          title: secItem.title || secContent.title || defaultContent.title,
          subtitle: secItem.subtitle || secContent.subtitle || defaultContent.subtitle,
          text: textVal,
          imageUrl: secItem.imageUrl || secContent.imageUrl || defaultContent.imageUrl,
          date: secItem.date || secContent.date || defaultContent.date,
          location: secItem.location || secContent.location || defaultContent.location,
        },
        settings: {
          ...defaultMatch?.settings,
          alignment: secItem.alignment || defaultMatch?.settings?.alignment || 'center',
          overlayOpacity: secItem.overlayOpacity ?? defaultMatch?.settings?.overlayOpacity ?? 0.4,
        },
      }
    }).sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
  }

  // Run through validation layer to filter incompatible sections/wedding text
  const validated = validateEventContent({ eventData, sections })
  return validated.sections || sections
}
