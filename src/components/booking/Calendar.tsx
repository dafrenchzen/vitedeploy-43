import { useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DEFAULT_AVAILABLE_HOURS } from '../../types/booking'
import 'react-day-picker/dist/style.css'

interface CalendarProps {
  selectedDate: Date | undefined
  onSelect: (date: Date | undefined) => void
  bookedDates?: Date[]
}

export function Calendar({ selectedDate, onSelect, bookedDates = [] }: CalendarProps) {
  const [month, setMonth] = useState<Date>(new Date())

  // Désactiver les dimanches et les dates passées
  const disabledDays = [
    { dayOfWeek: [0] }, // Dimanche
    { before: new Date() },
  ]

  // Style personnalisé pour les jours avec des réservations
  const modifiersStyles = {
    booked: {
      backgroundColor: 'rgba(239, 68, 68, 0.1)',
      color: '#ef4444',
    },
    selected: {
      backgroundColor: 'rgb(147, 51, 234)',
      color: 'white',
    },
  }

  const modifiers = {
    booked: bookedDates,
  }

  return (
    <div className="p-4 bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10">
      <style>
        {`
          .rdp {
            --rdp-cell-size: 40px;
            --rdp-accent-color: rgb(147, 51, 234);
            --rdp-background-color: rgb(147, 51, 234, 0.3);
            margin: 0;
          }
          .rdp-day_selected:not([disabled]) { 
            background-color: rgb(147, 51, 234);
            color: white;
          }
          .rdp-day_selected:hover:not([disabled]) { 
            background-color: rgb(147, 51, 234, 0.8);
          }
          .rdp-day:hover:not([disabled]) { 
            background-color: rgba(255, 255, 255, 0.1);
          }
          .rdp-head_cell {
            color: rgb(156 163 175);
            font-weight: 500;
            font-size: 0.875rem;
          }
          .rdp-day {
            color: white;
            font-size: 0.875rem;
          }
          .rdp-day_disabled {
            color: rgb(75 85 99);
          }
          .rdp-nav_button {
            color: white;
          }
          .rdp-nav_button:hover {
            background-color: rgba(255, 255, 255, 0.1);
          }
          .rdp-caption {
            color: white;
            font-size: 1rem;
            font-weight: 500;
          }
        `}
      </style>
      <DayPicker
        mode="single"
        selected={selectedDate}
        onSelect={onSelect}
        month={month}
        onMonthChange={setMonth}
        disabled={disabledDays}
        modifiers={modifiers}
        modifiersStyles={modifiersStyles}
        locale={fr}
        showOutsideDays
        className="rdp-custom"
      />
    </div>
  )
}
