import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/Button'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Mot de passe admin en dur (à remplacer par une vérification plus sécurisée)
    if (password === '43art2024') {
      // Stocker un token dans le localStorage
      localStorage.setItem('adminToken', 'true')
      navigate('/admin')
    } else {
      setError('Mot de passe incorrect')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary-900 via-dark-300 to-dark-300">
      <div className="max-w-md w-full space-y-8 p-8 bg-dark-800 rounded-xl shadow-lg">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white">
            Administration
          </h2>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="password" className="sr-only">
              Mot de passe
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              className="appearance-none rounded-lg relative block w-full px-3 py-2 border border-dark-600 placeholder-gray-500 text-white bg-dark-700 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe administrateur"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}

          <Button type="submit" className="w-full">
            Se connecter
          </Button>
        </form>
      </div>
    </div>
  )
}
