import { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Link, useLocation } from 'react-router-dom'
import { setSearchTerm } from '../../app/postSlice'
import { Menu, X, Moon, Sun, ChevronDown } from 'lucide-react'
import Login from '../Login'
import Signup from '../Signup'
import {LogoutBtn} from "../index"

export default function ResponsiveHeader() {
  const authStatus = useSelector((state) => state.auth.status)
  const { posts, searchTerm } = useSelector((state) => state.post)
  const dispatch = useDispatch()
  const location = useLocation()

  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false)

  const menuRef = useRef(null)
  const profileDropdownRef = useRef(null)

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light'
    setTheme(newTheme)
    localStorage.setItem('theme', newTheme)
    document.documentElement.setAttribute('data-theme', newTheme)
  }

  const handleSearch = (e) => {
    dispatch(setSearchTerm(e.target.value))
  }

  useEffect(() => {
    const storedTheme = localStorage.getItem('theme') || 'light'
    document.documentElement.setAttribute('data-theme', storedTheme)
    setTheme(storedTheme)

    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsMenuOpen(false)
      }
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <header className="bg-base-100 shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/" className="flex items-center space-x-2">
              <img src="/assets/Tech_logo.png" alt="Tech Update Logo" className="w-8 h-8" />
              <span className="text-xl font-bold">Tech Update</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {authStatus && (location.pathname === '/' || location.pathname === '/drafts') && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-full max-w-xs pr-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}

            {authStatus && location.pathname !== '/add-post' && (
              <Link to="/add-post" className="btn btn-primary">
                Write
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}

            <button onClick={toggleTheme} className="btn btn-ghost btn-circle">
              {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
            </button>

            {authStatus ? (
              <div className="relative" ref={profileDropdownRef}>
                <button
                  onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                  className="btn btn-ghost btn-circle avatar"
                >
                  <img
                    src="https://thispersondoesnotexist.com/"
                    alt="Profile"
                    className="w-10 h-10 rounded-full"
                  />
                  <ChevronDown className={`h-4 w-4 ml-2 transition-transform ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-base-100 rounded-md shadow-lg py-1 z-10">
                    <Link
                      to="/drafts"
                      className="block px-4 py-2 text-sm hover:bg-base-200"
                      onClick={() => setIsProfileDropdownOpen(false)}
                    >
                      My Drafts
                      <span className="badge ml-2">
                        {posts.filter((post) => post.status === 'inactive').length}
                      </span>
                    </Link>
                    <button
                      onClick={() => {
                        setIsProfileDropdownOpen(false)
                        // Add logout logic here
                      }}
                      className="block w-full text-left px-4 py-2 text-sm hover:bg-base-200"
                    >
                      <LogoutBtn />
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  onClick={() => document.getElementById('signup').showModal()}
                  className="btn btn-outline"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => document.getElementById('login').showModal()}
                  className="btn btn-primary"
                >
                  Login
                </button>
              </>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden btn btn-ghost btn-circle"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div ref={menuRef} className="md:hidden bg-base-100 py-4">
          <div className="container mx-auto px-4 space-y-4">
            {authStatus && (location.pathname === '/' || location.pathname === '/drafts') && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search"
                  className="input input-bordered w-full pr-10"
                  value={searchTerm}
                  onChange={handleSearch}
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
            )}

            {authStatus && location.pathname !== '/add-post' && (
              <Link to="/add-post" className="btn btn-primary w-full" onClick={() => setIsMenuOpen(false)}>
                Write
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 ml-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </Link>
            )}

            <button onClick={toggleTheme} className="btn btn-ghost w-full justify-start">
              {theme === 'light' ? (
                <>
                  <Moon className="h-5 w-5 mr-2" /> Dark Mode
                </>
              ) : (
                <>
                  <Sun className="h-5 w-5 mr-2" /> Light Mode
                </>
              )}
            </button>

            {authStatus ? (
              <>
                <Link
                  to="/drafts"
                  className="btn btn-ghost w-full justify-start"
                  onClick={() => setIsMenuOpen(false)}
                >
                  My Drafts
                  <span className="badge ml-2">
                    {posts.filter((post) => post.status === 'inactive').length}
                  </span>
                </Link>
                <button
                  onClick={() => {
                    setIsMenuOpen(false)
                    // Add logout logic here
                  }}
                  className="btn btn-ghost w-full justify-start"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    document.getElementById('signup').showModal()
                    setIsMenuOpen(false)
                  }}
                  className="btn btn-outline w-full"
                >
                  Sign Up
                </button>
                <button
                  onClick={() => {
                    document.getElementById('login').showModal()
                    setIsMenuOpen(false)
                  }}
                  className="btn btn-primary w-full"
                >
                  Login
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <dialog id="signup" className="modal">
        <div className="modal-box">
          <Signup />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>

      <dialog id="login" className="modal">
        <div className="modal-box">
          <Login />
        </div>
        <form method="dialog" className="modal-backdrop">
          <button>Close</button>
        </form>
      </dialog>
    </header>
  )
}

