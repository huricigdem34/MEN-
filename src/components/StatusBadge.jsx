export default function StatusBadge({ isAvailable }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium tracking-wide
        ${isAvailable
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'bg-neutral-800 text-neutral-500 border border-neutral-700'}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-emerald-400' : 'bg-neutral-600'}`} />
      {isAvailable ? 'Satışta' : 'Gizli'}
    </span>
  )
}
