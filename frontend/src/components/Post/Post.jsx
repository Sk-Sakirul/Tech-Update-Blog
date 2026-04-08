import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { setPosts } from '../../app/postSlice'
import dbService from '../../appwrite/config'
import { toastSuccess, toastError } from '../ui/Toast'
import Spinner from '../ui/Spinner'
import RTE from '../RTE'
import { Upload, ImageIcon } from 'lucide-react'

export default function Post({ post }) {
  const { register, watch, handleSubmit, control, getValues } = useForm({
    defaultValues: {
      title:   post?.title   || '',
      content: post?.content || '',
      status:  post?.status  || 'active',
    },
  })

  const [preview, setPreview] = useState(
    post?.featuredImageUrl || (post?.featuredImage ? dbService.getFilePreview(post.featuredImage) : null)
  )
  const [loading, setLoading] = useState(false)

  const navigate   = useNavigate()
  const dispatch   = useDispatch()
  const posts      = useSelector((s) => s.post.posts)

  // Live image preview
  useEffect(() => {
    const sub = watch((value, { name }) => {
      if (name === 'image' && value.image?.[0]) {
        const reader = new FileReader()
        reader.onloadend = () => setPreview(reader.result)
        reader.readAsDataURL(value.image[0])
      }
    })
    return () => sub.unsubscribe()
  }, [watch])

  const submit = async (data) => {
    setLoading(true)
    try {
      let dbPost

      if (post) {
        // Edit mode
        const newFile = data.image?.[0] ? await dbService.uploadFile(data.image[0]) : null
        if (newFile && post.featuredImage) dbService.deleteFile(post.featuredImage).catch(() => {})

        dbPost = await dbService.updatePost(post.$id, {
          title:         data.title,
          content:       data.content,
          status:        data.status,
          featuredImage: newFile ? newFile.$id : post.featuredImage,
        })

        if (dbPost) {
          dispatch(setPosts(posts.map((p) => (p.$id === dbPost.$id ? dbPost : p))))
          toastSuccess('Post updated!')
        }
      } else {
        // Create mode
        const file = await dbService.uploadFile(data.image?.[0])
        if (!file) throw new Error('Image upload failed')

        dbPost = await dbService.createPost({
          title:         data.title,
          content:       data.content,
          featuredImage: file.$id,
          status:        data.status,
        })

        if (dbPost) {
          dispatch(setPosts([dbPost, ...posts]))
          toastSuccess('Post published!')
        }
      }

      if (dbPost) navigate(`/post/${dbPost.$id}`)
      else navigate('/')
    } catch (err) {
      toastError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit(submit)} className="space-y-8">
      <div className="grid gap-8 lg:grid-cols-[1fr_300px]">

        {/* ── Left: title + content ── */}
        <div className="space-y-6">
          <div>
            <label className="mb-1.5 block text-sm font-medium text-ink">Post title</label>
            <input
              type="text"
              placeholder="An interesting headline…"
              className="input text-base font-serif"
              style={{ fontSize: '1.1rem' }}
              {...register('title', { required: true })}
            />
          </div>

          <div>
            <div className="mb-1.5 flex items-center justify-between">
              <label className="text-sm font-medium text-ink">Content</label>
              <span className="text-xs text-ink-3">Rich text editor</span>
            </div>
            <div className="overflow-hidden rounded-xl border" style={{ borderColor: 'var(--border)' }}>
              <RTE name="content" control={control} defaultValue={getValues('content') || ''} />
            </div>
          </div>
        </div>

        {/* ── Right: image + status ── */}
        <div className="space-y-5">
          {/* Cover image */}
          <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Cover image</p>

            {preview ? (
              <div className="relative mb-4 overflow-hidden rounded-xl" style={{ aspectRatio: '16/9' }}>
                <img src={preview} alt="Cover preview" className="h-full w-full object-cover" />
                <div className="absolute inset-0 flex items-end p-2 opacity-0 hover:opacity-100 transition-opacity" style={{ background: 'rgba(0,0,0,0.4)' }}>
                  <span className="text-xs text-white">Click upload to change</span>
                </div>
              </div>
            ) : (
              <div
                className="mb-4 flex flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 text-center"
                style={{ borderColor: 'var(--border-strong)', color: 'var(--ink-3)' }}
              >
                <ImageIcon className="mb-2 h-8 w-8 opacity-40" />
                <p className="text-xs">No cover image yet</p>
              </div>
            )}

            <label
              className="btn btn-secondary w-full cursor-pointer"
              style={{ fontSize: '0.8rem' }}
            >
              <Upload className="h-4 w-4" />
              {preview ? 'Change image' : 'Upload image'}
              <input
                type="file"
                accept="image/png,image/jpg,image/jpeg,image/gif,image/webp"
                className="sr-only"
                {...register('image', { required: !post })}
              />
            </label>
          </div>

          {/* Status toggle */}
          <Controller
            name="status"
            control={control}
            render={({ field }) => {
              const isPublished = field.value === 'active'
              return (
                <div className="rounded-2xl border p-5" style={{ backgroundColor: 'var(--surface-alt)', borderColor: 'var(--border)' }}>
                  <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-3">Visibility</p>
                  <button
                    type="button"
                    onClick={() => field.onChange(isPublished ? 'inactive' : 'active')}
                    className="flex w-full items-center justify-between rounded-xl border px-4 py-3.5 text-left transition-all"
                    style={{ backgroundColor: 'var(--surface)', borderColor: 'var(--border)' }}
                  >
                    <div>
                      <p className="text-sm font-semibold text-ink">{isPublished ? 'Published' : 'Draft'}</p>
                      <p className="mt-0.5 text-xs text-ink-3">
                        {isPublished ? 'Visible to all readers' : 'Only visible to you'}
                      </p>
                    </div>
                    <span
                      className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors"
                      style={{ backgroundColor: isPublished ? 'var(--accent)' : 'var(--border-strong)' }}
                    >
                      <span
                        className="inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform"
                        style={{ transform: isPublished ? 'translateX(22px)' : 'translateX(2px)' }}
                      />
                    </span>
                  </button>
                </div>
              )
            }}
          />
        </div>
      </div>

      {/* Submit bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-t pt-6" style={{ borderColor: 'var(--border)' }}>
        <p className="text-sm text-ink-3">
          {post ? 'Review your changes before saving.' : 'You can save as a draft and publish later.'}
        </p>
        <button type="submit" disabled={loading} className="btn btn-primary btn-lg min-w-40">
          {loading ? <Spinner size="sm" /> : post ? 'Save changes' : 'Publish post'}
        </button>
      </div>
    </form>
  )
}
