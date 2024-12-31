import { useState } from 'react'
import { Button } from '../ui/Button'
import { Input } from '../ui/Input'
import { TimeSlot } from '../../types/booking'
import { ExclamationCircleIcon } from '@heroicons/react/24/outline'

interface BookingFormProps {
  selectedDate: string
  selectedTime: string
  onSubmit: (booking: Omit<TimeSlot, 'id' | 'createdAt'>) => Promise<void>
}

export function BookingForm({
  selectedDate,
  selectedTime,
  onSubmit,
}: BookingFormProps) {
  const [sessionCategory, setSessionCategory] = useState<'music' | 'photo'>('music')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sessionOptions = {
    music: ['Recording', 'Mixing', 'Mastering'],
    photo: ['Shooting', 'Video', 'Lights'],
  }

  const handleOptionToggle = (option: string) => {
    setSelectedOptions(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option]
    )
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedOptions.length === 0) {
      setError('Veuillez sélectionner au moins une option')
      return
    }
    
    setIsSubmitting(true)
    setError(null)

    try {
      // Convertir les options sélectionnées en un type valide pour Firebase
      const bookingType = sessionCategory === 'music' ? 'recording' : 'photo'
      
      await onSubmit({
        date: selectedDate,
        startTime: selectedTime,
        endTime: selectedTime,
        type: bookingType,
        notes: `Options sélectionnées: ${selectedOptions.join(', ')}`,
        status: 'pending',
        userId: '',
        userName: '',
      })
    } catch (error) {
      console.error('Error submitting booking:', error)
      if (error instanceof Error) {
        setError(error.message)
      } else {
        setError('Une erreur est survenue lors de la réservation.')
      }
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 flex items-start gap-3">
          <ExclamationCircleIcon className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-500">{error}</p>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          Type de session
        </label>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {(['music', 'photo'] as const).map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => {
                setSessionCategory(category)
                setSelectedOptions([])
              }}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  sessionCategory === category
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }
              `}
            >
              {category === 'music' ? 'Music' : 'Photographie'}
            </button>
          ))}
        </div>

        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-300 mb-2">
            Options
          </label>
          <div className="space-y-2">
            {sessionOptions[sessionCategory].map((option) => (
              <label
                key={option}
                className="flex items-center space-x-2 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedOptions.includes(option)}
                  onChange={() => handleOptionToggle(option)}
                  className="w-4 h-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                />
                <span className="text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-300 mb-2"
        >
          Notes pour la session
        </label>
        <textarea
          id="notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
          rows={4}
          placeholder="Décrivez vos besoins pour la session..."
        />
      </div>

      <Button
        type="submit"
        disabled={isSubmitting || selectedOptions.length === 0}
        className="w-full"
      >
        {isSubmitting ? 'Réservation en cours...' : 'Confirmer la réservation'}
      </Button>
    </form>
  )
}
