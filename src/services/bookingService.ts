import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  updateDoc,
  doc,
  getDoc,
  Timestamp,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore'
import { db } from '../config/firebase'
import { TimeSlot } from '../types/booking'
import { auth } from '../config/firebase'

const BOOKINGS_COLLECTION = 'bookings'

class BookingError extends Error {
  constructor(message: string, public code?: string) {
    super(message)
    this.name = 'BookingError'
  }
}

export const bookingService = {
  async getBookingsForDate(date: string): Promise<TimeSlot[]> {
    try {
      const bookingsRef = collection(db, 'bookings')
      const startOfDay = new Date(date)
      startOfDay.setHours(0, 0, 0, 0)
      
      const endOfDay = new Date(date)
      endOfDay.setHours(23, 59, 59, 999)

      const q = query(
        bookingsRef,
        where('date', '>=', startOfDay),
        where('date', '<=', endOfDay)
      )

      const querySnapshot = await getDocs(q)
      
      return querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          date: data.date?.toDate() || new Date(),
        }
      }) as TimeSlot[]
    } catch (error) {
      console.error('Error fetching bookings:', error)
      throw new BookingError(
        'Impossible de récupérer les réservations.',
        'FETCH_ERROR'
      )
    }
  },

  async createBooking(booking: Omit<TimeSlot, 'id' | 'createdAt'>): Promise<string> {
    try {
      // Vérifier si le créneau est déjà réservé
      const existingBookings = await this.getBookingsForDate(booking.date)
      const isSlotTaken = existingBookings.some(
        (existing) => existing.startTime === booking.startTime
      )

      if (isSlotTaken) {
        throw new BookingError(
          'Ce créneau est déjà réservé.',
          'SLOT_ALREADY_BOOKED'
        )
      }

      // Ensure user is authenticated
      if (!auth.currentUser) {
        throw new BookingError(
          'Vous devez être connecté pour effectuer une réservation.',
          'AUTH_REQUIRED'
        )
      }

      const bookingRef = await addDoc(collection(db, 'bookings'), {
        ...booking,
        status: 'pending',
        date: new Date(booking.date),
        createdAt: serverTimestamp(),
        userId: auth.currentUser.uid,
        userName: auth.currentUser.email || '',
      })

      // Email confirmation is optional - don't throw error if it fails
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000'
      try {
        await fetch(`${API_URL}/api/sendBookingConfirmation`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            bookingId: bookingRef.id,
            ...booking,
          }),
        })
      } catch (error) {
        // Just log the error but don't prevent booking creation
        console.warn('Note: Booking confirmation email could not be sent:', error)
      }

      return bookingRef.id
    } catch (error) {
      console.error('Error creating booking:', error)
      if (error instanceof BookingError) {
        throw error
      }
      throw new BookingError(
        'Impossible de créer la réservation.',
        'CREATE_ERROR'
      )
    }
  },

  async getBookingById(bookingId: string): Promise<TimeSlot | null> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      const bookingDoc = await getDoc(bookingRef)

      if (!bookingDoc.exists()) {
        return null
      }

      const data = bookingDoc.data();
      return {
        id: bookingDoc.id,
        ...data,
        createdAt: data.createdAt?.toDate() || new Date(),
        date: data.date?.toDate() || new Date(),
      } as TimeSlot
    } catch (error) {
      console.error('Error fetching booking:', error)
      throw new BookingError(
        'Impossible de récupérer la réservation. Veuillez réessayer.',
        'FETCH_ERROR'
      )
    }
  },

  async updateBookingStatus(
    bookingId: string,
    status: TimeSlot['status']
  ): Promise<void> {
    try {
      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      await updateDoc(bookingRef, { status })
    } catch (error) {
      console.error('Error updating booking status:', error)
      throw new BookingError(
        'Impossible de mettre à jour le statut de la réservation.',
        'UPDATE_ERROR'
      )
    }
  },

  async cancelBooking(bookingId: string): Promise<void> {
    try {
      await this.updateBookingStatus(bookingId, 'cancelled')
    } catch (error) {
      console.error('Error cancelling booking:', error)
      throw new BookingError(
        'Impossible d\'annuler la réservation.',
        'CANCEL_ERROR'
      )
    }
  },

  async getBookingsForUser(userId: string): Promise<TimeSlot[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(bookingsRef, where('userId', '==', userId))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          createdAt: data.createdAt?.toDate() || new Date(),
          date: data.date?.toDate() || new Date(),
        };
      }) as TimeSlot[]
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw new BookingError(
        'Impossible de récupérer vos réservations.',
        'FETCH_ERROR'
      )
    }
  },

  async updateBooking(
    bookingId: string,
    updates: Partial<Omit<TimeSlot, 'id' | 'createdAt' | 'userId'>>
  ): Promise<void> {
    try {
      const currentUser = auth.currentUser
      if (!currentUser) {
        throw new BookingError(
          'Vous devez être connecté pour modifier une réservation.',
          'AUTH_REQUIRED'
        )
      }

      const bookingRef = doc(db, BOOKINGS_COLLECTION, bookingId)
      const bookingDoc = await getDoc(bookingRef)

      if (!bookingDoc.exists()) {
        throw new BookingError(
          'Cette réservation n\'existe pas.',
          'NOT_FOUND'
        )
      }

      const bookingData = bookingDoc.data()
      if (bookingData.userId !== currentUser.uid) {
        throw new BookingError(
          'Vous n\'êtes pas autorisé à modifier cette réservation.',
          'PERMISSION_DENIED'
        )
      }

      if (bookingData.status === 'cancelled') {
        throw new BookingError(
          'Impossible de modifier une réservation annulée.',
          'INVALID_STATUS'
        )
      }

      await updateDoc(bookingRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating booking:', error)
      if (error instanceof BookingError) {
        throw error
      }
      throw new BookingError(
        'Impossible de modifier la réservation. Veuillez réessayer.',
        'UPDATE_ERROR'
      )
    }
  },
}
