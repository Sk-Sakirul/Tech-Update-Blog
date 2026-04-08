import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import EmptyState from '../components/ui/EmptyState'
import { BookMarked, PenLine } from 'lucide-react'

export default function Drafts() {
  const userData  = useSelector((s) => s.auth.userData)
  const { posts, searchTerm } = useSelector((s) => s.post)

  const drafts = posts.filter(
    (p) =>
      p.status === 'inactive' &&
      p.userId === userData?.$id &&
      p.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              <PostCard {...post} author={userData?.name} />
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
