import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { BookMarked, ChevronDown, LayoutDashboard, LogOut, Menu, Moon, PenLine, Search, Sun, X } from 'lucide-react'
import { setSearchTerm } from '../../app/postSlice'
import { logout } from '../../app/authSlice'
import { flushPosts } from '../../app/postSlice'
import authService from '../../appwrite/auth'
import { toastSuccess } from '../ui/Toast'

export default function Navbar() {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const location = useLocation()
  const authStatus = useSelector((s) => s.auth.status)
  const userData = useSelector((s) => s.auth.userData)
  const { searchTerm } = useSelector((s) => s.post)

  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light')
  const [menuOpen, setMenuOpen] = useState(false)
  const [dropOpen, setDropOpen] = useState(false)
  const [logoutLoading, setLogoutLoading] = useState(false)

  const menuRef = useRef(null)
  const dropRef = useRef(null)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false)
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropOpen(false)
    }

    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
  }

  const handleLogout = async () => {
    setLogoutLoading(true)
    try {
      await authService.logout()
      dispatch(logout())
      dispatch(flushPosts())
      toastSuccess('Signed out successfully')
      navigate('/')
    } catch {
      // Keep logout failure quiet in the UI.
    } finally {
      setLogoutLoading(false)
      setDropOpen(false)
      setMenuOpen(false)
    }
  }

  const isHome = location.pathname === '/'
  const isDrafts = location.pathname === '/drafts'
  // Search is visible to everyone on home; drafts search only for logged-in users
  const showSearch = isHome || (authStatus && isDrafts)
  const avatarInitial = userData?.name?.trim()[0]?.toUpperCase() || 'U'

  return (
    <header className="sticky top-0 z-40 border-b border-white/50 bg-[color:var(--bg)]/88 backdrop-blur-xl">
      <div className="page-container">
        <div className="flex min-h-[76px] items-center justify-between gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-3 lg:gap-6">
            <Link to="/" className="flex shrink-0 items-center gap-3">
              <div
                className="flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-semibold tracking-[0.14em] text-white shadow-lg"
                style={{ background: 'linear-gradient(135deg, var(--accent), var(--accent-2))' }}
              >
                TU
              </div>
              <div className="hidden sm:block">
                <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-ink-3">Tech publication</p>
                <p className="text-lg font-semibold tracking-[-0.02em] text-ink">TechUpdate</p>
              </div>
            </Link>

            {showSearch && (
              <div className="relative hidden max-w-xl flex-1 md:block">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                <input
                  type="text"
                  placeholder="Search posts..."
                  value={searchTerm}
                  onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  className="input rounded-full border-white/60 py-3 pl-11 shadow-none"
                />
              </div>
            )}
          </div>

          <div className="hidden items-center gap-2 md:flex">
            <button
              onClick={toggleTheme}
              className="btn btn-ghost btn-icon rounded-full border border-transparent hover:border-[color:var(--border)]"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            </button>

            {authStatus ? (
              <>
                <Link to="/add-post" className="btn btn-primary btn-sm px-4 py-2.5">
                  <PenLine className="h-3.5 w-3.5" />
                  New post
                </Link>

                <div ref={dropRef} className="relative">
                  <button
                    onClick={() => setDropOpen((open) => !open)}
                    className="flex items-center gap-2 rounded-full border bg-white/55 px-2 py-1.5 transition-colors hover:bg-surface-alt"
                    style={{ borderColor: 'var(--border)' }}
                  >
                    <div className="avatar-circle h-9 w-9 text-xs" aria-label={userData?.name}>
                      {avatarInitial}
                    </div>
                    <div className="max-w-[140px] text-left">
                      <p className="truncate text-sm font-semibold text-ink">{userData?.name}</p>
                    </div>
                    <ChevronDown className={`h-3.5 w-3.5 text-ink-3 transition-transform ${dropOpen ? 'rotate-180' : ''}`} />
                  </button>

                  {dropOpen && (
                    <div className="panel absolute right-0 mt-3 w-60 overflow-hidden rounded-[24px] bg-[color:var(--surface-card)]">
                      <div className="border-b px-4 py-4" style={{ borderColor: 'var(--border)' }}>
                        <p className="truncate text-sm font-semibold text-ink">{userData?.name}</p>
                        <p className="truncate text-xs text-ink-3">{userData?.email}</p>
                      </div>
                      <div className="py-2">
                        <Link to="/dashboard" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-surface-alt" onClick={() => setDropOpen(false)}>
                          <LayoutDashboard className="h-4 w-4" />
                          Dashboard
                        </Link>
                        <Link to="/drafts" className="flex items-center gap-3 px-4 py-2.5 text-sm text-ink-2 hover:bg-surface-alt" onClick={() => setDropOpen(false)}>
                          <BookMarked className="h-4 w-4" />
                          My Drafts
                        </Link>
                      </div>
                      <div className="border-t py-2" style={{ borderColor: 'var(--border)' }}>
                        <button
                          onClick={handleLogout}
                          disabled={logoutLoading}
                          className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-surface-alt"
                          style={{ color: 'var(--danger)' }}
                        >
                          <LogOut className="h-4 w-4" />
                          {logoutLoading ? 'Signing out...' : 'Sign out'}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <button onClick={() => document.getElementById('modal-login')?.showModal()} className="btn btn-ghost btn-sm">
                  Sign in
                </button>
                <button onClick={() => document.getElementById('modal-signup')?.showModal()} className="btn btn-primary btn-sm">
                  Get started
                </button>
              </>
            )}
          </div>

          <button className="btn btn-ghost btn-icon rounded-full md:hidden" onClick={() => setMenuOpen((open) => !open)} aria-label="Menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {menuOpen && (
          <div ref={menuRef} className="border-t pb-4 pt-4 md:hidden" style={{ borderColor: 'var(--border)' }}>
            <div className="space-y-2">
              {showSearch && (
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-3" />
                  <input
                    type="text"
                    placeholder="Search posts..."
                    value={searchTerm}
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                    className="input rounded-full py-3 pl-11"
                  />
                </div>
              )}

              <button onClick={toggleTheme} className="btn btn-ghost w-full justify-start gap-3 rounded-2xl">
                {theme === 'light' ? <><Moon className="h-4 w-4" /> Dark mode</> : <><Sun className="h-4 w-4" /> Light mode</>}
              </button>

              {authStatus ? (
                <>
                  <Link to="/add-post" className="btn btn-primary w-full" onClick={() => setMenuOpen(false)}>
                    <PenLine className="h-4 w-4" /> Write a post
                  </Link>
                  <Link to="/dashboard" className="btn btn-ghost w-full justify-start gap-3 rounded-2xl" onClick={() => setMenuOpen(false)}>
                    <LayoutDashboard className="h-4 w-4" /> Dashboard
                  </Link>
                  <Link to="/drafts" className="btn btn-ghost w-full justify-start gap-3 rounded-2xl" onClick={() => setMenuOpen(false)}>
                    <BookMarked className="h-4 w-4" /> My Drafts
                  </Link>
                  <button onClick={handleLogout} disabled={logoutLoading} className="btn w-full justify-start gap-3 rounded-2xl" style={{ color: 'var(--danger)', background: 'transparent' }}>
                    <LogOut className="h-4 w-4" />
                    {logoutLoading ? 'Signing out...' : 'Sign out'}
                  </button>
                </>
              ) : (
                <>
                  <button className="btn btn-secondary w-full" onClick={() => { document.getElementById('modal-login')?.showModal(); setMenuOpen(false) }}>
                    Sign in
                  </button>
                  <button className="btn btn-primary w-full" onClick={() => { document.getElementById('modal-signup')?.showModal(); setMenuOpen(false) }}>
                    Get started
                  </button>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
