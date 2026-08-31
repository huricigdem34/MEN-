import { AlertTriangle } from 'lucide-react'

export default function ConfirmModal({ open, title, message, onConfirm, onCancel, loading, confirmLabel = 'Sil', hideCancel = false, danger = true }) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200"
        onClick={onCancel}
      />
      <div className="relative bg-neutral-900 border border-neutral-800 rounded-2xl p-7 max-w-sm w-full
                      shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        <div className={`w-11 h-11 rounded-full flex items-center justify-center mb-4
          ${danger ? 'bg-red-500/10 border border-red-500/20' : 'bg-amber-500/10 border border-amber-500/20'}`}>
          <AlertTriangle className={`w-5 h-5 ${danger ? 'text-red-400' : 'text-amber-400'}`} strokeWidth={1.5} />
        </div>
        <h3 className="text-neutral-100 font-medium text-base mb-2">{title}</h3>
        <p className="text-neutral-500 text-sm leading-relaxed mb-6">{message}</p>
        <div className="flex gap-3">
          {!hideCancel && (
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-xl text-sm font-medium text-neutral-400
                         border border-neutral-800 hover:bg-neutral-800 transition-colors"
            >
              Vazgeç
            </button>
          )}
          <button
            onClick={onConfirm}
            disabled={loading}
            className={`flex-1 py-2.5 rounded-xl text-sm font-medium disabled:opacity-50 transition-colors
              ${danger ? 'bg-red-500/90 text-neutral-950 hover:bg-red-500' : 'bg-amber-500 text-neutral-950 hover:bg-amber-400'}`}
          >
            {loading ? 'Siliniyor...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
