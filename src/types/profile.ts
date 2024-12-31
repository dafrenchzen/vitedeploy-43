import { Beat } from './beat'
import { TimeSlot } from './booking'

export interface UserProfile {
  id: string
  email: string
  displayName: string
  photoURL?: string
  phoneNumber?: string
  bio?: string
  socialLinks?: {
    instagram?: string
    twitter?: string
    soundcloud?: string
    youtube?: string
  }
  favoriteBeats: string[] // IDs des beats favoris
  createdAt: Date
  updatedAt: Date
}

export interface UserStats {
  totalBookings: number
  upcomingBookings: number
  favoriteBeats: number
}
