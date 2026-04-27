import { useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { Outlet } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.min.css'
import authService from './appwrite/auth'
import { login, logout } from './app/authSlice'
import Navbar from './components/layout/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'
import Signup from './components/Signup'
import Spinner from './components/ui/Spinner'

export default function App() {
  const dispatch = useDispatch()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    authService.getCurrentUser()
      .then(({ user }) => {
        if (user) dispatch(login(user))
        else dispatch(logout())
      })
      .catch(() => dispatch(logout()))
      .finally(() => setLoading(false))
  }, [dispatch])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center" style={{ backgroundColor: 'var(--bg)' }}>
        <div className="panel flex flex-col items-center gap-3 rounded-[28px] px-8 py-10">
          <Spinner size="lg" style={{ color: 'var(--accent)' }} className="text-accent" />
          <p className="text-sm text-ink-3">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="app-shell flex min-h-screen flex-col" style={{ backgroundColor: 'var(--bg)' }}>
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />

      <dialog
        id="modal-login"
        className="rounded-[28px] border p-0 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-sm"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', maxWidth: 440, width: '94vw' }}
      >
        <div className="p-7">
          <Login />
        </div>
        <form method="dialog" className="absolute right-4 top-4">
          <button className="btn btn-ghost btn-icon-sm text-ink-3">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      </dialog>

      <dialog
        id="modal-signup"
        className="rounded-[28px] border p-0 shadow-xl backdrop:bg-slate-950/40 backdrop:backdrop-blur-sm"
        style={{ borderColor: 'var(--border)', backgroundColor: 'var(--surface)', maxWidth: 440, width: '94vw' }}
      >
        <div className="p-7">
          <Signup />
        </div>
        <form method="dialog" className="absolute right-4 top-4">
          <button className="btn btn-ghost btn-icon-sm text-ink-3">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </form>
      </dialog>

      <ToastContainer
        position="top-right"
        autoClose={2500}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        style={{ fontFamily: 'var(--font-sans)' }}
      />
    </div>
  )
}
