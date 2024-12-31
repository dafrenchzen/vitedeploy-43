import { useState, useEffect } from 'react'
import { beatService } from '../services/beatService'
import { AudioPlayer } from '../components/player/AudioPlayer'
import { Beat, MusicStyle } from '../types/beat'
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'
import toast from 'react-hot-toast'

const MUSIC_STYLES: MusicStyle[] = [
  'Trap',
  'Drill',
  'RnB',
  'Rap',
  'Afro',
  'Pop',
  'Dancehall',
  'Cloud',
  'Boom Bap',
]

export function Beats() {
  const [beats, setBeats] = useState<Beat[]>([])
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStyle, setSelectedStyle] = useState<MusicStyle | ''>('')
  const [filteredBeats, setFilteredBeats] = useState<Beat[]>([])

  useEffect(() => {
    const loadBeats = async () => {
      try {
        setLoading(true)
        const allBeats = await beatService.getAllBeats()
        setBeats(allBeats)
        setFilteredBeats(allBeats)
      } catch (error) {
        console.error('Error loading beats:', error)
        toast.error('Erreur lors du chargement des beats')
      } finally {
        setLoading(false)
      }
    }

    loadBeats()
  }, [])

  useEffect(() => {
    let filtered = beats

    // Filtre par style
    if (selectedStyle) {
      filtered = filtered.filter((beat) => beat.style === selectedStyle)
    }

    // Filtre par recherche
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (beat) =>
          beat.title.toLowerCase().includes(searchLower) ||
          beat.producer.toLowerCase().includes(searchLower)
      )
    }

    setFilteredBeats(filtered)
  }, [searchTerm, selectedStyle, beats])

  const handleNext = () => {
    if (currentBeat) {
      const currentIndex = filteredBeats.findIndex(
        (beat) => beat.id === currentBeat.id
      )
      if (currentIndex < filteredBeats.length - 1) {
        setCurrentBeat(filteredBeats[currentIndex + 1])
      }
    }
  }

  const handlePrevious = () => {
    if (currentBeat) {
      const currentIndex = filteredBeats.findIndex(
        (beat) => beat.id === currentBeat.id
      )
      if (currentIndex > 0) {
        setCurrentBeat(filteredBeats[currentIndex - 1])
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 pb-32 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
          <h1 className="text-3xl font-bold">Beats</h1>
          
          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            {/* Filtre par style */}
            <select
              value={selectedStyle}
              onChange={(e) => setSelectedStyle(e.target.value as MusicStyle | '')}
              className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent md:w-48"
            >
              <option value="">Tous les styles</option>
              {MUSIC_STYLES.map((style) => (
                <option key={style} value={style}>
                  {style}
                </option>
              ))}
            </select>

            {/* Barre de recherche */}
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredBeats.map((beat) => (
            <div
              key={beat.id}
              className="bg-dark-100/50 backdrop-blur-lg rounded-xl border border-white/10 p-6 hover:border-primary-500/50 transition-colors cursor-pointer group"
              onClick={() => setCurrentBeat(beat)}
            >
              <div className="relative aspect-square mb-4 overflow-hidden rounded-lg">
                {beat.imageUrl ? (
                  <img
                    src={beat.imageUrl}
                    alt={beat.title}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center">
                    <MusicalNoteIcon className="w-12 h-12 text-white/20" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    setCurrentBeat(beat)
                  }}
                  className="absolute inset-0 flex items-center justify-center bg-black/0 hover:bg-black/40 transition-colors"
                >
                  <div className="w-16 h-16 rounded-full bg-primary-500 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:scale-110 duration-300">
                    {currentBeat?.id === beat.id ? (
                      <div className="w-4 h-4 bg-white rounded-sm" />
                    ) : (
                      <div className="w-0 h-0 border-l-[10px] border-l-white border-y-[6px] border-y-transparent ml-1" />
                    )}
                  </div>
                </button>
              </div>

              <h3 className="font-medium mb-1 group-hover:text-primary-500 transition-colors">
                {beat.title}
              </h3>
              <p className="text-sm text-gray-400">{beat.producer}</p>

              <div className="mt-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 text-xs bg-white/5 rounded-full">
                    {beat.style}
                  </span>
                  <span className="text-sm text-gray-400">
                    {Math.floor(beat.duration / 60)}:
                    {Math.floor(beat.duration % 60)
                      .toString()
                      .padStart(2, '0')}
                  </span>
                </div>
                <p className="font-medium">{beat.price}€</p>
              </div>
            </div>
          ))}
        </div>

        {filteredBeats.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-400">Aucun beat trouvé</p>
          </div>
        )}
      </div>

      <AudioPlayer
        currentBeat={currentBeat}
        playlist={filteredBeats}
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
    </div>
  )
}
