import { useEffect, useState, useMemo, useRef } from 'react'
import { ChevronDown, X, Star, ImageOff, Search, Wifi, Phone, Copy, Check, Globe, Instagram } from 'lucide-react'
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
    callUs: 'Bizi Arayın', itemCount: (n) => `${n} ürün`, close: 'Kapat',
  },
  en: {
    menu: 'Our Menu', search: 'Search the menu...', resultsFound: (n) => `${n} results found`,
    noResults: 'No results found', popular: 'Popular Items',
    updating: 'The menu is being updated, please check back shortly.', noItemsInCategory: 'No items in this category right now.',
    detail: 'Details', ingredients: 'Ingredients', allergens: 'Allergens', noAllergens: 'No allergens listed',
    chefNote: "Chef's Note", approxCalories: 'Approx. Calories', grammage: 'Portion', featured: 'Popular',
    tapToEnter: ['TAP TO ENTER', 'THE MENU'], welcome: ['Ready For A', 'Delicious Experience?'],
    wifiPassword: 'WiFi Password', copy: 'Copy', copied: 'Copied', reservation: 'Reservations & Contact',
    callUs: 'Call Us', itemCount: (n) => `${n} ${n === 1 ? 'item' : 'items'}`, close: 'Close',
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
          <Reveal className="mb-5">
            <section className="rounded-2xl border border-[#d8b574]/20 bg-white/[0.02] p-5 sm:p-6 font-sans text-center">
              <h2 className="text-[#f3d99c] text-[17px] mb-4" style={{ fontFamily: 'Georgia, serif' }}>{t.reservation}</h2>
              <div className="flex flex-wrap items-center justify-center gap-3">
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
                <a
                  href="https://www.instagram.com/thelobbyrest"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="group flex items-center justify-center w-11 h-11 rounded-full border transition-all duration-200"
                  style={{ borderColor: 'rgba(212,175,55,.45)', color: '#D4AF37', background: 'transparent' }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212,175,55,.12)'; e.currentTarget.style.borderColor = '#D4AF37' }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.borderColor = 'rgba(212,175,55,.45)' }}
                >
                  <Instagram
                    className="w-5 h-5 transition-transform duration-200 group-hover:scale-110"
                    strokeWidth={1.6}
                    style={{ filter: 'drop-shadow(0 0 4px rgba(212,175,55,.35))' }}
                  />
                </a>
              </div>
            </section>
          </Reveal>

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

const BULB_POSITIONS_DESKTOP = [
  { left: '4%', rope: '13vh' },
  { left: '20%', rope: '7vh' },
  { left: '35%', rope: '16vh' },
  { left: '50%', rope: '8vh' },
  { left: '65%', rope: '14vh' },
  { left: '80%', rope: '6vh' },
  { left: '93%', rope: '15vh' },
]
const BULB_POSITIONS_MOBILE = [
  { left: '10%', rope: '14vh' },
  { left: '24%', rope: '8vh' },
  { left: '38%', rope: '17vh' },
  { left: '50%', rope: '9vh' },
  { left: '62%', rope: '15vh' },
  { left: '76%', rope: '7vh' },
  { left: '90%', rope: '16vh' },
]
const ROPE_OPACITY_BY_LEVEL = [0.07, 0.32, 0.44, 0.55, 0.66, 0.76, 0.86, 0.94]

function IntroScreen({ onEnter, t }) {
  const [bulbLevel, setBulbLevel] = useState(0)
  const [clicked, setClicked] = useState(false)
  const [fadingOut, setFadingOut] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const timers = useRef([])

  useEffect(() => {
    setIsMobile(window.matchMedia('(max-width: 700px)').matches)
    return () => timers.current.forEach(clearTimeout)
  }, [])

  function handleClick() {
    if (clicked) return
    setClicked(true)

    for (let i = 0; i < 7; i++) {
      timers.current.push(setTimeout(() => setBulbLevel(i + 1), i * 320))
    }
    timers.current.push(setTimeout(() => setFadingOut(true), 3000))
    timers.current.push(setTimeout(() => onEnter(), 4100))
  }

  const positions = isMobile ? BULB_POSITIONS_MOBILE : BULB_POSITIONS_DESKTOP
  const darkness = Math.max(0.16, 0.68 - bulbLevel * 0.075)
  const ropeOpacity = ROPE_OPACITY_BY_LEVEL[bulbLevel]

  return (
    <div
      onClick={handleClick}
      style={{ transitionDuration: '1100ms' }}
      className={`fixed inset-0 z-[999] flex items-center justify-center cursor-pointer overflow-hidden transition-opacity ${fadingOut ? 'opacity-0' : 'opacity-100'}`}
    >
      <img src="/assets/intro/background.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />

      {/* Darkness overlay — lifts as bulbs light up */}
      <div className="absolute inset-0 transition-colors duration-700" style={{ backgroundColor: `rgba(0,0,0,${darkness})` }} />

      {/* Warm light pooling from each bulb */}
      <div
        className="absolute inset-x-0 top-0 h-[58vh] transition-opacity"
        style={{
          opacity: clicked ? 1 : 0,
          transitionDuration: '1050ms',
          filter: 'blur(10px)',
          background: [
            'radial-gradient(ellipse 8% 70% at 7% 0%, rgba(255,188,86,.24) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 72% at 21% 0%, rgba(255,188,86,.24) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 74% at 36% 0%, rgba(255,188,86,.25) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 76% at 50% 0%, rgba(255,188,86,.26) 0%, rgba(255,166,60,.11) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 74% at 64% 0%, rgba(255,188,86,.25) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 72% at 79% 0%, rgba(255,188,86,.24) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
            'radial-gradient(ellipse 8% 70% at 93% 0%, rgba(255,188,86,.24) 0%, rgba(255,166,60,.10) 43%, transparent 76%)',
          ].join(','),
        }}
      />

      {/* Fog */}
      <div className="absolute z-[4]" style={{
        width: '180%', height: '420px', left: '-40%', bottom: '-160px', opacity: 0.18, filter: 'blur(55px)',
        background: 'radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)',
        animation: 'lobby-fog-move 18s linear infinite',
      }} />
      <div className="absolute z-[4]" style={{
        width: '180%', height: '420px', left: '-40%', bottom: '-240px', opacity: 0.1, transform: 'scale(1.3)',
        background: 'radial-gradient(circle, rgba(255,255,255,.12), transparent 70%)',
        animation: 'lobby-fog-move2 25s linear infinite',
      }} />

      {/* Hanging bulbs */}
      <div className="absolute inset-0 z-[8] pointer-events-none overflow-hidden">
        {positions.map((pos, i) => (
          <div
            key={i}
            className="absolute top-0 flex flex-col items-center"
            style={{ left: pos.left, width: isMobile ? '92px' : '175px', transform: 'translateX(-50%)' }}
          >
            <div
              className="transition-opacity duration-700"
              style={{
                width: isMobile ? '2.5px' : '3px',
                height: pos.rope,
                opacity: i < bulbLevel ? ropeOpacity : 0.07,
                filter: i < bulbLevel ? 'brightness(1) saturate(1)' : 'brightness(.42) saturate(.55)',
                background: 'linear-gradient(90deg, #1c130c 0%, #6b4a2e 38%, #8a6238 50%, #4a3119 65%, #1c130c 100%)',
                borderRadius: '2px',
                maskImage: 'linear-gradient(to bottom, transparent 0, black 24px)',
                WebkitMaskImage: 'linear-gradient(to bottom, transparent 0, black 24px)',
                boxShadow: '0 1px 2px rgba(0,0,0,.42)',
              }}
            />
            <img
              src="/assets/intro/edison-bulb.png"
              alt=""
              className="edison-bulb-img"
              style={{
                width: isMobile ? '92px' : '175px',
                height: isMobile ? '256px' : '430px',
                objectFit: 'contain',
                objectPosition: 'center top',
                marginTop: '-2px',
                opacity: i < bulbLevel ? 1 : 0.64,
                filter: i < bulbLevel
                  ? 'brightness(.92) saturate(1.12) contrast(1.05) drop-shadow(0 4px 5px rgba(255,187,92,.16)) drop-shadow(0 11px 15px rgba(255,145,34,.18)) drop-shadow(0 24px 34px rgba(255,116,18,.12))'
                  : 'brightness(.055) saturate(.2) contrast(1.08)',
                transition: 'filter 1.15s cubic-bezier(.2,.7,.2,1), opacity 1s ease',
                animation: i < bulbLevel ? 'lobby-filament-breath 4s ease-in-out infinite' : 'none',
              }}
            />
          </div>
        ))}
      </div>

      <div className="absolute inset-x-0 bottom-[12%] z-10 text-center px-6">
        <p
          className="text-[16px] sm:text-[20px] tracking-[3.5px] leading-loose font-sans"
          style={{
            color: 'rgba(194,163,105,.85)',
            textShadow: '0 1px 0 rgba(255,224,163,.08), 0 -1px 1px rgba(0,0,0,.78)',
            animation: 'lobby-touch-glow 2.4s ease-in-out infinite',
          }}
        >
          {t.tapToEnter[0]}<br />{t.tapToEnter[1]}
        </p>
      </div>

      <style>{`
        @keyframes lobby-breathe { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.035); } }
        @keyframes lobby-fog-move { 0%, 100% { transform: translateX(-8%); } 50% { transform: translateX(8%); } }
        @keyframes lobby-fog-move2 { 0% { transform: translateX(10%) scale(1.3); } 50% { transform: translateX(-10%) scale(1.3); } 100% { transform: translateX(10%) scale(1.3); } }
        @keyframes lobby-filament-breath {
          0%, 100% { filter: brightness(1.01) saturate(1.14) contrast(1.06) drop-shadow(0 5px 5px rgba(255,187,92,.21)) drop-shadow(0 13px 16px rgba(255,145,34,.24)) drop-shadow(0 27px 38px rgba(255,116,18,.17)); }
          50% { filter: brightness(1.07) saturate(1.2) contrast(1.07) drop-shadow(0 5px 6px rgba(255,197,108,.25)) drop-shadow(0 14px 18px rgba(255,151,40,.29)) drop-shadow(0 29px 42px rgba(255,119,19,.20)); }
        }
        @keyframes lobby-touch-glow {
          0%, 100% { opacity: .42; letter-spacing: 3px; text-shadow: 0 1px 0 rgba(255,224,163,.08), 0 -1px 1px rgba(0,0,0,.78); }
          50% { opacity: 1; letter-spacing: 6px; text-shadow: 0 0 12px rgba(255,220,120,.7), 0 0 25px rgba(255,200,90,.5); }
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
      <div
        role="button"
        tabIndex={0}
        onClick={onToggle}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle() }}
        className="w-full min-h-[72px] px-4 sm:px-5 py-3 flex items-center justify-between gap-3
                   text-left active:bg-white/5 transition-colors cursor-pointer"
      >
        <span className="min-w-0">
          <span className="block text-[clamp(16px,4.2vw,21px)] text-[#eee4d2] leading-snug truncate">
            {label}
          </span>
          <span className="block text-[11px] text-[#999] mt-0.5 font-sans">{t.itemCount(category.items.length)}</span>
        </span>
        <span className="flex items-center gap-1 shrink-0">
          {isOpen && (
            <button
              type="button"
              onClick={(e) => { e.stopPropagation(); onToggle() }}
              aria-label={t.close}
              className="p-1.5 rounded-full text-[#d8b574]/70 hover:text-[#d8b574] hover:bg-white/5 transition-colors"
            >
              <X className="w-4 h-4" strokeWidth={2} />
            </button>
          )}
          <ChevronDown
            className={`w-5 h-5 text-[#d8b574] transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
            strokeWidth={1.75}
          />
        </span>
      </div>

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
          <div className="w-full max-h-[45vh] rounded-t-[26px] overflow-hidden bg-[#0c0f0d] flex items-center justify-center">
            <img
              src={product.image_url}
              alt={productField(product, 'name')}
              className="w-full max-h-[45vh] object-contain"
            />
          </div>
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
