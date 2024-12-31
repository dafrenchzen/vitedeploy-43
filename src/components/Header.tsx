import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from './ui/Button'
import { UserCircleIcon } from '@heroicons/react/24/outline'
import { GiCompactDisc } from 'react-icons/gi';

export function Header() {
  const location = useLocation()
  const { user, signOut } = useAuth()

  const isActive = (path: string) => location.pathname === path

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-dark-100/80 backdrop-blur-lg border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 h-20 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2">
            <GiCompactDisc className="text-2xl text-purple-500 animate-spin-slow" />
            <span className="text-2xl font-bold">43ART</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`hover:text-primary-500 transition-colors ${
              isActive('/') ? 'text-primary-500' : 'text-gray-300'
            }`}
          >
            Accueil
          </Link>
          <Link
            to="/beats"
            className={`hover:text-primary-500 transition-colors ${
              isActive('/beats') ? 'text-primary-500' : 'text-gray-300'
            }`}
          >
            Beats
          </Link>
          <Link
            to="/booking"
            className={`hover:text-primary-500 transition-colors ${
              isActive('/booking') ? 'text-primary-500' : 'text-gray-300'
            }`}
          >
            Réserver
          </Link>
        </nav>

        {/* User Menu */}
        <div className="flex items-center space-x-4">
          {user ? (
            <div className="flex items-center space-x-4">
              <Link
                to="/profile"
                className={`flex items-center space-x-2 hover:text-primary-500 transition-colors ${
                  isActive('/profile') ? 'text-primary-500' : 'text-gray-300'
                }`}
              >
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'Profile'}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <UserCircleIcon className="w-8 h-8" />
                )}
                <span className="hidden md:inline">Mon Profil</span>
              </Link>
              <Button
                variant="outline"
                onClick={() => signOut()}
                className="hidden md:inline-flex"
              >
                Déconnexion
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>Connexion</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  )
}
