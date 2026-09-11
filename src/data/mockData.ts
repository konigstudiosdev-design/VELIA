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

export const GALLERY_IMAGES: string[] = [
  'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=800&h=800&fit=crop&auto=format',
  'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=800&h=800&fit=crop&auto=format',
]

export const INITIAL_SECTIONS: SectionConfig[] = [
  {
    id: 'portada',
    name: 'Portada',
    icon: '✨',
    visible: true,
    order: 1,
    title: 'Lucía & Mateo',
    subtitle: 'Con alegría te invitamos a nuestra boda',
    date: '18 · 09 · 2027',
    location: 'Ciudad de México',
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
    content: 'Queremos compartir contigo el comienzo de esta nueva etapa de nuestras vidas. Tu presencia hará que este día sea verdaderamente inolvidable.',
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
    date: '2027-09-18',
    alignment: 'center',
  },
  {
    id: 'historia',
    name: 'Nuestra historia',
    icon: '📖',
    visible: true,
    order: 4,
    title: 'Cómo nos conocimos',
    content: 'Nos conocimos un otoño en Ciudad de México y desde ese primer café supimos que compartiríamos muchas aventuras juntos.',
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
    content: '17:00 HRS · Ceremonia Civil\n18:30 HRS · Cóctel de Bienvenida\n20:00 HRS · Cena & Recepción\n22:00 HRS · Fiesta',
    alignment: 'center',
  },
  {
    id: 'dresscode',
    name: 'Dress code',
    icon: '👔',
    visible: true,
    order: 6,
    title: 'Código de Vestimenta',
    subtitle: 'Rigurosa Etiqueta / Gala',
    content: 'Hombres: Esmoquin o Traje Oscuro.\nMujeres: Vestido Largo de Gala.',
    alignment: 'center',
  },
  {
    id: 'galeria',
    name: 'Galería',
    icon: '🖼️',
    visible: true,
    order: 7,
    title: 'Nuestros Momentos',
    subtitle: 'Fotografías de nuestro camino juntos',
    alignment: 'center',
  },
  {
    id: 'ubicacion',
    name: 'Ubicación',
    icon: '📍',
    visible: true,
    order: 8,
    title: 'Lugar de la Celebración',
    venue: 'Villa Escondida',
    location: 'Carretera Picacho Ajusco Km 4.5, CDMX',
    alignment: 'center',
  },
  {
    id: 'regalos',
    name: 'Regalos',
    icon: '🎁',
    visible: true,
    order: 9,
    title: 'Mesa de Regalos',
    content: 'El mejor regalo es tu presencia, pero si deseas hacernos un detalle:',
    subtitle: 'El Palacio de Hierro · Evento 49201',
    alignment: 'center',
  },
  {
    id: 'rsvp',
    name: 'RSVP',
    icon: '✍️',
    visible: true,
    order: 10,
    title: 'Confirmar Asistencia',
    subtitle: 'Por favor confirma antes del 1 de septiembre',
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

export const INITIAL_GUESTS: GuestItem[] = [
  { id: '1', name: 'María González', phone: '+52 33 1234 5678', email: 'maria@ejemplo.com', group: 'Familia Novia', passes: 2, confirmedGuests: 2, rsvp: 'Confirmado', table: 'Mesa 3', dietaryNotes: 'Vegetariano', token: 'g_maria_1234' },
  { id: '2', name: 'Carlos Ramírez', phone: '+52 33 9876 5432', email: 'carlos@ejemplo.com', group: 'Amigos', passes: 1, confirmedGuests: 0, rsvp: 'Pendiente', table: 'Mesa 1', token: 'g_carlos_5678' },
  { id: '3', name: 'Ana Martínez', phone: '+52 55 4321 8765', email: 'ana@ejemplo.com', group: 'Familia Novio', passes: 2, confirmedGuests: 2, rsvp: 'Confirmado', table: 'Mesa 2', token: 'g_ana_9012' },
  { id: '4', name: 'Fernando Silva', phone: '+52 81 5555 1234', group: 'Trabajo', passes: 2, confirmedGuests: 2, rsvp: 'Confirmado', table: 'Mesa 3', token: 'g_fer_3456' },
  { id: '5', name: 'Sofía López', phone: '+52 55 9988 7766', group: 'Amigos', passes: 1, confirmedGuests: 0, rsvp: 'Rechazado', table: 'Sin asignar', token: 'g_sofia_7890' },
  { id: '6', name: 'Elena Torres', phone: '+52 33 8877 6655', group: 'Familia Novia', passes: 2, confirmedGuests: 2, rsvp: 'Confirmado', table: 'Mesa 1', token: 'g_elena_2345' },
  { id: '7', name: 'Rodrigo Ruiz', phone: '+52 55 1122 3344', group: 'Trabajo', passes: 3, confirmedGuests: 0, rsvp: 'Pendiente', table: 'Mesa 4', token: 'g_rod_6789' },
  { id: '8', name: 'Beatriz Morales', phone: '+52 81 9900 1122', group: 'Familia Novio', passes: 2, confirmedGuests: 2, rsvp: 'Confirmado', table: 'Mesa 2', token: 'g_bea_0123' },
]

export const INITIAL_ACTIVITIES: ActivityItem[] = [
  { id: '1', text: 'María González confirmó asistencia (2 pases)', time: 'Hace 10 min', icon: '✅', type: 'confirm' },
  { id: '2', text: 'Carlos Ramírez actualizó su respuesta a pendiente', time: 'Hace 1 hora', icon: '🔄', type: 'update' },
  { id: '3', text: 'Ana Martínez abrió la invitación por WhatsApp', time: 'Hace 3 horas', icon: '👁️', type: 'open' },
  { id: '4', text: 'Fernando Silva confirmó asistencia (2 pases)', time: 'Hace 5 horas', icon: '✅', type: 'confirm' },
  { id: '5', text: 'Elena Torres envió un mensaje en el libro de firmas', time: 'Hace 1 día', icon: '💌', type: 'update' },
]

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
