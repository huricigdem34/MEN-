import { LogOut, UtensilsCrossed, Tag, Trash2, Settings } from 'lucide-react'
import { signOut } from '../lib/auth'
import { useNavigate } from 'react-router-dom'

const NAV_ITEMS = [
  { key: 'items', label: 'Menü Ürünleri', icon: UtensilsCrossed },
  { key: 'categories', label: 'Kategoriler', icon: Tag },
  { key: 'trash', label: 'Çöp Kutusu', icon: Trash2 },
  { key: 'settings', label: 'Ayarlar', icon: Settings },
]

export default function Sidebar({ activeView, onChangeView }) {
  const navigate = useNavigate()

  async function handleLogout() {
    await signOut()
    navigate('/sistem/login')
  }

  return (
    <aside className="w-64 min-h-screen bg-neutral-950 border-r border-neutral-900 flex flex-col fixed left-0 top-0">
      <div className="px-6 py-6 border-b border-neutral-900">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="The Lobby" className="w-11 h-11 object-contain shrink-0" />
          <div>
            <p className="text-neutral-100 font-light tracking-wide text-sm">Menü Yönetimi</p>
            <p className="text-neutral-600 text-xs">Yönetici Paneli</p>
          </div>
        </div>
      </div>

      <nav className="flex-1 px-4 py-6 space-y-1">
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => onChangeView?.(key)}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-medium tracking-wide text-left transition-colors
              ${activeView === key ? 'bg-neutral-900/60 text-amber-500' : 'text-neutral-500 hover:text-neutral-300 hover:bg-neutral-900/40'}`}
          >
            <Icon className="w-4 h-4" strokeWidth={1.5} />
            {label}
          </button>
        ))}
      </nav>

      <div className="px-4 py-6 border-t border-neutral-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-neutral-500
                     hover:text-neutral-200 hover:bg-neutral-900/60 transition-all duration-200 text-sm"
        >
          <LogOut className="w-4 h-4" strokeWidth={1.5} />
          Çıkış Yap
        </button>
      </div>
    </aside>
  )
}
