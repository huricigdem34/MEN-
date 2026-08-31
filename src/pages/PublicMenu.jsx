import { useEffect, useState, useMemo, useRef } from 'react'
import { ChevronDown, X, Star, ImageOff, Search, Wifi, Phone, Copy, Check, Globe } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { AllergenIcon, IngredientIcon } from '../components/MenuIcons'
import { trTitleCase } from '../lib/menuIcons'

const UI = {
  tr: {
    menu: 'Menümüz', search: 'Menüde ara...', resultsFound: (n) => `${n} sonuç bulundu`,
    noResults: 'Sonuç bulunamadı', popular: 'Popüler Ürünler',
    updating: 'Menü şu anda güncelleniyor, birazdan tekrar bakın.', noItemsInCategory: 'Bu kategoride şu anda ürün yok.',
    detail: 'Detay', ingredients: 'İçindekiler', allergens: 'Alerjenler', noAllergens: 'Belirtilen alerjen yok',
    chefNote: 'Şefin Notu', approxCalories: 'Yaklaşık Kalori', grammage: 'Gramaj', featured: 'Popüler',
    tapToEnter: ['MENÜYE GİRMEK İÇİN', 'DOKUNUN'], welcome: ['Lezzetli Bir Deneyime', 'Hazır Mısınız?'],
    wifiPassword: 'WiFi Şifresi', copy: 'Kopyala', copied: 'Kopyalandı', reservation: 'Rezervasyon & İletişim',
    callUs: 'Bizi Arayın', itemCount: (n) => `${n} ürün`,
  },
  en: {
    menu: 'Our Menu', search: 'Search the menu...', resultsFound: (n) => `${n} results found`,
    noResults: 'No results found', popular: 'Popular Items',
    updating: 'The menu is being updated, please check back shortly.', noItemsInCategory: 'No items in this category right now.',
    detail: 'Details', ingredients: 'Ingredients', allergens: 'Allergens', noAllergens: 'No allergens listed',
    chefNote: "Chef's Note", approxCalories: 'Approx. Calories', grammage: 'Portion', featured: 'Popular',
    tapToEnter: ['TAP TO ENTER', 'THE MENU'], welcome: ['Ready For A', 'Delicious Experience?'],
    wifiPassword: 'WiFi Password', copy: 'Copy', copied: 'Copied', reservation: 'Reservations & Contact',
    callUs: 'Call Us', itemCount: (n) => `${n} ${n === 1 ? 'item' : 'items'}`,
  },
}

const ALLERGEN_EN = {
  'Gluten': 'Gluten', 'Süt ve süt ürünleri': 'Dairy', 'Yumurta': 'Eggs', 'Balık': 'Fish',
  'Kabuklu deniz ürünleri': 'Shellfish', 'Yer fıstığı': 'Peanuts', 'Susam': 'Sesame', 'Soya': 'Soy',
  'Hardal': 'Mustard', 'Kereviz': 'Celery', 'Sülfit': 'Sulphites', 'Sert kabuklu meyveler': 'Tree nuts',
}

function Reveal({ children, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          observer.unobserve(el)
        }
      },
      { threshold: 0.08 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      style={{ overflowAnchor: 'none' }}
      className={`transition-all duration-700 ease-out ${visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${className}`}
    >
      {children}
    </div>
  )
}

