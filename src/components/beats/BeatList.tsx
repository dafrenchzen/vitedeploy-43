import { useState } from 'react'
import {
  PlayIcon,
  PauseIcon,
  HeartIcon,
  ShoppingCartIcon,
} from '@heroicons/react/24/solid'
import { Beat } from '../../types/beat'
import { beatService } from '../../services/beatService'

interface BeatListProps {
  beats: Beat[]
  currentBeat: Beat | null
  isPlaying: boolean
  onBeatSelect: (beat: Beat) => void
}

export function BeatList({
  beats,
  currentBeat,
  isPlaying,
  onBeatSelect,
}: BeatListProps) {
  const [hoveredBeat, setHoveredBeat] = useState<string | null>(null)

  const handleLike = async (beatId: string, e: React.MouseEvent) => {
    e.stopPropagation()
    await beatService.toggleLike(beatId)
  }

  return (
    <div className="space-y-2">
      {beats.map((beat) => {
        const isCurrentBeat = currentBeat?.id === beat.id
        const showPlayIcon = hoveredBeat === beat.id || isCurrentBeat

        return (
          <div
            key={beat.id}
            className={`group relative flex items-center gap-4 p-4 rounded-xl transition-colors cursor-pointer ${
              isCurrentBeat
                ? 'bg-primary-600/20 hover:bg-primary-600/30'
                : 'hover:bg-white/5'
            }`}
            onClick={() => onBeatSelect(beat)}
            onMouseEnter={() => setHoveredBeat(beat.id)}
            onMouseLeave={() => setHoveredBeat(null)}
          >
            {/* Image/Play button */}
            <div className="relative w-16 h-16 flex-shrink-0">
              {beat.imageUrl ? (
                <img
                  src={beat.imageUrl}
                  alt={beat.title}
                  className="w-full h-full rounded-lg object-cover"
                />
              ) : (
                <div className="w-full h-full rounded-lg bg-white/5 flex items-center justify-center">
                  <PlayIcon className="w-8 h-8 text-white/50" />
                </div>
              )}
              {showPlayIcon && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-lg">
                  {isCurrentBeat && isPlaying ? (
                    <PauseIcon className="w-8 h-8" />
                  ) : (
                    <PlayIcon className="w-8 h-8" />
                  )}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
              <h3 className="font-medium truncate">{beat.title}</h3>
              <p className="text-sm text-gray-400 truncate">{beat.producer}</p>
              <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                <span>{beat.bpm} BPM</span>
                {beat.key && <span>{beat.key}</span>}
                <span>{beat.plays} plays</span>
                <span>{beat.likes} likes</span>
              </div>
            </div>

            {/* Tags */}
            <div className="hidden md:flex items-center gap-2">
              {beat.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-1 text-xs rounded-full bg-white/5"
                >
                  {tag}
                </span>
              ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-3">
              <button
                onClick={(e) => handleLike(beat.id, e)}
                className="p-2 hover:bg-white/10 rounded-full transition-colors"
              >
                <HeartIcon className="w-5 h-5 text-gray-400 hover:text-red-500" />
              </button>
              <div className="flex items-center gap-2">
                <span className="font-medium">${beat.price}</span>
                <button className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <ShoppingCartIcon className="w-5 h-5 text-gray-400 hover:text-primary-500" />
                </button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
