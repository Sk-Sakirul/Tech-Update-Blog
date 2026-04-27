import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { ArrowRight, PenLine, Rss, Sparkles, TrendingUp } from 'lucide-react'
import { setPosts } from '../app/postSlice'
import dbService from '../appwrite/config'
import PostCard from '../components/PostCard'
import EmptyState from '../components/ui/EmptyState'
import Spinner from '../components/ui/Spinner'
import { toastError } from '../components/ui/Toast'

export default function Home() {
  const dispatch = useDispatch()
  const { status: authStatus, userData } = useSelector((s) => s.auth)
  const { posts, searchTerm } = useSelector((s) => s.post)
  const [fetching, setFetching] = useState(false)

  // ✅ Always fetch posts on mount — guests and logged-in users both see posts.
  //    We always refresh from the server so the list stays up to date.
  useEffect(() => {
    setFetching(true)
    dbService.getPosts()
      .then((res) => {
        if (res) dispatch(setPosts(res.documents))
      })
      .catch(() => {
        toastError('Could not load posts right now.')
      })
      .finally(() => setFetching(false))
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  // Only show published (active) posts on the public home feed
  const activePosts = posts.filter(
    (p) =>
      p?.status === 'active' &&
      p?.title?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // ── Hero banner (shown to everyone) ──────────────────────────────────────
  const HeroBanner = () => (
    <section className="panel mb-8 rounded-[32px] px-6 py-8 sm:px-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl">
          <div className="eyebrow mb-4">
            <TrendingUp className="h-3.5 w-3.5" />
            Reader feed
          </div>
          <h1 className="font-serif text-3xl font-bold text-ink sm:text-4xl">
            {searchTerm ? `Results for "${searchTerm}"` : 'Latest stories from the community'}
          </h1>
          <p className="mt-3 text-sm leading-7 text-ink-3 sm:text-base">
            {activePosts.length} published post{activePosts.length !== 1 ? 's' : ''} ready to explore.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          {authStatus ? (
            // Logged-in: show user name + write button
            <>
              <div className="metric-tile min-w-[180px]">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-ink-3">Signed in as</p>
                <p className="mt-2 text-lg font-semibold text-ink">{userData?.name ?? 'Writer'}</p>
              </div>
              <Link to="/add-post" className="btn btn-primary self-start sm:self-center">
                <PenLine className="h-4 w-4" /> Write a post
              </Link>
            </>
          ) : (
            // Guest: show CTA to sign up
            <div className="flex flex-col gap-2 sm:flex-row">
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('modal-signup')?.showModal()}
              >
                Start writing <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => document.getElementById('modal-login')?.showModal()}
              >
                Sign in
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  )

  if (fetching) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Spinner size="lg" className="text-accent" />
      </div>
    )
  }

  if (!activePosts.length) {
    return (
      <div className="page-container py-10">
        {/* Show the landing hero for guests even when no posts exist */}
        {!authStatus && <GuestLanding />}

        {authStatus && (
          <EmptyState
            icon={<PenLine className="h-8 w-8" />}
            title={searchTerm ? 'No posts match your search' : 'No posts yet'}
            description={searchTerm ? 'Try a different search term.' : 'Be the first to publish something great.'}
            action={
              !searchTerm && (
                <Link to="/add-post" className="btn btn-primary">
                  <PenLine className="h-4 w-4" /> Write the first post
                </Link>
              )
            }
          />
        )}

        {!authStatus && !searchTerm && (
          <EmptyState
            icon={<Rss className="h-8 w-8" />}
            title="No posts yet"
            description="Be the first to share a story. Sign up and start writing."
            action={
              <button
                className="btn btn-primary"
                onClick={() => document.getElementById('modal-signup')?.showModal()}
              >
                Get started
              </button>
            }
          />
        )}
      </div>
    )
  }

  return (
    <div className="page-container py-10">
      <HeroBanner />

      <section className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3 stagger">
        {activePosts.map((post) => (
          <div key={post.$id} className="slide-up">
            <PostCard
              {...post}
              author={post.author?.name ?? 'Anonymous'}
            />
          </div>
        ))}
      </section>
    </div>
  )
}

// ── Guest landing hero (shown when no posts + not logged in) ─────────────────
function GuestLanding() {
  const guestStats = [
    { label: 'Editorial-ready publishing', value: 'Fast', note: 'Write, upload covers, and publish in minutes.' },
    { label: 'Focused reading experience', value: 'Clean', note: 'Story pages keep attention on the content.' },
    { label: 'Built for repeat publishing', value: 'Scalable', note: 'Drafts, dashboards, and direct links stay organized.' },
  ]

  const features = [
    {
      title: 'Editorial landing experience',
      description: 'A polished first impression that makes the product feel trustworthy for readers and contributors.',
    },
    {
      title: 'Faster publishing flow',
      description: 'Writers can move from idea to draft to published article without a cluttered interface.',
    },
    {
      title: 'Professional brand language',
      description: 'A consistent visual system across navigation, cards, sections, and action buttons.',
    },
  ]

  return (
    <div className="mb-10">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-stretch">
        <div className="panel relative overflow-hidden rounded-[36px] px-6 py-10 sm:px-10 md:py-14">
          <div
            className="absolute inset-x-0 top-0 h-40"
            style={{ background: 'linear-gradient(135deg, rgba(15,118,110,0.18), rgba(37,99,235,0.12), transparent)' }}
          />
          <div className="relative z-10 max-w-3xl">
            <div className="eyebrow mb-5">
              <Rss className="h-3.5 w-3.5" />
              Modern publishing for technology stories
            </div>
            <h1 className="font-serif text-4xl font-bold leading-tight text-ink sm:text-5xl lg:text-6xl">
              Publish sharp ideas in a space that finally looks credible.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-ink-3 sm:text-lg">
              TechUpdate gives writers a cleaner editorial surface, better visual hierarchy, and a more confident product feel for readers.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => document.getElementById('modal-signup')?.showModal()}
              >
                Start writing
                <ArrowRight className="h-4 w-4" />
              </button>
              <button
                className="btn btn-secondary btn-lg"
                onClick={() => document.getElementById('modal-login')?.showModal()}
              >
                Sign in
              </button>
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          <div className="metric-tile flex items-start justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-ink-3">Product feel</p>
              <p className="mt-3 font-serif text-3xl font-bold text-ink">Professional</p>
              <p className="mt-2 text-sm leading-6 text-ink-3">A stronger visual identity across desktop and mobile views.</p>
            </div>
            <div className="rounded-2xl p-3" style={{ backgroundColor: 'var(--accent-light)' }}>
              <Sparkles className="h-5 w-5 text-accent" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            {guestStats.map((item) => (
              <div key={item.label} className="metric-tile">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-3">{item.label}</p>
                <p className="mt-3 font-serif text-3xl font-bold text-ink">{item.value}</p>
                <p className="mt-2 text-sm leading-6 text-ink-3">{item.note}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-10 grid gap-5 lg:grid-cols-3">
        {features.map((feature, index) => (
          <div key={feature.title} className="card p-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-semibold text-white" style={{ background: index === 1 ? 'linear-gradient(135deg, var(--accent-2), var(--accent))' : 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}>
              0{index + 1}
            </div>
            <h2 className="mt-5 font-serif text-2xl font-semibold text-ink">{feature.title}</h2>
            <p className="mt-3 text-sm leading-7 text-ink-3">{feature.description}</p>
          </div>
        ))}
      </section>
    </div>
  )
}