export default function PublicMenu() {
  const [phase, setPhase] = useState('intro') // 'intro' | 'welcome' | 'menu'
  const [lang, setLang] = useState('tr')
  const [categories, setCategories] = useState([])
  const [items, setItems] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [openCategory, setOpenCategory] = useState(null)
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [search, setSearch] = useState('')
  const [wifiOpen, setWifiOpen] = useState(false)
  const welcomeTimer = useRef(null)
  const headerRef = useRef(null)
  const scrollTimer = useRef(null)

  const t = UI[lang]

  useEffect(() => {
    fetchMenu()
    return () => {
      clearTimeout(welcomeTimer.current)
      clearTimeout(scrollTimer.current)
    }
  }, [])

  async function fetchMenu() {
    setLoading(true)
    const [{ data: cats, error: catErr }, { data: menuItems, error: itemErr }, { data: settingsData }] = await Promise.all([
      supabase.from('categories').select('*').order('sort_order', { ascending: true }),
      supabase.from('menu_items').select('*').eq('is_available', true).is('deleted_at', null).order('sort_order', { ascending: true }),
      supabase.from('settings').select('*'),
    ])
    if (!catErr && cats) setCategories(cats)
    if (!itemErr && menuItems) setItems(menuItems)
    if (settingsData) {
      const map = {}
      for (const s of settingsData) map[s.key] = s.value
      setSettings(map)
    }
    setLoading(false)
  }

  function enterWelcome() {
    setPhase('welcome')
    welcomeTimer.current = setTimeout(() => setPhase('menu'), 3200)
  }

  function skipToMenu() {
    clearTimeout(welcomeTimer.current)
    setPhase('menu')
  }

  function categoryLabel(cat) {
    return lang === 'en' && cat.name_en ? cat.name_en : cat.name
  }

  function productField(item, field) {
    const enField = `${field}_en`
    return lang === 'en' && item[enField] ? item[enField] : item[field]
  }

  const itemsByCategory = useMemo(() => {
    const map = {}
    for (const item of items) {
      if (!map[item.category]) map[item.category] = []
      map[item.category].push(item)
    }
    return map
  }, [items])

  const featuredItems = useMemo(() => items.filter((i) => i.is_featured), [items])

  const searchResults = useMemo(() => {
    const q = search.trim().toLowerCase()
    if (!q) return null
    return items.filter((i) => productField(i, 'name').toLowerCase().includes(q))
  }, [items, search, lang])

  const categoriesWithItems = useMemo(
    () => categories.map((c) => ({ ...c, items: itemsByCategory[c.name] || [] })),
    [categories, itemsByCategory]
  )

  function toggleCategory(name) {
    const isOpening = openCategory !== name
    setOpenCategory((prev) => (prev === name ? null : name))

    clearTimeout(scrollTimer.current)
    if (isOpening) {
      // Wait for the OTHER accordion's 500ms collapse transition to actually
      // finish before measuring position — measuring too early (mid-collapse)
      // gives a moving/wrong target that fights with the smooth scroll and
      // causes the screen to jump around.
      scrollTimer.current = setTimeout(() => {
        const target = document.getElementById(`category-${name.replace(/\s+/g, '-')}`)
        if (!target) return
        const headerHeight = headerRef.current?.getBoundingClientRect().height || 0
        const targetTop = target.getBoundingClientRect().top + window.scrollY - headerHeight - 10
        window.scrollTo({ top: targetTop, behavior: 'smooth' })
      }, 550)
    }
  }

  const hasWifi = Boolean(settings.wifi_password)
  const hasReservation = Boolean(settings.reservation_phone)

  return (
    <div className="min-h-[100dvh] bg-[#080a09] text-white relative overflow-x-hidden" style={{ fontFamily: 'Georgia, serif' }}>
      {phase === 'intro' && <IntroScreen onEnter={enterWelcome} t={t} />}
      {phase === 'welcome' && <WelcomeScreen onSkip={skipToMenu} t={t} />}

      <div className={`transition-opacity duration-700 ${phase === 'menu' ? 'opacity-100' : 'opacity-0 pointer-events-none fixed inset-0'}`}>
        <header ref={headerRef} className="sticky top-0 z-30 bg-gradient-to-b from-[#090c0a] via-[#090c0a]/95 to-transparent
                            px-4 pt-[max(1rem,env(safe-area-inset-top))] pb-4 text-center relative">
          <button
            onClick={() => setLang((l) => (l === 'tr' ? 'en' : 'tr'))}
            className="fixed sm:absolute top-[max(0.75rem,env(safe-area-inset-top))] right-3 z-40
                       font-sans flex items-center gap-1 text-[10px] tracking-wide text-[#d8b574] border border-[#d8b574]/30
                       bg-[#0a0d0b]/80 backdrop-blur-sm rounded-full px-2.5 py-1.5 hover:bg-[#d8b574]/10 transition-colors"
          >
            <Globe className="w-3 h-3" /> {lang === 'tr' ? 'EN' : 'TR'}
          </button>
          <img src="/logo.png" alt="The Lobby" className="w-14 h-14 sm:w-16 sm:h-16 object-contain mx-auto" />
          <p className="text-[10px] tracking-[4px] text-[#d8b574]">THE LOBBY</p>
          <h1 className="text-[clamp(22px,6vw,32px)] text-[#f3d99c] tracking-wide mt-0.5 mb-3">{t.menu}</h1>
          <div className="relative max-w-xs mx-auto font-sans">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#d8b574]/60" strokeWidth={1.5} />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={t.search}
              className="w-full bg-white/[0.04] border border-[#d8b574]/25 rounded-full pl-10 pr-4 py-2.5
                         text-sm text-[#f7edd7] placeholder-[#8a8378] focus:outline-none focus:border-[#d8b574]/50
                         transition-colors"
            />
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-3 sm:px-5 pb-10">
          {(hasWifi || hasReservation) && (
            <Reveal className="mb-5">
              <section className="rounded-2xl border border-[#d8b574]/20 bg-white/[0.02] p-5 sm:p-6 font-sans text-center">
                <h2 className="text-[#f3d99c] text-[17px] mb-4" style={{ fontFamily: 'Georgia, serif' }}>{t.reservation}</h2>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
                  {hasWifi && (
                    <button
                      onClick={() => setWifiOpen(true)}
                      className="flex items-center gap-2 border border-[#d8b574]/30 text-[#d8c9a9] text-sm px-4 py-2.5 rounded-full hover:bg-[#d8b574]/10 transition-colors"
                    >
                      <Wifi className="w-4 h-4 text-[#d8b574]" strokeWidth={1.5} /> {t.wifiPassword}
                    </button>
                  )}
                  {hasReservation && (
                    <a
                      href={`tel:${settings.reservation_phone}`}
                      className="flex items-center gap-2 bg-amber-500 text-neutral-950 font-medium text-sm px-5 py-2.5 rounded-full hover:bg-amber-400 transition-colors"
                    >
                      <Phone className="w-4 h-4" strokeWidth={1.5} /> {t.callUs}
                    </a>
                  )}
                </div>
              </section>
            </Reveal>
          )}

          {loading ? (
            <div className="flex justify-center py-24">
              <div className="w-7 h-7 border-2 border-[#d8b574]/30 border-t-[#d8b574] rounded-full animate-spin" />
            </div>
          ) : categories.length === 0 ? (
            <p className="text-center text-[#999] py-24 text-sm">{t.updating}</p>
          ) : searchResults !== null ? (
            <div>
              <p className="text-[#999] text-xs font-sans mb-3 px-1">
                {searchResults.length > 0 ? t.resultsFound(searchResults.length) : t.noResults}
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5">
                {searchResults.map((item) => (
                  <ProductCard key={item.id} item={item} onClick={() => setSelectedProduct(item)} t={t} productField={productField} />
                ))}
              </div>
            </div>
          ) : (
            <>
              {featuredItems.length > 0 && (
                <FeaturedStrip items={featuredItems} onSelect={setSelectedProduct} t={t} productField={productField} />
              )}

              <div className="space-y-3">
                {categoriesWithItems.map((cat) => (
                  <Reveal key={cat.id}>
                    <CategoryAccordion
                      category={cat}
                      label={categoryLabel(cat)}
                      isOpen={openCategory === cat.name}
                      onToggle={() => toggleCategory(cat.name)}
                      onSelectProduct={setSelectedProduct}
                      t={t}
                      productField={productField}
                    />
                  </Reveal>
                ))}
              </div>
            </>
          )}
        </main>
      </div>

      {selectedProduct && (
        <ProductModal product={selectedProduct} onClose={() => setSelectedProduct(null)} t={t} lang={lang} productField={productField} />
      )}

      {wifiOpen && (
        <WifiModal password={settings.wifi_password} onClose={() => setWifiOpen(false)} t={t} />
      )}
    </div>
  )
}

function IntroScreen({ onEnter, t }) {
  return (
    <div
      onClick={onEnter}
      className="fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden animate-in fade-in duration-700"
      style={{ background: 'radial-gradient(circle at 50% 35%, #1a1710 0%, #0a0906 45%, #050403 100%)' }}
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 30%, rgba(216,181,116,.12), transparent 55%)' }} />
      <div className="absolute -top-24 -left-24 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(216,181,116,.05)', animationDuration: '4s' }} />
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(216,181,116,.05)', animationDuration: '4s', animationDelay: '1s' }} />

      <div className="relative z-10 text-center px-6 animate-in fade-in zoom-in-95 duration-1000">
        <img
          src="/logo.png"
          alt="The Lobby"
          className="w-28 h-28 sm:w-36 sm:h-36 object-contain mx-auto mb-9 drop-shadow-[0_8px_28px_rgba(0,0,0,.65)]"
          style={{ animation: 'lobby-breathe 3.5s ease-in-out infinite' }}
        />
        <div className="w-10 h-px mx-auto mb-6" style={{ background: 'linear-gradient(90deg, transparent, rgba(216,181,116,.5), transparent)' }} />
        <p
          className="text-[16px] sm:text-[20px] tracking-[3.5px] leading-loose font-sans"
          style={{ color: 'rgba(194,163,105,.85)', textShadow: '0 1px 0 rgba(255,224,163,.08), 0 -1px 1px rgba(0,0,0,.78)' }}
        >
          <span className="inline-block animate-pulse" style={{ animationDuration: '2.2s' }}>{t.tapToEnter[0]}</span>
          <br />
          <span className="inline-block animate-pulse" style={{ animationDuration: '2.2s', animationDelay: '0.4s' }}>{t.tapToEnter[1]}</span>
        </p>
      </div>

      <style>{`
        @keyframes lobby-breathe {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.035); }
        }
      `}</style>
    </div>
  )
}

function WelcomeScreen({ onSkip, t }) {
  return (
    <div
      onClick={onSkip}
      className="fixed inset-0 z-[999] flex items-center justify-center bg-[#030403] cursor-pointer px-8 overflow-hidden animate-in fade-in duration-700"
    >
      <div className="absolute inset-0" style={{ background: 'radial-gradient(circle at 50% 42%, rgba(211,167,91,.18), transparent 38%)' }} />
      <div className="absolute -top-32 -left-16 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(216,181,116,.06)', animationDuration: '5s' }} />
      <div className="absolute -bottom-32 -right-16 w-80 h-80 rounded-full blur-3xl animate-pulse" style={{ background: 'rgba(216,181,116,.06)', animationDuration: '5s', animationDelay: '1.2s' }} />

      <div className="relative z-10 text-center max-w-lg">
        <img
          src="/logo.png"
          alt="The Lobby"
          className="w-16 h-16 object-contain mx-auto mb-7 animate-in fade-in zoom-in-95 duration-1000"
        />
        <h1 className="text-[clamp(28px,7.5vw,50px)] leading-[1.35] text-[#f5d89a]">
          <span className="block animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            {t.welcome[0]}
          </span>
          <strong className="block font-normal animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            {t.welcome[1]}
          </strong>
        </h1>
        <div
          className="w-14 h-px mx-auto mt-7 animate-in fade-in duration-1000"
          style={{ background: 'linear-gradient(90deg, transparent, rgba(216,181,116,.6), transparent)', animationDelay: '1100ms' }}
        />
      </div>
    </div>
  )
}

function WifiModal({ password, onClose, t }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard?.writeText(password).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 1800)
    })
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,.8)', backdropFilter: 'blur(8px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="w-full max-w-xs rounded-3xl p-6 text-center font-sans animate-in fade-in zoom-in-95 duration-200"
           style={{ background: '#0d110e', border: '1px solid rgba(216,181,116,.3)' }}>
        <Wifi className="w-8 h-8 text-[#d8b574] mx-auto mb-3" strokeWidth={1.5} />
        <p className="text-[#999] text-xs mb-1.5">{t.wifiPassword}</p>
        <p className="text-[#f3d99c] text-2xl font-semibold tracking-wide mb-4">{password}</p>
        <button
          onClick={handleCopy}
          className="w-full flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950
                     text-sm font-medium py-2.5 rounded-xl transition-colors"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? t.copied : t.copy}
        </button>
        <button onClick={onClose} className="text-[#777] text-xs mt-3 hover:text-[#aaa]">✕</button>
      </div>
    </div>
  )
}

