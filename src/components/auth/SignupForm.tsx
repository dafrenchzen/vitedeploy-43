import { useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'

export function SignupForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const { signup, signInWithGoogle } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirmPassword) {
      return setError('Passwords do not match')
    }
    try {
      setError('')
      await signup(email, password)
    } catch (error) {
      setError('Failed to create an account')
    }
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <Input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button type="submit" className="w-full bg-primary-600 hover:bg-primary-700">
          Sign Up
        </Button>
        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-dark-100 text-gray-400">Or continue with</span>
          </div>
        </div>
        <Button
          type="button"
          onClick={() => signInWithGoogle()}
          className="w-full bg-white hover:bg-gray-100 text-gray-900"
        >
          <img
            src="/google.svg"
            alt="Google"
            className="w-5 h-5 mr-2"
          />
          Sign in with Google
        </Button>
      </form>
    </div>
  )
}
