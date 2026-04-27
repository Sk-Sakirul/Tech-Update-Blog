import { useEffect, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import dbService from '../appwrite/config'
import { setPosts } from '../app/postSlice'
import PostCard from '../components/PostCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { toastError } from '../components/ui/Toast'
import { BookMarked, PenLine } from 'lucide-react'

export default function Drafts() {
  const dispatch  = useDispatch()
  const userData  = useSelector((s) => s.auth.userData)
  const { posts, searchTerm } = useSelector((s) => s.post)
  const [fetching, setFetching] = useState(true)

  // ✅ Always fetch fresh posts so the user sees their latest drafts
  useEffect(() => {
    setFetching(true)
    dbService.getPosts()
      .then((res) => {
        if (res?.documents) dispatch(setPosts(res.documents))
      })
      .catch(() => toastError('Could not load drafts.'))
      .finally(() => setFetching(false))
  }, [dispatch])

  // Only show drafts belonging to the current authenticated user
  const drafts = posts.filter(
    (p) =>
      p.status === 'inactive' &&
      p.userId === userData?.$id &&
      p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    )
  }

  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <div className="section-rule w-12" />
        <h1 className="font-serif text-3xl font-bold text-ink">My Drafts</h1>
        <p className="mt-1 text-sm text-ink-3">
          {drafts.length} draft{drafts.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {drafts.length === 0 ? (
        <EmptyState
          icon={<BookMarked className="h-8 w-8" />}
          title={searchTerm ? 'No drafts match your search' : 'No drafts yet'}
          description={
            searchTerm
              ? 'Try a different keyword.'
              : 'Save a post as a draft and it will appear here.'
          }
          action={
            !searchTerm && (
              <Link to="/add-post" className="btn btn-primary">
                <PenLine className="h-4 w-4" /> Start writing
              </Link>
            )
          }
        />
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 stagger">
          {drafts.map((post) => (
            <div key={post.$id} className="slide-up">
              <PostCard {...post} author={post.author?.name ?? userData?.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
