import { EventData, SectionConfig, InvitationTheme } from '../types'

const DRAFT_EVENT_KEY = 'velia_draft_event_data'
const DRAFT_SECTIONS_KEY = 'velia_draft_sections'
const DRAFT_THEME_KEY = 'velia_draft_theme'

export function saveEventDataDraft(eventData: EventData) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(DRAFT_EVENT_KEY, JSON.stringify(eventData))
  } catch (err) {
    console.warn('Draft save event:', err)
  }
}

export function getEventDataDraft(): EventData | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = localStorage.getItem(DRAFT_EVENT_KEY)
    if (!raw) return null
    return JSON.parse(raw) as EventData
  } catch (err) {
    return null
  }
}

export function saveSectionsDraft(sections: SectionConfig[]) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(DRAFT_SECTIONS_KEY, JSON.stringify(sections))
  } catch (err) {
    console.warn('Draft save sections:', err)
  }
}

export function getSectionsDraft(): SectionConfig[] | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = localStorage.getItem(DRAFT_SECTIONS_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed as SectionConfig[]
    }
    return null
  } catch (err) {
    return null
  }
}

export function saveThemeDraft(theme: InvitationTheme) {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.setItem(DRAFT_THEME_KEY, JSON.stringify(theme))
  } catch (err) {
    console.warn('Draft save theme:', err)
  }
}

export function getThemeDraft(): InvitationTheme | null {
  if (typeof window === 'undefined' || !window.localStorage) return null
  try {
    const raw = localStorage.getItem(DRAFT_THEME_KEY)
    if (!raw) return null
    return JSON.parse(raw) as InvitationTheme
  } catch (err) {
    return null
  }
}

export function clearDrafts() {
  if (typeof window === 'undefined' || !window.localStorage) return
  try {
    localStorage.removeItem(DRAFT_EVENT_KEY)
    localStorage.removeItem(DRAFT_SECTIONS_KEY)
    localStorage.removeItem(DRAFT_THEME_KEY)
  } catch (err) {
    console.warn('Clear drafts:', err)
  }
}
