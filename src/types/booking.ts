export interface TimeSlot {
  id?: string
  date: string // Format: YYYY-MM-DD
  startTime: string // Format: HH:mm
  endTime?: string // Format: HH:mm
  userId: string
  userName: string
  status: 'pending' | 'confirmed' | 'cancelled'
  type: 'recording' | 'mixing' | 'mastering'
  notes?: string
  createdAt: Date
}

export type AvailableHours = {
  [key: string]: string[] // key is day of week (0-6), value is array of available start times
}

export const DEFAULT_AVAILABLE_HOURS: AvailableHours = {
  '1': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'], // Lundi
  '2': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'], // Mardi
  '3': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'], // Mercredi
  '4': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'], // Jeudi
  '5': ['10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00'], // Vendredi
  '6': ['12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'], // Samedi
  '0': [], // Dimanche - fermé
}
