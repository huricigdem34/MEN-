import { UtensilsCrossed } from 'lucide-react'

export default function EmptyState({ message = 'Henüz ürün yok' }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-14 h-14 rounded-full border border-neutral-800 flex items-center justify-center mb-4">
        <UtensilsCrossed className="w-5 h-5 text-neutral-700" strokeWidth={1.5} />
      </div>
      <p className="text-neutral-500 text-sm">{message}</p>
    </div>
  )
}
