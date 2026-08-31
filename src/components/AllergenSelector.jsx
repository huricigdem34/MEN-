import { X, Plus } from 'lucide-react'
import { useState } from 'react'

const COMMON_ALLERGENS = [
  'Gluten', 'Süt ve süt ürünleri', 'Yumurta', 'Balık', 'Kabuklu deniz ürünleri',
  'Yer fıstığı', 'Susam', 'Soya', 'Hardal', 'Kereviz', 'Sülfit', 'Sert kabuklu meyveler'
]

export default function AllergenSelector({ value = [], onChange }) {
  const [customInput, setCustomInput] = useState('')

  function toggle(allergen) {
    if (value.includes(allergen)) {
      onChange(value.filter((a) => a !== allergen))
    } else {
      onChange([...value, allergen])
    }
  }

  function addCustom() {
    const trimmed = customInput.trim()
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed])
      setCustomInput('')
    }
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2 mb-3">
        {COMMON_ALLERGENS.map((allergen) => (
          <button
            key={allergen}
            type="button"
            onClick={() => toggle(allergen)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all duration-150
              ${value.includes(allergen)
                ? 'bg-amber-500/10 text-amber-500 border-amber-500/40'
                : 'bg-transparent text-neutral-500 border-neutral-800 hover:border-neutral-700'}`}
          >
            {allergen}
          </button>
        ))}
      </div>

      <div className="flex gap-2">
        <input
          type="text"
          value={customInput}
          onChange={(e) => setCustomInput(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addCustom() } }}
          placeholder="Başka bir alerjen ekle..."
          className="flex-1 bg-neutral-950/80 border border-neutral-800 rounded-lg px-3 py-2 text-sm
                     text-neutral-200 placeholder-neutral-600 focus:outline-none focus:border-amber-500/40"
        />
        <button
          type="button"
          onClick={addCustom}
          className="px-3 rounded-lg border border-neutral-800 text-neutral-400 hover:text-amber-500 hover:border-amber-500/40 transition-colors"
        >
          <Plus className="w-4 h-4" strokeWidth={1.5} />
        </button>
      </div>

      {value.filter((v) => !COMMON_ALLERGENS.includes(v)).length > 0 && (
        <div className="flex flex-wrap gap-2 mt-3">
          {value.filter((v) => !COMMON_ALLERGENS.includes(v)).map((allergen) => (
            <span
              key={allergen}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs
                         bg-neutral-800 text-neutral-300"
            >
              {allergen}
              <button type="button" onClick={() => toggle(allergen)}>
                <X className="w-3 h-3" strokeWidth={2} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  )
}
