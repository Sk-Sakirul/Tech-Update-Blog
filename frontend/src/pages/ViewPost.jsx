import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import parse from 'html-react-parser'
import dbService from '../appwrite/config'
import { setPosts } from '../app/postSlice'
import { toastSuccess, toastError } from '../components/ui/Toast'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import Spinner from '../components/ui/Spinner'
import { Edit3, Trash2, Clock, Calendar, ChevronLeft, Expand } from 'lucide-react'

const getRelativeDate = (date) => {
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

const readingTime = (html) => {
  const words = html?.replace(/<[^>]*>/g, '').trim().split(/\s+/).length || 0
  return Math.max(1, Math.ceil(words / 200))
}

export default function ViewPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const posts = useSelector((s) => s.post.posts)
  const userData = useSelector((s) => s.auth.userData)

  const [post, setPost] = useState(() => posts.find((p) => p.$id === slug))
  const [loading, setLoading] = useState(!post)
  const [deleting, setDeleting] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [lightbox, setLightbox] = useState(false)

  const isAuthor = post && userData ? post.userId === userData.$id : false
  const authorName = isAuthor ? userData?.name : post?.author?.name || 'Anonymous'
  const initial = authorName?.trim()?.[0]?.toUpperCase() || 'A'
  const imgSrc = post?.featuredImageUrl || (post?.featuredImage ? dbService.getFilePreview(post.featuredImage) : null)

  useEffect(() => {
    if (post) { setLoading(false); return }
    setLoading(true)
    dbService.getPost(slug)
      .then((fetched) => {
        if (fetched) {
          setPost(fetched)
          dispatch(setPosts([fetched, ...posts.filter((p) => p.$id !== fetched.$id)]))
        } else navigate('/')
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  }, [dispatch, navigate, post, posts, slug])

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await dbService.deletePost(post.$id)
      if (post.featuredImage) await dbService.deleteFile(post.featuredImage).catch(() => {})
      dispatch(setPosts(posts.filter((p) => p.$id !== post.$id)))
      toastSuccess('Post deleted')
      navigate('/')
    } catch {
      toastError('Could not delete post')
    } finally {
      setDeleting(false)
      setConfirmOpen(false)
    }
  }

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="fade-in py-8">
      {imgSrc && (
        <div className="page-container-sm mb-8">
          <div className="relative mx-auto overflow-hidden rounded-[28px] border shadow-lg" style={{ aspectRatio: '16/9', maxWidth: 920, backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
            <img
              src={imgSrc}
              alt={post.title}
              className="h-full w-full cursor-zoom-in object-cover"
              onClick={() => setLightbox(true)}
            />
            <div className="pointer-events-none absolute inset-0" style={{ background: 'linear-gradient(to bottom, transparent 52%, rgba(0,0,0,0.48) 100%)' }} />
            <button
              onClick={() => setLightbox(true)}
              className="absolute bottom-4 right-4 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs text-white backdrop-blur-sm"
              style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
            >
              <Expand className="h-3 w-3" /> Expand
            </button>
          </div>
        </div>
      )}

      {lightbox && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightbox(false)}
        >
          <img src={imgSrc} alt={post.title} className="max-h-screen max-w-full rounded-xl object-contain" />
        </div>
      )}

      <div className="page-container-sm py-2">
        <Link to="/" className="mb-8 flex items-center gap-1.5 text-sm text-ink-3 transition-colors hover:text-ink">
          <ChevronLeft className="h-4 w-4" /> All posts
        </Link>

        <h1 className="text-3xl font-extrabold leading-tight tracking-[-0.04em] text-ink md:text-4xl lg:text-5xl">
          {post.title}
        </h1>

        <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-b pb-6" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-3">
            <div className="avatar-circle h-10 w-10 text-sm">{initial}</div>
            <div>
              <p className="text-sm font-semibold text-ink">{authorName}</p>
              <div className="mt-0.5 flex items-center gap-3 text-xs text-ink-3">
                <span className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  {getRelativeDate(post.$createdAt)}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {readingTime(post.content)} min read
                </span>
              </div>
            </div>
          </div>

          {isAuthor && (
            <div className="flex items-center gap-2">
              <Link to={`/edit-post/${post.$id}`} className="btn btn-secondary btn-sm">
                <Edit3 className="h-3.5 w-3.5" /> Edit
              </Link>
              <button
                className="btn btn-sm"
                style={{ backgroundColor: 'var(--danger-soft)', color: 'var(--danger)', border: '1px solid var(--danger)' }}
                onClick={() => setConfirmOpen(true)}
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          )}
        </div>

        <div className="mt-8 prose-blog">
          {parse(post.content)}
        </div>

        <div className="mt-12 border-t pt-8 text-center" style={{ borderColor: 'var(--border)' }}>
          <p className="text-sm text-ink-3">
            Written by <span className="font-medium text-ink">{authorName}</span>
          </p>
          <Link to="/" className="mt-4 inline-flex btn btn-secondary btn-sm">
            Back to more stories
          </Link>
        </div>
      </div>

      <ConfirmDialog
        open={confirmOpen}
        title="Delete this post?"
        message="Once deleted, this post and its cover image cannot be recovered."
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
        loading={deleting}
      />
    </div>
  )
}