function FeaturedStrip({ items, onSelect, t, productField }) {
  return (
    <section className="mb-5">
      <div className="flex items-center gap-2 mb-2.5 px-1">
        <Star className="w-4 h-4 text-amber-400 fill-amber-400" strokeWidth={1.5} />
        <h2 className="text-[15px] sm:text-[17px] text-[#f3d99c] tracking-wide">{t.popular}</h2>
      </div>
      <div className="flex gap-3 overflow-x-auto pb-2 -mx-1 px-1 snap-x snap-mandatory">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className="snap-start shrink-0 w-[150px] sm:w-[170px] rounded-xl overflow-hidden bg-[#111512]
                       border border-amber-500/25 text-left active:scale-[0.97] transition-transform duration-150"
          >
            <div className="relative">
              {item.image_url ? (
                <img src={item.image_url} alt={productField(item, 'name')} loading="lazy"
                     className="w-full aspect-square object-cover" style={{ filter: 'saturate(.9) contrast(1.05)' }} />
              ) : (
                <div className="w-full aspect-square bg-[#1a1d19] flex items-center justify-center">
                  <ImageOff className="w-6 h-6 text-neutral-700" strokeWidth={1.5} />
                </div>
              )}
              <span className="absolute top-1.5 right-1.5 bg-black/60 backdrop-blur-sm rounded-full p-1">
                <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
              </span>
            </div>
            <div className="p-2.5 font-sans">
              <p className="text-[12.5px] text-[#f7edd7] leading-snug line-clamp-2 min-h-[2.2em]">{trTitleCase(productField(item, 'name'))}</p>
              <p className="text-[#f3d99c] font-semibold text-[13px] mt-1">{Number(item.price).toFixed(0)} ₺</p>
            </div>
          </button>
        ))}
      </div>
    </section>
  )
}

