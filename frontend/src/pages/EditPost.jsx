import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import dbService from '../appwrite/config'
import { setPosts } from '../app/postSlice'
import { Post } from '../components'
import Spinner from '../components/ui/Spinner'

export default function EditPost() {
  const { slug }   = useParams()
  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const posts      = useSelector((s) => s.post.posts)
  const [post, setPost]       = useState(() => posts.find((p) => p.$id === slug))
  const [loading, setLoading] = useState(!post)

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
