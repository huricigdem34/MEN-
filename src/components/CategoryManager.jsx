import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, GripVertical, Loader2, Check, X } from 'lucide-react'
import {
  DndContext, closestCenter, PointerSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import {
  SortableContext, verticalListSortingStrategy, useSortable, arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { supabase } from '../lib/supabase'
import ConfirmModal from './ConfirmModal'

const GROUP_SUGGESTIONS = ['Mezeler & Aperatifler', 'Ana Yemekler', 'İçecekler']

export default function CategoryManager({ onCategoriesChanged }) {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [newName, setNewName] = useState('')
  const [adding, setAdding] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [editingName, setEditingName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleteBlockedCount, setDeleteBlockedCount] = useState(null)
  const [error, setError] = useState('')

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  useEffect(() => {
    fetchCategories()
  }, [])

  async function fetchCategories() {
    setLoading(true)
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('sort_order', { ascending: true })
    if (!error) setCategories(data)
    setLoading(false)
  }

  async function notifyParent() {
    await fetchCategories()
    onCategoriesChanged?.()
  }

  async function handleAdd() {
    const trimmed = newName.trim()
    if (!trimmed) return
    setAdding(true)
    setError('')
    const nextSort = categories.length ? Math.max(...categories.map((c) => c.sort_order)) + 1 : 0
    const { error } = await supabase.from('categories').insert({ name: trimmed, sort_order: nextSort })
    setAdding(false)
    if (error) {
      setError('Bu isimde bir kategori zaten var olabilir.')
      return
    }
    setNewName('')
    notifyParent()
  }

  function startEdit(cat) {
    setEditingId(cat.id)
    setEditingName(cat.name)
  }

  async function saveEdit(cat) {
    const trimmed = editingName.trim()
    if (!trimmed || trimmed === cat.name) {
      setEditingId(null)
      return
    }
    await supabase.from('categories').update({ name: trimmed }).eq('id', cat.id)
    const { data: items } = await supabase.from('menu_items').select('*').eq('category', cat.name)
    for (const item of items || []) {
      await supabase.from('menu_items').update({ category: trimmed }).eq('id', item.id)
    }
    setEditingId(null)
    notifyParent()
  }

  async function updateGroup(cat, groupName) {
    await supabase.from('categories').update({ group_name: groupName || null }).eq('id', cat.id)
    notifyParent()
  }

  async function updateNameEn(cat, nameEn) {
    await supabase.from('categories').update({ name_en: nameEn || null }).eq('id', cat.id)
    notifyParent()
  }

  async function requestDelete(cat) {
    const { data: items } = await supabase.from('menu_items').select('*').eq('category', cat.name)
    setDeleteBlockedCount(items ? items.length : 0)
    setDeleteTarget(cat)
  }

  async function confirmDelete() {
    await supabase.from('categories').delete().eq('id', deleteTarget.id)
    setDeleteTarget(null)
    notifyParent()
  }

  async function handleDragEnd(event) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = categories.findIndex((c) => c.id === active.id)
    const newIndex = categories.findIndex((c) => c.id === over.id)
    const reordered = arrayMove(categories, oldIndex, newIndex)
    setCategories(reordered) // optimistic UI update, feels instant

    // Persist new sort_order for every row that actually moved position
    await Promise.all(
      reordered.map((cat, i) =>
        cat.sort_order !== i ? supabase.from('categories').update({ sort_order: i }).eq('id', cat.id) : null
      )
    )
    notifyParent()
  }

  return (
    <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl overflow-hidden">
      <div className="p-5 border-b border-neutral-800">
        <div className="flex gap-2">
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') handleAdd() }}
            placeholder="Yeni kategori adı..."
            className="flex-1 bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-2.5 text-sm
                       text-white placeholder-neutral-600
                       focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          />
          <button
            onClick={handleAdd}
            disabled={adding || !newName.trim()}
            className="flex items-center gap-1.5 bg-amber-500 hover:bg-amber-400 disabled:opacity-40
                       text-neutral-950 font-medium text-sm px-4 py-2.5 rounded-xl transition-colors"
          >
            {adding ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" strokeWidth={2} />}
            Ekle
          </button>
        </div>
        {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
        <p className="text-xs text-neutral-600 mt-2.5">
          Sürükleyerek sırasını değiştir. Her kategoriye bir "grup" atayabilirsin — bu grup, Menü Ürünleri sayfasındaki sol filtre listesinde kullanılır.
        </p>
      </div>

      {loading ? (
        <div className="py-16 flex justify-center">
          <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
        </div>
      ) : (
        <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={categories.map((c) => c.id)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y divide-neutral-800/60">
              {categories.map((cat) => (
                <SortableCategoryRow
                  key={cat.id}
                  cat={cat}
                  isEditing={editingId === cat.id}
                  editingName={editingName}
                  setEditingName={setEditingName}
                  onStartEdit={() => startEdit(cat)}
                  onSaveEdit={() => saveEdit(cat)}
                  onCancelEdit={() => setEditingId(null)}
                  onDelete={() => requestDelete(cat)}
                  onGroupChange={(g) => updateGroup(cat, g)}
                  onNameEnChange={(n) => updateNameEn(cat, n)}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}

      <ConfirmModal
        open={Boolean(deleteTarget)}
        title={deleteBlockedCount > 0 ? 'Bu kategori silinemez' : 'Kategoriyi sil?'}
        message={
          deleteBlockedCount > 0
            ? `"${deleteTarget?.name}" kategorisinde ${deleteBlockedCount} ürün var. Önce bu ürünleri başka bir kategoriye taşı ya da sil, sonra tekrar dene.`
            : `"${deleteTarget?.name}" kalıcı olarak silinecek.`
        }
        onConfirm={deleteBlockedCount > 0 ? () => setDeleteTarget(null) : confirmDelete}
        onCancel={() => setDeleteTarget(null)}
        confirmLabel={deleteBlockedCount > 0 ? 'Anladım' : 'Sil'}
        hideCancel={deleteBlockedCount > 0}
        danger={deleteBlockedCount === 0}
      />
    </div>
  )
}

function SortableCategoryRow({ cat, isEditing, editingName, setEditingName, onStartEdit, onSaveEdit, onCancelEdit, onDelete, onGroupChange, onNameEnChange }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: cat.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <li ref={setNodeRef} style={style} className="flex items-center gap-3 px-5 py-3.5 bg-neutral-900/40">
      <button
        {...attributes}
        {...listeners}
        className="text-neutral-600 hover:text-amber-500 cursor-grab active:cursor-grabbing shrink-0 touch-none"
      >
        <GripVertical className="w-4 h-4" />
      </button>

      {isEditing ? (
        <>
          <input
            autoFocus
            type="text"
            value={editingName}
            onChange={(e) => setEditingName(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') onSaveEdit() }}
            className="flex-1 bg-neutral-950/80 border border-amber-500/40 rounded-lg px-3 py-1.5 text-sm text-white
                       focus:outline-none"
          />
          <button onClick={onSaveEdit} className="p-1.5 text-emerald-400 hover:bg-neutral-800 rounded-lg">
            <Check className="w-4 h-4" />
          </button>
          <button onClick={onCancelEdit} className="p-1.5 text-neutral-500 hover:bg-neutral-800 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </>
      ) : (
        <>
          <span className="flex-1 text-sm text-neutral-200 min-w-0 truncate">{cat.name}</span>

          <input
            type="text"
            defaultValue={cat.name_en || ''}
            onBlur={(e) => { if (e.target.value.trim() !== (cat.name_en || '')) onNameEnChange(e.target.value.trim()) }}
            placeholder="EN adı yok"
            className="w-32 shrink-0 bg-neutral-950/60 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs
                       text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500/40"
          />

          <input
            type="text"
            list="group-suggestions"
            defaultValue={cat.group_name || ''}
            onBlur={(e) => { if (e.target.value.trim() !== (cat.group_name || '')) onGroupChange(e.target.value.trim()) }}
            placeholder="Grup yok"
            className="w-40 shrink-0 bg-neutral-950/60 border border-neutral-800 rounded-lg px-2.5 py-1.5 text-xs
                       text-neutral-300 placeholder-neutral-600 focus:outline-none focus:border-amber-500/40"
          />

          <button
            onClick={onStartEdit}
            className="p-2 rounded-lg text-neutral-500 hover:text-amber-500 hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
          <button
            onClick={onDelete}
            className="p-2 rounded-lg text-neutral-500 hover:text-red-400 hover:bg-neutral-800 transition-colors shrink-0"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
          </button>
        </>
      )}

      <datalist id="group-suggestions">
        {GROUP_SUGGESTIONS.map((g) => <option key={g} value={g} />)}
      </datalist>
    </li>
  )
}
