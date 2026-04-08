import { Link } from 'react-router-dom'

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-white/50 pb-8 pt-12">
      <div className="page-container">
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-4 text-center">
          <Link to="/" className="flex items-center gap-3">
            <div
              className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.14em] text-white"
              style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
            >
              TU
            </div>
            <div className="text-left">
              <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-3">Publishing platform</p>
              <p className="text-lg font-semibold tracking-[-0.02em] text-ink">TechUpdate</p>
            </div>
          </Link>

          <p className="max-w-xl text-sm leading-7 text-ink-3">
            A modern blogging platform for thoughtful writing on software, products, and technology.
          </p>

          <p className="text-sm text-ink-3">
            Copyright {new Date().getFullYear()} TechUpdate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}
