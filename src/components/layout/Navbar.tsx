import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../ui/Button'
import { Bars3Icon, XMarkIcon, UserCircleIcon } from '@heroicons/react/24/outline'
import { useAuth } from '../../context/AuthContext'

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const { user, signOut } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut()
      navigate('/')
    } catch (error) {
      console.error('Error logging out:', error)
    }
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-dark-900/90 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-screen-xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="text-2xl font-bold text-white">
            43ART
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className="text-gray-300 hover:text-purple-500 transition-colors duration-300"
            >
              Home
            </Link>
            <Link
              to="/studio"
              className="text-gray-300 hover:text-purple-500 transition-colors duration-300"
            >
              Studio
            </Link>
            <Link
              to="/beats"
              className="text-gray-300 hover:text-purple-500 transition-colors duration-300"
            >
              Beats
            </Link>
            <Link
              to="/booking"
              className="text-gray-300 hover:text-purple-500 transition-colors duration-300"
            >
              Booking
            </Link>
            {user && (
              <Link
                to="/profile"
                className="flex items-center space-x-2 text-white bg-purple-600 hover:bg-black px-4 py-2 rounded-lg transition-colors duration-300"
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Mon profil</span>
              </Link>
            )}
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <span className="text-gray-300">{user.email}</span>
                  <Button onClick={handleLogout} variant="outline">
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth">
                  <Button>Login</Button>
                </Link>
              )}
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-gray-300 hover:text-white"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="md:hidden py-4">
            <Link
              to="/"
              className="nav-link block px-3 py-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/studio"
              className="nav-link block px-3 py-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Studio
            </Link>
            <Link
              to="/beats"
              className="nav-link block px-3 py-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Beats
            </Link>
            <Link
              to="/booking"
              className="nav-link block px-3 py-2 rounded-lg"
              onClick={() => setIsOpen(false)}
            >
              Booking
            </Link>
            {user && (
              <Link
                to="/profile"
                className="nav-link block px-3 py-2 rounded-lg flex items-center space-x-2"
                onClick={() => setIsOpen(false)}
              >
                <UserCircleIcon className="w-5 h-5" />
                <span>Mon profil</span>
              </Link>
            )}
            <div className="pt-4 space-y-2 px-3">
              {user ? (
                <>
                  <div className="text-gray-300 mb-2">{user.email}</div>
                  <Button
                    onClick={() => {
                      handleLogout()
                      setIsOpen(false)
                    }}
                    variant="outline"
                    className="w-full"
                  >
                    Logout
                  </Button>
                </>
              ) : (
                <Link to="/auth" onClick={() => setIsOpen(false)}>
                  <Button className="w-full">Login</Button>
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  )
}
