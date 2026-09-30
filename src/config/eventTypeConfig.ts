import { EventType, SectionType } from '../types'

export type EventTypeKey =
  | 'wedding'
  | 'quinceanera'
  | 'birthday'
  | 'baptism'
  | 'graduation'
  | 'baby_shower'
  | 'communion'
  | 'anniversary'
  | 'other'

export interface EventTypeConfig {
  key: EventTypeKey
  displayName: string

  // 1. Allowed / forbidden sections
  allowedSections: SectionType[]
  defaultActiveSections: SectionType[]
  forbiddenSections: SectionType[]
  recommendedSectionOrder: SectionType[]

  // 2. Allowed / forbidden fields
  allowedFields: {
    person1Name: boolean
    person2Name: boolean
    age: boolean
    yearsToCelebrate: boolean
    parents: boolean
    godparents: boolean
    courtOfHonor: boolean
    chambelanes: boolean
    honoreeRoleName: string
  }

  // 3. Field labels
  fieldLabels: {
    person1Name: string
    person2Name?: string
    age?: string
    yearsToCelebrate?: string
    heroSubtitle: string
    heroTagline: string
    ceremonyTitle: string
    receptionTitle: string
    dressCodeTitle: string
    dressCodeDefault: string
    dressCodeNote?: string
    messageTitle: string
    messageDefaultText: string
    giftsTitle: string
    giftsSubtitle: string
    guestbookTitle: string
    guestbookSubtitle: string
  }

  // 4. Default section contents
  defaultSectionContents: {
    hero: {
      subtitle: string
      tagline: string
      locationDefault: string
    }
    message: {
      title: string
      text: string
    }
    countdown: {
      title: string
    }
    dateLocation: {
      title: string
      ceremonyTitle: string
      ceremonyPlace: string
      receptionTitle: string
      receptionPlace: string
    }
    schedule: {
      title: string
      items: Array<{ time: string; title: string; desc: string }>
    }
    dressCode: {
      title: string
      code: string
      description: string
      colorNote?: string
    }
    gifts: {
      title: string
      subtitle: string
    }
    guestbook: {
      title: string
      subtitle: string
    }
  }
}

/**
 * Normalizes any string representation of event type to a standard EventTypeKey
 */
export function getEventTypeKey(eventType?: string | EventType): EventTypeKey {
  if (!eventType) return 'other'
  const normalized = eventType.toLowerCase().trim()

  if (normalized.includes('boda') || normalized === 'wedding') return 'wedding'
  if (normalized.includes('xv') || normalized.includes('quince') || normalized === 'quinceanera') return 'quinceanera'
  if (normalized.includes('cumple') || normalized === 'birthday') return 'birthday'
  if (normalized.includes('baby') || normalized === 'baby_shower') return 'baby_shower'
  if (normalized.includes('bautiz') || normalized === 'baptism') return 'baptism'
  if (normalized.includes('gradua') || normalized === 'graduation') return 'graduation'
  if (normalized.includes('comun') || normalized === 'communion') return 'communion'
  if (normalized.includes('anivers') || normalized === 'anniversary') return 'anniversary'
  return 'other'
}

/**
 * Complete Event Type Configurations map
 */
