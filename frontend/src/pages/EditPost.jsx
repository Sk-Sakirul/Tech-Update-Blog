import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import dbService from '../appwrite/config'
import { setPosts } from '../app/postSlice'
import { Post } from '../components'
import Spinner from '../components/ui/Spinner'
import { toastError } from '../components/ui/Toast'

export default function EditPost() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const posts      = useSelector((s) => s.post.posts)
  const userData   = useSelector((s) => s.auth.userData)

  const [post, setPost]       = useState(null)
  const [loading, setLoading] = useState(true)

  // ✅ Always fetch fresh so we have the latest userId for ownership check
  useEffect(() => {
    setLoading(true)
    dbService.getPost(slug)
      .then((fetched) => {
        if (!fetched) {
          navigate('/')
          return
        }

        // ✅ Ownership guard: redirect if the logged-in user is not the author
        if (fetched.userId !== userData?.$id) {
          toastError('You are not allowed to edit this post.')
          navigate('/')
          return
        }

        setPost(fetched)
        dispatch(setPosts([fetched, ...posts.filter((p) => p.$id !== fetched.$id)]))
      })
      .catch(() => navigate('/'))
      .finally(() => setLoading(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug])

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    )
  }

  if (!post) return null

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <div className="section-rule w-12" />
        <h1 className="font-serif text-3xl font-bold text-ink">Edit post</h1>
        <p className="mt-1 text-sm text-ink-3">Update your story and save changes.</p>
      </div>
      <div className="rounded-2xl border p-6 md:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <Post post={post} />
      </div>
    </div>
  )
}
