import { format } from 'date-fns'
import { fr } from 'date-fns/locale'
import { DEFAULT_AVAILABLE_HOURS, TimeSlot } from '../../types/booking'

interface TimeSlotPickerProps {
  selectedDate: Date
  bookedSlots: TimeSlot[]
  onSelectTime: (startTime: string, endTime?: string) => void
  selectedTime?: string
  selectedEndTime?: string
}

export function TimeSlotPicker({
  selectedDate,
  bookedSlots,
  onSelectTime,
  selectedTime,
  selectedEndTime,
}: TimeSlotPickerProps) {
  const dayOfWeek = selectedDate.getDay().toString()
  const availableHours = DEFAULT_AVAILABLE_HOURS[dayOfWeek] || []
  const bookedTimes = new Set(bookedSlots.map((slot) => slot.startTime))

  const getNextHour = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const nextHour = parseInt(hours) + 1
    return `${nextHour.toString().padStart(2, '0')}:${minutes}`
  }

  const getPreviousHour = (time: string): string => {
    const [hours, minutes] = time.split(':')
    const prevHour = parseInt(hours) - 1
    return `${prevHour.toString().padStart(2, '0')}:${minutes}`
  }

  const handleTimeClick = (time: string) => {
    if (bookedTimes.has(time)) return

    // Si aucune heure n'est sélectionnée, sélectionner cette heure
    if (!selectedTime) {
      onSelectTime(time)
      return
    }

    // Si on clique sur l'heure déjà sélectionnée, la désélectionner
    if (time === selectedTime) {
      onSelectTime('')
      return
    }

    // Si on a déjà deux heures sélectionnées, recommencer avec celle-ci
    if (selectedTime && selectedEndTime) {
      onSelectTime(time)
      return
    }

    // Vérifier si l'heure cliquée est adjacente à l'heure sélectionnée
    const nextHour = getNextHour(selectedTime)
    const prevHour = getPreviousHour(selectedTime)

    if (time === nextHour || time === prevHour) {
      const [start, end] = time < selectedTime 
        ? [time, selectedTime] 
        : [selectedTime, time]
      onSelectTime(start, end)
    } else {
      // Si l'heure n'est pas adjacente, commencer une nouvelle sélection
      onSelectTime(time)
    }
  }

  return (
    <div className="p-4 bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10">
      <h3 className="text-lg font-semibold mb-4">
        Horaires disponibles pour le{' '}
        {format(selectedDate, 'EEEE d MMMM', { locale: fr })}
      </h3>
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
        {availableHours.map((time) => {
          const isBooked = bookedTimes.has(time)
          const isSelected = time === selectedTime || time === selectedEndTime
          const isInRange = selectedTime && selectedEndTime && 
            time >= selectedTime && time <= selectedEndTime

          return (
            <button
              key={time}
              onClick={() => handleTimeClick(time)}
              disabled={isBooked}
              className={`
                px-4 py-2 rounded-lg text-sm font-medium transition-colors
                ${
                  isBooked
                    ? 'bg-red-500/10 text-red-500 cursor-not-allowed'
                    : isSelected || isInRange
                    ? 'bg-primary-600 text-white'
                    : 'bg-white/5 text-white hover:bg-white/10'
                }
              `}
            >
              {time}
            </button>
          )
        })}
      </div>
    </div>
  )
}
