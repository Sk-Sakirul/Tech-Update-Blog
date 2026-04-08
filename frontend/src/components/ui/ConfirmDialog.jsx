// Minimal confirm dialog using <dialog> element
import { useEffect, useRef } from 'react'
import Spinner from './Spinner'

export default function ConfirmDialog({ open, title, message, onConfirm, onCancel, loading }) {
  const ref = useRef(null)

  useEffect(() => {
    if (open) ref.current?.showModal()
    else ref.current?.close()
  }, [open])

  return (
    <dialog
      ref={ref}
      className="rounded-2xl border p-0 shadow-lg backdrop:bg-black/40 backdrop:backdrop-blur-sm"
      style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', maxWidth: 420, width: '90vw' }}
      onCancel={onCancel}
    >
      <div className="p-6">
        <h3 className="font-serif text-lg font-semibold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-3">{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button className="btn btn-secondary btn-sm" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button className="btn btn-danger btn-sm" onClick={onConfirm} disabled={loading}>
            {loading ? <Spinner size="sm" /> : 'Delete'}
          </button>
        </div>
      </div>
    </dialog>
  )
}
