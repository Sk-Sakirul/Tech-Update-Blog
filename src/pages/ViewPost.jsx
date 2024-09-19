import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import parse from 'html-react-parser'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import dbService from '../appwrite/config'
import { Button } from '../components'
import { setPosts } from '../app/postSlice'

export default function ViewPost() {
  const { slug } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const posts = useSelector((state) => state.post.posts)
  const post = posts.find((post) => post.$id === slug)
  const userData = useSelector((state) => state.auth.userData)
  const isAuthor = post && userData ? post.userId === userData.$id : false
  const [loading, setLoading] = useState(false)
  const [showFullImage, setShowFullImage] = useState(false)

  const currentTheme = localStorage.getItem('theme') ?? 'light'
  const toastTheme = ['light', 'cupcake', 'aqua', 'cyberpunk', 'wireframe'].includes(currentTheme) ? 'light' : 'dark'

  useEffect(() => {
    if (!post) navigate('/')
  }, [post, navigate])

  const notify = () => toast.success('Post deleted!', {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: toastTheme,
  })

  const deletePost = async () => {
    setLoading(true)
    try {
      await dbService.deletePost(post.$id)
      await dbService.deleteFile(post.featuredImage)
      const updatedPosts = posts.filter((p) => p.$id !== post.$id)
      dispatch(setPosts(updatedPosts))
      notify()
      navigate('/')
    } catch (error) {
      console.error('Error deleting post:', error)
      toast.error('Failed to delete post')
    } finally {
      setLoading(false)
    }
  }

  const calculateReadingTime = (text, wordsPerMinute = 200) => {
    const words = text.trim().split(/\s+/).length
    return Math.ceil(words / wordsPerMinute)
  }

  const getRelativeDate = (date) => {
    const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })
    const now = new Date()
    const diff = now - date
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return 'Today'
    if (diffDays === 1) return 'Yesterday'
    if (diffDays < 30) return rtf.format(-diffDays, 'day')
    if (diffDays < 365) return rtf.format(-Math.round(diffDays / 30), 'month')
    return rtf.format(-Math.round(diffDays / 365), 'year')
  }

  if (!post) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto px-6 py-8 bg-base-100 rounded-lg shadow-lg"
    >
      <div className="relative overflow-hidden rounded-lg shadow-md mb-8">
        <img
          src={dbService.getFilePreview(post.featuredImage)}
          alt={post.title}
          className="w-full h-64 sm:h-96 object-cover cursor-pointer transition-transform duration-300 hover:scale-105"
          onClick={() => setShowFullImage(true)}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <h1 className="text-white text-2xl sm:text-4xl font-bold p-4 sm:p-6">{post.title}</h1>
        </div>
      </div>

      {showFullImage && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center" onClick={() => setShowFullImage(false)}>
          <img
            src={dbService.getFilePreview(post.featuredImage)}
            alt={post.title}
            className="max-w-full max-h-full object-contain"
          />
        </div>
      )}

      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full overflow-hidden">
            <img
              src="https://thispersondoesnotexist.com/"
              alt="User avatar"
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <p className="text-lg font-semibold">{isAuthor ? userData.name : 'Anonymous'}</p>
            <div className="flex items-center text-sm text-gray-500 space-x-2">
              <span className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                {getRelativeDate(new Date(post.$createdAt))}
              </span>
              <span className="badge badge-ghost">
                {calculateReadingTime(post.content)} min read
              </span>
            </div>
          </div>
        </div>
        {isAuthor && (
          <div className="flex space-x-2 mt-4 sm:mt-0">
            <Link to={`/edit-post/${post.$id}`}>
              <Button className="btn btn-sm btn-outline" disabled={loading}>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Edit
              </Button>
            </Link>
            <Button className="btn btn-sm btn-error" onClick={deletePost} disabled={loading}>
              {loading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete
                </>
              )}
            </Button>
          </div>
        )}
      </div>

      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="prose prose-lg max-w-none"
      >
        {parse(post.content)}
      </motion.div>
    </motion.div>
  )
}
