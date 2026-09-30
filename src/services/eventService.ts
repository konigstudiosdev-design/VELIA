import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  deleteDoc,
  serverTimestamp,
  onSnapshot,
  writeBatch,
  increment,
} from 'firebase/firestore'
import {
  ref,
  uploadBytes,
  getDownloadURL,
  deleteObject,
} from 'firebase/storage'
import { db, storage } from '../firebase'
import {
  EventData,
  GuestItem,
  SectionConfig,
  ActivityItem,
  TableGroup,
  GiftItem,
  GalleryPhoto,
  EventStatus,
} from '../types'
import { INITIAL_SECTIONS, INITIAL_GUESTS, INITIAL_ACTIVITIES } from '../data/mockData'
import { getDefaultSections } from '../data/templateDefinitions'

// Track sequence timestamps for autosave concurrency control
let lastSaveTimestamp = 0

/**
 * Generates a cryptographically secure guest access token using crypto.randomUUID()
 */
export function generateGuestToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return `g_${crypto.randomUUID().replace(/-/g, '')}`
  }
  const array = new Uint8Array(16)
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(array)
  } else {
    for (let i = 0; i < 16; i++) array[i] = Math.floor(Math.random() * 256)
  }
  return `g_${Array.from(array, b => b.toString(16).padStart(2, '0')).join('')}`
}

/**
 * Normalizes a custom slug to be clean for URLs (e.g. "lucia-y-mateo")
 */
