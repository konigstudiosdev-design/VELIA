import { InvitationSection, TemplateDefinition, InvitationTheme } from '../types'

export const DEFAULT_THEME: InvitationTheme = {
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

export function getDefaultSections(eventData?: any): InvitationSection[] {
  const p1 = eventData?.person1Name || 'Lucía'
  const p2 = eventData?.person2Name || 'Mateo'
  const names = p2 ? `${p1} & ${p2}` : p1
  const date = eventData?.date || '2027-09-18'

  return [
    {
      id: 'sec_hero',
      type: 'hero',
      order: 0,
      enabled: true,
      content: {
        title: names,
        subtitle: 'Nos casamos',
        tagline: 'Con la bendición de nuestros padres e hijos',
        date,
        location: eventData?.location || 'Villa Escondida · CDMX',
        imageUrl: 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=1200&h=1600&fit=crop&auto=format',
      },
      settings: {
        alignment: 'center',
        overlayOpacity: 0.4,
        fullHeight: true,
      },
    },
    {
      id: 'sec_message',
      type: 'message',
      order: 1,
      enabled: true,
      content: {
        title: 'Nuestra Historia',
        text: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables. Queremos que seas parte de este día tan importante para nosotros.',
      },
      settings: {
        fontItalic: true,
        alignment: 'center',
      },
    },
    {
      id: 'sec_countdown',
      type: 'countdown',
      order: 2,
      enabled: true,
      content: {
        title: 'Faltan muy pocos días',
        targetDate: `${date}T16:00:00`,
      },
      settings: {
        style: 'cards',
      },
    },
    {
      id: 'sec_dateLocation',
      type: 'dateLocation',
      order: 3,
      enabled: true,
      content: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Ceremonia Religiosa',
        ceremonyTime: '16:00 HRS',
        ceremonyPlace: 'Parroquia de San José',
        ceremonyAddress: 'Av. Revolución 120, CDMX',
        receptionTitle: 'Recepción & Fiesta',
        receptionTime: '18:30 HRS',
        receptionPlace: 'Hacienda Villa Escondida',
        receptionAddress: 'Carretera Libre a Toluca Km 24',
      },
      settings: {
        showMapButton: true,
      },
    },
    {
      id: 'sec_schedule',
      type: 'schedule',
      order: 4,
      enabled: true,
      content: {
        title: 'Itinerario del Evento',
        items: [
          { time: '16:00 HRS', title: 'Misa de Acción de Gracias', desc: 'Parroquia de San José' },
          { time: '18:00 HRS', title: 'Cóctel de Bienvenida', desc: 'Jardín Principal de la Hacienda' },
          { time: '19:30 HRS', title: 'Cena & Brindis', desc: 'Gran Salón' },
          { time: '21:00 HRS', title: 'Apertura de Pista', desc: 'Música en vivo y baile' },
        ],
      },
      settings: {},
    },
    {
      id: 'sec_dressCode',
      type: 'dressCode',
      order: 5,
      enabled: true,
      content: {
        title: 'Código de Vestimenta',
        code: 'Rigurosa Etiqueta / Formal',
        description: 'Mujeres: Vestido largo elegante · Hombres: Esmoquin o Traje oscuro.',
        colorNote: 'Agradecemos evitar tonos blancos, marfil y beige reservados para la novia.',
      },
      settings: {},
    },
    {
      id: 'sec_gallery',
      type: 'gallery',
      order: 6,
      enabled: true,
      content: {
        title: 'Galería de Recuerdos',
        images: [
          'https://images.unsplash.com/photo-1519741497674-611481863552?w=600&h=800&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=600&h=800&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1520854221256-17451cc331bf?w=600&h=800&fit=crop&auto=format',
          'https://images.unsplash.com/photo-1583939003579-730e3918a45a?w=600&h=800&fit=crop&auto=format',
        ],
      },
      settings: {
        columns: 2,
      },
    },
    {
      id: 'sec_rsvp',
      type: 'rsvp',
      order: 7,
      enabled: true,
      content: {
        title: 'Confirmación de Asistencia',
        subtitle: 'Por favor confirma tu presencia antes del 1 de Agosto de 2027',
        deadline: '2027-08-01',
      },
      settings: {
        requireDietary: true,
      },
    },
    {
      id: 'sec_gifts',
      type: 'gifts',
      order: 8,
      enabled: true,
      content: {
        title: 'Mesa de Regalos',
        subtitle: 'Tu presencia es nuestro mejor regalo. Si deseas realizarnos un obsequio, ponemos a tu disposición:',
        clabe: '012180015488921102',
        bank: 'BBVA Bancomer',
        beneficiary: names,
        wishlistUrl: 'https://www.liverpool.com.mx/tienda/giftregistry',
      },
      settings: {},
    },
    {
      id: 'sec_lodging',
      type: 'lodging',
      order: 9,
      enabled: true,
      content: {
        title: 'Hospedaje Recomendado',
        hotels: [
          { name: 'Hotel Boutique Quinta Real', code: 'BODA-LUCIA-MATEO', discount: '15% Descuento', phone: '+52 55 1234 5678' },
          { name: 'Hotel Camino Real CDMX', code: 'VELIA2027', discount: 'Tarifa preferencial', phone: '+52 55 8765 4321' },
        ],
      },
      settings: {},
    },
    {
      id: 'sec_playlist',
      type: 'playlist',
      order: 10,
      enabled: true,
      content: {
        title: 'Sugiérenos una Canción',
        subtitle: '¿Qué canción no puede faltar en la pista de baile? Agrégala a nuestra playlist.',
        spotifyUrl: 'https://open.spotify.com',
      },
      settings: {},
    },
    {
      id: 'sec_location',
      type: 'location',
      order: 11,
      enabled: true,
      content: {
        title: 'Ubicación & Mapa',
        address: 'Hacienda Villa Escondida · Carretera Libre a Toluca Km 24',
        mapUrl: 'https://maps.google.com',
      },
      settings: {},
    },
    {
      id: 'sec_guestbook',
      type: 'guestbook',
      order: 12,
      enabled: true,
      content: {
        title: 'Libro de Firmas & Deseos',
        subtitle: 'Déjanos un mensaje con tus buenos deseos para esta nueva etapa.',
      },
      settings: {},
    },
  ]
}

