import { GuestItem } from '../types'

export interface SectionConfig {
  id: string
  name: string
  icon: string
  visible: boolean
  order: number
  title?: string
  subtitle?: string
  date?: string
  location?: string
  venue?: string
  time?: string
  imageUrl?: string
  overlayOpacity?: number
  alignment?: 'left' | 'center' | 'right'
  fontSize?: 'sm' | 'md' | 'lg' | 'xl'
  fontWeight?: 'normal' | 'bold'
  fontItalic?: boolean
  textColor?: string
  content?: string
}

export interface ActivityItem {
  id: string
  text: string
  time: string
  icon: string
  type: 'confirm' | 'update' | 'open'
}

export interface TableGroup {
  id: string
  name: string
  capacity: number
  guests: GuestItem[]
}

export interface ThemePreset {
  id: string
  name: string
  primaryColor: string
  accentColor: string
  bgColor: string
  fontFamily: string
  buttonStyle: string
  imgPreview: string
}

export const GALLERY_IMAGES: string[] = []

export const INITIAL_SECTIONS: SectionConfig[] = [
  {
    id: 'portada',
    name: 'Portada',
    icon: '✨',
    visible: true,
    order: 1,
    title: 'Nuestra Celebración',
    subtitle: 'Con alegría te invitamos a nuestro evento',
    date: '',
    location: '',
    imageUrl: 'https://images.unsplash.com/photo-1763553113332-800519753e40?w=800&h=1200&fit=crop&auto=format',
    overlayOpacity: 35,
    alignment: 'center',
    fontSize: 'xl',
    fontWeight: 'normal',
    fontItalic: false,
    textColor: '#FFFFFF',
  },
  {
    id: 'mensaje',
    name: 'Mensaje',
    icon: '✉️',
    visible: true,
    order: 2,
    title: 'Nuestra Invitación',
    content: 'Queremos compartir contigo este día tan especial. Tu presencia es muy importante para nosotros.',
    alignment: 'center',
    fontSize: 'md',
    textColor: '#332B27',
  },
  {
    id: 'regresiva',
    name: 'Cuenta regresiva',
    icon: '⏳',
    visible: true,
    order: 3,
    title: 'El gran día',
    subtitle: 'Faltan pocos días',
    date: '',
    alignment: 'center',
  },
  {
    id: 'historia',
    name: 'Nuestra historia',
    icon: '📖',
    visible: true,
    order: 4,
    title: 'Nuestra Historia',
    content: '',
    imageUrl: 'https://images.unsplash.com/photo-1524650448000-02d0a2aeb6cb?w=600&h=800&fit=crop&auto=format',
    alignment: 'left',
  },
  {
    id: 'itinerario',
    name: 'Itinerario',
    icon: '🕒',
    visible: true,
    order: 5,
    title: 'Programa del Evento',
    content: '17:00 HRS · Ceremonia\n18:30 HRS · Cóctel de Bienvenida\n20:00 HRS · Recepción',
    alignment: 'center',
  },
  {
    id: 'dresscode',
    name: 'Dress code',
    icon: '👔',
    visible: true,
    order: 6,
    title: 'Código de Vestimenta',
    subtitle: 'Formal / Etiqueta',
    content: '',
    alignment: 'center',
  },
  {
    id: 'galeria',
    name: 'Galería',
    icon: '🖼️',
    visible: true,
    order: 7,
    title: 'Galería de Fotos',
    subtitle: 'Momentos especiales',
    alignment: 'center',
  },
  {
    id: 'ubicacion',
    name: 'Ubicación',
    icon: '📍',
    visible: true,
    order: 8,
    title: 'Lugar de la Celebración',
    venue: '',
    location: '',
    alignment: 'center',
  },
  {
    id: 'regalos',
    name: 'Regalos',
    icon: '🎁',
    visible: true,
    order: 9,
    title: 'Mesa de Regalos',
    content: 'El mejor regalo es tu presencia.',
    subtitle: '',
    alignment: 'center',
  },
  {
    id: 'rsvp',
    name: 'RSVP',
    icon: '✍️',
    visible: true,
    order: 10,
    title: 'Confirmar Asistencia',
    subtitle: 'Por favor confirma tu asistencia',
    alignment: 'center',
  },
  {
    id: 'mesa',
    name: 'Mesa',
    icon: '🍽️',
    visible: false,
    order: 11,
    title: 'Consulta tu Mesa',
    subtitle: 'Ingresa tu nombre para ver tu lugar asignado',
    alignment: 'center',
  },
  {
    id: 'libro',
    name: 'Libro de firmas',
    icon: '🖊️',
    visible: false,
    order: 12,
    title: 'Libro de Deseos',
    subtitle: 'Déjanos un mensaje especial',
    alignment: 'center',
  },
]

export const INITIAL_GUESTS: GuestItem[] = []

export const INITIAL_ACTIVITIES: ActivityItem[] = []

export const THEME_PRESETS: ThemePreset[] = [
  {
    id: 'editorial',
    name: 'Editorial',
    primaryColor: '#332B27',
    accentColor: '#C8A982',
    bgColor: '#FAF8F4',
    fontFamily: 'Cormorant Garamond',
    buttonStyle: 'rounded-full',
    imgPreview: 'https://images.unsplash.com/photo-1763553113332-800519753e40?w=200&h=200&fit=crop&auto=format',
  },
  {
    id: 'romantic',
    name: 'Romantic',
    primaryColor: '#C9A5A0',
    accentColor: '#E9DED2',
    bgColor: '#FFFBF9',
    fontFamily: 'Cormorant Garamond',
    buttonStyle: 'rounded-full',
    imgPreview: 'https://images.unsplash.com/photo-1524650448000-02d0a2aeb6cb?w=200&h=200&fit=crop&auto=format',
  },
  {
    id: 'classic',
    name: 'Clásico',
    primaryColor: '#1C1B1A',
    accentColor: '#C8A982',
    bgColor: '#F8F6F0',
    fontFamily: 'Cinzel',
    buttonStyle: 'rounded-lg',
    imgPreview: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=200&h=200&fit=crop&auto=format',
  },
]
