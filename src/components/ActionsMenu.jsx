import { useState, useRef, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { MoreVertical, Pencil, Trash2 } from 'lucide-react'

export default function ActionsMenu({ onEdit, onDelete }) {
  const [open, setOpen] = useState(false)
  const [coords, setCoords] = useState({ top: 0, left: 0 })
  const buttonRef = useRef(null)
  const menuRef = useRef(null)

  function computeCoords() {
    const rect = buttonRef.current.getBoundingClientRect()
    const menuWidth = 160 // w-40
    setCoords({
      top: rect.bottom + 4,
      left: Math.min(rect.right - menuWidth, window.innerWidth - menuWidth - 8),
    })
  }

  function openMenu() {
    computeCoords()
    setOpen(true)
  }

  useEffect(() => {
    if (!open) return

    function handleClickOutside(e) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target) &&
        menuRef.current && !menuRef.current.contains(e.target)
      ) {
        setOpen(false)
      }
    }
    function handleReposition() {
      setOpen(false)
    }

    document.addEventListener('mousedown', handleClickOutside)
    // Delay attaching the scroll listener by a tick — opening the menu (and the
    // click that triggered it) can itself cause the browser to scroll the
    // button into view, which would otherwise close the menu instantly.
    const attachTimer = setTimeout(() => {
      computeCoords() // correct for any scroll-into-view that happened right after opening
      window.addEventListener('scroll', handleReposition, true)
      window.addEventListener('resize', handleReposition)
    }, 150)

    return () => {
      clearTimeout(attachTimer)
      document.removeEventListener('mousedown', handleClickOutside)
      window.removeEventListener('scroll', handleReposition, true)
      window.removeEventListener('resize', handleReposition)
    }
  }, [open])

  return (
    <>
      <button
        ref={buttonRef}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className="p-2 rounded-lg text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800
                   transition-colors md:opacity-0 md:group-hover:opacity-100 opacity-100"
      >
        <MoreVertical className="w-4 h-4" strokeWidth={1.5} />
      </button>

      {open && createPortal(
        <div
          ref={menuRef}
          style={{ position: 'fixed', top: coords.top, left: coords.left }}
          className="w-40 bg-neutral-900 border border-neutral-800
                     rounded-xl shadow-2xl overflow-hidden z-[100] animate-in fade-in zoom-in-95 duration-150"
        >
          <button
            onClick={() => { setOpen(false); onEdit() }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-300
                       hover:bg-neutral-800 hover:text-amber-500 transition-colors"
          >
            <Pencil className="w-3.5 h-3.5" strokeWidth={1.5} />
            Düzenle
          </button>
          <button
            onClick={() => { setOpen(false); onDelete() }}
            className="w-full flex items-center gap-2.5 px-4 py-3 text-sm text-neutral-300
                       hover:bg-neutral-800 hover:text-red-400 transition-colors border-t border-neutral-800"
          >
            <Trash2 className="w-3.5 h-3.5" strokeWidth={1.5} />
            Sil
          </button>
        </div>,
        document.body
      )}
    </>
  )
}
