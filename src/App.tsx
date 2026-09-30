import { useState, useEffect, useRef } from 'react'

import { AppView, EventData, GuestItem, Template, BillingStatus } from './types'
import { TEMPLATES_DATA } from './data/templates'

import HeaderNav from './components/HeaderNav'
import LoginView from './components/LoginView'
import RegisterView from './components/RegisterView'
import OnboardingView from './components/OnboardingView'
import SummaryView from './components/SummaryView'
import TemplateGalleryView from './components/TemplateGalleryView'
import PreviewView from './components/PreviewView'
import CreationLoadingView from './components/CreationLoadingView'
import DashboardView from './components/DashboardView'
import PublicInvitationExperience from './components/PublicInvitationExperience'
import OfflineBanner from './components/OfflineBanner'
import PwaInstallPrompt from './components/PwaInstallPrompt'
import ToastContainer, { ToastMessage } from './components/Toast'
import PaymentStatus from './components/billing/PaymentStatus'
import HowItWorksModal from './components/HowItWorksModal'
import PartnerOnboardingView from './components/partner/PartnerOnboardingView'
import PartnerDashboardView from './components/partner/PartnerDashboardView'
import AdminDashboardView from './components/admin/AdminDashboardView'

import { AuthProvider, useAuth } from './contexts/AuthContext'
import {
  createEventAndInvitation,
  getUserEvents,
  getPublicInvitationBySlug,
  getPublicGuestByToken,
  saveGuest,
  deleteGuest,
  incrementInvitationViews,
  updateEventData as saveEventDataToFirestore,
} from './services/eventService'
import {
  saveReferralAttribution,
  getStoredAttribution,
  getPartnerBySlugOrCode,
  processPartnerSale,
} from './services/partnerService'
import { updateSeoMetaData } from './utils/seo'
import { getEventDataDraft, saveEventDataDraft } from './utils/draftStorage'

// ─── Scroll Reveal ────────────────────────────────────────────────────────────
function useReveal(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true) },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

interface RevealProps {
  children: React.ReactNode
  delay?: number
  className?: string
}
function Reveal({ children, delay = 0, className = '' }: RevealProps) {
  const { ref, visible } = useReveal()
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(26px)',
        transition: `opacity 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms, transform 0.9s cubic-bezier(0.16,1,0.3,1) ${delay}ms`,
      }}
    >
      {children}
    </div>
  )
}

// ─── Hero ─────────────────────────────────────────────────────────────────────
function HeroSection({ onStartCreate, onNavigate }: { onStartCreate: () => void; onNavigate: (view: AppView) => void }) {
  const [heroTab, setHeroTab] = useState<'boda' | 'xv' | 'cumple'>('boda')

  const sampleData = {
    boda: {
      subtitle: 'NUESTRA BODA',
      person1: 'Lucía',
      amp: '&',
      person2: 'Mateo',
      date: '18 · 09 · 2027',
      location: 'Hacienda San José · CDMX',
      badge: '💍 Bodas',
    },
    xv: {
      subtitle: 'MIS XV AÑOS',
      person1: 'Fernanda',
      amp: '',
      person2: 'Torres',
      date: '12 · 12 · 2026',
      location: 'Jardín Real · Guadalajara',
      badge: '👑 XV Años',
    },
    cumple: {
      subtitle: 'MI CUMPLEAÑOS',
      person1: 'Carlos',
      amp: '',
      person2: 'Festejo',
      date: '05 · 11 · 2026',
      location: 'Lounge Bar · Monterrey',
      badge: '🎂 Cumpleaños',
    },
  }[heroTab]

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-ink select-none">
      {/* Background Image with Vignette Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?w=1800&h=1200&fit=crop&auto=format"
          alt="Elegante evento social VÉLIA"
          className="w-full h-full object-cover scale-105"
          style={{ animation: 'heroImgReveal 2s ease-out forwards' }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-ink/95 via-ink/80 to-ink/40" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(200,169,130,0.15),transparent_60%)] pointer-events-none" />
      </div>

      {/* Main Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 lg:px-12 pt-20 pb-16">
        <div className="grid lg:grid-cols-[1fr_400px] gap-12 lg:gap-16 items-center min-h-[calc(100vh-5rem)]">

          {/* Left Text Column */}
          <div className="space-y-6">
            <div style={{ animation: 'fadeUp 0.9s ease-out 0.2s both' }}>
              <span className="inline-flex items-center gap-2 bg-champagne/15 border border-champagne/40 backdrop-blur-md px-4 py-1.5 rounded-full text-champagne font-body text-[0.68rem] tracking-[0.3em] uppercase font-semibold">
                <span className="w-1.5 h-1.5 rounded-full bg-champagne animate-ping" />
                Experiencias Digitales Premium &amp; B2B
              </span>
            </div>

            <h1
              className="font-display text-4xl sm:text-6xl lg:text-[4.75rem] text-white leading-[1.05] font-light max-w-2xl"
              style={{ animation: 'fadeUp 0.9s ease-out 0.4s both' }}
            >
              Tu historia merece una <span className="italic font-serif text-champagne bg-gradient-to-r from-champagne via-[#e8d2b2] to-champagne bg-clip-text text-transparent">invitación extraordinaria.</span>
            </h1>

            <p
              className="font-body text-white/75 text-base sm:text-lg leading-relaxed max-w-xl"
              style={{ animation: 'fadeUp 0.9s ease-out 0.6s both' }}
            >
              Diseña una invitación digital elegante con pases personalizados para WhatsApp, itinerario interactivo, mesa de regalos y mapa. O gestiona los eventos de tus clientes como profesional.
            </p>

            {/* CTAs */}
            <div
              className="flex flex-wrap items-center gap-4 pt-2"
              style={{ animation: 'fadeUp 0.9s ease-out 0.8s both' }}
            >
              <button
                onClick={onStartCreate}
                className="font-body font-medium bg-champagne hover:bg-[#d4b990] text-brown px-9 py-4 rounded-full text-sm transition-all duration-300 hover:scale-[1.03] cursor-pointer shadow-lg hover:shadow-champagne/20 flex items-center gap-2"
              >
                <span>✨</span>
                <span>Crear mi evento</span>
              </button>

              <button
                onClick={() => onNavigate('partner_onboarding')}
                className="font-body font-medium text-white border border-white/30 hover:border-champagne hover:bg-white/5 px-8 py-4 rounded-full text-sm transition-all duration-300 cursor-pointer flex items-center gap-2"
              >
                <span>🥂</span>
                <span>Soy Wedding Planner</span>
              </button>
            </div>

            {/* Feature Highlights Pills */}
            <div
              className="flex flex-wrap items-center gap-4 text-xs font-body text-white/60 pt-2"
              style={{ animation: 'fadeUp 0.9s ease-out 0.9s both' }}
            >
              <span className="flex items-center gap-1.5">
                <span className="text-champagne font-bold">✓</span> RSVP por WhatsApp
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-champagne font-bold">✓</span> Mesa de Regalos CLABE
              </span>
              <span className="flex items-center gap-1.5">
                <span className="text-champagne font-bold">✓</span> Publicación Inmediata
              </span>
            </div>

            {/* Metrics Bar */}
            <div
              className="grid grid-cols-3 gap-6 pt-8 border-t border-white/10 max-w-lg"
              style={{ animation: 'fadeUp 0.9s ease-out 1s both' }}
            >
              <div>
                <p className="font-display text-2xl sm:text-3xl text-white font-light">+2,400</p>
                <p className="font-body text-[0.65rem] text-white/40 tracking-wider uppercase mt-0.5">Eventos creados</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-white font-light">98%</p>
                <p className="font-body text-[0.65rem] text-white/40 tracking-wider uppercase mt-0.5">Satisfacción</p>
              </div>
              <div>
                <p className="font-display text-2xl sm:text-3xl text-white font-light">9</p>
                <p className="font-body text-[0.65rem] text-white/40 tracking-wider uppercase mt-0.5">Ocasiones</p>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Mockup Card */}
          <div
            className="hidden lg:flex flex-col items-center justify-center"
            style={{ animation: 'fadeUp 1.1s ease-out 0.8s both' }}
          >
            {/* Occasion Tabs */}
            <div className="flex gap-1 p-1 bg-white/10 backdrop-blur-md rounded-full border border-white/15 mb-4 z-10">
              {(['boda', 'xv', 'cumple'] as const).map(tab => (
                <button
                  key={tab}
                  onClick={() => setHeroTab(tab)}
                  className={`font-body text-[0.68rem] px-3.5 py-1 rounded-full transition-all cursor-pointer ${
                    heroTab === tab
                      ? 'bg-champagne text-brown font-semibold shadow-xs'
                      : 'text-white/60 hover:text-white'
                  }`}
                >
                  {tab === 'boda' ? '💍 Boda' : tab === 'xv' ? '👑 XV Años' : '🎂 Cumple'}
                </button>
              ))}
            </div>

            {/* Floating Luxury Card */}
            <div
              className="relative"
              style={{ animation: 'floatCard 7s ease-in-out infinite' }}
            >
              <div className="absolute inset-2 translate-y-8 blur-3xl bg-champagne/30 rounded-3xl" />

              <div
                className="relative bg-white w-[300px] px-8 py-10 rounded-2xl text-center border border-beige/60 transition-all duration-500"
                style={{ boxShadow: '0 40px 100px rgba(0,0,0,0.5), 0 10px 30px rgba(0,0,0,0.2)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="h-[0.5px] flex-1 bg-champagne/50" />
                  <span className="text-xs">{sampleData.badge}</span>
                  <div className="h-[0.5px] flex-1 bg-champagne/50" />
                </div>

                <p className="font-body text-[0.6rem] tracking-[0.32em] text-champagne uppercase mb-3 leading-none">
                  {sampleData.subtitle}
                </p>

                <h2 className="font-display text-[2.5rem] text-brown font-light leading-none mb-[2px]">
                  {sampleData.person1}
                </h2>
                {sampleData.amp && (
                  <p className="font-display text-base text-brown/30 font-light tracking-[0.15em]">&amp;</p>
                )}
                <h2 className="font-display text-[2.5rem] text-brown font-light leading-none mb-8">
                  {sampleData.person2}
                </h2>

                <div className="h-[0.5px] bg-beige mb-6" />

                <p className="font-display text-lg text-brown font-light tracking-[0.12em] mb-0.5">
                  {sampleData.date}
                </p>
                <p className="font-body text-[0.58rem] tracking-[0.2em] text-brown/45 uppercase mb-8">
                  {sampleData.location}
                </p>

                <button
                  onClick={onStartCreate}
                  className="w-full font-body text-[0.62rem] tracking-[0.25em] uppercase text-champagne bg-brown hover:bg-ink px-5 py-3 rounded-full transition-all duration-300 cursor-pointer font-medium shadow-sm"
                >
                  Confirmar Asistencia
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll cue */}
      <div
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ animation: 'fadeIn 1s ease-out 1.8s both' }}
      >
        <span className="font-body text-[0.6rem] tracking-[0.35em] text-white/30 uppercase">Descubrir</span>
        <div
          className="w-[1px] h-12 bg-white/20"
          style={{ animation: 'scrollPulse 2.2s ease-in-out 2s infinite' }}
        />
      </div>
    </section>
  )
}

