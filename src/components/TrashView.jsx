import { useEffect, useState } from 'react'
import { RotateCcw, Trash2, ImageOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import EmptyState from './EmptyState'
import ConfirmModal from './ConfirmModal'

const RETENTION_DAYS = 30

function daysRemaining(deletedAt) {
  const deleted = new Date(deletedAt).getTime()
  const purgeAt = deleted + RETENTION_DAYS * 24 * 60 * 60 * 1000
  const daysLeft = Math.ceil((purgeAt - Date.now()) / (24 * 60 * 60 * 1000))
  return Math.max(daysLeft, 0)
}

export default function TrashView({ onChanged }) {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [purgeTarget, setPurgeTarget] = useState(null)

  useEffect(() => {
    fetchTrash()
  }, [])

  async function fetchTrash() {
    setLoading(true)
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .order('name', { ascending: true })
    if (!error) setItems((data || []).filter((i) => i.deleted_at))
    setLoading(false)
  }

  async function restore(item) {
    await supabase.from('menu_items').update({ deleted_at: null }).eq('id', item.id)
    setItems((prev) => prev.filter((i) => i.id !== item.id))
    onChanged?.()
  }

  async function confirmPurge() {
    await supabase.from('menu_items').delete().eq('id', purgeTarget.id)
    setItems((prev) => prev.filter((i) => i.id !== purgeTarget.id))
    setPurgeTarget(null)
    onChanged?.()
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-light text-neutral-100 tracking-wide">Çöp Kutusu</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Silinen ürünler burada {RETENTION_DAYS} gün tutulur, sonra otomatik olarak kalıcı silinir.
        </p>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
        {loading ? (
          <div className="py-20 flex justify-center">
            <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
          </div>
        ) : items.length === 0 ? (
          <EmptyState message="Çöp kutusu boş" />
        ) : (
          <ul className="divide-y divide-neutral-800/60">
            {items.map((item) => (
              <li key={item.id} className="flex items-center gap-3 px-5 py-4">
                <div className="w-10 h-10 rounded-lg bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <ImageOff className="w-4 h-4 text-neutral-700" strokeWidth={1.5} />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-200 truncate">{item.name}</p>
                  <p className="text-xs text-neutral-600">{item.category}</p>
                </div>
                <span className="text-xs text-neutral-500 shrink-0">
                  {daysRemaining(item.deleted_at)} gün sonra kalıcı silinir
                </span>
                <button
                  onClick={() => restore(item)}
                  title="Geri Yükle"
                  className="p-2 rounded-lg text-neutral-500 hover:text-emerald-400 hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <RotateCcw className="w-4 h-4" strokeWidth={1.5} />
                </button>
                <button
                  onClick={() => setPurgeTarget(item)}
                  title="Kalıcı Olarak Sil"
                  className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors shrink-0"
                >
                  <Trash2 className="w-4 h-4" strokeWidth={1.5} />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <ConfirmModal
        open={Boolean(purgeTarget)}
        title="Kalıcı olarak sil?"
        message={`"${purgeTarget?.name}" tamamen silinecek, bu işlem geri alınamaz.`}
        confirmLabel="Kalıcı Sil"
        onConfirm={confirmPurge}
        onCancel={() => setPurgeTarget(null)}
      />
    </div>
  )
}