export const TEMPLATE_DEFINITIONS: Record<string, TemplateDefinition> = {
  maison: {
    id: 'maison',
    name: 'Maison',
    category: 'Boda',
    style: 'Editorial',
    tag: 'Editorial · Elegante',
    img: 'https://images.unsplash.com/photo-1763553113332-800519753e40?w=800&h=1200&fit=crop&auto=format',
    accent: '#C8A982',
    description: 'Composición alta moda con bloques tipográficos audaces y márgenes amplios.',
    theme: {
      ...DEFAULT_THEME,
      primaryColor: '#332B27',
      accentColor: '#C8A982',
      headingFont: 'Cormorant Garamond',
    },
    defaultSections: getDefaultSections(),
  },
  amour: {
    id: 'amour',
    name: 'Amour',
    category: 'Boda',
    style: 'Romántico',
    tag: 'Romántico · Clásico',
    img: 'https://images.unsplash.com/photo-1524650448000-02d0a2aeb6cb?w=800&h=1200&fit=crop&auto=format',
    accent: '#E9DED2',
    description: 'Tonos cálidos y románticos con detalles botánicos sutiles.',
    theme: {
      ...DEFAULT_THEME,
      primaryColor: '#4A3B32',
      accentColor: '#D8B8A0',
      headingFont: 'Cormorant Garamond',
    },
    defaultSections: getDefaultSections(),
  },
  verona: {
    id: 'verona',
    name: 'Verona',
    category: 'Boda',
    style: 'Clásico',
    tag: 'Clásico · Atemporal',
    img: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=800&h=1200&fit=crop&auto=format',
    accent: '#332B27',
    description: 'Elegancia europea tradicional con caligrafía delicada y monogramas reales.',
    theme: {
      ...DEFAULT_THEME,
      primaryColor: '#2C2623',
      accentColor: '#C8A982',
      headingFont: 'Cinzel',
    },
    defaultSections: getDefaultSections(),
  },
  lumiere: {
    id: 'lumiere',
    name: 'Lumière',
    category: 'Boda',
    style: 'Minimalista',
    tag: 'Minimal · Pulido',
    img: 'https://images.unsplash.com/photo-1606490208247-b65be3d94cd1?w=800&h=1200&fit=crop&auto=format',
    accent: '#1C1B1A',
    description: 'Estética arquitectónica limpia, enfoque en espacios en blanco y fotografías icónicas.',
    theme: {
      ...DEFAULT_THEME,
      primaryColor: '#1C1B1A',
      accentColor: '#8E8279',
      headingFont: 'Inter',
    },
    defaultSections: getDefaultSections(),
  },
}