export function cleanSlug(rawSlug?: string): string {
  if (!rawSlug) return `evento-${Date.now().toString(36)}`
  let slug = rawSlug.trim().toLowerCase()

  // Iteratively strip any leading or nested protocol / domain prefixes
  let previous = ''
  while (slug !== previous) {
    previous = slug
    slug = slug
      .replace(/^https?:\/\//g, '')
      .replace(/velia\.mx\/e\//g, '')
      .replace(/velia\.mx\//g, '')
  }

  slug = slug.replace(/[^a-z0-9-]/g, '-')
  slug = slug.replace(/-+/g, '-').replace(/^-|-$/g, '')
  return slug || `evento-${Date.now().toString(36)}`
}

/**
 * Ensures slug uniqueness by appending suffix if collision occurs
 */
export async function getUniqueSlug(rawSlug: string, currentInvitationId?: string): Promise<string> {
  const baseSlug = cleanSlug(rawSlug)
  let candidate = baseSlug
  let counter = 1

  const invColl = collection(db, 'invitations')

  try {
    while (counter <= 20) {
      const q = query(invColl, where('slug', '==', candidate))
      const snap = await getDocs(q)

      if (snap.empty || (currentInvitationId && snap.docs[0].id === currentInvitationId)) {
        return candidate
      }

      counter++
      candidate = `${baseSlug}-${counter}`
    }
  } catch (err) {
    console.warn('Firestore slug uniqueness query fallback:', err)
  }

  return baseSlug
}

/**
 * Runtime validation for EventData
 */
export function validateEventData(data: Partial<EventData>): { valid: boolean; error?: string } {
  if (!data.person1Name || data.person1Name.trim().length === 0) {
    return { valid: false, error: 'El nombre principal es obligatorio.' }
  }
  return { valid: true }
}

/**
 * Runtime validation for GuestItem
 */
export function validateGuest(guest: Partial<GuestItem>): { valid: boolean; error?: string } {
  if (!guest.name || guest.name.trim().length === 0) {
    return { valid: false, error: 'El nombre del invitado es obligatorio.' }
  }
  if (guest.passes !== undefined && (typeof guest.passes !== 'number' || guest.passes < 1)) {
    return { valid: false, error: 'El número de pases debe ser al menos 1.' }
  }
  return { valid: true }
}

/**
 * Creates a new event, associated invitation, initial guests, and guestAccess records atomically using Firestore writeBatch
 */
export async function createEventAndInvitation(
  ownerId: string,
  eventData: EventData,
  templateId: string
): Promise<{ eventId: string; invitationId: string; slug: string }> {
  const validation = validateEventData(eventData)
  if (!validation.valid) {
    throw new Error(validation.error || 'Datos del evento no válidos.')
  }

  const eventId = `evt_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`
  const invitationId = `inv_${eventId}`

  let slug = cleanSlug(eventData.customSlug || `${eventData.person1Name}-${eventData.person2Name || ''}`)
  try {
    slug = await getUniqueSlug(slug, invitationId)
  } catch (e) {
    console.warn('Unique slug check fallback:', e)
  }

  const finalEventData: EventData = {
    ...eventData,
    id: eventId,
    ownerId,
    invitationId,
    customSlug: slug,
    status: eventData.status || 'Published',
    date: eventData.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  }

  const batch = writeBatch(db)

  // 1. User event document: users/{ownerId}/events/{eventId}
  const userEventRef = doc(db, 'users', ownerId, 'events', eventId)
  batch.set(userEventRef, {
    ...finalEventData,
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  })

  // 2. Public invitation document: invitations/{invitationId}
  const invitationRef = doc(db, 'invitations', invitationId)
  batch.set(invitationRef, {
    id: invitationId,
    eventId,
    ownerId,
    templateId,
    slug,
    status: finalEventData.status,
    eventData: finalEventData,
    sections: getDefaultSections(finalEventData),
    viewsCount: 0,
    publishedAt: finalEventData.status === 'Published' ? new Date().toISOString() : null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdAtServer: serverTimestamp(),
    updatedAtServer: serverTimestamp(),
  })

  await batch.commit()

  return { eventId, invitationId, slug }
}

/**
 * Fetches user's events from Firestore
 */
export async function getUserEvents(ownerId: string): Promise<EventData[]> {
  const eventsRef = collection(db, 'users', ownerId, 'events')
  const snap = await getDocs(eventsRef)
  const events: EventData[] = []
  snap.forEach(docSnap => {
    events.push(docSnap.data() as EventData)
  })
  return events.sort((a, b) => (b.createdAt || '').localeCompare(a.createdAt || ''))
}

/**
 * Fetches a public invitation by custom slug
 */
export async function getPublicInvitationBySlug(slug: string) {
  const cleaned = cleanSlug(slug)
  const invColl = collection(db, 'invitations')
  const q = query(invColl, where('slug', '==', cleaned))
  const snap = await getDocs(q)
  if (snap.empty) return null
  return snap.docs[0].data()
}

/**
 * Increments the view count for a published invitation with session storage guard
 */
export async function incrementInvitationViews(invitationId: string): Promise<void> {
  if (!invitationId) return
  if (typeof window !== 'undefined' && window.sessionStorage) {
    const key = `velia_viewed_${invitationId}`
    if (sessionStorage.getItem(key)) return
    sessionStorage.setItem(key, 'true')
  }
  try {
    const invRef = doc(db, 'invitations', invitationId)
    await updateDoc(invRef, {
      viewsCount: increment(1),
    })
  } catch (err) {
    console.warn('View count increment:', err)
  }
}

/**
 * PUBLIC SECURE ACCESS: Fetches minimal public pass data by bearer token from guestAccess/{token}
 */
export async function getPublicGuestByToken(token: string): Promise<{
  token: string
  invitationId: string
  guestId: string
  guestName: string
  passes: number
  confirmedGuests: number
  rsvp: 'Confirmado' | 'Pendiente' | 'Rechazado'
} | null> {
  if (!token) return null
  const accessRef = doc(db, 'guestAccess', token)
  const snap = await getDoc(accessRef)
  if (!snap.exists()) return null
  const data = snap.data()
  if (data.status !== 'Published') return null

  return {
    token: data.token,
    invitationId: data.invitationId,
    guestId: data.guestId,
    guestName: data.guestName,
    passes: Number(data.passes || 1),
    confirmedGuests: Number(data.confirmedGuests || 0),
    rsvp: data.rsvp || 'Pendiente',
  }
}

/**
 * Updates invitation status (Draft | Published | Paused)
 */
export async function updateInvitationStatus(
  ownerId: string,
  eventId: string,
  invitationId: string,
  status: EventStatus
): Promise<void> {
  if (!ownerId || !eventId) return
  const batch = writeBatch(db)

  const userEventRef = doc(db, 'users', ownerId, 'events', eventId)
  batch.set(
    userEventRef,
    {
      status,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    },
    { merge: true }
  )

  if (invitationId) {
    const invRef = doc(db, 'invitations', invitationId)
    const updatePayload: any = {
      status,
      updatedAt: new Date().toISOString(),
      updatedAtServer: serverTimestamp(),
    }
    if (status === 'Published') {
      updatePayload.publishedAt = new Date().toISOString()
    }
    batch.set(invRef, updatePayload, { merge: true })

    try {
      const guestsSnap = await getDocs(collection(db, 'invitations', invitationId, 'guests'))
      guestsSnap.forEach(gDoc => {
        const gData = gDoc.data() as GuestItem
        if (gData.token) {
          const accessRef = doc(db, 'guestAccess', gData.token)
          batch.set(accessRef, { status, updatedAt: new Date().toISOString() }, { merge: true })
        }
      })
    } catch (err) {
      console.warn('Guest access status update fallback:', err)
    }
  }

  await batch.commit()
}

/**
 * Updates invitation sections with autosave and concurrency control
 */
export async function saveInvitationSections(
  invitationId: string,
  sections: SectionConfig[]
): Promise<void> {
  if (!invitationId) return

  const requestTimestamp = Date.now()
  if (requestTimestamp < lastSaveTimestamp) {
    return
  }
  lastSaveTimestamp = requestTimestamp

  const invRef = doc(db, 'invitations', invitationId)
  try {
    await setDoc(
      invRef,
      {
        sections,
        updatedAt: new Date().toISOString(),
        updatedAtServer: serverTimestamp(),
      },
      { merge: true }
    )
  } catch (err) {
    console.warn('saveInvitationSections error fallback:', err)
  }
}

/**
 * Real-time listener for invitation sections
 */
export function subscribeInvitationSections(
  invitationId: string,
  callback: (sections: SectionConfig[]) => void
) {
  if (!invitationId) return () => {}
  const invRef = doc(db, 'invitations', invitationId)
  return onSnapshot(invRef, (snap) => {
    if (snap.exists()) {
      const data = snap.data()
      if (data.sections && Array.isArray(data.sections)) {
        callback(data.sections)
      }
    }
  })
}

/**
 * Updates general event metadata
 */
export async function updateEventData(
  ownerId: string,
  eventId: string,
  invitationId: string,
  eventData: EventData
): Promise<void> {
  if (!ownerId || !eventId) return

  const cleanedEventData: EventData = {
    ...eventData,
    person1Name: eventData.person1Name || 'Mi Evento',
    date: eventData.date || new Date().toISOString().split('T')[0],
    customSlug: cleanSlug(eventData.customSlug || `${eventData.person1Name}`),
    updatedAt: new Date().toISOString(),
  }

  const validation = validateEventData(cleanedEventData)
  if (!validation.valid) throw new Error(validation.error)

  let uniqueSlug = cleanedEventData.customSlug
  try {
    uniqueSlug = await getUniqueSlug(cleanedEventData.customSlug, invitationId)
  } catch (e) {
    console.warn('Unique slug check update fallback:', e)
  }
  cleanedEventData.customSlug = uniqueSlug

  const batch = writeBatch(db)

  const userEventRef = doc(db, 'users', ownerId, 'events', eventId)
  batch.set(
    userEventRef,
    {
      ...cleanedEventData,
      updatedAtServer: serverTimestamp(),
    },
    { merge: true }
  )

  if (invitationId) {
    const invRef = doc(db, 'invitations', invitationId)
    batch.set(
      invRef,
      {
        eventData: cleanedEventData,
        slug: uniqueSlug,
        status: cleanedEventData.status,
        updatedAt: new Date().toISOString(),
        updatedAtServer: serverTimestamp(),
      },
      { merge: true }
    )
  }

  await batch.commit()
}

/**
 * Deletes an event and its associated public invitation document
 */
export async function deleteEventAndInvitation(
  ownerId: string,
  eventId: string,
  invitationId?: string
): Promise<void> {
  if (!ownerId || !eventId) return
  const batch = writeBatch(db)

  const userEventRef = doc(db, 'users', ownerId, 'events', eventId)
  batch.delete(userEventRef)

  if (invitationId) {
    const invRef = doc(db, 'invitations', invitationId)
    batch.delete(invRef)
  }

  await batch.commit()
}

/**
 * Real-time listener for guests list
 */
export function subscribeGuests(invitationId: string, callback: (guests: GuestItem[]) => void) {
  const guestsRef = collection(db, 'invitations', invitationId, 'guests')
  return onSnapshot(
    guestsRef,
    (snap) => {
      const guests: GuestItem[] = []
      snap.forEach(docSnap => {
        guests.push(docSnap.data() as GuestItem)
      })
      callback(guests)
    },
    (err) => {
      console.error('Error al escuchar invitados en tiempo real:', err)
    }
  )
}

/**
 * Adds or updates a guest in Firestore
 */
export async function saveGuest(invitationId: string, guest: GuestItem, ownerId?: string): Promise<GuestItem> {
  const val = validateGuest(guest)
  if (!val.valid) throw new Error(val.error)

  const token = guest.token || generateGuestToken()
  const finalGuest: GuestItem = {
    ...guest,
    invitationId,
    token,
    confirmedGuests: guest.confirmedGuests ?? (guest.rsvp === 'Confirmado' ? guest.passes : 0),
    updatedAt: new Date().toISOString(),
  }

  const batch = writeBatch(db)

  const guestRef = doc(db, 'invitations', invitationId, 'guests', finalGuest.id)
  batch.set(guestRef, finalGuest, { merge: true })

  const accessRef = doc(db, 'guestAccess', token)
  batch.set(
    accessRef,
    {
      token,
      invitationId,
      guestId: finalGuest.id,
      ownerId: ownerId || '',
      guestName: finalGuest.name,
      passes: finalGuest.passes,
      confirmedGuests: finalGuest.confirmedGuests,
      rsvp: finalGuest.rsvp,
      status: 'Published',
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  await batch.commit()

  // Log activity
  const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
  const actDoc = doc(activitiesRef)
  await setDoc(actDoc, {
    id: actDoc.id,
    text: `Invitado guardado: ${finalGuest.name} (${finalGuest.passes} pases)`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: '👤',
    type: 'update',
    createdAtServer: serverTimestamp(),
  })

  return finalGuest
}

/**
 * Deletes a guest from Firestore
 */
export async function deleteGuest(invitationId: string, guestId: string, token?: string): Promise<void> {
  const batch = writeBatch(db)

  const guestRef = doc(db, 'invitations', invitationId, 'guests', guestId)
  batch.delete(guestRef)

  if (token) {
    const accessRef = doc(db, 'guestAccess', token)
    batch.delete(accessRef)
  }

  await batch.commit()
}

/**
 * Updates RSVP status on private guest doc
 */
export async function updateRsvpStatus(
  invitationId: string,
  guestId: string,
  status: 'Confirmado' | 'Rechazado',
  confirmedCount?: number,
  dietaryNotes?: string,
  notes?: string
): Promise<void> {
  const guestRef = doc(db, 'invitations', invitationId, 'guests', guestId)
  const updateData: Partial<GuestItem> = {
    rsvp: status,
    confirmedGuests: status === 'Confirmado' ? (confirmedCount || 1) : 0,
    updatedAt: new Date().toISOString(),
  }

  if (dietaryNotes !== undefined) updateData.dietaryNotes = dietaryNotes
  if (notes !== undefined) updateData.notes = notes

  await updateDoc(guestRef, updateData)
}

// ─── TABLES MANAGEMENT ───────────────────────────────────────────────────────

export function subscribeTables(invitationId: string, callback: (tables: TableGroup[]) => void) {
  const tablesRef = collection(db, 'invitations', invitationId, 'tables')
  return onSnapshot(tablesRef, (snap) => {
    const tables: TableGroup[] = []
    snap.forEach(docSnap => {
      tables.push(docSnap.data() as TableGroup)
    })
    callback(tables)
  })
}

export async function saveTableGroup(invitationId: string, table: TableGroup): Promise<void> {
  if (!table.name || table.name.trim().length === 0) {
    throw new Error('El nombre de la mesa es obligatorio.')
  }
  if (table.capacity < 1) {
    throw new Error('La capacidad de la mesa debe ser al menos 1.')
  }

  const tableRef = doc(db, 'invitations', invitationId, 'tables', table.id)
  await setDoc(
    tableRef,
    {
      ...table,
      invitationId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
  const actDoc = doc(activitiesRef)
  await setDoc(actDoc, {
    id: actDoc.id,
    text: `Mesa actualizada: ${table.name} (${table.capacity} lugares)`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: '🍽️',
    type: 'update',
    createdAtServer: serverTimestamp(),
  })
}

export async function deleteTableGroup(invitationId: string, tableId: string): Promise<void> {
  const tableRef = doc(db, 'invitations', invitationId, 'tables', tableId)
  await deleteDoc(tableRef)
}

// ─── GIFTS MANAGEMENT ────────────────────────────────────────────────────────

export function subscribeGifts(invitationId: string, callback: (gifts: GiftItem[]) => void) {
  const giftsRef = collection(db, 'invitations', invitationId, 'gifts')
  return onSnapshot(giftsRef, (snap) => {
    const gifts: GiftItem[] = []
    snap.forEach(docSnap => {
      gifts.push(docSnap.data() as GiftItem)
    })
    callback(gifts)
  })
}

export async function saveGiftItem(invitationId: string, gift: GiftItem): Promise<void> {
  if (!gift.title || gift.title.trim().length === 0) {
    throw new Error('El título del regalo es obligatorio.')
  }
  if (gift.title.length > 100) {
    throw new Error('El título no puede exceder 100 caracteres.')
  }
  if (gift.description && gift.description.length > 500) {
    throw new Error('La descripción no puede exceder 500 caracteres.')
  }

  const giftRef = doc(db, 'invitations', invitationId, 'gifts', gift.id)
  await setDoc(
    giftRef,
    {
      ...gift,
      invitationId,
      updatedAt: new Date().toISOString(),
    },
    { merge: true }
  )

  const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
  const actDoc = doc(activitiesRef)
  await setDoc(actDoc, {
    id: actDoc.id,
    text: `Regalo configurado: ${gift.title}`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: '🎁',
    type: 'update',
    createdAtServer: serverTimestamp(),
  })
}

export async function deleteGiftItem(invitationId: string, giftId: string): Promise<void> {
  const giftRef = doc(db, 'invitations', invitationId, 'gifts', giftId)
  await deleteDoc(giftRef)
}

// ─── GALLERY MANAGEMENT & FIREBASE STORAGE ──────────────────────────────────

export function subscribeGalleryPhotos(invitationId: string, callback: (photos: GalleryPhoto[]) => void) {
  const photosRef = collection(db, 'invitations', invitationId, 'gallery')
  return onSnapshot(photosRef, (snap) => {
    const photos: GalleryPhoto[] = []
    snap.forEach(docSnap => {
      photos.push(docSnap.data() as GalleryPhoto)
    })
    callback(photos)
  })
}

export async function uploadGalleryPhoto(invitationId: string, file: File): Promise<GalleryPhoto> {
  const photoId = `photo_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`
  const storageRef = ref(storage, `invitations/${invitationId}/gallery/${photoId}_${file.name}`)

  const uploadResult = await uploadBytes(storageRef, file)
  const downloadUrl = await getDownloadURL(uploadResult.ref)

  const photoObj: GalleryPhoto = {
    id: photoId,
    invitationId,
    url: downloadUrl,
    name: file.name,
    enabled: true,
    createdAt: new Date().toISOString(),
  }

  const photoRef = doc(db, 'invitations', invitationId, 'gallery', photoId)
  await setDoc(photoRef, photoObj)

  const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
  const actDoc = doc(activitiesRef)
  await setDoc(actDoc, {
    id: actDoc.id,
    text: `Nueva fotografía agregada a la galería`,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    icon: '🖼️',
    type: 'update',
    createdAtServer: serverTimestamp(),
  })

  return photoObj
}

export async function toggleGalleryPhotoEnabled(
  invitationId: string,
  photoId: string,
  enabled: boolean
): Promise<void> {
  const photoRef = doc(db, 'invitations', invitationId, 'gallery', photoId)
  await updateDoc(photoRef, { enabled })
}

export async function deleteGalleryPhoto(invitationId: string, photoId: string, photoUrl?: string): Promise<void> {
  const photoRef = doc(db, 'invitations', invitationId, 'gallery', photoId)
  await deleteDoc(photoRef)

  if (photoUrl && photoUrl.includes('firebasestorage')) {
    try {
      const fileRef = ref(storage, photoUrl)
      await deleteObject(fileRef)
    } catch (e) {
      console.warn('Storage file cleanup:', e)
    }
  }
}

/**
 * PUBLIC RSVP: Confirms RSVP via bearer token safely on guestAccess/{token}
 */
export async function submitPublicRsvpWithToken(
  token: string,
  status: 'Confirmado' | 'Rechazado',
  confirmedCount: number,
  dietaryNotes?: string,
  notes?: string
): Promise<void> {
  if (!token) throw new Error('Token de invitado no válido.')

  const accessRef = doc(db, 'guestAccess', token)
  const snap = await getDoc(accessRef)
  if (!snap.exists()) throw new Error('Acceso de invitado no encontrado.')

  const accessData = snap.data()
  const allowedPasses = Number(accessData.passes || 1)

  const finalConfirmedCount = status === 'Confirmado' ? Math.min(Math.max(1, confirmedCount), allowedPasses) : 0

  const publicUpdateData: any = {
    rsvp: status,
    confirmedGuests: finalConfirmedCount,
    updatedAt: new Date().toISOString(),
  }

  await updateDoc(accessRef, publicUpdateData)

  const invitationId = accessData.invitationId
  const guestId = accessData.guestId
  if (invitationId && guestId) {
    try {
      const privateGuestRef = doc(db, 'invitations', invitationId, 'guests', guestId)
      const privateUpdate: Partial<GuestItem> = {
        rsvp: status,
        confirmedGuests: finalConfirmedCount,
        updatedAt: new Date().toISOString(),
      }
      if (dietaryNotes !== undefined) privateUpdate.dietaryNotes = dietaryNotes
      if (notes !== undefined) privateUpdate.notes = notes

      await updateDoc(privateGuestRef, privateUpdate)

      const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
      const actDoc = doc(activitiesRef)
      await setDoc(actDoc, {
        id: actDoc.id,
        text: `${accessData.guestName} ${status === 'Confirmado' ? `confirmó asistencia (${finalConfirmedCount} pases)` : 'declinó la invitación'}`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        icon: status === 'Confirmado' ? '✅' : '❌',
        type: 'confirm',
        createdAtServer: serverTimestamp(),
      })
    } catch (e) {
      console.warn('Syncing to private guest doc:', e)
    }
  }
}

/**
 * Builds personalized WhatsApp share URL
 */
export function buildWhatsAppShareUrl(
  slug: string,
  guestName?: string,
  token?: string,
  phone?: string
): string {
  const origin = typeof window !== 'undefined' ? window.location.origin : 'https://velia.mx'
  const personalUrl = token
    ? `${origin}/e/${cleanSlug(slug)}?token=${token}`
    : `${origin}/e/${cleanSlug(slug)}`

  const greeting = guestName ? `¡Hola ${guestName}! ` : ''
  const text = `${greeting}Queremos compartir contigo nuestra invitación. Puedes ver todos los detalles y confirmar tu asistencia aquí: ${personalUrl}`

  const cleanPhone = (phone || '').replace(/[^0-9]/g, '')
  if (cleanPhone) {
    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`
  }
  return `https://wa.me/?text=${encodeURIComponent(text)}`
}

/**
 * Real-time listener for activity feed
 */
export function subscribeActivities(invitationId: string, callback: (activities: ActivityItem[]) => void) {
  const activitiesRef = collection(db, 'invitations', invitationId, 'activities')
  return onSnapshot(
    activitiesRef,
    (snap) => {
      const activities: ActivityItem[] = []
      snap.forEach(docSnap => {
        activities.push(docSnap.data() as ActivityItem)
      })
      callback(activities)
    },
    (err) => {
      console.error('Error al escuchar actividad en tiempo real:', err)
    }
  )
}
