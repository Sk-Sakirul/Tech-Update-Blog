import { Link } from 'react-router-dom'

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] items-center justify-center px-4">
      <div className="text-center">
        <p className="font-serif text-9xl font-black" style={{ color: 'var(--accent)', lineHeight: 1 }}>404</p>
        <h1 className="mt-4 font-serif text-2xl font-bold text-ink">Page not found</h1>
        <p className="mx-auto mt-2 max-w-xs text-sm text-ink-3">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link to="/" className="btn btn-primary">Back to home</Link>
          <Link to="/add-post" className="btn btn-secondary">Write something new</Link>
        </div>
      </div>
    </div>
  )
}
