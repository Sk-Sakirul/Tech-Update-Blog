import { Post } from '../components'

export default function AddPost() {
  return (
    <div className="page-container py-10">
      <div className="mb-8">
        <div className="section-rule w-12" />
        <h1 className="font-serif text-3xl font-bold text-ink">Write a new post</h1>
        <p className="mt-1 text-sm text-ink-3">Craft your headline, add a cover image, and publish when ready.</p>
      </div>
      <div className="rounded-2xl border p-6 md:p-8" style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}>
        <Post />
      </div>
    </div>
  )
}
