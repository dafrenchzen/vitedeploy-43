import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Button } from '../components/ui/Button'
import toast from 'react-hot-toast'

export function Auth() {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [loading, setLoading] = useState(false)
  const { signIn, signUp, signInWithGoogle } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      if (isLogin) {
        await signIn(email, password)
      } else {
        await signUp(email, password, displayName)
      }
      navigate('/profile')
    } catch (error: any) {
      console.error('Auth error:', error)
      toast.error(
        error.message || 'Une erreur est survenue lors de l\'authentification'
      )
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle()
      navigate('/profile')
    } catch (error: any) {
      console.error('Error signing in with Google:', error)
      toast.error(
        error.message || 'Une erreur est survenue lors de la connexion avec Google'
      )
    }
  }

  // Fonction pour créer un compte admin rapidement (à retirer en production)
  const handleCreateAdminAccount = async () => {
    try {
      await signUp('admin@43art.fr', 'admin123', 'Admin')
      toast.success('Compte administrateur créé avec succès')
      navigate('/admin')
    } catch (error: any) {
      console.error('Admin creation error:', error)
      toast.error(
        error.message || 'Une erreur est survenue lors de la création du compte admin'
      )
    }
  }

  return (
    <div className="min-h-screen pt-20 px-4 flex items-center justify-center">
      <div className="w-full max-w-md">
        <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <h2 className="text-2xl font-bold mb-6 text-center">
            {isLogin ? 'Connexion' : 'Inscription'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div>
                <label
                  htmlFor="displayName"
                  className="block text-sm font-medium text-gray-400 mb-1"
                >
                  Nom d'affichage
                </label>
                <input
                  type="text"
                  id="displayName"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  required={!isLogin}
                />
              </div>
            )}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Mot de passe
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                required
                minLength={6}
              />
            </div>
            <Button
              type="submit"
              className="w-full"
              disabled={loading}
            >
              {loading
                ? 'Chargement...'
                : isLogin
                ? 'Se connecter'
                : "S'inscrire"}
            </Button>
          </form>

          <div className="mt-4">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-dark-100/50 text-gray-400">
                  Ou continuer avec
                </span>
              </div>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full mt-4"
              onClick={handleGoogleSignIn}
            >
              <img
                src="https://www.google.com/favicon.ico"
                alt="Google"
                className="w-5 h-5 mr-2"
              />
              Google
            </Button>
          </div>

          <p className="mt-4 text-center text-sm text-gray-400">
            {isLogin ? "Pas encore de compte ? " : "Déjà un compte ? "}
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-primary-500 hover:text-primary-400 font-medium"
            >
              {isLogin ? "S'inscrire" : "Se connecter"}
            </button>
          </p>

          {/* Bouton temporaire pour créer un compte admin (à retirer en production) */}
          <div className="mt-8 pt-4 border-t border-white/10">
            <Button
              onClick={handleCreateAdminAccount}
              variant="outline"
              className="w-full"
            >
              Créer un compte administrateur
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