export const EVENT_TYPE_CONFIGS: Record<EventTypeKey, EventTypeConfig> = {
  // ─── BODA ───────────────────────────────────────────────────────────────────
  wedding: {
    key: 'wedding',
    displayName: 'Boda',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'lodging',
      'playlist',
      'location',
      'guestbook',
      'eventPhotos',
      'seating',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'lodging',
      'playlist',
      'location',
      'guestbook',
      'seating',
      'eventPhotos',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: true,
      age: false,
      yearsToCelebrate: false,
      parents: true,
      godparents: false,
      courtOfHonor: true,
      chambelanes: false,
      honoreeRoleName: 'Novios',
    },
    fieldLabels: {
      person1Name: 'Nombre de la Novia / Novio 1',
      person2Name: 'Nombre del Novio / Novio 2',
      heroSubtitle: 'Nos casamos',
      heroTagline: 'Con la bendición de Dios y de nuestros padres',
      ceremonyTitle: 'Ceremonia Religiosa',
      receptionTitle: 'Recepción & Fiesta',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Rigurosa Etiqueta / Formal',
      dressCodeNote: 'Agradecemos evitar tonos blancos, marfil y beige reservados para la novia.',
      messageTitle: 'Nuestra Historia',
      messageDefaultText:
        'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables. Queremos que seas parte de este día tan importante para nosotros.',
      giftsTitle: 'Mesa de Regalos',
      giftsSubtitle: 'Tu presencia es nuestro mejor regalo. Si deseas realizarnos un obsequio, ponemos a tu disposición:',
      guestbookTitle: 'Libro de Firmas & Deseos',
      guestbookSubtitle: 'Déjanos un mensaje con tus buenos deseos para esta nueva etapa.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Nos casamos',
        tagline: 'Con la bendición de Dios y de nuestros padres',
        locationDefault: 'Villa Escondida · CDMX',
      },
      message: {
        title: 'Nuestra Historia',
        text: 'Hay momentos en la vida que son especiales por sí solos, pero compartirlos con las personas que más queremos los hace inolvidables. Queremos que seas parte de este día tan importante para nosotros.',
      },
      countdown: {
        title: 'Faltan muy pocos días',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Ceremonia Religiosa',
        ceremonyPlace: 'Parroquia de San José',
        receptionTitle: 'Recepción & Fiesta',
        receptionPlace: 'Hacienda Villa Escondida',
      },
      schedule: {
        title: 'Itinerario de la Boda',
        items: [
          { time: '16:00 HRS', title: 'Misa de Matrimonio', desc: 'Parroquia Principal' },
          { time: '18:00 HRS', title: 'Cóctel de Bienvenida', desc: 'Jardín de la Hacienda' },
          { time: '19:30 HRS', title: 'Cena & Brindis', desc: 'Gran Salón' },
          { time: '21:00 HRS', title: 'Apertura de Pista & Baile', desc: 'Música en vivo' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Rigurosa Etiqueta / Formal',
        description: 'Mujeres: Vestido largo elegante · Hombres: Esmoquin o Traje oscuro.',
        colorNote: 'Agradecemos evitar tonos blancos, marfil y beige reservados para la novia.',
      },
      gifts: {
        title: 'Mesa de Regalos',
        subtitle: 'Tu presencia es nuestro mejor regalo. Si deseas realizarnos un obsequio, ponemos a tu disposición:',
      },
      guestbook: {
        title: 'Libro de Firmas & Deseos',
        subtitle: 'Déjanos un mensaje con tus buenos deseos para esta nueva etapa.',
      },
    },
  },

  // ─── XV AÑOS ────────────────────────────────────────────────────────────────
  quinceanera: {
    key: 'quinceanera',
    displayName: 'XV Años',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'lodging',
      'playlist',
      'location',
      'guestbook',
      'eventPhotos',
      'seating',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'playlist',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: true,
      yearsToCelebrate: false,
      parents: true,
      godparents: true,
      courtOfHonor: true,
      chambelanes: true,
      honoreeRoleName: 'Quinceañera',
    },
    fieldLabels: {
      person1Name: 'Nombre de la Quinceañera',
      age: 'Edad (15)',
      heroSubtitle: 'Mis XV Años',
      heroTagline: 'Con la bendición de Dios y el amor de mis padres y padrinos',
      ceremonyTitle: 'Misa de Acción de Gracias',
      receptionTitle: 'Recepción & Baile de Gala',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Formal / Gala',
      dressCodeNote: 'Agradecemos reservar la gama de tonos del vestido principal para la Quinceañera.',
      messageTitle: 'Agradecimiento Especial',
      messageDefaultText:
        'Hoy celebro 15 años llenos de ilusión, sueños y momentos inolvidables. Acompañarme en esta noche tan especial será el mejor regalo.',
      giftsTitle: 'Mesa de Regalos',
      giftsSubtitle: 'Tu presencia es mi mayor alegría. Si deseas darme un detalle especial:',
      guestbookTitle: 'Libro de Recuerdos & Deseos',
      guestbookSubtitle: 'Déjame un mensaje especial para recordar siempre esta linda noche.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Mis XV Años',
        tagline: 'Con la bendición de Dios y el amor de mis padres y padrinos',
        locationDefault: 'Salón de Eventos Real · CDMX',
      },
      message: {
        title: 'Agradecimiento Especial',
        text: 'Hoy celebro 15 años llenos de ilusión, sueños y momentos inolvidables. Acompañarme en esta noche tan especial será el mejor regalo.',
      },
      countdown: {
        title: 'El gran día de mis XV',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Misa de Acción de Gracias',
        ceremonyPlace: 'Parroquia de Nuestra Señora de Guadalupe',
        receptionTitle: 'Recepción & Baile de Gala',
        receptionPlace: 'Salón Real de Gala',
      },
      schedule: {
        title: 'Itinerario de la Noche',
        items: [
          { time: '17:00 HRS', title: 'Misa de Acción de Gracias', desc: 'Santuario Principal' },
          { time: '19:00 HRS', title: 'Recepción & Bienvenida', desc: 'Jardines del Salón' },
          { time: '20:30 HRS', title: 'Entrada Triunfal & Vals', desc: 'Baile con Papá y Chambelanes' },
          { time: '21:30 HRS', title: 'Cena & Pista de Baile', desc: 'Música & Dj en vivo' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Formal / Gala',
        description: 'Vestido de noche o traje formal para acompañarme en esta gran celebración.',
        colorNote: 'Agradecemos reservar los tonos del vestido principal para la Quinceañera.',
      },
      gifts: {
        title: 'Mesa de Regalos',
        subtitle: 'Tu presencia es mi mayor alegría. Si deseas darme un detalle especial:',
      },
      guestbook: {
        title: 'Libro de Recuerdos',
        subtitle: 'Déjame un mensaje especial para recordar siempre esta linda noche.',
      },
    },
  },

  // ─── CUMPLEAÑOS ─────────────────────────────────────────────────────────────
  birthday: {
    key: 'birthday',
    displayName: 'Cumpleaños',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'playlist',
      'location',
      'guestbook',
      'eventPhotos',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'playlist',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: true,
      yearsToCelebrate: false,
      parents: false,
      godparents: false,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Festejado(a)',
    },
    fieldLabels: {
      person1Name: 'Nombre del Festejado(a)',
      age: 'Edad a cumplir',
      heroSubtitle: '¡Celebremos juntos!',
      heroTagline: 'Un año más lleno de grandes historias y momentos inolvidables',
      ceremonyTitle: 'Lugar de Encuentro',
      receptionTitle: 'Fiesta & Celebración',
      dressCodeTitle: 'Dress Code',
      dressCodeDefault: 'Casual Elegante / Coctel',
      messageTitle: 'Mi Celebración',
      messageDefaultText:
        'Un año más es la excusa perfecta para reunir a las personas que más quiero. ¡Acompáñame a festejar en grande!',
      giftsTitle: 'Mesa de Regalos / Lluvia de Sobres',
      giftsSubtitle: 'Tu presencia es el mejor regalo. Si deseas darme un obsequio:',
      guestbookTitle: 'Mensajes de Cumpleaños',
      guestbookSubtitle: '¡Déjame una felicitación o consejo divertido para este nuevo año!',
    },
    defaultSectionContents: {
      hero: {
        subtitle: '¡Celebremos juntos!',
        tagline: 'Un año más lleno de historias y grandes momentos',
        locationDefault: 'Terraza & Garden Lounge',
      },
      message: {
        title: 'Mi Celebración',
        text: 'Un año más es la excusa perfecta para reunir a las personas que más quiero. ¡Acompáñame a festejar en grande!',
      },
      countdown: {
        title: 'Faltan pocos días para el festejo',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Cóctel de Bienvenida',
        ceremonyPlace: 'Lounge Bar',
        receptionTitle: 'Fiesta & Cena',
        receptionPlace: 'Terraza Principal',
      },
      schedule: {
        title: 'Itinerario de la Fiesta',
        items: [
          { time: '18:00 HRS', title: 'Cóctel & Bienvenida', desc: 'Bebidas de autor' },
          { time: '19:30 HRS', title: 'Cena & Brindis', desc: 'Momentos especiales' },
          { time: '21:00 HRS', title: 'Pastel & Mañanitas', desc: 'Momento del deseo' },
          { time: '21:30 HRS', title: 'Fiesta & DJ Set', desc: '¡A bailar toda la noche!' },
        ],
      },
      dressCode: {
        title: 'Dress Code',
        code: 'Casual Elegante / Coctel',
        description: 'Vístete cómodo y listo para disfrutar y bailar toda la noche.',
      },
      gifts: {
        title: 'Mesa de Regalos / Detalle',
        subtitle: 'Tu presencia es mi mejor regalo. Si deseas darme un detalle especial:',
      },
      guestbook: {
        title: 'Mensajes & Buenos Deseos',
        subtitle: 'Déjame una felicitación o recuerdo divertido para este nuevo año.',
      },
    },
  },

  // ─── BAUTIZO ────────────────────────────────────────────────────────────────
  baptism: {
    key: 'baptism',
    displayName: 'Bautizo',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
      'eventPhotos',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: true,
      yearsToCelebrate: false,
      parents: true,
      godparents: true,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Bautizado(a)',
    },
    fieldLabels: {
      person1Name: 'Nombre del Bautizado(a)',
      age: 'Edad / Meses',
      heroSubtitle: 'Mi Bautizo',
      heroTagline: 'Con la bendición del Señor y el amor de mis padres y padrinos',
      ceremonyTitle: 'Ceremonia del Sacramento',
      receptionTitle: 'Convivio Familiar',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Formal / Tonos Blancos y Pasteles',
      messageTitle: 'Un Momento Bendecido',
      messageDefaultText:
        'Hoy recibo la luz del bautismo en compañía de mis seres queridos. Te invitamos a acompañarnos en este bendecido día.',
      giftsTitle: 'Detalle o Regalo',
      giftsSubtitle: 'Agradecemos tu presencia y tus bendiciones. Si deseas darle un detalle:',
      guestbookTitle: 'Libro de Bendiciones',
      guestbookSubtitle: 'Déjanos unas palabras de amor y bendiciones para nuestro bebé.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Mi Bautizo',
        tagline: 'Con la bendición del Señor y el amor de mis padres y padrinos',
        locationDefault: 'Parroquia de San Juan Bautista',
      },
      message: {
        title: 'Un Momento Bendecido',
        text: 'Hoy recibo la luz del bautismo en compañía de mis seres queridos. Te invitamos a acompañarnos en este bendecido día.',
      },
      countdown: {
        title: 'El día de mi Bautizo',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Misa de Bautismo',
        ceremonyPlace: 'Parroquia de San Juan',
        receptionTitle: 'Convivio Familiar',
        receptionPlace: 'Jardín Campestre',
      },
      schedule: {
        title: 'Itinerario del Evento',
        items: [
          { time: '12:00 HRS', title: 'Ceremonia de Bautismo', desc: 'Parroquia Principal' },
          { time: '14:00 HRS', title: 'Comida & Recepción', desc: 'Jardín de Fiestas' },
          { time: '16:00 HRS', title: 'Pastel & Agradecimientos', desc: 'Momento en familia' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Formal / Tonos Blancos y Pasteles',
        description: 'Sugerimos atuendo formal elegante en tonos claros o pasteles.',
      },
      gifts: {
        title: 'Mesa de Regalos / Detalle',
        subtitle: 'Tu presencia es nuestro mejor regalo. Si deseas darle un detalle especial:',
      },
      guestbook: {
        title: 'Libro de Bendiciones',
        subtitle: 'Déjanos unas palabras de bendición y cariño para nuestro bebé.',
      },
    },
  },

  // ─── GRADUACIÓN ─────────────────────────────────────────────────────────────
  graduation: {
    key: 'graduation',
    displayName: 'Graduación',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
      'eventPhotos',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: false,
      yearsToCelebrate: false,
      parents: false,
      godparents: false,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Graduado(a)',
    },
    fieldLabels: {
      person1Name: 'Nombre del Graduado(a) / Generación',
      heroSubtitle: 'Mi Graduación',
      heroTagline: 'Celebrando el esfuerzo, la dedicación y un nuevo comienzo',
      ceremonyTitle: 'Acto Académico',
      receptionTitle: 'Fiesta de Gala de Graduación',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Etiqueta / Rigurosa Gala',
      messageTitle: 'Un Logro Compartido',
      messageDefaultText:
        'Años de estudio y dedicación culminan hoy en este gran logro. Me encantaría que me acompañes a brindar por el inicio de este nuevo camino.',
      giftsTitle: 'Obsequios & Reconocimientos',
      giftsSubtitle: 'Tu compañía en este día tan significativo es lo más valioso:',
      guestbookTitle: 'Libro de Firmas & Mensajes',
      guestbookSubtitle: 'Escribe un mensaje de éxito para este nuevo capítulo profesional.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Mi Graduación',
        tagline: 'Celebrando el esfuerzo, la dedicación y un nuevo comienzo',
        locationDefault: 'Centro de Convenciones Universitaras',
      },
      message: {
        title: 'Un Logro Compartido',
        text: 'Años de estudio y dedicación culminan hoy en este gran logro. Me encantaría que me acompañes a brindar por el inicio de este nuevo camino.',
      },
      countdown: {
        title: 'Faltan pocos días para la graduación',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Acto Académico',
        ceremonyPlace: 'Auditorio Universitario',
        receptionTitle: 'Fiesta de Gala',
        receptionPlace: 'Gran Salón de Eventos',
      },
      schedule: {
        title: 'Itinerario del Evento',
        items: [
          { time: '17:00 HRS', title: 'Ceremonia de Graduación', desc: 'Entrega de diplomas' },
          { time: '19:30 HRS', title: 'Cóctel de Bienvenida', desc: 'Brindis de honor' },
          { time: '21:00 HRS', title: 'Cena de Gala & Baile', desc: 'Música en vivo' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Etiqueta / Rigurosa Gala',
        description: 'Traje formal u oscuro para caballeros · Vestido de gala para damas.',
      },
      gifts: {
        title: 'Mesa de Regalos / Detalle',
        subtitle: 'Tu compañía en este día tan significativo es lo más valioso:',
      },
      guestbook: {
        title: 'Libro de Deseos & Éxitos',
        subtitle: 'Escribe un mensaje especial para este nuevo capítulo profesional.',
      },
    },
  },

  // ─── BABY SHOWER ────────────────────────────────────────────────────────────
  baby_shower: {
    key: 'baby_shower',
    displayName: 'Baby Shower',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
      'eventPhotos',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: false,
      yearsToCelebrate: false,
      parents: true,
      godparents: false,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Bebé / Mamá',
    },
    fieldLabels: {
      person1Name: 'Nombre del Bebé / Mamá',
      heroSubtitle: 'Bienvenida al Bebé',
      heroTagline: 'Celebrando la dulce espera de nuestro nuevo amor',
      ceremonyTitle: 'Lugar de Encuentro',
      receptionTitle: 'Festejo & Juegos',
      dressCodeTitle: 'Dress Code',
      dressCodeDefault: 'Casual / Tonos Pastel',
      messageTitle: 'La Dulce Espera',
      messageDefaultText:
        'Muy pronto llegará a nuestras vidas una gran bendición. Queremos compartir la alegría de esta dulce espera en compañía de las personas que amamos.',
      giftsTitle: 'Mesa de Regalos para el Bebé',
      giftsSubtitle: 'Si deseas sugerencias de obsequios para la llegada de nuestro bebé:',
      guestbookTitle: 'Libro de Deseos para el Bebé',
      guestbookSubtitle: 'Déjale un hermoso mensaje que leerá cuando crezca.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Baby Shower',
        tagline: 'Celebrando la dulce espera de nuestra gran bendición',
        locationDefault: 'Jardín de Fiestas & Té',
      },
      message: {
        title: 'La Dulce Espera',
        text: 'Muy pronto llegará a nuestras vidas una gran bendición. Queremos compartir la alegría de esta dulce espera en compañía de las personas que amamos.',
      },
      countdown: {
        title: 'Contando los días para el Baby Shower',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Recepción & Bienvenida',
        ceremonyPlace: 'Jardín de Té',
        receptionTitle: 'Juegos & Comida',
        receptionPlace: 'Salon de Eventos',
      },
      schedule: {
        title: 'Itinerario de Celebración',
        items: [
          { time: '16:00 HRS', title: 'Bienvenida & Muestra de Regalos', desc: 'Cóctel de bienvenida' },
          { time: '17:00 HRS', title: 'Juegos & Dinámicas', desc: 'Premios & sorpresas' },
          { time: '18:30 HRS', title: 'Pastel & Deseos', desc: 'Agradecimiento especial' },
        ],
      },
      dressCode: {
        title: 'Dress Code',
        code: 'Casual / Tonos Pastel',
        description: 'Vístete cómodo con tonos suaves o neutros.',
      },
      gifts: {
        title: 'Mesa de Regalos para el Bebé',
        subtitle: 'Si deseas sugerencias de obsequios para la llegada de nuestro bebé:',
      },
      guestbook: {
        title: 'Consejos & Deseos para el Bebé',
        subtitle: 'Déjanos una dedicatoria o consejo con mucho cariño.',
      },
    },
  },

  // ─── PRIMERA COMUNIÓN ───────────────────────────────────────────────────────
  communion: {
    key: 'communion',
    displayName: 'Primera Comunión',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
      'eventPhotos',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: true,
      yearsToCelebrate: false,
      parents: true,
      godparents: true,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Comulgante',
    },
    fieldLabels: {
      person1Name: 'Nombre del Comulgante',
      age: 'Edad',
      heroSubtitle: 'Mi Primera Comunión',
      heroTagline: 'Recibiendo por primera vez el sacramento de la Eucaristía',
      ceremonyTitle: 'Misa de Primera Comunión',
      receptionTitle: 'Recepción Familiar',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Formal / Tonos Blancos o Claros',
      messageTitle: 'Un Día de Fe',
      messageDefaultText:
        'Hoy recibo a Jesús en mi corazón. Es un día de fiesta espiritual para mí y mi familia, y queremos celebrarlo contigo.',
      giftsTitle: 'Mesa de Regalos / Detalle',
      giftsSubtitle: 'Agradecemos tu amor y oración. Si deseas otorgarle un detalle:',
      guestbookTitle: 'Libro de Firmas & Oraciones',
      guestbookSubtitle: 'Déjame una bendición o mensaje para recordar siempre este sagrado día.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Mi Primera Comunión',
        tagline: 'Recibiendo el sagrado sacramento de la Eucaristía',
        locationDefault: 'Parroquia del Sagrado Corazón',
      },
      message: {
        title: 'Un Día de Fe',
        text: 'Hoy recibo a Jesús en mi corazón. Es un día de fiesta espiritual para mí y mi familia, y queremos celebrarlo contigo.',
      },
      countdown: {
        title: 'El día de mi Primera Comunión',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Misa de Primera Comunión',
        ceremonyPlace: 'Parroquia de la Sagrada Familia',
        receptionTitle: 'Recepción Familiar',
        receptionPlace: 'Hacienda o Jardín',
      },
      schedule: {
        title: 'Itinerario del Evento',
        items: [
          { time: '11:00 HRS', title: 'Misa Sacramental', desc: 'Parroquia Principal' },
          { time: '13:30 HRS', title: 'Recepción & Banquete', desc: 'Jardín de Fiestas' },
          { time: '16:00 HRS', title: 'Pastel & Foto Familiar', desc: 'Momento de recuerdos' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Formal / Tonos Claros',
        description: 'Sugerimos atuendo formal en colores blanco, beige o pasteles.',
      },
      gifts: {
        title: 'Mesa de Regalos / Detalle',
        subtitle: 'Agradecemos tu amor y oración. Si deseas otorgarle un detalle:',
      },
      guestbook: {
        title: 'Libro de Firmas & Bendiciones',
        subtitle: 'Déjame una bendición o mensaje para recordar siempre este día.',
      },
    },
  },

  // ─── ANIVERSARIO ────────────────────────────────────────────────────────────
  anniversary: {
    key: 'anniversary',
    displayName: 'Aniversario',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'lodging',
      'playlist',
      'location',
      'guestbook',
      'eventPhotos',
      'seating',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: true,
      age: false,
      yearsToCelebrate: true,
      parents: false,
      godparents: false,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Esposos',
    },
    fieldLabels: {
      person1Name: 'Nombre Esposo / Esposa 1',
      person2Name: 'Nombre Esposo / Esposa 2',
      yearsToCelebrate: 'Años a celebrar',
      heroSubtitle: 'Nuestro Aniversario',
      heroTagline: 'Celebrando años de amor, complicidad y familia',
      ceremonyTitle: 'Misa / Renovación de Votos',
      receptionTitle: 'Cena de Gala & Brindis',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Formal / Rigurosa Etiqueta',
      messageTitle: 'Años Compartidos',
      messageDefaultText:
        'Celebrar los años que hemos recorrido juntos es un regalo invalorable. Queremos compartir este gran logro con nuestros amigos y familiares más amados.',
      giftsTitle: 'Mesa de Regalos / Lluvia de Sobres',
      giftsSubtitle: 'Tu presencia es nuestro regalo más valioso. Ponemos a tu disposición:',
      guestbookTitle: 'Libro de Firmas & Felicitaciones',
      guestbookSubtitle: 'Escríbenos una linda memoria o felicitación por nuestros años juntos.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Nuestro Aniversario',
        tagline: 'Celebrando años de amor, complicidad y familia',
        locationDefault: 'Salón de Fiestas Imperiale',
      },
      message: {
        title: 'Años Compartidos',
        text: 'Celebrar los años que hemos recorrido juntos es un regalo invalorable. Queremos compartir este gran logro con nuestros amigos y familiares más amados.',
      },
      countdown: {
        title: 'El gran día del Aniversario',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Misa / Renovación de Votos',
        ceremonyPlace: 'Capilla San Marcos',
        receptionTitle: 'Brindis & Cena de Gala',
        receptionPlace: 'Gran Salón Imperiale',
      },
      schedule: {
        title: 'Itinerario de la Gala',
        items: [
          { time: '18:00 HRS', title: 'Renovación de Votos', desc: 'Capilla Principal' },
          { time: '19:30 HRS', title: 'Brindis & Cóctel', desc: 'Jardín Central' },
          { time: '21:00 HRS', title: 'Cena de Gala & Baile', desc: 'Salón Principal' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Formal / Rigurosa Etiqueta',
        description: 'Traje oscuro o esmoquin para ellos · Vestido largo de noche para ellas.',
      },
      gifts: {
        title: 'Mesa de Regalos / Lluvia de Sobres',
        subtitle: 'Tu presencia es nuestro regalo más valioso. Ponemos a tu disposición:',
      },
      guestbook: {
        title: 'Libro de Firmas & Deseos',
        subtitle: 'Escríbenos una linda memoria o felicitación por nuestros años juntos.',
      },
    },
  },

  // ─── OTRO / GENERAL ─────────────────────────────────────────────────────────
  other: {
    key: 'other',
    displayName: 'Celebración',
    allowedSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'lodging',
      'playlist',
      'location',
      'guestbook',
      'eventPhotos',
      'seating',
    ],
    defaultActiveSections: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    forbiddenSections: [],
    recommendedSectionOrder: [
      'hero',
      'message',
      'countdown',
      'dateLocation',
      'schedule',
      'dressCode',
      'gallery',
      'rsvp',
      'gifts',
      'location',
      'guestbook',
    ],
    allowedFields: {
      person1Name: true,
      person2Name: false,
      age: false,
      yearsToCelebrate: false,
      parents: false,
      godparents: false,
      courtOfHonor: false,
      chambelanes: false,
      honoreeRoleName: 'Festejado(a)',
    },
    fieldLabels: {
      person1Name: 'Nombre del Evento / Anfitrión',
      heroSubtitle: 'Nuestra Celebración',
      heroTagline: 'Te invitamos a compartir este día tan especial con nosotros',
      ceremonyTitle: 'Recepción & Festejo',
      receptionTitle: 'Ubicación & Programa',
      dressCodeTitle: 'Código de Vestimenta',
      dressCodeDefault: 'Formal / Casual Elegante',
      messageTitle: 'Nuestra Invitación',
      messageDefaultText:
        'Los momentos más importantes de la vida se disfrutan mejor rodeados de grandes amigos y familia. ¡Nos encantará contar con tu presencia!',
      giftsTitle: 'Mesa de Regalos / Detalle',
      giftsSubtitle: 'Tu presencia es lo más importante para nosotros. Si deseas realizarnos un obsequio:',
      guestbookTitle: 'Libro de Firmas & Recuerdos',
      guestbookSubtitle: 'Déjanos unas palabras o recuerdos para atesorar este evento.',
    },
    defaultSectionContents: {
      hero: {
        subtitle: 'Nuestra Celebración',
        tagline: 'Te invitamos a compartir este día tan especial con nosotros',
        locationDefault: 'Salón de Eventos Escondido',
      },
      message: {
        title: 'Nuestra Invitación',
        text: 'Los momentos más importantes de la vida se disfrutan mejor rodeados de grandes amigos y familia. ¡Nos encantará contar con tu presencia!',
      },
      countdown: {
        title: 'Faltan pocos días',
      },
      dateLocation: {
        title: 'Cuándo & Dónde',
        ceremonyTitle: 'Bienvenida & Recepción',
        ceremonyPlace: 'Jardín Principal',
        receptionTitle: 'Fiesta & Comida',
        receptionPlace: 'Gran Salón',
      },
      schedule: {
        title: 'Programa del Evento',
        items: [
          { time: '17:00 HRS', title: 'Bienvenida & Cóctel', desc: 'Recepción de invitados' },
          { time: '19:00 HRS', title: 'Cena & Banquete', desc: 'Gran Salón' },
          { time: '21:00 HRS', title: 'Música & Baile', desc: 'Pista de baile' },
        ],
      },
      dressCode: {
        title: 'Código de Vestimenta',
        code: 'Formal / Casual Elegante',
        description: 'Vístete para disfrutar de un gran momento inolvidable.',
      },
      gifts: {
        title: 'Mesa de Regalos / Detalle',
        subtitle: 'Tu presencia es lo más importante para nosotros. Si deseas realizarnos un obsequio:',
      },
      guestbook: {
        title: 'Libro de Firmas',
        subtitle: 'Déjanos unas palabras o recuerdos para atesorar este evento.',
      },
    },
  },
}

