import { useState, useEffect } from 'react'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { useAuth } from '../context/AuthContext'
import { profileService } from '../services/profileService'
import { bookingService } from '../services/bookingService'
import { beatService } from '../services/beatService'
import { Tab } from '@headlessui/react'
import { Button } from '../components/ui/Button'
import { TimeSlot } from '../types/booking'
import { Beat } from '../types/beat'
import toast from 'react-hot-toast'
import { Dialog } from '@headlessui/react'

export function Profile() {
  const { user, userProfile, updateUserProfile } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [displayName, setDisplayName] = useState('')
  const [bookings, setBookings] = useState<TimeSlot[]>([])
  const [favoriteBeats, setFavoriteBeats] = useState<Beat[]>([])
  const [loading, setLoading] = useState(true)
  const [editingBooking, setEditingBooking] = useState<TimeSlot | null>(null)
  const [isEditingBooking, setIsEditingBooking] = useState(false)
  const [bookingNotes, setBookingNotes] = useState('')
  const [bookingToCancel, setBookingToCancel] = useState<TimeSlot | null>(null)
  const [isCancelDialogOpen, setIsCancelDialogOpen] = useState(false)

  useEffect(() => {
    if (userProfile) {
      setDisplayName(userProfile.displayName || '')
    }
  }, [userProfile])

  useEffect(() => {
    const fetchBookings = async () => {
      if (user) {
        try {
          const userBookings = await bookingService.getBookingsForUser(user.uid)
          setBookings(userBookings)
        } catch (error) {
          console.error('Error fetching bookings:', error)
          toast.error('Erreur lors de la récupération des réservations')
        }
      }
    }

    const fetchFavoriteBeats = async () => {
      if (userProfile?.favoriteBeats) {
        try {
          const beats = await Promise.all(
            userProfile.favoriteBeats.map((beatId) =>
              beatService.getBeatById(beatId)
            )
          )
          setFavoriteBeats(beats.filter((beat): beat is Beat => beat !== null))
        } catch (error) {
          console.error('Error fetching favorite beats:', error)
          toast.error('Erreur lors de la récupération des beats favoris')
        }
      }
    }

    const loadData = async () => {
      setLoading(true)
      await Promise.all([fetchBookings(), fetchFavoriteBeats()])
      setLoading(false)
    }

    loadData()
  }, [user, userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await updateUserProfile({
        displayName,
      })
      setIsEditing(false)
      toast.success('Profil mis à jour avec succès')
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Erreur lors de la mise à jour du profil')
    }
  }

  const handleCancelBooking = async (booking: TimeSlot) => {
    setBookingToCancel(booking)
    setIsCancelDialogOpen(true)
  }

  const confirmCancelBooking = async () => {
    if (!bookingToCancel?.id) return

    try {
      await bookingService.cancelBooking(bookingToCancel.id)
      // Mettre à jour la liste des réservations
      setBookings(bookings.map(booking => 
        booking.id === bookingToCancel.id 
          ? { ...booking, status: 'cancelled' } 
          : booking
      ))
      toast.success('Réservation annulée avec succès')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      toast.error('Erreur lors de l\'annulation de la réservation')
    } finally {
      setIsCancelDialogOpen(false)
      setBookingToCancel(null)
    }
  }

  const updateProfilePhoto = async (file: File) => {
    try {
      await updateUserProfile({
        photoURL: URL.createObjectURL(file),
      })
      toast.success('Photo de profil mise à jour avec succès')
    } catch (error) {
      console.error('Error updating profile photo:', error)
      toast.error('Erreur lors de la mise à jour de la photo de profil')
    }
  }

  if (!user || !userProfile) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-400">
              Vous devez être connecté pour accéder à cette page
            </p>
          </div>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-400">Chargement...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8 mb-8">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-6">
              <div className="relative group">
                <div className="w-20 h-20 rounded-full overflow-hidden bg-white/5">
                  {userProfile?.photoURL ? (
                    <img
                      src={userProfile.photoURL}
                      alt={userProfile.displayName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg
                        className="w-8 h-8"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                        />
                      </svg>
                    </div>
                  )}
                  
                  <label
                    htmlFor="photo-upload"
                    className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  >
                    <span className="text-white text-sm">Changer</span>
                  </label>
                  <input
                    type="file"
                    id="photo-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files?.[0]
                      if (file) {
                        updateProfilePhoto(file).catch((error) => {
                          console.error('Error updating profile photo:', error)
                          toast.error('Erreur lors de la mise à jour de la photo')
                        })
                      }
                    }}
                  />
                </div>
              </div>
              
              <div>
                <h2 className="text-2xl font-bold">Profil</h2>
                {!isEditing && userProfile?.displayName && (
                  <p className="text-gray-400">{userProfile.displayName}</p>
                )}
              </div>
            </div>
            
            {!isEditing && (
              <Button onClick={() => setIsEditing(true)} variant="outline">
                Modifier
              </Button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
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
                />
              </div>
              <div className="flex gap-4">
                <Button type="submit">Enregistrer</Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false)
                    setDisplayName(userProfile.displayName || '')
                  }}
                >
                  Annuler
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div>
                <p className="text-sm text-gray-400">Nom d'affichage</p>
                <p>{userProfile.displayName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Email</p>
                <p>{user.email}</p>
              </div>
            </div>
          )}
        </div>

        <Tab.Group>
          <Tab.List className="flex space-x-1 rounded-xl bg-dark-100/50 backdrop-blur-lg p-1 mb-8">
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${
                  selected
                    ? 'bg-white/10 text-white shadow'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              Réservations
            </Tab>
            <Tab
              className={({ selected }) =>
                `w-full rounded-lg py-2.5 text-sm font-medium leading-5
                ${
                  selected
                    ? 'bg-white/10 text-white shadow'
                    : 'text-gray-400 hover:bg-white/5 hover:text-white'
                }`
              }
            >
              Beats favoris
            </Tab>
          </Tab.List>
          <Tab.Panels>
            <Tab.Panel>
              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Aucune réservation pour le moment
                  </div>
                ) : (
                  bookings.map((booking) => (
                    <div
                      key={booking.id}
                      className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10"
                    >
                      <div className="flex justify-between items-start">
                        <div className="space-y-2">
                          <div>
                            <h3 className="text-lg font-semibold">
                              {format(booking.date, 'EEEE d MMMM yyyy', { locale: fr })}
                            </h3>
                            <p className="text-gray-400">
                              {booking.startTime}
                              {booking.endTime ? ` - ${booking.endTime}` : ''}
                            </p>
                          </div>
                          
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="px-2 py-1 bg-white/5 rounded text-sm">
                                {booking.type === 'recording' ? 'Music' : 'Photographie'}
                              </span>
                              <span className={`text-sm ${
                                booking.status === 'cancelled' 
                                  ? 'text-red-500' 
                                  : booking.status === 'confirmed' 
                                  ? 'text-green-500' 
                                  : 'text-yellow-500'
                              }`}>
                                {booking.status === 'cancelled' && '• Annulée'}
                                {booking.status === 'confirmed' && '• Confirmée'}
                                {booking.status === 'pending' && '• En attente'}
                              </span>
                            </div>
                            
                            {booking.notes && (
                              <div className="text-sm text-gray-400">
                                {booking.notes.replace('Options sélectionnées: ', '')}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2">
                          {booking.status !== 'cancelled' && (
                            <Button
                              variant="danger"
                              onClick={() => handleCancelBooking(booking)}
                              className="w-full"
                            >
                              Annuler
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Tab.Panel>
            <Tab.Panel>
              <div className="space-y-4">
                {favoriteBeats.length === 0 ? (
                  <div className="text-center py-12 text-gray-400">
                    Aucun beat favori pour le moment
                  </div>
                ) : (
                  favoriteBeats.map((beat) => (
                    <div
                      key={beat.id}
                      className="bg-dark-100/50 backdrop-blur-lg rounded-xl border border-white/10 p-6"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-medium mb-1">{beat.title}</h3>
                          <p className="text-sm text-gray-400">
                            Produit par {beat.producer}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{beat.price}€</p>
                          <p className="text-sm text-gray-400">{beat.bpm} BPM</p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Tab.Panel>
          </Tab.Panels>
        </Tab.Group>
      </div>

      {/* Boîte de dialogue de confirmation d'annulation */}
      <Dialog
        open={isCancelDialogOpen}
        onClose={() => setIsCancelDialogOpen(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30" aria-hidden="true" />
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="bg-dark-100 rounded-xl p-6 max-w-sm mx-auto">
            <Dialog.Title className="text-lg font-semibold mb-4">
              Confirmer l'annulation
            </Dialog.Title>
            <p className="text-gray-300 mb-6">
              Êtes-vous sûr de vouloir annuler cette réservation ?
              {bookingToCancel && (
                <span className="block mt-2 text-sm">
                  {format(bookingToCancel.date, 'EEEE d MMMM yyyy', { locale: fr })} à{' '}
                  {bookingToCancel.startTime}
                  {bookingToCancel.endTime ? ` - ${bookingToCancel.endTime}` : ''}
                </span>
              )}
            </p>
            <div className="flex justify-end gap-3">
              <Button
                variant="secondary"
                onClick={() => setIsCancelDialogOpen(false)}
              >
                Annuler
              </Button>
              <Button
                variant="danger"
                onClick={confirmCancelBooking}
              >
                Confirmer
              </Button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>

      {/* Modal de modification de réservation */}
      <Dialog
        open={isEditingBooking}
        onClose={() => setIsEditingBooking(false)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
        
        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="mx-auto max-w-lg rounded-2xl bg-dark-100/95 backdrop-blur-lg border border-white/10 p-6">
            <Dialog.Title className="text-lg font-medium mb-4">
              Modifier la réservation
            </Dialog.Title>

            {editingBooking && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-400 mb-1">Date et heure</p>
                  <p>
                    {format(editingBooking.date, 'EEEE d MMMM yyyy', {
                      locale: fr,
                    })}
                    {' à '}
                    {editingBooking.startTime}
                  </p>
                </div>

                <div>
                  <label
                    htmlFor="notes"
                    className="block text-sm font-medium text-gray-400 mb-1"
                  >
                    Notes
                  </label>
                  <textarea
                    id="notes"
                    value={bookingNotes}
                    onChange={(e) => setBookingNotes(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                    placeholder="Ajoutez des notes pour votre session..."
                  />
                </div>

                <div className="flex justify-end gap-4 mt-6">
                  <Button
                    variant="outline"
                    onClick={() => setIsEditingBooking(false)}
                  >
                    Annuler
                  </Button>
                  <Button
                    onClick={async () => {
                      try {
                        await bookingService.updateBooking(editingBooking.id, {
                          notes: bookingNotes,
                        })
                        const updatedBookings = await bookingService.getBookingsForUser(user.uid)
                        setBookings(updatedBookings)
                        setIsEditingBooking(false)
                        toast.success('Réservation mise à jour avec succès')
                      } catch (error) {
                        console.error('Error updating booking:', error)
                        toast.error('Erreur lors de la mise à jour de la réservation')
                      }
                    }}
                  >
                    Enregistrer
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Panel>
        </div>
      </Dialog>
    </div>
  )
}
