import { allergenIcons, allergenType, ingredientIcons, ingredientType } from '../lib/menuIcons'

export function AllergenIcon({ label }) {
  const type = allergenType(label)
  return (
    <div className="flex items-center gap-2 text-[11px] text-[#d8c9a9]">
      <span
        className="w-8 h-8 rounded-lg border border-[#d8b574]/25 bg-[#d8b574]/[0.04] grid place-items-center shrink-0
                   [&>svg]:w-[21px] [&>svg]:h-[21px] [&>svg]:fill-none [&>svg]:stroke-[#d8b574] [&>svg]:stroke-[1.7]
                   [&>svg]:[stroke-linecap:round] [&>svg]:[stroke-linejoin:round]"
        dangerouslySetInnerHTML={{ __html: allergenIcons[type] }}
      />
      <span>{label}</span>
    </div>
  )
}

export function IngredientIcon({ label }) {
  const type = ingredientType(label)
  return (
    <div className="flex flex-col items-center text-center gap-1.5 px-2 py-2 rounded-xl
                     bg-gradient-to-b from-[#d8b574]/[0.035] to-transparent">
      <span
        className="w-[52px] h-[52px] grid place-items-center
                   [&>svg]:w-[50px] [&>svg]:h-[50px] [&>svg]:fill-none [&>svg]:stroke-[#d8b574] [&>svg]:stroke-[1.45]
                   [&>svg]:[stroke-linecap:round] [&>svg]:[stroke-linejoin:round]
                   [&>svg]:[filter:drop-shadow(0_0_5px_rgba(216,181,116,.12))]"
        dangerouslySetInnerHTML={{ __html: ingredientIcons[type] }}
      />
      <span className="text-[10.5px] text-[#d8c9a9] max-w-[92px] leading-tight">{label}</span>
    </div>
  )
}
