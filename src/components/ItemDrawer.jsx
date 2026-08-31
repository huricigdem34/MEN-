import { useState, useEffect } from 'react'
import { X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'
import AllergenSelector from './AllergenSelector'
import ImageUpload from './ImageUpload'

const EMPTY_ITEM = {
  name: '', description: '', category: '', price: '',
  grammage: '', allergens: [], image_url: '', is_available: true, is_featured: false,
  calories: '', ingredients: '', chef_note: '',
  name_en: '', description_en: '', ingredients_en: '', chef_note_en: '',
}

export default function ItemDrawer({ open, item, categories, onClose, onSaved }) {
  const [form, setForm] = useState(EMPTY_ITEM)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const isEditing = Boolean(item?.id)

  useEffect(() => {
    if (open) {
      setForm(item ? { ...EMPTY_ITEM, ...item, price: String(item.price) } : EMPTY_ITEM)
      setErrors({})
    }
  }, [open, item])

  function update(field, val) {
    setForm((f) => ({ ...f, [field]: val }))
    if (errors[field]) setErrors((e) => ({ ...e, [field]: null }))
  }

  function validate() {
    const errs = {}
    if (!form.name.trim()) errs.name = 'Ürün adı zorunlu'
    if (!form.category.trim()) errs.category = 'Kategori zorunlu'
    if (!form.price || isNaN(form.price) || Number(form.price) < 0) errs.price = 'Geçerli bir fiyat gir'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)

    const payload = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      price: Number(form.price),
      grammage: form.grammage.trim(),
      allergens: form.allergens,
      image_url: form.image_url,
      is_available: form.is_available,
      is_featured: form.is_featured,
      calories: form.calories.trim(),
      ingredients: form.ingredients.trim(),
      chef_note: form.chef_note.trim(),
      name_en: form.name_en.trim(),
      description_en: form.description_en.trim(),
      ingredients_en: form.ingredients_en.trim(),
      chef_note_en: form.chef_note_en.trim(),
    }

    const { error } = isEditing
      ? await supabase.from('menu_items').update(payload).eq('id', item.id)
      : await supabase.from('menu_items').insert(payload)

    setSaving(false)

    if (error) {
      setErrors({ submit: 'Kaydedilirken bir sorun oluştu. Tekrar dene.' })
      return
    }

    onSaved()
    onClose()
  }

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-opacity duration-300
          ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />

      <div
        className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-neutral-950 border-l border-neutral-900
          z-50 flex flex-col transition-transform duration-300 ease-out
          ${open ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-neutral-900 shrink-0">
          <div>
            <h2 className="text-neutral-100 font-light text-lg tracking-wide">
              {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
            </h2>
            <p className="text-neutral-600 text-xs mt-0.5">
              {isEditing ? 'Aşağıdaki bilgileri güncelle' : 'Yeni menü ürününün bilgilerini gir'}
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-lg text-neutral-500 hover:text-neutral-200 hover:bg-neutral-900 transition-colors">
            <X className="w-5 h-5" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Ürün Fotoğrafı</label>
            <ImageUpload value={form.image_url} onChange={(url) => update('image_url', url)} label="Ürün fotoğrafı" />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">
              Ürün Adı <span className="text-amber-500">*</span>
            </label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="ör. Arnavut Ciğeri"
              className={`w-full bg-neutral-900/60 border rounded-xl px-4 py-3 text-sm text-neutral-100
                         placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all
                         ${errors.name ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:border-amber-500/50 focus:ring-amber-500/30'}`}
            />
            {errors.name && <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Açıklama</label>
            <textarea
              value={form.description}
              onChange={(e) => update('description', e.target.value)}
              placeholder="Ürünün kısa ve şık açıklaması..."
              rows={3}
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                         text-neutral-100 placeholder-neutral-600 resize-none
                         focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">
                Kategori <span className="text-amber-500">*</span>
              </label>
              <select
                value={form.category}
                onChange={(e) => update('category', e.target.value)}
                className={`w-full bg-neutral-900/60 border rounded-xl px-4 py-3 text-sm text-neutral-100
                           focus:outline-none focus:ring-1 transition-all appearance-none
                           ${errors.category ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:border-amber-500/50 focus:ring-amber-500/30'}`}
              >
                <option value="" disabled>Kategori seç...</option>
                {categories.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              {categories.length === 0 && (
                <p className="text-xs text-neutral-600 mt-1.5">Henüz kategori yok — önce "Kategoriler" bölümünden bir tane ekle.</p>
              )}
              {errors.category && <p className="text-xs text-red-400 mt-1.5">{errors.category}</p>}
            </div>

            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">
                Fiyat (₺) <span className="text-amber-500">*</span>
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.price}
                onChange={(e) => update('price', e.target.value)}
                placeholder="0.00"
                className={`w-full bg-neutral-900/60 border rounded-xl px-4 py-3 text-sm text-neutral-100
                           placeholder-neutral-600 focus:outline-none focus:ring-1 transition-all
                           ${errors.price ? 'border-red-500/50 focus:ring-red-500/30' : 'border-neutral-800 focus:border-amber-500/50 focus:ring-amber-500/30'}`}
              />
              {errors.price && <p className="text-xs text-red-400 mt-1.5">{errors.price}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Gramaj</label>
              <input
                type="text"
                value={form.grammage}
                onChange={(e) => update('grammage', e.target.value)}
                placeholder='ör. "250 g"'
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                           text-neutral-100 placeholder-neutral-600
                           focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
            <div>
              <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Kalori</label>
              <input
                type="text"
                value={form.calories}
                onChange={(e) => update('calories', e.target.value)}
                placeholder='ör. "250 kcal"'
                className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                           text-neutral-100 placeholder-neutral-600
                           focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">İçindekiler</label>
            <textarea
              value={form.ingredients}
              onChange={(e) => update('ingredients', e.target.value)}
              placeholder="Virgülle ayırarak yaz: Süzme yoğurt, sarımsak, zeytinyağı, tuz"
              rows={2}
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                         text-neutral-100 placeholder-neutral-600 resize-none
                         focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
            <p className="text-xs text-neutral-600 mt-1.5">Halka menüde her malzeme küçük bir ikonla gösterilir.</p>
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Şefin Notu</label>
            <textarea
              value={form.chef_note}
              onChange={(e) => update('chef_note', e.target.value)}
              placeholder="İsteğe bağlı, şefin ürüne dair kısa notu"
              rows={2}
              className="w-full bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                         text-neutral-100 placeholder-neutral-600 resize-none
                         focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">Alerjenler</label>
            <AllergenSelector value={form.allergens} onChange={(v) => update('allergens', v)} />
          </div>

          <div className="border-t border-neutral-800 pt-5">
            <p className="text-xs font-medium text-amber-500/80 mb-3.5 tracking-wide uppercase">
              İngilizce Çeviri (isteğe bağlı)
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Ürün Adı (EN)</label>
                <input
                  type="text"
                  value={form.name_en}
                  onChange={(e) => update('name_en', e.target.value)}
                  placeholder="Boş bırakılırsa Türkçe isim gösterilir"
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm
                             text-neutral-100 placeholder-neutral-600
                             focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Açıklama (EN)</label>
                <textarea
                  value={form.description_en}
                  onChange={(e) => update('description_en', e.target.value)}
                  rows={2}
                  placeholder="Boş bırakılırsa Türkçe açıklama gösterilir"
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm
                             text-neutral-100 placeholder-neutral-600 resize-none
                             focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">İçindekiler (EN)</label>
                <input
                  type="text"
                  value={form.ingredients_en}
                  onChange={(e) => update('ingredients_en', e.target.value)}
                  placeholder="Virgülle ayır: Yogurt, garlic, olive oil"
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm
                             text-neutral-100 placeholder-neutral-600
                             focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
              <div>
                <label className="block text-xs text-neutral-500 mb-1.5">Şefin Notu (EN)</label>
                <input
                  type="text"
                  value={form.chef_note_en}
                  onChange={(e) => update('chef_note_en', e.target.value)}
                  placeholder="İsteğe bağlı"
                  className="w-full bg-neutral-900/60 border border-neutral-800 rounded-lg px-3.5 py-2.5 text-sm
                             text-neutral-100 placeholder-neutral-600
                             focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3.5">
            <div>
              <p className="text-sm text-neutral-200 font-medium">Menüde satışta</p>
              <p className="text-xs text-neutral-600 mt-0.5">Gizli ürünler müşterilere gösterilmez</p>
            </div>
            <button
              type="button"
              onClick={() => update('is_available', !form.is_available)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                ${form.is_available ? 'bg-amber-500' : 'bg-neutral-700'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${form.is_available ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          <div className="flex items-center justify-between bg-neutral-900/60 border border-neutral-800 rounded-xl px-4 py-3.5">
            <div>
              <p className="text-sm text-neutral-200 font-medium">Popüler ürün</p>
              <p className="text-xs text-neutral-600 mt-0.5">Halka açık menüde "Popüler Ürünler" bölümünde öne çıkar</p>
            </div>
            <button
              type="button"
              onClick={() => update('is_featured', !form.is_featured)}
              className={`relative w-11 h-6 rounded-full transition-colors duration-200 shrink-0
                ${form.is_featured ? 'bg-amber-500' : 'bg-neutral-700'}`}
            >
              <span
                className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform duration-200
                  ${form.is_featured ? 'translate-x-5' : 'translate-x-0'}`}
              />
            </button>
          </div>

          {errors.submit && (
            <div className="text-sm text-red-400 bg-red-950/30 border border-red-900/50 rounded-lg px-4 py-2.5">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="flex gap-3 px-6 py-5 border-t border-neutral-900 shrink-0">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl text-sm font-medium text-neutral-400
                       border border-neutral-800 hover:bg-neutral-900 transition-colors"
          >
            Vazgeç
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex-1 py-3 rounded-xl text-sm font-medium bg-amber-500 text-neutral-950
                       hover:bg-amber-400 disabled:opacity-50 transition-colors flex items-center justify-center gap-2"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : isEditing ? 'Değişiklikleri Kaydet' : 'Ürünü Ekle'}
          </button>
        </div>
      </div>
    </>
  )
}
