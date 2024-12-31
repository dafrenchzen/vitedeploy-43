import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { Calendar } from '../components/booking/Calendar'
import { TimeSlotPicker } from '../components/booking/TimeSlotPicker'
import { BookingForm } from '../components/booking/BookingForm'
import { bookingService } from '../services/bookingService'
import { TimeSlot } from '../types/booking'

export function Booking() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [selectedTime, setSelectedTime] = useState<string>()
  const [selectedEndTime, setSelectedEndTime] = useState<string>()
  const [bookings, setBookings] = useState<TimeSlot[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (selectedDate) {
      const fetchBookings = async () => {
        try {
          const dateStr = format(selectedDate, 'yyyy-MM-dd')
          const dayBookings = await bookingService.getBookingsForDate(dateStr)
          setBookings(dayBookings)
        } catch (error) {
          console.error('Error fetching bookings:', error)
        } finally {
          setLoading(false)
        }
      }
      fetchBookings()
    }
  }, [selectedDate])

  const handleTimeSelect = (startTime: string, endTime?: string) => {
    setSelectedTime(startTime)
    setSelectedEndTime(endTime)
  }

  const handleBookingSubmit = async (
    bookingData: Omit<TimeSlot, 'id' | 'createdAt' | 'startTime' | 'endTime'>
  ) => {
    if (!user || !selectedTime) return

    try {
      const bookingId = await bookingService.createBooking({
        ...bookingData,
        userId: user.uid,
        userName: user.email || '',
        startTime: selectedTime,
        endTime: selectedEndTime || selectedTime,
      })

      // Rediriger vers la page de confirmation
      navigate(`/booking/confirmation/${bookingId}`)
    } catch (error) {
      console.error('Error creating booking:', error)
    }
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white">
      {/* Hero Section */}
      <div className="relative py-32 bg-gradient-to-b from-purple-900/20 via-dark-900/50 to-dark-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-6">
            <h1 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent">
              Book Your Session
            </h1>
            <p className="text-2xl text-gray-300 max-w-2xl mx-auto">
              Choose your perfect time slot and start creating with us
            </p>
          </div>
        </div>
      </div>

      {/* Booking Module Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 mb-20">
        <div className="bg-dark-800 rounded-2xl shadow-2xl p-8 border border-gray-700">
          <div className="grid md:grid-cols-[1fr,1fr] gap-8">
            <div className="space-y-8">
              <Calendar
                selectedDate={selectedDate}
                onSelect={setSelectedDate}
                bookedDates={bookings.map((b) => new Date(b.date))}
              />
              {selectedDate && (
                <TimeSlotPicker
                  selectedDate={selectedDate}
                  bookedSlots={bookings}
                  onSelectTime={handleTimeSelect}
                  selectedTime={selectedTime}
                  selectedEndTime={selectedEndTime}
                />
              )}
            </div>

            <div>
              {selectedDate && selectedTime ? (
                <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
                  <h2 className="text-xl font-semibold mb-4">
                    Détails de la réservation
                  </h2>
                  <div className="mb-6 space-y-2">
                    <p className="text-gray-300">
                      Date:{' '}
                      <span className="text-white">
                        {format(selectedDate, 'EEEE d MMMM yyyy')}
                      </span>
                    </p>
                    <p className="text-gray-300">
                      Heure: <span className="text-white">{selectedTime}</span> -{' '}
                      <span className="text-white">{selectedEndTime}</span>
                    </p>
                  </div>
                  <BookingForm
                    selectedDate={format(selectedDate, 'yyyy-MM-dd')}
                    selectedTime={selectedTime}
                    selectedEndTime={selectedEndTime}
                    onSubmit={handleBookingSubmit}
                  />
                </div>
              ) : (
                <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6 text-center">
                  <p className="text-gray-400">
                    Sélectionnez une date et un horaire pour continuer
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Information Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-20">
        {/* Session Types */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
            <div className="text-purple-500 text-4xl mb-4">1h</div>
            <h3 className="text-xl font-semibold mb-3">Quick Session</h3>
            <p className="text-gray-400 mb-4">
              Perfect for recording singles or quick projects. Includes basic mixing.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Recording time: 1 hour</li>
              <li>• Basic mix included</li>
              <li>• 1 revision included</li>
              <li>• Ideal for singles</li>
            </ul>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
            <div className="text-purple-500 text-4xl mb-4">2h</div>
            <h3 className="text-xl font-semibold mb-3">Standard Session</h3>
            <p className="text-gray-400 mb-4">
              Our most popular option. Perfect for multiple tracks or complex recordings.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Recording time: 2 hours</li>
              <li>• Professional mixing included</li>
              <li>• 2 revisions included</li>
              <li>• Ideal for EPs or multiple songs</li>
            </ul>
          </div>

          <div className="bg-dark-800 rounded-xl p-6 border border-gray-700">
            <div className="text-purple-500 text-4xl mb-4">Custom</div>
            <h3 className="text-xl font-semibold mb-3">Project Session</h3>
            <p className="text-gray-400 mb-4">
              For larger projects requiring extended studio time.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>• Flexible recording time</li>
              <li>• Full mixing & mastering</li>
              <li>• Unlimited revisions</li>
              <li>• Ideal for albums or large projects</li>
            </ul>
          </div>
        </div>

        {/* Studio Equipment */}
        <div className="bg-dark-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Professional Equipment</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <h3 className="text-purple-500 font-semibold mb-3">Microphones</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Neumann TLM 103</li>
                <li>• Shure SM7B</li>
                <li>• AKG C414</li>
                <li>• And more...</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-500 font-semibold mb-3">Processing</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Universal Audio Apollo</li>
                <li>• SSL Preamps</li>
                <li>• Pro Tools HD</li>
                <li>• Waves Plugins</li>
              </ul>
            </div>
            <div>
              <h3 className="text-purple-500 font-semibold mb-3">Monitoring</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Focal Shape 65</li>
                <li>• Yamaha HS8</li>
                <li>• Beyerdynamic DT 990 Pro</li>
                <li>• Treated acoustic room</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Booking Policy */}
        <div className="bg-dark-800 rounded-xl p-8 border border-gray-700">
          <h2 className="text-2xl font-bold mb-6">Booking Policy</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-purple-500 font-semibold">Before Your Session</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Book at least 24 hours in advance</li>
                <li>• Prepare your material beforehand</li>
                <li>• Bring your audio files on USB drive</li>
                <li>• Arrive 10 minutes before your session</li>
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-purple-500 font-semibold">Cancellation Policy</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• Free cancellation up to 48h before</li>
                <li>• 50% fee within 48h of session</li>
                <li>• 100% fee for no-shows</li>
                <li>• One free reschedule allowed</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
