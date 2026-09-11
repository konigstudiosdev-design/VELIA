/**
 * Updates document head SEO and Open Graph meta tags dynamically in client DOM
 */
export function updateSeoMetaData(options: {
  title: string
  description?: string
  imageUrl?: string
  url?: string
}): void {
  if (typeof document === 'undefined') return

  // Update Title
  document.title = options.title

  // Helper to set or create meta tag
  const setMeta = (selector: string, attrName: string, attrVal: string, content: string) => {
    let el = document.querySelector(selector)
    if (!el) {
      el = document.createElement('meta')
      el.setAttribute(attrName, attrVal)
      document.head.appendChild(el)
    }
    el.setAttribute('content', content)
  }

  const desc = options.description || 'VÉLIA — Invitaciones Digitales Premium'
  const img = options.imageUrl || 'https://images.unsplash.com/photo-1763553113391-a659bee36e06?w=1200&h=630&fit=crop'
  const pageUrl = options.url || (typeof window !== 'undefined' ? window.location.href : 'https://velia.mx')

  setMeta('meta[name="description"]', 'name', 'description', desc)
  setMeta('meta[property="og:title"]', 'property', 'og:title', options.title)
  setMeta('meta[property="og:description"]', 'property', 'og:description', desc)
  setMeta('meta[property="og:image"]', 'property', 'og:image', img)
  setMeta('meta[property="og:url"]', 'property', 'og:url', pageUrl)
  setMeta('meta[name="twitter:card"]', 'name', 'twitter:card', 'summary_large_image')
  setMeta('meta[name="twitter:title"]', 'name', 'twitter:title', options.title)
  setMeta('meta[name="twitter:description"]', 'name', 'twitter:description', desc)
  setMeta('meta[name="twitter:image"]', 'name', 'twitter:image', img)
}
