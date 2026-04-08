import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import authService from '../appwrite/auth'
import { login as authLogin } from '../app/authSlice'
import { toastSuccess, toastError } from './ui/Toast'
import Spinner from './ui/Spinner'
import { Eye, EyeOff, Mail, Lock } from 'lucide-react'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPwd, setShowPwd] = useState(false)

  const onSubmit = async (data) => {
    setError('')
    setLoading(true)
    try {
      await authService.login(data)
      const userData = await authService.getCurrentUser()
      if (userData) {
        dispatch(authLogin(userData))
        document.getElementById('modal-login')?.close()
        navigate('/')
        toastSuccess(`Welcome back, ${userData.name}!`)
      }
    } catch (err) {
      setError(err.message || 'Invalid email or password')
      toastError('Login failed. Please check your credentials.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <h2 className="font-serif text-2xl font-bold text-ink">Welcome back</h2>
        <p className="mt-1 text-sm text-ink-3">
          Don&apos;t have an account?{' '}
          <button
            type="button"
            className="font-medium text-accent hover:underline"
            onClick={() => {
              document.getElementById('modal-login')?.close()
              document.getElementById('modal-signup')?.showModal()
            }}
          >
            Sign up free
          </button>
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border px-4 py-3 text-sm" style={{ backgroundColor: 'var(--danger-soft)', borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Email</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              type="email"
              placeholder="you@example.com"
              className={`input pl-10 ${errors.email ? 'input-error' : ''}`}
              {...register('email', {
                required: 'Email is required',
                pattern: { value: /^\S+@\S+$/i, message: 'Invalid email address' },
              })}
            />
          </div>
          {errors.email && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{errors.email.message}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-sm font-medium text-ink">Password</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
            <input
              type={showPwd ? 'text' : 'password'}
              placeholder="Your password"
              className={`input pl-10 pr-10 ${errors.password ? 'input-error' : ''}`}
              {...register('password', { required: 'Password is required' })}
            />
            <button
              type="button"
              tabIndex={-1}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-ink"
              onClick={() => setShowPwd(!showPwd)}
            >
              {showPwd ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && <p className="mt-1 text-xs" style={{ color: 'var(--danger)' }}>{errors.password.message}</p>}
        </div>

        <button type="submit" disabled={loading} className="btn btn-primary mt-2 w-full">
          {loading ? <Spinner size="sm" /> : 'Sign in'}
        </button>
      </form>
    </div>
  )
}
