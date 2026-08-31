import { useEffect, useState, useMemo } from 'react'
import { Plus, Search, ImageOff, Star, Info, Mail, GripVertical } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../lib/supabase'
import Sidebar from '../components/Sidebar'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'
import ActionsMenu from '../components/ActionsMenu'
import ConfirmModal from '../components/ConfirmModal'
import ItemDrawer from '../components/ItemDrawer'
import CategoryManager from '../components/CategoryManager'
import TrashView from '../components/TrashView'
import SettingsView from '../components/SettingsView'

const SUPPORT_EMAIL = 'faridgasimzade2@gmail.com'

export default function Dashboard() {
  const [view, setView] = useState('items') // 'items' | 'categories' | 'trash' | 'settings'
  const [items, setItems] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')

  const [drawerOpen, setDrawerOpen] = useState(false)
  const [editingItem, setEditingItem] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    fetchItems()
    fetchCategories()
  }, [])

  async function fetchItems() {
    setLoading(true)
    const { data, error } = await supabase
      .from('menu_items')
      .select('*')
      .is('deleted_at', null)
      .order('category', { ascending: true })
      .order('sort_order', { ascending: true })

    if (!error) setItems(data)
    setLoading(false)
  }

  async function fetchCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setCategories(data)
  }

  async function confirmDelete() {
    setDeleting(true)
    const { error } = await supabase
      .from('menu_items')
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', deleteTarget.id)
    setDeleting(false)
    if (!error) {
      setItems((prev) => prev.filter((i) => i.id !== deleteTarget.id))
      setDeleteTarget(null)
    }
  }

  async function toggleAvailability(id, current) {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_available: !current })
      .eq('id', id)
    if (!error) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_available: !current } : i)))
    }
  }

  async function toggleFeatured(id, current) {
    const { error } = await supabase
      .from('menu_items')
      .update({ is_featured: !current })
      .eq('id', id)
    if (!error) {
      setItems((prev) => prev.map((i) => (i.id === id ? { ...i, is_featured: !current } : i)))
    }
  }

  const categoryNames = useMemo(() => categories.map((c) => c.name), [categories])

  const itemCountByCategory = useMemo(() => {
    const map = {}
    for (const item of items) map[item.category] = (map[item.category] || 0) + 1
    return map
  }, [items])

  const groupedCategories = useMemo(() => {
    const groups = {}
    const ungrouped = []
    for (const cat of categories) {
      if (cat.group_name) {
        if (!groups[cat.group_name]) groups[cat.group_name] = []
        groups[cat.group_name].push(cat)
      } else {
        ungrouped.push(cat)
      }
    }
    const result = Object.entries(groups).map(([groupName, cats]) => ({ groupName, cats }))
    if (ungrouped.length) result.push({ groupName: 'Diğer', cats: ungrouped })
    return result
  }, [categories])

  const stats = useMemo(() => ({
    total: items.length,
    available: items.filter((i) => i.is_available).length,
    hidden: items.filter((i) => !i.is_available).length,
    featured: items.filter((i) => i.is_featured).length,
  }), [items])

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesSearch = item.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = categoryFilter === 'all' || item.category === categoryFilter
      return matchesSearch && matchesCategory
    })
  }, [items, search, categoryFilter])

  // Reordering only makes sense within one specific category, with no search filter muddying the list
  const canReorder = categoryFilter !== 'all' && search.trim() === ''

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = filteredItems.findIndex((i) => i.id === active.id)
    const newIndex = filteredItems.findIndex((i) => i.id === over.id)
    const reordered = arrayMove(filteredItems, oldIndex, newIndex)

    // Optimistic: splice the reordered category items back into the full items array
    setItems((prev) => {
      const others = prev.filter((i) => i.category !== categoryFilter)
      return [...others, ...reordered]
    })

    await Promise.all(
      reordered.map((item, i) =>
        item.sort_order !== i ? supabase.from('menu_items').update({ sort_order: i }).eq('id', item.id) : null
      )
    )
  }

  return (
    <div className="min-h-screen bg-neutral-950">
      <Sidebar activeView={view} onChangeView={setView} />

      {view === 'categories' ? (
        <main className="ml-64 px-10 py-10">
          <div className="mb-8">
            <h1 className="text-2xl font-light text-neutral-100 tracking-wide">Kategoriler</h1>
            <p className="text-neutral-500 text-sm mt-1">
              Menüdeki kategorileri ekle, yeniden adlandır, sırasını sürükleyerek değiştir veya sil.
            </p>
          </div>
          <CategoryManager onCategoriesChanged={() => { fetchCategories(); fetchItems() }} />
        </main>
      ) : view === 'trash' ? (
        <main className="ml-64 px-10 py-10">
          <TrashView onChanged={fetchItems} />
        </main>
      ) : view === 'settings' ? (
        <main className="ml-64 px-10 py-10">
          <SettingsView />
        </main>
      ) : (
        <main className="ml-64 flex">
          {/* Grouped category filter sidebar */}
          <aside className="w-60 shrink-0 border-r border-neutral-900 min-h-screen py-8 px-4 sticky top-0 self-start max-h-screen overflow-y-auto">
            <button
              onClick={() => setCategoryFilter('all')}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium mb-4 transition-colors
                ${categoryFilter === 'all' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' : 'text-neutral-400 hover:bg-neutral-900/60'}`}
            >
              Tüm Kategoriler
            </button>

            {groupedCategories.map(({ groupName, cats }) => (
              <div key={groupName} className="mb-5">
                <p className="text-[10px] font-semibold text-neutral-600 uppercase tracking-wider px-3 mb-1.5">{groupName}</p>
                <div className="space-y-0.5">
                  {cats.map((cat) => (
                    <button
                      key={cat.id}
                      onClick={() => setCategoryFilter(cat.name)}
                      className={`w-full flex items-center justify-between gap-2 text-left px-3 py-2 rounded-lg text-sm transition-colors
                        ${categoryFilter === cat.name ? 'bg-amber-500/10 text-amber-500' : 'text-neutral-400 hover:bg-neutral-900/60 hover:text-neutral-200'}`}
                    >
                      <span className="truncate">{cat.name}</span>
                      <span className="text-[10px] text-neutral-600 shrink-0">{itemCountByCategory[cat.name] || 0}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 px-8 py-10 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-2xl font-light text-neutral-100 tracking-wide">Menü Yönetimi</h1>
                <p className="text-neutral-500 text-sm mt-1">Toplam {items.length} ürün</p>
              </div>
              <button
                onClick={() => { setEditingItem(null); setDrawerOpen(true) }}
                className="flex items-center gap-2 bg-amber-500 hover:bg-amber-400 text-neutral-950
                           font-medium text-sm tracking-wide px-5 py-3 rounded-xl transition-all duration-200"
              >
                <Plus className="w-4 h-4" strokeWidth={2} />
                Ürün Ekle
              </button>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-4 gap-3 mb-6">
              <StatCard label="Toplam Ürün" value={stats.total} />
              <StatCard label="Satışta" value={stats.available} accent="emerald" />
              <StatCard label="Gizli" value={stats.hidden} accent="neutral" />
              <StatCard label="Popüler" value={stats.featured} accent="amber" />
            </div>

            {/* Support info banner */}
            <div className="flex items-start gap-2.5 bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 py-3 mb-6">
              <Info className="w-4 h-4 text-neutral-500 mt-0.5 shrink-0" strokeWidth={1.5} />
              <p className="text-xs text-neutral-500 leading-relaxed">
                Herhangi bir hata ile karşılaşırsanız{' '}
                <a href={`mailto:${SUPPORT_EMAIL}`} className="text-amber-500 hover:underline inline-flex items-center gap-1">
                  <Mail className="w-3 h-3" />{SUPPORT_EMAIL}
                </a>{' '}
                adresi ile iletişime geçebilirsiniz.
              </p>
            </div>

            <div className="relative max-w-sm mb-3">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-600" strokeWidth={1.5} />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Ürün ara..."
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl pl-10 pr-4 py-2.5
                           text-white text-sm placeholder-neutral-600 caret-amber-500
                           focus:outline-none focus:border-amber-500/40 focus:ring-1 focus:ring-amber-500/20
                           transition-all duration-200"
              />
            </div>

            <p className="text-xs text-neutral-600 mb-4">
              {canReorder
                ? 'Ürünleri sürükleyerek sırasını değiştirebilirsin.'
                : 'Ürün sıralamak için sol taraftan tek bir kategori seç (arama kutusu boş olmalı).'}
            </p>

            <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-x-auto">
              {loading ? (
                <div className="py-20 flex justify-center">
                  <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
                </div>
              ) : filteredItems.length === 0 ? (
                <EmptyState message={search ? `Eşleşen ürün yok: "${search}"` : 'Bu kategoride henüz ürün yok'} />
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-neutral-800">
                      <th className="w-8"></th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4 pl-2">
                        Ürün
                      </th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4">
                        Kategori
                      </th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4">
                        Gramaj
                      </th>
                      <th className="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4">
                        Fiyat
                      </th>
                      <th className="text-center text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4">
                        Popüler
                      </th>
                      <th className="text-left text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-4">
                        Durum
                      </th>
                      <th className="text-right text-xs font-medium text-neutral-500 uppercase tracking-wider px-4 py-6 pr-6">
                        İşlemler
                      </th>
                    </tr>
                  </thead>
                  {canReorder ? (
                    <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                      <SortableContext items={filteredItems.map((i) => i.id)} strategy={verticalListSortingStrategy}>
                        <tbody className="divide-y divide-neutral-800/60">
                          {filteredItems.map((item) => (
                            <SortableItemRow
                              key={item.id}
                              item={item}
                              draggable
                              onEdit={() => { setEditingItem(item); setDrawerOpen(true) }}
                              onDelete={() => setDeleteTarget(item)}
                              onToggleAvailability={() => toggleAvailability(item.id, item.is_available)}
                              onToggleFeatured={() => toggleFeatured(item.id, item.is_featured)}
                            />
                          ))}
                        </tbody>
                      </SortableContext>
                    </DndContext>
                  ) : (
                    <tbody className="divide-y divide-neutral-800/60">
                      {filteredItems.map((item) => (
                        <SortableItemRow
                          key={item.id}
                          item={item}
                          draggable={false}
                          onEdit={() => { setEditingItem(item); setDrawerOpen(true) }}
                          onDelete={() => setDeleteTarget(item)}
                          onToggleAvailability={() => toggleAvailability(item.id, item.is_available)}
                          onToggleFeatured={() => toggleFeatured(item.id, item.is_featured)}
                        />
                      ))}
                    </tbody>
                  )}
                </table>
              )}
            </div>
          </div>
        </main>
      )}

      <ItemDrawer
        open={drawerOpen}
        item={editingItem}
        categories={categoryNames}
        onClose={() => setDrawerOpen(false)}
        onSaved={fetchItems}
      />

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title="Bu ürünü kaldır?"
        message={deleteTarget ? `"${deleteTarget.name}" çöp kutusuna taşınacak, 30 gün içinde geri yükleyebilirsin.` : ''}
        confirmLabel="Çöp Kutusuna Taşı"
        onConfirm={confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </div>
  )
}

function SortableItemRow({ item, draggable, onEdit, onDelete, onToggleAvailability, onToggleFeatured }) {
  const sortable = useSortable({ id: item.id, disabled: !draggable })
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = sortable

  const style = draggable
    ? { transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }
    : {}

  return (
    <tr ref={draggable ? setNodeRef : undefined} style={style} className="group hover:bg-neutral-900/60 transition-colors duration-150 bg-neutral-900/40">
      <td className="pl-3">
        {draggable ? (
          <button {...attributes} {...listeners} className="text-neutral-600 hover:text-amber-500 cursor-grab active:cursor-grabbing touch-none">
            <GripVertical className="w-4 h-4" />
          </button>
        ) : (
          <GripVertical className="w-4 h-4 text-neutral-800" />
        )}
      </td>
      <td className="px-4 py-4 pl-2">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-lg bg-neutral-800 overflow-hidden shrink-0 flex items-center justify-center">
            {item.image_url ? (
              <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
            ) : (
              <ImageOff className="w-4 h-4 text-neutral-700" strokeWidth={1.5} />
            )}
          </div>
          <div className="min-w-0">
            <p className="text-neutral-100 text-sm font-medium truncate">{item.name}</p>
            <p className="text-neutral-500 text-xs truncate max-w-xs">{item.description}</p>
          </div>
        </div>
      </td>
      <td className="px-4 py-4">
        <span className="text-neutral-400 text-sm">{item.category}</span>
      </td>
      <td className="px-4 py-4">
        <span className="text-neutral-500 text-sm">{item.grammage || '—'}</span>
      </td>
      <td className="px-4 py-4 text-right">
        <span className="text-amber-500 text-sm font-medium tabular-nums">
          {Number(item.price).toFixed(2)} ₺
        </span>
      </td>
      <td className="px-4 py-4 text-center">
        <button onClick={onToggleFeatured} title={item.is_featured ? 'Popülerden çıkar' : 'Popüler olarak işaretle'} className="inline-flex">
          <Star
            className={`w-4.5 h-4.5 transition-colors ${item.is_featured ? 'fill-amber-500 text-amber-500' : 'text-neutral-700 hover:text-neutral-500'}`}
            strokeWidth={1.5}
          />
        </button>
      </td>
      <td className="px-4 py-4">
        <button onClick={onToggleAvailability}>
          <StatusBadge isAvailable={item.is_available} />
        </button>
      </td>
      <td className="px-4 py-4 pr-6 text-right">
        <ActionsMenu onEdit={onEdit} onDelete={onDelete} />
      </td>
    </tr>
  )
}

function StatCard({ label, value, accent = 'neutral' }) {
  const colors = {
    neutral: 'text-neutral-300',
    emerald: 'text-emerald-400',
    amber: 'text-amber-500',
  }
  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-xl px-4 py-3.5">
      <p className="text-[11px] text-neutral-500 uppercase tracking-wide mb-1">{label}</p>
      <p className={`text-2xl font-light ${colors[accent]}`}>{value}</p>
    </div>
  )
}
