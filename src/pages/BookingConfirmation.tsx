import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { bookingService } from '../services/bookingService'
import { TimeSlot } from '../types/booking'
import { Button } from '../components/ui/Button'
import { CheckCircleIcon } from '@heroicons/react/24/outline'

export function BookingConfirmation() {
  const { bookingId } = useParams()
  const navigate = useNavigate()
  const [booking, setBooking] = useState<TimeSlot | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchBooking = async () => {
      if (!bookingId) return
      try {
        const bookingData = await bookingService.getBookingById(bookingId)
        setBooking(bookingData)
      } catch (error) {
        console.error('Error fetching booking:', error)
        navigate('/booking')
      } finally {
        setLoading(false)
      }
    }

    fetchBooking()
  }, [bookingId, navigate])

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  if (!booking) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-red-500">
            Réservation introuvable
          </h1>
          <Button
            onClick={() => navigate('/booking')}
            className="mt-4 bg-primary-600 hover:bg-primary-700"
          >
            Retour aux réservations
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-2">Réservation confirmée !</h1>
            <p className="text-gray-400">
              Un email de confirmation a été envoyé à votre adresse
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white/5 rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Détails de la session</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-400">Date</span>
                  <span className="font-medium">
                    {format(new Date(booking.date), 'EEEE d MMMM yyyy', {
                      locale: fr,
                    })}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Heure</span>
                  <span className="font-medium">{booking.startTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Type de session</span>
                  <span className="font-medium capitalize">{booking.type}</span>
                </div>
                {booking.notes && (
                  <div className="pt-3 border-t border-white/10">
                    <span className="block text-gray-400 mb-2">Notes</span>
                    <p className="text-sm">{booking.notes}</p>
                  </div>
                )}
              </div>
            </div>

            <div className="bg-primary-900/30 rounded-lg p-6">
              <h3 className="font-medium mb-2">Rappel important</h3>
              <ul className="text-sm text-gray-300 space-y-2">
                <li>• Arrivez 10 minutes avant votre session</li>
                <li>• Apportez votre matériel si nécessaire</li>
                <li>• En cas d'empêchement, prévenez-nous 24h à l'avance</li>
              </ul>
            </div>

            <div className="flex gap-4">
              <Button
                onClick={() => navigate('/booking')}
                variant="outline"
                className="flex-1"
              >
                Retour aux réservations
              </Button>
              <Button
                onClick={() => window.print()}
                className="flex-1 bg-primary-600 hover:bg-primary-700"
              >
                Imprimer la confirmation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
