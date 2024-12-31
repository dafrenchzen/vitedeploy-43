import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  collection,
  query,
  where,
  getDocs,
  Timestamp,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { UserProfile, UserStats } from '../types/profile'
import { Beat } from '../types/beat'
import { TimeSlot } from '../types/booking'

const USERS_COLLECTION = 'users'
const BOOKINGS_COLLECTION = 'bookings'

export const profileService = {
  async getUserProfile(userId: string): Promise<UserProfile | null> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId))
      if (!userDoc.exists()) return null

      const data = userDoc.data()
      return {
        id: userDoc.id,
        ...data,
        createdAt: data.createdAt.toDate(),
        updatedAt: data.updatedAt.toDate(),
      } as UserProfile
    } catch (error) {
      console.error('Error fetching user profile:', error)
      throw new Error('Failed to fetch user profile')
    }
  },

  async updateUserProfile(
    userId: string,
    data: Partial<Omit<UserProfile, 'id' | 'createdAt' | 'updatedAt'>>
  ): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      await updateDoc(userRef, {
        ...data,
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw new Error('Failed to update user profile')
    }
  },

  async uploadProfilePhoto(
    userId: string,
    file: File
  ): Promise<string> {
    try {
      const photoRef = ref(storage, `users/${userId}/profile-photo`)
      await uploadBytes(photoRef, file)
      const photoURL = await getDownloadURL(photoRef)
      
      await this.updateUserProfile(userId, { photoURL })
      return photoURL
    } catch (error) {
      console.error('Error uploading profile photo:', error)
      throw new Error('Failed to upload profile photo')
    }
  },

  async toggleFavoriteBeat(userId: string, beatId: string): Promise<void> {
    try {
      const userRef = doc(db, USERS_COLLECTION, userId)
      const userDoc = await getDoc(userRef)
      
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }

      const favoriteBeats = userDoc.data().favoriteBeats || []
      const isFavorite = favoriteBeats.includes(beatId)

      await updateDoc(userRef, {
        favoriteBeats: isFavorite
          ? arrayRemove(beatId)
          : arrayUnion(beatId),
        updatedAt: Timestamp.now(),
      })
    } catch (error) {
      console.error('Error toggling favorite beat:', error)
      throw new Error('Failed to update favorite beats')
    }
  },

  async getFavoriteBeats(userId: string): Promise<Beat[]> {
    try {
      const userDoc = await getDoc(doc(db, USERS_COLLECTION, userId))
      if (!userDoc.exists()) return []

      const favoriteBeats = userDoc.data().favoriteBeats || []
      if (favoriteBeats.length === 0) return []

      const beatsRef = collection(db, 'beats')
      const q = query(beatsRef, where('__name__', 'in', favoriteBeats))
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as Beat[]
    } catch (error) {
      console.error('Error fetching favorite beats:', error)
      throw new Error('Failed to fetch favorite beats')
    }
  },

  async getUserBookings(userId: string): Promise<TimeSlot[]> {
    try {
      const bookingsRef = collection(db, BOOKINGS_COLLECTION)
      const q = query(
        bookingsRef,
        where('userId', '==', userId),
        where('status', 'in', ['pending', 'confirmed'])
      )
      const querySnapshot = await getDocs(q)

      return querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        createdAt: doc.data().createdAt.toDate(),
      })) as TimeSlot[]
    } catch (error) {
      console.error('Error fetching user bookings:', error)
      throw new Error('Failed to fetch user bookings')
    }
  },

  async getUserStats(userId: string): Promise<UserStats> {
    try {
      const [bookings, profile] = await Promise.all([
        this.getUserBookings(userId),
        this.getUserProfile(userId),
      ])

      const now = new Date()
      const upcomingBookings = bookings.filter(
        (booking) => new Date(booking.date) >= now
      )

      return {
        totalBookings: bookings.length,
        upcomingBookings: upcomingBookings.length,
        favoriteBeats: profile?.favoriteBeats.length || 0,
      }
    } catch (error) {
      console.error('Error fetching user stats:', error)
      throw new Error('Failed to fetch user stats')
    }
  },
}
