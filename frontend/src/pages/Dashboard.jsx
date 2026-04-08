import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import dbService from '../appwrite/config'
import { setPosts } from '../app/postSlice'
import { toastSuccess, toastError } from '../components/ui/Toast'
import ConfirmDialog from '../components/ui/ConfirmDialog'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { PenLine, Edit3, Trash2, Eye, BookMarked, FileText, TrendingUp } from 'lucide-react'

const getRelativeDate = (date) => {
  const diffDays = Math.round((Date.now() - new Date(date)) / 86400000)
  if (diffDays === 0) return 'Today'
  if (diffDays === 1) return 'Yesterday'
  if (diffDays < 30) return `${diffDays}d ago`
  if (diffDays < 365) return `${Math.round(diffDays / 30)}mo ago`
  return `${Math.round(diffDays / 365)}y ago`
}

export default function Dashboard() {
  const dispatch  = useDispatch()
  const userData  = useSelector((s) => s.auth.userData)
  const { posts } = useSelector((s) => s.post)

  const [fetching, setFetching] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [confirmId, setConfirmId] = useState(null)

  // Fetch if empty
  useEffect(() => {
    if (!posts.length) {
      setFetching(true)
      dbService.getPosts()
        .then((res) => { if (res) dispatch(setPosts(res.documents)) })
        .catch(() => {
          toastError('Could not load your dashboard data.')
        })
        .finally(() => setFetching(false))
    }
  }, [dispatch, posts.length])

  const myPosts    = posts.filter((p) => p.userId === userData?.$id)
  const published  = myPosts.filter((p) => p.status === 'active')
  const drafts     = myPosts.filter((p) => p.status === 'inactive')

  const handleDelete = async () => {
    const post = posts.find((p) => p.$id === confirmId)
    if (!post) return
    setDeleting(true)
    try {
      await dbService.deletePost(post.$id)
      if (post.featuredImage) await dbService.deleteFile(post.featuredImage).catch(() => {})
      dispatch(setPosts(posts.filter((p) => p.$id !== post.$id)))
      toastSuccess('Post deleted')
    } catch {
      toastError('Could not delete post')
    } finally {
      setDeleting(false)
      setConfirmId(null)
    }
  }

  const statsCards = [
    { label: 'Total posts', value: myPosts.length, icon: FileText, color: 'var(--accent)' },
    { label: 'Published',   value: published.length, icon: TrendingUp, color: 'var(--success)' },
    { label: 'Drafts',      value: drafts.length,  icon: BookMarked, color: 'var(--accent-2)' },
  ]

  return (
    <div className="page-container py-10">
      {/* Header */}
      <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="section-rule w-12" />
          <h1 className="font-serif text-3xl font-bold text-ink">Dashboard</h1>
          <p className="mt-1 text-sm text-ink-3">Welcome back, {userData?.name?.split(' ')[0]}</p>
        </div>
        <Link to="/add-post" className="btn btn-primary self-start sm:self-auto">
          <PenLine className="h-4 w-4" /> New post
        </Link>
      </div>

      {/* Stats */}
      <div className="mb-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {statsCards.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border p-6" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-3">{label}</p>
              <div className="flex h-9 w-9 items-center justify-center rounded-xl" style={{ backgroundColor: 'var(--accent-light)' }}>
                <Icon className="h-4 w-4" style={{ color }} />
              </div>
            </div>
            <p className="mt-3 font-serif text-4xl font-bold text-ink">{value}</p>
          </div>
        ))}
      </div>

      {/* Posts table */}
      {fetching ? (
        <div className="flex h-40 items-center justify-center">
          <Spinner size="lg" className="text-accent" />
        </div>
      ) : myPosts.length === 0 ? (
        <EmptyState
          icon={<PenLine className="h-8 w-8" />}
          title="No posts yet"
          description="Write your first post and share your thoughts with the world."
          action={<Link to="/add-post" className="btn btn-primary"><PenLine className="h-4 w-4" /> Write your first post</Link>}
        />
      ) : (
        <div>
          <h2 className="font-serif text-xl font-semibold text-ink mb-4">Your posts</h2>
          <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'var(--border)' }}>
            <table className="w-full">
              <thead>
                <tr style={{ backgroundColor: 'var(--surface-alt)', borderBottom: '1px solid var(--border)' }}>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider hidden sm:table-cell">Status</th>
                  <th className="px-5 py-3 text-left text-xs font-semibold text-ink-3 uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="px-5 py-3 text-right text-xs font-semibold text-ink-3 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody style={{ backgroundColor: 'var(--surface)' }}>
                {myPosts.map((post, i) => (
                  <tr
                    key={post.$id}
                    className="transition-colors hover:bg-surface-alt"
                    style={{ borderBottom: i < myPosts.length - 1 ? '1px solid var(--border)' : 'none' }}
                  >
                    <td className="px-5 py-4">
                      <Link
                        to={`/post/${post.$id}`}
                        className="font-medium text-ink hover:text-accent transition-colors line-clamp-1 text-sm"
                      >
                        {post.title}
                      </Link>
                    </td>
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span className={`badge text-xs ${post.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                        {post.status === 'active' ? 'Published' : 'Draft'}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-xs text-ink-3 hidden md:table-cell">
                      {getRelativeDate(post.$createdAt)}
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <Link
                          to={`/post/${post.$id}`}
                          className="btn btn-ghost btn-icon-sm"
                          title="View"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                        <Link
                          to={`/edit-post/${post.$id}`}
                          className="btn btn-ghost btn-icon-sm"
                          title="Edit"
                        >
                          <Edit3 className="h-4 w-4" />
                        </Link>
                        <button
                          className="btn btn-ghost btn-icon-sm"
                          title="Delete"
                          style={{ color: 'var(--danger)' }}
                          onClick={() => setConfirmId(post.$id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!confirmId}
        title="Delete post?"
        message="This action is permanent. The post and its cover image will be removed."
        onConfirm={handleDelete}
        onCancel={() => setConfirmId(null)}
        loading={deleting}
      />
    </div>
  )
}