function CategoryAccordion({ category, label, isOpen, onToggle, onSelectProduct, t, productField }) {
  if (category.items.length === 0) return null

  return (
    <section
      id={`category-${category.name.replace(/\s+/g, '-')}`}
      className="rounded-2xl overflow-hidden border transition-colors duration-300"
      style={{
        borderColor: isOpen ? 'rgba(216,181,116,.58)' : 'rgba(202,166,96,.38)',
        background: 'linear-gradient(145deg, rgba(48,50,45,.96), rgba(31,34,30,.98))',
        overflowAnchor: 'none',
      }}
    >
      <button
        type="button"
        onClick={onToggle}
        className="w-full min-h-[72px] px-4 sm:px-5 py-3 flex items-center justify-between gap-3
                   text-left active:bg-white/5 transition-colors"
      >
        <span className="min-w-0">
          <span className="block text-[clamp(16px,4.2vw,21px)] text-[#eee4d2] leading-snug truncate">
            {label}
          </span>
          <span className="block text-[11px] text-[#999] mt-0.5 font-sans">{t.itemCount(category.items.length)}</span>
        </span>
        <ChevronDown
          className={`w-5 h-5 text-[#d8b574] shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
          strokeWidth={1.75}
        />
      </button>

      <div
        className="grid transition-[grid-template-rows] duration-500 ease-out"
        style={{ gridTemplateRows: isOpen ? '1fr' : '0fr' }}
      >
        <div className="overflow-hidden">
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-2.5 sm:gap-3.5 p-3 sm:p-4 pt-1">
            {category.items.map((item) => (
              <ProductCard key={item.id} item={item} onClick={() => onSelectProduct(item)} t={t} productField={productField} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

function ProductCard({ item, onClick, t, productField }) {
  return (
    <article
      onClick={onClick}
      className="relative rounded-xl overflow-hidden bg-[#111512] border border-[#d8b574]/[0.18] cursor-pointer
                 active:scale-[0.98] transition-transform duration-150"
    >
      {item.is_featured && (
        <span className="absolute top-1.5 right-1.5 z-10 bg-black/60 backdrop-blur-sm rounded-full p-1">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" />
        </span>
      )}
      {item.image_url ? (
        <img
          src={item.image_url}
          alt={productField(item, 'name')}
          loading="lazy"
          className="w-full aspect-[4/3] object-cover"
          style={{ filter: 'saturate(.9) contrast(1.05)' }}
        />
      ) : (
        <div className="w-full aspect-[4/3] bg-[#1a1d19] flex items-center justify-center">
          <ImageOff className="w-6 h-6 text-neutral-700" strokeWidth={1.5} />
        </div>
      )}
      <div className="p-2.5 sm:p-3.5">
        <h3 className="text-[clamp(13px,3.6vw,16px)] text-[#f7edd7] leading-snug line-clamp-2 min-h-[2.4em]">
          {trTitleCase(productField(item, 'name'))}
        </h3>
        <div className="flex items-center justify-between mt-2">
          <span className="text-[#f3d99c] font-sans font-semibold text-[clamp(13px,3.6vw,16px)]">
            {Number(item.price).toFixed(0)} ₺
          </span>
          <span className="font-sans text-[9px] sm:text-[10px] border border-[#d8b574]/25 text-[#d8c9a9] px-2 py-1 rounded-full">
            {t.detail}
          </span>
        </div>
      </div>
    </article>
  )
}

function ProductModal({ product, onClose, t, lang, productField }) {
  const ingredientsRaw = productField(product, 'ingredients')
  const ingredientList = (ingredientsRaw || '')
    .split(',')
    .map((s) => trTitleCase(s.trim()))
    .filter(Boolean)
    .slice(0, 6)

  const allergenList = (product.allergens || []).filter(Boolean).map((a) => (lang === 'en' ? (ALLERGEN_EN[a] || a) : a))
  const chefNote = productField(product, 'chef_note')

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5"
      style={{ background: 'rgba(0,0,0,.82)', backdropFilter: 'blur(10px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className="w-full max-w-[560px] max-h-[92dvh] overflow-y-auto rounded-[26px] relative animate-in fade-in zoom-in-95 duration-200"
        style={{ background: '#0d110e', border: '1px solid rgba(216,181,116,.3)', boxShadow: '0 30px 100px #000' }}
      >
        <button
          onClick={onClose}
          aria-label="Close"
          className="fixed sm:absolute top-5 right-5 z-10 text-[#f3d99c] text-3xl leading-none font-sans font-light"
          style={{ textShadow: '0 0 10px rgba(216,181,116,.25)' }}
        >
          <X className="w-7 h-7" strokeWidth={2} />
        </button>

        {product.image_url ? (
          <img src={product.image_url} alt={productField(product, 'name')} className="w-full h-[210px] sm:h-[260px] object-cover rounded-t-[26px]" />
        ) : (
          <div className="w-full h-[120px] rounded-t-[26px] bg-[#111512]" />
        )}

        <div className="p-5 sm:p-6 font-sans">
          <div className="flex items-center gap-2 flex-wrap">
            <small className="text-[#d8b574] tracking-[3px] text-[11px]">{product.category.toUpperCase()}</small>
            {product.is_featured && (
              <span className="inline-flex items-center gap-1 text-[10px] text-amber-400 bg-amber-500/10 border border-amber-500/25 px-2 py-0.5 rounded-full">
                <Star className="w-2.5 h-2.5 fill-amber-400" /> {t.featured}
              </span>
            )}
          </div>
          <h2 className="text-[clamp(22px,6vw,30px)] text-[#f4dfb0] mt-1.5 mb-2" style={{ fontFamily: 'Georgia, serif' }}>
            {trTitleCase(productField(product, 'name'))}
          </h2>
          {productField(product, 'description') && (
            <p className="text-[#bbb] text-sm leading-relaxed">{productField(product, 'description')}</p>
          )}

          {(product.calories || product.grammage) && (
            <div className="grid grid-cols-2 gap-3 my-5">
              <div className="bg-white/[0.045] border border-white/[0.06] rounded-2xl p-4">
                <span className="block text-[11px] text-[#999] mb-1.5">{t.approxCalories}</span>
                <b className="text-[#f3d99c] text-lg">{product.calories || '—'}</b>
              </div>
              <div className="bg-white/[0.045] border border-white/[0.06] rounded-2xl p-4">
                <span className="block text-[11px] text-[#999] mb-1.5">{t.grammage}</span>
                <b className="text-[#f3d99c] text-lg">{product.grammage || '—'}</b>
              </div>
            </div>
          )}

          {ingredientList.length > 0 && (
            <section className="my-5">
              <h3 className="text-[#ead09a] text-[17px] mb-2">{t.ingredients}</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {ingredientList.map((ing) => <IngredientIcon key={ing} label={ing} />)}
              </div>
            </section>
          )}

          <section className="my-5">
            <h3 className="text-[#ead09a] text-[17px] mb-2">{t.allergens}</h3>
            {allergenList.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {allergenList.map((a) => <AllergenIcon key={a} label={a} />)}
              </div>
            ) : (
              <p className="text-[#999] text-xs">{t.noAllergens}</p>
            )}
          </section>

          {chefNote && (
            <div className="mt-5 p-4 rounded-2xl border-l-2" style={{
              background: 'linear-gradient(135deg, rgba(216,181,116,.13), rgba(216,181,116,.035))',
              borderColor: '#d8b574',
            }}>
              <span className="block text-[#f3d99c] text-[17px] mb-1.5">{t.chefNote}</span>
              <p className="text-[#bbb] text-sm leading-relaxed">{chefNote}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