/**
 * Returns the config object for a given EventType or string
 */
export function getEventTypeConfig(eventType?: string | EventType): EventTypeConfig {
  const key = getEventTypeKey(eventType)
  return EVENT_TYPE_CONFIGS[key] || EVENT_TYPE_CONFIGS.other
}

/**
 * Validation layer that cleanses eventData and invitation sections according to the EventType.
 * Detects incompatible fields, sections, or wedding phrases in non-wedding invitations.
 */
export function validateEventContent<
  T extends {
    eventType?: EventType | string
    eventData?: any
    sections?: any[]
  }
>(input: T): T {
  const eventType = input.eventData?.eventType || input.eventType || 'Otro'
  const config = getEventTypeConfig(eventType)
  const isWeddingOrAnniversary = config.key === 'wedding' || config.key === 'anniversary'

  // Clean eventData if present
  let cleanedEventData = input.eventData ? { ...input.eventData } : undefined
  if (cleanedEventData) {
    if (!config.allowedFields.person2Name) {
      cleanedEventData.person2Name = ''
    }
  }

  // Clean sections if present
  let cleanedSections = Array.isArray(input.sections) ? [...input.sections] : undefined

  if (cleanedSections) {
    // 1. Filter out forbidden sections
    cleanedSections = cleanedSections.filter(sec => {
      const secType: SectionType = sec.type || sec.id
      if (config.forbiddenSections.includes(secType)) {
        return false
      }
      return true
    })

    // 2. Sanitize contents of remaining sections
    cleanedSections = cleanedSections.map(sec => {
      const content = sec.content ? { ...sec.content } : {}

      if (!isWeddingOrAnniversary) {
        if (content.subtitle) {
          content.subtitle = sanitizeWeddingTerms(content.subtitle, config)
        }
        if (content.title) {
          content.title = sanitizeWeddingTerms(content.title, config)
        }
        if (content.text) {
          content.text = sanitizeWeddingTerms(content.text, config)
        }
        if (content.description) {
          content.description = sanitizeWeddingTerms(content.description, config)
        }
        if (content.colorNote && content.colorNote.includes('novia')) {
          content.colorNote = config.fieldLabels.dressCodeNote || ''
        }
      }

      return {
        ...sec,
        content,
      }
    })
  }

  return {
    ...input,
    eventData: cleanedEventData,
    sections: cleanedSections,
  }
}

function sanitizeWeddingTerms(text: string, config: EventTypeConfig): string {
  if (!text) return text
  let result = text
  result = result.replace(/nos casamos/gi, config.fieldLabels.heroSubtitle)
  result = result.replace(/nuestra boda/gi, `mi ${config.displayName}`)
  result = result.replace(/celebración de nuestra boda/gi, `celebración de mi ${config.displayName}`)
  result = result.replace(/reservados para la novia/gi, `reservados para el festejado(a)`)
  result = result.replace(/de la novia/gi, `del festejado(a)`)
  return result
}