// ─── Categories ───────────────────────────────────────────────────────────────
const CATEGORIES = [
  { name: 'Bodas',        img: 'photo-1606490208247-b65be3d94cd1', sub: 'El día más especial' },
  { name: 'XV Años',      img: 'photo-1763625639768-7282f4f0deb7', sub: 'Una noche mágica' },
  { name: 'Cumpleaños',   img: 'photo-1762918988304-97d4a5840a4a', sub: 'Celebra a lo grande' },
  { name: 'Baby Shower',  img: 'photo-1767070806009-152054f6edd5', sub: 'La bienvenida perfecta' },
  { name: 'Bautizos',     img: 'photo-1566516171511-1c411a59c8ba', sub: 'Un momento sagrado' },
  { name: 'Graduaciones', img: 'photo-1623461487986-9400110de28e', sub: 'El inicio de todo' },
  { name: 'Aniversarios', img: 'photo-1672288336066-8cd91b57b510', sub: 'Amor que perdura' },
]

function CategoriesSection({ onStartCreate }: { onStartCreate: () => void }) {
  return (
    <section id="Plantillas" className="bg-ivory py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal className="mb-14 lg:mb-20">
          <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Ocasiones</span>
          <h2 className="font-display text-4xl lg:text-[3.5rem] text-brown font-light mt-3 leading-tight">
            Una invitación para<br className="hidden sm:block" /> cada historia.
          </h2>
        </Reveal>

        <div className="hidden md:grid md:grid-cols-4 gap-3 lg:gap-4">
          {CATEGORIES.map((cat, i) => (
            <Reveal
              key={cat.name}
              delay={i * 55}
              className={i === 0 ? 'md:col-span-2' : ''}
            >
              <div
                onClick={onStartCreate}
                className="group relative overflow-hidden bg-beige cursor-pointer h-full"
              >
                <div
                  className="relative w-full"
                  style={{ paddingBottom: i === 0 ? '75%' : '130%' }}
                >
                  <img
                    src={`https://images.unsplash.com/${cat.img}?w=700&h=900&fit=crop&auto=format`}
                    alt={cat.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-brown/85 via-brown/15 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 lg:p-6">
                    <p className="font-body text-[0.6rem] tracking-[0.3em] text-champagne/80 uppercase mb-1.5 opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0 transition-all duration-300">
                      {cat.sub}
                    </p>
                    <h3 className={`font-display text-white font-light leading-none ${i === 0 ? 'text-3xl lg:text-4xl' : 'text-2xl'}`}>
                      {cat.name}
                    </h3>
                  </div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="md:hidden flex gap-3 overflow-x-auto pb-3 -mx-6 px-6">
          {CATEGORIES.map(cat => (
            <div
              key={cat.name}
              onClick={onStartCreate}
              className="relative flex-none w-44 overflow-hidden bg-beige cursor-pointer group"
            >
              <div className="relative" style={{ paddingBottom: '150%' }}>
                <img
                  src={`https://images.unsplash.com/${cat.img}?w=400&h=600&fit=crop&auto=format`}
                  alt={cat.name}
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brown/80 to-transparent" />
                <div className="absolute bottom-0 p-4">
                  <h3 className="font-display text-white text-xl font-light">{cat.name}</h3>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── How It Works ─────────────────────────────────────────────────────────────
function HowItWorksSection({ onOpenHowItWorks }: { onOpenHowItWorks: () => void }) {
  const steps = [
    {
      num: '01',
      title: 'Elige tu diseño',
      desc: 'Selecciona una plantilla creada para el estilo de tu evento.',
    },
    {
      num: '02',
      title: 'Personalízala',
      desc: 'Agrega tus nombres, fotografías, horarios, ubicación y todos los detalles.',
    },
    {
      num: '03',
      title: 'Publícala',
      desc: 'Obtén tu enlace y compártelo directamente con tus invitados.',
    },
  ]

  return (
    <section id="Cómo funciona" className="bg-white py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal className="mb-16 lg:mb-24 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="max-w-xl">
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Proceso</span>
            <h2 className="font-display text-4xl lg:text-[3.5rem] text-brown font-light mt-3 leading-tight">
              De tu idea a tu invitación en minutos.
            </h2>
          </div>

          <button
            onClick={onOpenHowItWorks}
            className="inline-flex items-center gap-2 font-body text-xs font-medium text-brown border border-brown/25 px-6 py-3 rounded-full hover:border-brown hover:bg-ivory transition-colors cursor-pointer self-start md:self-auto"
          >
            <span>Ver guía paso a paso</span>
            <span>→</span>
          </button>
        </Reveal>

        <div className="grid lg:grid-cols-3 gap-12 lg:gap-16">
          {steps.map((step, i) => (
            <Reveal key={step.num} delay={i * 140}>
              <div onClick={onOpenHowItWorks} className="group cursor-pointer">
                <span className="block font-display text-[5.5rem] lg:text-[7rem] text-beige font-light leading-none mb-6 group-hover:text-champagne/25 transition-colors duration-500 select-none">
                  {step.num}
                </span>
                <div className="w-10 h-[0.5px] bg-beige mb-6" />
                <h3 className="font-display text-2xl lg:text-3xl text-brown font-light mb-3">{step.title}</h3>
                <p className="font-body text-sm text-brown/55 leading-relaxed">{step.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Editor Section ───────────────────────────────────────────────────────────
function EditorSection({ onOpenHowItWorks }: { onOpenHowItWorks: () => void }) {
  const [activeSection, setActiveSection] = useState(0)
  const sections = ['Portada', 'Evento', 'Ceremonia', 'RSVP', 'Galería', 'Regalos']

  return (
    <section className="bg-ivory py-24 lg:py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-[1fr_1.1fr] gap-16 lg:gap-24 items-center">
          <Reveal>
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Editor</span>
            <h2 className="font-display text-4xl lg:text-5xl text-brown font-light mt-3 leading-tight mb-6">
              Diseñarla es parte<br /> de la celebración.
            </h2>
            <p className="font-body text-brown/58 text-base leading-relaxed mb-8 max-w-md">
              Modifica tu invitación cuando quieras. Cambia textos, fotografías, colores y secciones sin empezar de nuevo.
            </p>
            <button
              onClick={onOpenHowItWorks}
              className="inline-flex items-center gap-2 font-body text-sm text-brown border-b border-brown/25 pb-0.5 hover:border-brown transition-colors duration-200 cursor-pointer"
            >
              Ver cómo funciona
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </button>
          </Reveal>

          {/* Editor mockup */}
          <Reveal delay={200}>
            <div
              className="bg-white border border-beige/70 rounded-xl overflow-hidden cursor-pointer"
              onClick={onOpenHowItWorks}
              style={{ boxShadow: '0 24px 80px rgba(51,43,39,0.1), 0 4px 16px rgba(51,43,39,0.06)' }}
            >
              <div className="flex items-center gap-1.5 px-4 py-3 bg-ivory/60 border-b border-beige/60">
                <span className="w-2.5 h-2.5 rounded-full bg-rose/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-champagne/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-beige" />
                <div className="flex-1 mx-5 h-[22px] bg-white rounded border border-beige/50 flex items-center px-3">
                  <span className="font-body text-[0.6rem] text-brown/35 tracking-wide">velia.mx/luciamateo2027</span>
                </div>
              </div>

              <div className="flex" style={{ height: 340 }}>
                <div className="w-[140px] flex-none border-r border-beige/60 bg-ivory/40 p-3 flex flex-col gap-1">
                  <p className="font-body text-[0.58rem] tracking-[0.25em] text-brown/35 uppercase mb-2 px-2">Secciones</p>
                  {sections.map((sec, i) => (
                    <button
                      key={sec}
                      onClick={(e) => {
                        e.stopPropagation()
                        setActiveSection(i)
                      }}
                      className={`text-left px-2.5 py-[7px] rounded text-[0.7rem] font-body transition-colors cursor-pointer ${
                        i === activeSection
                          ? 'bg-champagne/20 text-brown font-medium'
                          : 'text-brown/45 hover:text-brown hover:bg-beige/30'
                      }`}
                    >
                      {sec}
                    </button>
                  ))}
                </div>

                <div className="flex-1 flex items-center justify-center bg-beige/15 p-5">
                  <div
                    className="bg-white rounded-2xl overflow-hidden border border-beige/60"
                    style={{ width: 115, height: 220, boxShadow: '0 8px 32px rgba(51,43,39,0.12)' }}
                  >
                    <div className="bg-brown h-[88px] flex flex-col items-center justify-end pb-3 relative">
                      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-brown/30 rounded-full" />
                      <p className="font-display text-white text-xs font-light leading-none">Lucía</p>
                      <p className="font-display text-white/40 text-[9px] font-light">&amp;</p>
                      <p className="font-display text-white text-xs font-light leading-none">Mateo</p>
                    </div>
                    <div className="p-3 flex flex-col gap-2.5">
                      <p className="font-body text-[6px] tracking-wider text-brown/45 uppercase text-center">
                        18 · 09 · 2027
                      </p>
                      <div className="h-[0.5px] bg-beige" />
                      <div className="space-y-1.5">
                        <div className="h-1.5 bg-beige rounded-full" />
                        <div className="h-1.5 bg-beige/60 rounded-full w-4/5" />
                        <div className="h-1.5 bg-beige/40 rounded-full w-3/5" />
                      </div>
                      <div className="mt-1">
                        <div className="border border-champagne/40 text-champagne text-[6px] font-body text-center py-1.5 rounded-sm tracking-wider">
                          RSVP
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-[150px] flex-none border-l border-beige/60 bg-ivory/40 p-3.5">
                  <p className="font-body text-[0.58rem] tracking-[0.25em] text-brown/35 uppercase mb-4">Diseño</p>
                  <div className="space-y-4">
                    <div>
                      <p className="font-body text-[0.65rem] text-brown/50 mb-1.5">Tipografía</p>
                      <div className="h-7 bg-white border border-beige rounded flex items-center px-2.5">
                        <span className="font-body text-[0.65rem] text-brown/60">Cormorant</span>
                      </div>
                    </div>
                    <div>
                      <p className="font-body text-[0.65rem] text-brown/50 mb-1.5">Color</p>
                      <div className="flex gap-1.5 flex-wrap">
                        {['#332B27', '#C8A982', '#C9A5A0', '#E9DED2', '#1C1B1A'].map(c => (
                          <button
                            key={c}
                            className="w-4 h-4 rounded-full border-2 border-white shadow-sm hover:scale-110 transition-transform duration-150"
                            style={{ backgroundColor: c }}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="font-body text-[0.65rem] text-brown/50 mb-1.5">Fotografía</p>
                      <button className="w-full h-14 bg-beige/50 rounded border border-dashed border-beige flex items-center justify-center hover:bg-beige/80 transition-colors">
                        <svg className="w-4 h-4 text-brown/30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 4v16m8-8H4" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Features ─────────────────────────────────────────────────────────────────
const FEATURES = [
  { icon: '↩', name: 'RSVP',             desc: 'Conoce quién asistirá en tiempo real.' },
  { icon: '◎', name: 'Invitados',         desc: 'Administra tu lista desde un solo lugar.' },
  { icon: '⊞', name: 'Mesas',            desc: 'Asigna mesas y permite que tus invitados consulten su lugar.' },
  { icon: '◈', name: 'WhatsApp',          desc: 'Comparte invitaciones personalizadas directamente por WhatsApp.' },
  { icon: '◻', name: 'Galería',           desc: 'Comparte fotografías antes y después del evento.' },
  { icon: '◷', name: 'Ubicación',         desc: 'Facilita la llegada con mapas y direcciones.' },
  { icon: '◇', name: 'Mesa de regalos',   desc: 'Comparte tus regalos y listas favoritas.' },
  { icon: '◌', name: 'Cuenta regresiva',  desc: 'Haz que cada día cuente.' },
]

function FeaturesSection() {
  return (
    <section id="Funciones" className="bg-brown py-24 lg:py-36">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal className="mb-14 lg:mb-20">
          <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne/65 uppercase">Funciones</span>
          <h2 className="font-display text-4xl lg:text-[3.5rem] text-ivory font-light mt-3 leading-tight max-w-lg">
            Mucho más que una invitación.
          </h2>
        </Reveal>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-ivory/8">
          {FEATURES.map((feat, i) => (
            <Reveal key={feat.name} delay={i * 55}>
              <div className="group bg-brown hover:bg-[#3d3229] transition-colors duration-300 cursor-pointer p-7 lg:p-9 h-full">
                <span className="block font-display text-3xl text-champagne/40 group-hover:text-champagne/70 transition-colors duration-300 mb-5 leading-none">
                  {feat.icon}
                </span>
                <h3 className="font-display text-xl lg:text-[1.4rem] text-ivory font-light mb-2">{feat.name}</h3>
                <p className="font-body text-[0.76rem] text-ivory/45 leading-relaxed group-hover:text-ivory/65 transition-colors duration-300">
                  {feat.desc}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

// ─── Templates ────────────────────────────────────────────────────────────────
const TEMPLATES_HERO = [
  { name: 'Maison', tag: 'Editorial · Elegante', img: 'photo-1763553113332-800519753e40', accent: '#C8A982' },
  { name: 'Élan',   tag: 'Minimal · Moderno',   img: 'photo-1676027649792-9e6b014a0e2f', accent: '#C9A5A0' },
  { name: 'Amour',  tag: 'Romántico · Clásico', img: 'photo-1524650448000-02d0a2aeb6cb', accent: '#E9DED2' },
]

function TemplatesSection({ onExploreDesigns }: { onExploreDesigns: () => void }) {
  return (
    <section className="bg-white py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Reveal className="text-center mb-14 lg:mb-20">
          <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Diseños</span>
          <h2 className="font-display text-4xl lg:text-[3.5rem] text-brown font-light mt-3 leading-tight">
            Tu invitación. Tu estilo.
          </h2>
        </Reveal>

        <div className="grid md:grid-cols-3 gap-5 lg:gap-8">
          {TEMPLATES_HERO.map((tpl, i) => (
            <Reveal key={tpl.name} delay={i * 120}>
              <div onClick={onExploreDesigns} className="group cursor-pointer">
                <div className="relative overflow-hidden bg-beige mb-5" style={{ paddingBottom: '140%' }}>
                  <img
                    src={`https://images.unsplash.com/${tpl.img}?w=600&h=900&fit=crop&auto=format`}
                    alt={tpl.name}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                  <div className="absolute inset-0 bg-brown/20 group-hover:bg-brown/10 transition-colors duration-500" />
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="font-body text-[0.65rem] tracking-[0.3em] text-white uppercase bg-brown/75 px-5 py-2.5 backdrop-blur-sm">
                      Ver diseño
                    </span>
                  </div>
                  <div className="absolute bottom-5 left-5">
                    <span
                      className="font-body text-[0.58rem] tracking-[0.25em] uppercase px-2.5 py-1"
                      style={{ backgroundColor: tpl.accent, color: '#332B27' }}
                    >
                      {tpl.tag.split(' · ')[0]}
                    </span>
                  </div>
                </div>
                <div className="flex items-end justify-between px-1">
                  <div>
                    <h3 className="font-display text-2xl text-brown font-light">{tpl.name}</h3>
                    <p className="font-body text-[0.65rem] tracking-[0.2em] text-brown/45 uppercase mt-1">{tpl.tag}</p>
                  </div>
                  <div
                    className="w-3.5 h-3.5 rounded-full border border-beige/80 shadow-sm mb-1"
                    style={{ backgroundColor: tpl.accent }}
                  />
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={350} className="text-center mt-12 lg:mt-16">
          <button
            onClick={onExploreDesigns}
            className="font-body text-sm text-brown/55 border-b border-brown/20 pb-0.5 hover:text-brown hover:border-brown transition-colors duration-200 cursor-pointer"
          >
            Ver todos los diseños
          </button>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Dashboard Section (Landing Preview) ──────────────────────────────────────
function DashboardSection({ onStartCreate }: { onStartCreate: () => void }) {
  const rsvpData = [
    { label: 'Confirmados', value: 108, total: 156, pct: 69, color: '#C8A982' },
    { label: 'Pendientes',  value: 32,  total: 156, pct: 21, color: '#E9DED2' },
    { label: 'Rechazados',  value: 16,  total: 156, pct: 10, color: '#C9A5A0' },
  ]

  return (
    <section className="bg-ivory py-24 lg:py-32">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          <Reveal>
            <div
              className="bg-white border border-beige/70 rounded-xl overflow-hidden cursor-pointer"
              onClick={onStartCreate}
              style={{ boxShadow: '0 20px 70px rgba(51,43,39,0.09), 0 4px 16px rgba(51,43,39,0.05)' }}
            >
              <div className="bg-brown px-6 py-5 flex items-center justify-between">
                <div>
                  <p className="font-body text-[0.6rem] tracking-[0.28em] text-champagne/60 uppercase">
                    Dashboard
                  </p>
                  <p className="font-display text-white text-xl font-light mt-0.5">
                    Boda de Lucía &amp; Mateo
                  </p>
                </div>
                <div>
                  <p className="font-display text-white/35 text-[2rem] font-light leading-none">18.09</p>
                  <p className="font-body text-[0.58rem] tracking-widest text-white/25 uppercase text-right">2027</p>
                </div>
              </div>

              <div className="grid grid-cols-4 divide-x divide-beige border-b border-beige">
                {[
                  { label: 'Invitados', value: 156 },
                  { label: 'Confirmados', value: 108 },
                  { label: 'Pendientes', value: 32 },
                  { label: 'Rechazados', value: 16 },
                ].map(s => (
                  <div key={s.label} className="p-4 text-center">
                    <p className="font-display text-brown text-2xl font-light">{s.value}</p>
                    <p className="font-body text-[0.58rem] text-brown/45 uppercase tracking-wide mt-0.5 leading-tight">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>

              <div className="p-5 border-b border-beige">
                <p className="font-body text-[0.6rem] tracking-[0.25em] text-brown/35 uppercase mb-4">
                  Estado RSVP
                </p>
                <div className="space-y-3">
                  {rsvpData.map(item => (
                    <div key={item.label} className="flex items-center gap-3">
                      <p className="font-body text-[0.7rem] text-brown/55 w-20 flex-none">{item.label}</p>
                      <div className="flex-1 h-1.5 bg-beige/60 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-1000"
                          style={{ width: `${item.pct}%`, backgroundColor: item.color }}
                        />
                      </div>
                      <p className="font-body text-[0.68rem] text-brown/45 w-8 text-right">{item.pct}%</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-3 divide-x divide-beige">
                {[
                  { icon: '⊞', label: 'Mesas',    detail: '12 asignadas' },
                  { icon: '◻', label: 'Galería',   detail: '34 fotos' },
                  { icon: '◇', label: 'Regalos',   detail: '8 listas' },
                ].map(item => (
                  <div key={item.label} className="p-4 text-left hover:bg-beige/20 transition-colors cursor-pointer">
                    <span className="block text-champagne text-lg mb-1.5">{item.icon}</span>
                    <p className="font-body text-[0.72rem] text-brown/70">{item.label}</p>
                    <p className="font-body text-[0.62rem] text-brown/38 mt-0.5">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>

          <Reveal delay={200}>
            <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Panel de control</span>
            <h2 className="font-display text-4xl lg:text-5xl text-brown font-light mt-3 leading-tight mb-6">
              Todo tu evento,<br /> bajo control.
            </h2>
            <p className="font-body text-brown/58 text-base leading-relaxed mb-8 max-w-md">
              Administra confirmaciones, mesas, galería y regalos desde un panel diseñado para que nada se te escape el gran día.
            </p>
            <ul className="space-y-3.5">
              {[
                'Confirmaciones en tiempo real',
                'Asignación de mesas y lugares',
                'Galería compartida con tus invitados',
                'Lista de regalos integrada',
              ].map(item => (
                <li key={item} className="flex items-center gap-3 font-body text-sm text-brown/65">
                  <span className="w-1 h-1 rounded-full bg-champagne flex-none" />
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Pricing ──────────────────────────────────────────────────────────────────
const PLANS = [
  {
    name: 'Esencial (Básico)',
    price: '$199',
    unit: 'MXN · Pago único',
    tagline: 'Ideal para eventos sencillos con información clara y rápida.',
    featured: false,
    features: [
      '1 invitación digital publicada (velia.mx/e/tu-evento)',
      'Edición básica (Portada, Fecha, Ubicación Google Maps y Mensaje)',
      'Confirmación de Asistencia RSVP (hasta 50 invitados)',
      'Código de vestimenta (Dress code)',
      'Cuenta regresiva animada',
      'Vigencia de publicación: 60 días',
    ],
  },
  {
    name: 'Signature (Completo)',
    price: '$499',
    unit: 'MXN · Pago único',
    tagline: 'Toda la elegancia y potencia de VÉLIA con personalización total.',
    featured: true,
    features: [
      '1 invitación premium con personalización total',
      'Edición e itinerario completo e ilimitado de secciones',
      'Invitados e pases ilimitados con código QR y token para WhatsApp',
      'Asignación de Mesas y Asientos (Seating chart interactivo)',
      'Mesa de regalos completa (CLABE bancaria + Liverpool/Sears)',
      'Música & Playlist de Spotify + Libro de firmas de invitados',
      'Estadísticas de visitas y respuestas RSVP en vivo',
      'Vigencia de publicación: 365 días (1 año completo)',
    ],
  },
]

function PricingSection({ onStartCreate }: { onStartCreate: () => void }) {
  return (
    <section id="Precios" className="bg-white py-24 lg:py-32">
      <div className="max-w-5xl mx-auto px-6 lg:px-12">
        <Reveal className="text-center mb-4">
          <span className="font-body text-[0.65rem] tracking-[0.35em] text-champagne uppercase">Precios</span>
          <h2 className="font-display text-4xl lg:text-5xl text-brown font-light mt-3">Elige tu plan</h2>
        </Reveal>
        <Reveal delay={100} className="text-center mb-14 lg:mb-18">
          <p className="font-body text-brown/45 text-sm tracking-wide">Pago único por evento · Sin mensualidades · Acceso completo al panel</p>
        </Reveal>

        <div className="grid md:grid-cols-2 max-w-4xl mx-auto gap-6 lg:gap-8 items-stretch">
          {PLANS.map((plan, i) => (
            <Reveal key={plan.name} delay={i * 90}>
              <div
                className={`relative p-8 lg:p-10 transition-transform duration-300 rounded-3xl flex flex-col justify-between h-full ${
                  plan.featured
                    ? 'bg-brown text-ivory shadow-2xl md:scale-[1.03] border-2 border-champagne'
                    : 'bg-ivory border border-beige hover:border-beige/80 text-brown'
                }`}
              >
                {plan.featured && (
                  <span className="absolute -top-[13px] left-1/2 -translate-x-1/2 font-body text-[0.6rem] tracking-[0.3em] uppercase bg-champagne text-brown px-4 py-1.5 whitespace-nowrap rounded-full font-bold shadow-xs">
                    Opción Más Popular
                  </span>
                )}

                <p
                  className={`font-body text-[0.65rem] tracking-[0.28em] uppercase mb-5 ${
                    plan.featured ? 'text-champagne' : 'text-brown/45'
                  }`}
                >
                  {plan.name}
                </p>

                <div className="mb-8 flex items-end gap-1">
                  <span className={`font-display text-5xl font-light leading-none ${plan.featured ? 'text-ivory' : 'text-brown'}`}>
                    {plan.price}
                  </span>
                  <span className={`font-body text-xs mb-1.5 ${plan.featured ? 'text-ivory/45' : 'text-brown/35'}`}>
                    MXN
                  </span>
                </div>

                <ul className="space-y-3 mb-9">
                  {plan.features.map(f => (
                    <li
                      key={f}
                      className={`flex items-start gap-2.5 font-body text-sm leading-relaxed ${
                        plan.featured ? 'text-ivory/80' : 'text-brown/65'
                      }`}
                    >
                      <span className="flex-none text-champagne mt-0.5 text-xs">—</span>
                      {f}
                    </li>
                  ))}
                </ul>

                <button
                  onClick={onStartCreate}
                  className={`w-full block text-center font-body text-sm font-medium py-3 rounded-full transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
                    plan.featured
                      ? 'bg-champagne text-brown hover:bg-[#d4b990]'
                      : 'border border-brown/25 text-brown hover:border-brown'
                  }`}
                >
                  Comenzar
                </button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal delay={400} className="text-center mt-10">
          <p className="font-body text-[0.72rem] text-brown/35 tracking-wide">
            Todos los planes incluyen tu enlace personalizado y acceso completo al dashboard
          </p>
        </Reveal>
      </div>
    </section>
  )
}

// ─── CTA Final ────────────────────────────────────────────────────────────────
function CTASection({ onStartCreate }: { onStartCreate: () => void }) {
  return (
    <section className="relative py-32 lg:py-44 overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1763553113332-800519753e40?w=1800&h=900&fit=crop&auto=format"
          alt="Celebración elegante"
          className="w-full h-full object-cover opacity-35"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-ink/50 via-ink/60 to-ink/80" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <Reveal>
          <span className="font-body text-[0.65rem] tracking-[0.38em] text-champagne/75 uppercase">
            Empieza hoy
          </span>
          <h2 className="font-display text-4xl md:text-6xl lg:text-[4.2rem] text-white font-light mt-5 leading-[1.08] mb-7">
            Haz que la primera impresión sea inolvidable.
          </h2>
          <p className="font-body text-white/55 text-base leading-relaxed mb-10 max-w-lg mx-auto">
            Crea hoy una invitación que tus invitados quieran guardar.
          </p>
          <button
            onClick={onStartCreate}
            className="inline-block font-body font-medium bg-champagne text-brown px-10 py-4 rounded-full text-sm hover:bg-[#d4b990] transition-all duration-300 hover:scale-[1.03] cursor-pointer"
          >
            Crear mi invitación
          </button>
        </Reveal>
      </div>
    </section>
  )
}

// ─── Partner Landing Section ──────────────────────────────────────────────────
function PartnerLandingSection({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <section className="py-24 lg:py-36 bg-gradient-to-br from-brown via-ink to-black text-ivory">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <Reveal>
            <span className="font-body text-[0.65rem] tracking-[0.38em] text-champagne uppercase font-medium block mb-2">
              Programa de Profesionales
            </span>
            <h2 className="font-display text-4xl lg:text-[3.8rem] text-white font-light leading-tight mb-6">
              ¿Eres Wedding Planner u Organizador de Eventos?
            </h2>
            <p className="font-body text-white/70 text-base leading-relaxed mb-8 max-w-lg">
              Ofrece invitaciones digitales extraordinarias dentro de tus paquetes y genera comisiones exclusivas de entre el 40% y el 50% por cada proyecto.
            </p>
            <div className="flex flex-wrap gap-4">
              <button
                onClick={() => onNavigate('partner_onboarding')}
                className="font-body font-medium bg-champagne text-brown px-8 py-3.5 rounded-full text-sm hover:bg-white transition-all cursor-pointer shadow-sm hover:scale-[1.02]"
              >
                Conocer Programa Partners ✨
              </button>
            </div>
          </Reveal>

          <Reveal delay={150}>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-xs">
                <span className="text-3xl block mb-2">💼</span>
                <h3 className="font-display text-xl text-white font-medium mb-1">
                  Panel Exclusivo
                </h3>
                <p className="font-body text-xs text-white/65 leading-relaxed">
                  Administra múltiples clientes, eventos e invitaciones en un solo lugar.
                </p>
              </div>

              <div className="bg-white/10 border border-white/15 rounded-2xl p-6 backdrop-blur-xs">
                <span className="text-3xl block mb-2">💰</span>
                <h3 className="font-display text-xl text-white font-medium mb-1">
                  Comisiones SPEI
                </h3>
                <p className="font-body text-xs text-white/65 leading-relaxed">
                  Recibe transferencias bancarias directas por cada contrato realizado.
                </p>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}

// ─── Footer ───────────────────────────────────────────────────────────────────
function Footer({ onNavigate }: { onNavigate: (view: AppView) => void }) {
  return (
    <footer className="bg-brown py-16 lg:py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid md:grid-cols-4 gap-10 lg:gap-14 mb-14">
          <div className="md:col-span-2">
            <span
              onClick={() => onNavigate('landing')}
              className="font-display text-[1.9rem] tracking-[0.28em] text-ivory font-light block mb-3 cursor-pointer"
            >
              VÉLIA
            </span>
            <p className="font-body text-ivory/38 text-sm leading-relaxed max-w-xs">
              Invitaciones que cuentan tu historia.
            </p>
          </div>
          <div>
            <p className="font-body text-[0.6rem] tracking-[0.3em] text-champagne/55 uppercase mb-5">
              Producto
            </p>
            <ul className="space-y-3">
              {['Plantillas', 'Funciones', 'Precios'].map(link => (
                <li key={link}>
                  <a href={`#${link}`} className="font-body text-sm text-ivory/45 hover:text-ivory transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="font-body text-[0.6rem] tracking-[0.3em] text-champagne/55 uppercase mb-5">
              Soporte
            </p>
            <ul className="space-y-3">
              {['Ayuda', 'Privacidad', 'Términos'].map(link => (
                <li key={link}>
                  <a href="#" className="font-body text-sm text-ivory/45 hover:text-ivory transition-colors duration-200">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="border-t border-ivory/8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-3">
          <p className="font-body text-[0.65rem] text-ivory/25 tracking-wide">
            © 2026 VÉLIA. Todos los derechos reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

// ─── Main App Content Component ───────────────────────────────────────────────
function AppContent() {
  const { user, userProfile, loading: authLoading } = useAuth()

  const [currentView, setCurrentView] = useState<AppView>('landing')
  const [userEmail, setUserEmail] = useState<string>('')

  // Toast Notifications State
  const [toasts, setToasts] = useState<ToastMessage[]>([])

  const addToast = (type: 'success' | 'error' | 'info', text: string) => {
    const id = `toast_${Date.now()}`
    setToasts(prev => [...prev, { id, type, text }])
  }

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }

  // Modals
  const [paymentModalStatus, setPaymentModalStatus] = useState<BillingStatus | null>(null)
  const [showHowItWorksModal, setShowHowItWorksModal] = useState<boolean>(false)

  // Public Guest view state
  const [loadingPublic, setLoadingPublic] = useState(false)
  const [publicInvitation, setPublicInvitation] = useState<any>(null)
  const [publicGuestToken, setPublicGuestToken] = useState<string>('')
  const [publicGuest, setPublicGuest] = useState<any>(null)
  const [publicNotFound, setPublicNotFound] = useState(false)

  // Event Data State with Draft Fallback
  const [eventData, setEventData] = useState<EventData>(() => {
    const draft = getEventDataDraft()
    if (draft && (draft.person1Name || draft.eventType)) return draft
    return {
      eventType: 'Boda',
      person1Name: '',
      person2Name: '',
      date: '',
      style: 'Editorial',
      selectedTemplateId: 'maison',
      customSlug: '',
      status: 'Draft',
      planId: 'free',
      billingStatus: 'free',
    }
  })

  // Auto-save eventData draft whenever modified
  useEffect(() => {
    saveEventDataDraft(eventData)
  }, [eventData])

  // Template State
  const [selectedTemplate, setSelectedTemplate] = useState<Template>(TEMPLATES_DATA[0])
  const [previewTemplate, setPreviewTemplate] = useState<Template>(TEMPLATES_DATA[0])

  // Check URL for Public Link & Payment Redirect Status
  useEffect(() => {
    if (typeof window === 'undefined') return
    const pathname = window.location.pathname
    const searchParams = new URLSearchParams(window.location.search)

    // Payment Redirect handling
    const paymentParam = searchParams.get('payment')
    if (paymentParam === 'verify') {
      setPaymentModalStatus('pending')
      setTimeout(() => {
        setPaymentModalStatus('paid')
      }, 2000)
    } else if (paymentParam === 'canceled') {
      setPaymentModalStatus('canceled')
    }

    // Partner Referral Attribution handling (/p/maria-events or ?ref=MARIA10)
    let partnerTerm = ''
    if (pathname.startsWith('/p/')) {
      partnerTerm = pathname.replace('/p/', '')
    } else if (searchParams.get('ref')) {
      partnerTerm = searchParams.get('ref') || ''
    }

    if (partnerTerm) {
      getPartnerBySlugOrCode(partnerTerm)
        .then((partner) => {
          if (partner && partner.status === 'active') {
            saveReferralAttribution(partner.partnerId, partner.referralCode, partner.referralSlug)
            addToast('info', `Te ha recomendado ${partner.businessName}`)
          }
        })
        .catch(err => console.error('Error al verificar partner referido:', err))
    }

    let slug = ''
    if (pathname.startsWith('/e/')) {
      slug = pathname.replace('/e/', '')
    } else if (searchParams.get('e')) {
      slug = searchParams.get('e') || ''
    }

    const token = searchParams.get('token') || searchParams.get('g') || ''

    if (slug) {
      setLoadingPublic(true)
      getPublicInvitationBySlug(slug)
        .then(async (data) => {
          if (data) {
            setPublicInvitation(data)

            // Single session-guarded view counter increment
            if (data.id && data.status === 'Published') {
              incrementInvitationViews(data.id)
            }

            // Dynamic SEO tags
            const names = data.eventData?.person2Name
              ? `${data.eventData.person1Name} & ${data.eventData.person2Name}`
              : data.eventData?.person1Name || 'Evento'
            updateSeoMetaData({
              title: `${names} | Invitación Digital VÉLIA`,
              description: `Te invitamos a celebrar con nosotros nuestro evento especial.`,
              url: window.location.href,
            })

            if (token) {
              setPublicGuestToken(token)
              try {
                const gData = await getPublicGuestByToken(token)
                if (gData) {
                  setPublicGuest(gData)
                }
              } catch (e) {
                console.error('Error al resolver guest token:', e)
              }
            }
          } else {
            setPublicNotFound(true)
          }
        })
        .catch((err) => {
          console.error('Error al cargar invitación pública:', err)
          setPublicNotFound(true)
        })
        .finally(() => {
          setLoadingPublic(false)
        })
    }
  }, [])

  // Auto-load user events when authenticated and restore progress
  useEffect(() => {
    if (userProfile?.uid) {
      getUserEvents(userProfile.uid)
        .then((events) => {
          if (events && events.length > 0) {
            const latest = events[0]
            setEventData(latest)
            saveEventDataDraft(latest)
            const matchedTpl =
              TEMPLATES_DATA.find(t => t.id === latest.selectedTemplateId) || TEMPLATES_DATA[0]
            setSelectedTemplate(matchedTpl)
            setPreviewTemplate(matchedTpl)

            // Auto-redirect to dashboard if returning logged in user is on landing, login or register view
            if (currentView === 'landing' || currentView === 'login' || currentView === 'register') {
              setCurrentView('dashboard')
            }
          }
        })
        .catch(err => {
          console.error('Error al cargar eventos del usuario:', err)
        })
    }
  }, [userProfile?.uid])

  // Scroll to top on view change
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [currentView])

  // Auto-redirect if user becomes authenticated while on login/register view
  useEffect(() => {
    if (user && (currentView === 'login' || currentView === 'register')) {
      if (user.email) setUserEmail(user.email)
      addToast('success', 'Sesión iniciada con éxito')

      const isOwnerAdmin =
        user.email?.toLowerCase() === 'konigstudios.dev@gmail.com' ||
        userProfile?.role === 'admin'

      if (isOwnerAdmin) {
        setCurrentView('admin_dashboard')
      } else if (userProfile?.role === 'partner') {
        setCurrentView('partner_dashboard')
      } else {
        setCurrentView('onboarding')
      }
    }
  }, [user, currentView, userProfile?.role])

  // Handlers
  const handleStartCreate = () => {
    const isOwnerAdmin =
      user?.email?.toLowerCase() === 'konigstudios.dev@gmail.com' ||
      userProfile?.role === 'admin'

    if (user) {
      if (isOwnerAdmin) {
        setCurrentView('admin_dashboard')
      } else if (userProfile?.role === 'partner') {
        setCurrentView('partner_dashboard')
      } else {
        setCurrentView('onboarding')
      }
    } else {
      setCurrentView('register')
    }
  }

  const handleLoginSuccess = (email: string) => {
    setUserEmail(email)
    addToast('success', 'Sesión iniciada correctamente')

    const isOwnerAdmin =
      email.toLowerCase() === 'konigstudios.dev@gmail.com' ||
      userProfile?.role === 'admin'

    if (isOwnerAdmin) {
      setCurrentView('admin_dashboard')
    } else if (userProfile?.role === 'partner') {
      setCurrentView('partner_dashboard')
    } else {
      setCurrentView('onboarding')
    }
  }

  const handleRegisterSuccess = (name: string, email: string) => {
    setUserEmail(email)
    setEventData(prev => ({
      ...prev,
      person1Name: name || '',
    }))
    addToast('success', 'Cuenta creada con éxito')

    const isOwnerAdmin =
      email.toLowerCase() === 'konigstudios.dev@gmail.com' ||
      userProfile?.role === 'admin'

    if (isOwnerAdmin) {
      setCurrentView('admin_dashboard')
    } else if (userProfile?.role === 'partner') {
      setCurrentView('partner_dashboard')
    } else {
      setCurrentView('onboarding')
    }
  }

  const handleOnboardingComplete = (data: EventData) => {
    setEventData(data)
    setCurrentView('summary')
  }

  const handleSelectTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setPreviewTemplate(template)
    setCurrentView('preview')
  }

  const handlePreviewTemplate = (template: Template) => {
    setPreviewTemplate(template)
    setCurrentView('preview')
  }

  const handleConfirmUseTemplate = (template: Template) => {
    setSelectedTemplate(template)
    setEventData(prev => ({
      ...prev,
      selectedTemplateId: template.id,
    }))

    if (eventData.id || eventData.invitationId) {
      setCurrentView('dashboard')
      addToast('success', `Diseño cambiado a ${template.name}`)
    } else {
      setCurrentView('creation')
    }
  }

  const handleCreateEventInBackground = async () => {
    if (user?.uid) {
      try {
        const attr = getStoredAttribution()
        const dataToSave: EventData = {
          ...eventData,
          partnerId: eventData.partnerId || attr?.partnerId || userProfile?.partnerId,
        }

        const res = await createEventAndInvitation(user.uid, dataToSave, selectedTemplate.id)
        setEventData(prev => ({
          ...prev,
          id: res.eventId,
          invitationId: res.invitationId,
          customSlug: res.slug,
          ownerId: user.uid,
          partnerId: dataToSave.partnerId,
        }))
        addToast('success', '¡Evento e invitación creados!')
      } catch (err) {
        console.error('Error al crear evento en Firestore:', err)
        addToast('error', 'Ocurrió un error al guardar tu evento.')
      }
    }
  }

  const handleProceedToDashboard = () => {
    setCurrentView('dashboard')
  }

  const handleUpdateEventData = async (updated: EventData) => {
    setEventData(updated)
    if (user?.uid && updated.id && updated.invitationId) {
      try {
        await saveEventDataToFirestore(user.uid, updated.id, updated.invitationId, updated)
        addToast('success', 'Ajustes guardados')
      } catch (err) {
        console.error('Error al actualizar datos del evento en Firestore:', err)
        addToast('error', 'Error al guardar ajustes.')
      }
    }
  }

  const handleSaveGuest = async (guest: GuestItem) => {
    if (eventData.invitationId) {
      try {
        await saveGuest(eventData.invitationId, guest, userProfile?.uid)
        addToast('success', 'Invitado guardado')
      } catch (err) {
        console.error('Error al guardar invitado:', err)
        addToast('error', 'Error al guardar invitado.')
      }
    }
  }

  const handleDeleteGuest = async (guestId: string) => {
    if (eventData.invitationId) {
      try {
        await deleteGuest(eventData.invitationId, guestId)
        addToast('info', 'Invitado eliminado')
      } catch (err) {
        console.error('Error al eliminar invitado:', err)
        addToast('error', 'Error al eliminar invitado.')
      }
    }
  }

  // 1. Loading state for public link
  if (loadingPublic || authLoading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 select-none">
        <div className="text-center space-y-4 animate-fade-up">
          <span className="font-display text-3xl tracking-[0.3em] text-brown font-light block">
            VÉLIA
          </span>
          <div className="w-8 h-[0.5px] bg-champagne mx-auto" />
          <p className="font-body text-xs text-brown/50 tracking-wider">
            Cargando experiencia...
          </p>
        </div>
      </div>
    )
  }

  // 2. Public Invitation Experience depending on Publication Status (Draft | Published | Paused)
  if (publicInvitation) {
    const status = publicInvitation.status || 'Published'

    if (status === 'Draft') {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center select-none">
          <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-beige shadow-sm space-y-4 animate-fade-up">
            <span className="font-display text-2xl tracking-[0.3em] text-brown font-light block">
              VÉLIA
            </span>
            <div className="w-12 h-12 rounded-full bg-champagne/20 text-brown flex items-center justify-center text-xl mx-auto">
              ✏️
            </div>
            <h2 className="font-display text-2xl text-brown font-light">Invitación en Preparación</h2>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              Esta invitación aún está siendo diseñada por los anfitriones y no está disponible públicamente todavía.
            </p>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
              className="font-body text-xs font-medium bg-brown text-ivory px-6 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer"
            >
              Ir a VÉLIA
            </button>
          </div>
        </div>
      )
    }

    if (status === 'Paused') {
      return (
        <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center select-none">
          <div className="max-w-md bg-white p-8 sm:p-10 rounded-3xl border border-beige shadow-sm space-y-4 animate-fade-up">
            <span className="font-display text-2xl tracking-[0.3em] text-brown font-light block">
              VÉLIA
            </span>
            <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xl mx-auto">
              ⏸️
            </div>
            <h2 className="font-display text-2xl text-brown font-light">Invitación Pausada</h2>
            <p className="font-body text-xs text-brown/60 leading-relaxed">
              El acceso público a esta invitación ha sido pausado temporalmente por los organizadores.
            </p>
            <button
              onClick={() => {
                window.location.href = '/'
              }}
              className="font-body text-xs font-medium bg-brown text-ivory px-6 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer"
            >
              Ir a VÉLIA
            </button>
          </div>
        </div>
      )
    }

    const matchedTemplate =
      TEMPLATES_DATA.find(t => t.id === publicInvitation.templateId) || TEMPLATES_DATA[0]

    return (
      <div className="min-h-screen bg-ivory">
        <OfflineBanner />
        <PublicInvitationExperience
          eventData={publicInvitation.eventData}
          template={matchedTemplate}
          sections={publicInvitation.sections}
          guestToken={publicGuestToken}
          currentGuest={publicGuest}
        />
        <PwaInstallPrompt />
      </div>
    )
  }

  // 3. Public Invitation Not Found (404 SCREEN)
  if (publicNotFound) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center p-6 text-center select-none">
        <div className="max-w-md bg-white p-8 rounded-3xl border border-beige shadow-sm space-y-4 animate-fade-up">
          <span className="font-display text-2xl tracking-[0.3em] text-brown font-light block">
            VÉLIA
          </span>
          <div className="w-12 h-12 rounded-full bg-rose/20 text-brown flex items-center justify-center text-xl mx-auto">
            🔍
          </div>
          <h2 className="font-display text-2xl text-brown font-light">Invitación no encontrada</h2>
          <p className="font-body text-xs text-brown/60 leading-relaxed">
            No pudimos encontrar la invitación solicitada. Por favor verifica la dirección URL.
          </p>
          <button
            onClick={() => {
              setPublicNotFound(false)
              window.history.pushState({}, '', '/')
            }}
            className="font-body text-xs font-medium bg-brown text-ivory px-6 py-2.5 rounded-full hover:bg-ink transition-all cursor-pointer"
          >
            Ir a VÉLIA
          </button>
        </div>
      </div>
    )
  }

  // 4. Main SaaS Application Views
  return (
    <div className="bg-ivory font-body min-h-screen text-brown antialiased flex flex-col justify-between relative">
      <OfflineBanner />

      {/* Navigation Header */}
      <HeaderNav
        currentView={currentView}
        onNavigate={setCurrentView}
        userEmail={userEmail || userProfile?.email || user?.email || ''}
      />

      {/* Main Content Router */}
      <main className="flex-1">
        {currentView === 'landing' && (
          <div className="relative">
            {/* 1. Hero */}
            <div>
              <HeroSection onStartCreate={handleStartCreate} onNavigate={setCurrentView} />
            </div>

            {/* 2. Categories */}
            <div className="bg-ivory border-t border-beige/60">
              <CategoriesSection onStartCreate={handleStartCreate} />
            </div>

            {/* 3. How It Works */}
            <div className="bg-white border-t border-beige/60">
              <HowItWorksSection onOpenHowItWorks={() => setShowHowItWorksModal(true)} />
            </div>

            {/* 4. Editor Preview */}
            <div className="bg-ivory border-t border-beige/60">
              <EditorSection onOpenHowItWorks={() => setShowHowItWorksModal(true)} />
            </div>

            {/* 5. Features */}
            <div className="bg-brown text-ivory border-t border-ivory/15">
              <FeaturesSection />
            </div>

            {/* 6. Templates */}
            <div className="bg-white border-t border-beige/60">
              <TemplatesSection onExploreDesigns={() => setCurrentView('templates')} />
            </div>

            {/* 7. Dashboard Control */}
            <div className="bg-ivory border-t border-beige/60">
              <DashboardSection onStartCreate={handleStartCreate} />
            </div>

            {/* 8. Pricing */}
            <div className="bg-white border-t border-beige/60">
              <PricingSection onStartCreate={handleStartCreate} />
            </div>

            {/* 9. Partner Program */}
            <div className="bg-gradient-to-br from-brown via-ink to-black text-ivory border-t border-champagne/30">
              <PartnerLandingSection onNavigate={setCurrentView} />
            </div>

            {/* 10. CTA Final */}
            <div className="bg-ink border-t border-white/10">
              <CTASection onStartCreate={handleStartCreate} />
            </div>

            {/* 11. Footer */}
            <div className="bg-brown border-t border-ivory/10">
              <Footer onNavigate={setCurrentView} />
            </div>
          </div>
        )}

        {currentView === 'login' && (
          <LoginView
            onNavigate={setCurrentView}
            onLoginSuccess={handleLoginSuccess}
          />
        )}

        {currentView === 'register' && (
          <RegisterView
            onNavigate={setCurrentView}
            onRegisterSuccess={handleRegisterSuccess}
          />
        )}

        {currentView === 'onboarding' && (
          <OnboardingView
            initialData={eventData}
            onComplete={handleOnboardingComplete}
          />
        )}

        {currentView === 'summary' && (
          <SummaryView
            eventData={eventData}
            onEditOnboarding={() => setCurrentView('onboarding')}
            onChooseDesign={() => setCurrentView('templates')}
          />
        )}

        {currentView === 'templates' && (
          <TemplateGalleryView
            initialCategory={eventData.eventType}
            initialStyle={eventData.style}
            onSelectTemplate={handleSelectTemplate}
            onPreviewTemplate={handlePreviewTemplate}
            onBackToSummary={() => {
              if (eventData.id || eventData.invitationId) {
                setCurrentView('dashboard')
              } else {
                setCurrentView('summary')
              }
            }}
          />
        )}

        {currentView === 'preview' && (
          <PreviewView
            template={previewTemplate}
            eventData={eventData}
            onBackToGallery={() => setCurrentView('templates')}
            onEditData={() => {
              if (eventData.id || eventData.invitationId) {
                setCurrentView('dashboard')
              } else {
                setCurrentView('onboarding')
              }
            }}
            onConfirmUseTemplate={handleConfirmUseTemplate}
          />
        )}

        {currentView === 'creation' && (
          <CreationLoadingView
            onCreateEvent={handleCreateEventInBackground}
            onProceedToDashboard={handleProceedToDashboard}
          />
        )}

        {currentView === 'dashboard' && (
          <DashboardView
            eventData={eventData}
            template={selectedTemplate}
            onUpdateEventData={handleUpdateEventData}
            onSaveGuest={handleSaveGuest}
            onDeleteGuest={handleDeleteGuest}
            onChangeTemplate={() => setCurrentView('templates')}
            onEditOnboarding={() => setCurrentView('onboarding')}
            onGoToLanding={() => setCurrentView('landing')}
          />
        )}

        {currentView === 'partner_onboarding' && (
          <PartnerOnboardingView
            onNavigate={setCurrentView}
            onSuccess={() => setCurrentView('partner_dashboard')}
          />
        )}

        {currentView === 'partner_dashboard' && (
          <PartnerDashboardView
            onNavigate={setCurrentView}
            onSelectEventToEdit={(evt) => {
              setEventData(evt)
              setCurrentView('dashboard')
            }}
          />
        )}

        {currentView === 'admin_dashboard' && (
          <AdminDashboardView
            onNavigate={setCurrentView}
            onSelectEventToEdit={(evt) => {
              setEventData(evt)
              setCurrentView('dashboard')
            }}
          />
        )}
      </main>

      {/* Floating PWA Install Prompt, Payment Status, How It Works Modal & Toast Container */}
      <PwaInstallPrompt />
      <ToastContainer toasts={toasts} onDismiss={removeToast} />

      {paymentModalStatus && (
        <PaymentStatus
          status={paymentModalStatus}
          onClose={() => setPaymentModalStatus(null)}
        />
      )}

      {showHowItWorksModal && (
        <HowItWorksModal
          onClose={() => setShowHowItWorksModal(false)}
          onStartCreate={handleStartCreate}
        />
      )}
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}
