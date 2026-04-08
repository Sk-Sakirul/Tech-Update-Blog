import { Link } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { useState } from 'react'
import { Calendar, Clock } from 'lucide-react'
import dbService from '../appwrite/config'

const getRelativeDate = (date) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
  const diffDays = Math.round((Date.now() - date) / 86400000)

  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return rtf.format(-diffDays, 'day')
  if (diffDays < 365) return rtf.format(-Math.round(diffDays / 30), 'month')
  return rtf.format(-Math.round(diffDays / 365), 'year')
}

const readingTime = (html) => {
  const words = html?.replace(/<[^>]*>/g, '').trim().split(/\s+/).length || 0
  return Math.max(1, Math.ceil(words / 200))
}

export default function PostCard({ $id, title, content, featuredImage, featuredImageUrl, $createdAt, author, status }) {
  const [imgLoaded, setImgLoaded] = useState(false)
  const [imgError, setImgError] = useState(false)
  const userData = useSelector((s) => s.auth.userData)
  const posts = useSelector((s) => s.post.posts)
  const post = posts.find((p) => p.$id === $id)
  const isAuthor = post && userData ? post.userId === userData.$id : false
  const displayAuthor = isAuthor ? (userData?.name ?? 'You') : (author ?? 'Anonymous')
  const initial = displayAuthor.trim()[0]?.toUpperCase() ?? 'A'
  const imgSrc = featuredImageUrl || dbService.getFilePreview(featuredImage)
  const mins = readingTime(content)
  const excerpt = content?.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim() || 'Open the article to read the full post.'

  return (
    <Link to={`/post/${$id}`} className="group block h-full">
      <article className="card flex h-full flex-col">
        <div className="relative mx-4 mt-4 overflow-hidden rounded-3xl" style={{ aspectRatio: '16/10', backgroundColor: 'var(--surface-alt)' }}>
          <div
            className="absolute inset-0 z-10"
            style={{ background: 'linear-gradient(180deg, transparent 10%, rgba(15, 23, 42, 0.18) 100%)' }}
          />

          {!imgLoaded && !imgError && (
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="spinner spinner-md text-ink-3" />
            </div>
          )}

          {imgError ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-3">
              <svg className="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs opacity-50">No image</span>
            </div>
          ) : imgSrc ? (
            <img
              src={imgSrc}
              alt={title}
              onLoad={() => setImgLoaded(true)}
              onError={() => setImgError(true)}
              className={`absolute inset-0 h-full w-full object-cover transition-all duration-500 group-hover:scale-105 ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
            />
          ) : (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-ink-3">
              <svg className="h-8 w-8 opacity-40" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-xs opacity-50">No image</span>
            </div>
          )}

          <div className="absolute left-4 top-4 z-20 flex items-center gap-2">
            {status === 'inactive' && (
              <span className="badge badge-neutral text-xs">Draft</span>
            )}
            <span className="rounded-full border px-2.5 py-1 text-[11px] font-medium text-white backdrop-blur-sm" style={{ borderColor: 'rgba(255,255,255,0.28)', backgroundColor: 'rgba(15,23,42,0.32)' }}>
              {mins} min read
            </span>
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-4 p-6">
          <div className="flex items-center gap-3">
            <div className="avatar-circle h-10 w-10 shrink-0 text-sm">{initial}</div>
            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-ink">{displayAuthor}</p>
              <p className="flex items-center gap-1 text-xs text-ink-3">
                <Calendar className="h-3 w-3" />
                {getRelativeDate(new Date($createdAt))}
              </p>
            </div>
          </div>

          <h2 className="line-clamp-2 text-[1.35rem] font-semibold leading-snug tracking-[-0.03em] text-ink transition-colors group-hover:text-accent">
            {title}
          </h2>

          <p className="line-clamp-3 text-sm leading-7 text-ink-3">
            {excerpt}
          </p>

          <div className="mt-auto flex items-center justify-between border-t pt-4 text-xs text-ink-3" style={{ borderColor: 'var(--border)' }}>
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              Editorial format
            </span>
            <span className="font-medium text-accent">Read more</span>
          </div>
        </div>
      </article>
    </Link>
  )
}
