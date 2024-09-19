
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'
import { motion } from 'framer-motion'
import authService from '../appwrite/auth'
import { login as authLogin } from '../app/authSlice'
import { Input, Button } from '.'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const currentTheme = localStorage.getItem('theme') ?? 'light'
  const toastTheme = ['light', 'cupcake', 'aqua', 'cyberpunk', 'wireframe'].includes(currentTheme) ? 'light' : 'dark'

  const notifyOnSuccess = (user) => toast.success(`Welcome, ${user}`, {
    position: 'top-right',
    autoClose: 1000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: toastTheme,
  })

  const notifyOnError = () => toast.error('Something went wrong!', {
    position: 'top-right',
    autoClose: 2000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: toastTheme,
  })

  const login = async (data) => {
    setError('')
    try {
      setLoading(true)
      const session = await authService.login(data)
      if (session) {
        const userData = await authService.getCurrentUser()
        if (userData) dispatch(authLogin(userData))
        document.getElementById('login').close()
        navigate('/')
        notifyOnSuccess(userData.name)
      }
    } catch (error) {
      notifyOnError()
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md mx-auto p-6 bg-base-100 rounded-lg">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>
        <p className="text-center text-base-content/70 mb-8">
          Don't have an account?{' '}
          <button
            className="text-primary hover:underline focus:outline-none"
            onClick={() => {
              document.getElementById('signup').showModal()
              document.getElementById('login').close()
            }}
          >
            Sign up
          </button>
        </p>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-error/20 text-error p-3 rounded-md mb-6"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit(login)} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <Input
              id="email"
              type="email"
              placeholder="Enter your email"
              {...register('email', {
                required: 'Email is required',
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: 'Invalid email address',
                },
              })}
              className={`w-full ${errors.email ? 'input-error' : ''}`}
            />
            {errors.email && (
              <p className="mt-1 text-error text-sm">{errors.email.message}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              {...register('password', { required: 'Password is required' })}
              className={`w-full ${errors.password ? 'input-error' : ''}`}
            />
            {errors.password && (
              <p className="mt-1 text-error text-sm">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full btn btn-primary"
            disabled={loading}
          >
            {loading ? (
              <span className="loading loading-spinner loading-sm"></span>
            ) : (
              'Sign In'
            )}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <a href="#" className="text-sm text-primary hover:underline">
            Forgot your password?
          </a>
        </div>
      </motion.div>
    </div>
  )
}