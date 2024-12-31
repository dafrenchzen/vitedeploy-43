import { useEffect, useRef, useState } from 'react'
import { Beat } from '../../types/beat'
import {
  PlayIcon,
  PauseIcon,
  ForwardIcon,
  BackwardIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
} from '@heroicons/react/24/solid'
import { HeartIcon } from '@heroicons/react/24/outline'
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid'
import { useAuth } from '../../context/AuthContext'
import { beatService } from '../../services/beatService'
import toast from 'react-hot-toast'

interface AudioPlayerProps {
  currentBeat: Beat | null
  playlist: Beat[]
  onNext: () => void
  onPrevious: () => void
}

export function AudioPlayer({
  currentBeat,
  playlist,
  onNext,
  onPrevious,
}: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const progressBarRef = useRef<HTMLDivElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [volume, setVolume] = useState(1)
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isLiked, setIsLiked] = useState(false)
  const { user } = useAuth()

  useEffect(() => {
    if (currentBeat && user) {
      beatService.getBeatLikeStatus(currentBeat.id, user.uid).then(setIsLiked)
    }
  }, [currentBeat, user])

  useEffect(() => {
    if (currentBeat && audioRef.current) {
      audioRef.current.src = currentBeat.audioUrl
      audioRef.current.load()
      setIsPlaying(true)
      audioRef.current.play()
      beatService.updateBeatPlays(currentBeat.id)
    }
  }, [currentBeat])

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }
  }, [isPlaying])

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const { currentTime, duration } = audioRef.current
      setProgress((currentTime / duration) * 100)
      setCurrentTime(currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleProgressBarClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && audioRef.current) {
      const rect = progressBarRef.current.getBoundingClientRect()
      const x = event.clientX - rect.left
      const percentage = (x / rect.width) * 100
      const time = (percentage / 100) * audioRef.current.duration
      audioRef.current.currentTime = time
    }
  }

  const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(event.target.value)
    setVolume(value)
    if (audioRef.current) {
      audioRef.current.volume = value
    }
    setIsMuted(value === 0)
  }

  const toggleMute = () => {
    if (audioRef.current) {
      if (isMuted) {
        audioRef.current.volume = volume
        setIsMuted(false)
      } else {
        audioRef.current.volume = 0
        setIsMuted(true)
      }
    }
  }

  const handleEnded = () => {
    onNext()
  }

  const toggleLike = async () => {
    if (!user) {
      toast.error('Vous devez être connecté pour aimer un beat')
      return
    }
    if (!currentBeat) return

    try {
      await beatService.toggleBeatLike(currentBeat.id, user.uid)
      setIsLiked(!isLiked)
    } catch (error) {
      toast.error('Erreur lors de la mise à jour des likes')
    }
  }

  if (!currentBeat) return null

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-dark-100/80 backdrop-blur-xl border-t border-white/10 py-4">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center gap-8">
          {/* Image et infos */}
          <div className="flex items-center gap-4">
            {currentBeat.imageUrl && (
              <img
                src={currentBeat.imageUrl}
                alt={currentBeat.title}
                className="w-16 h-16 rounded-lg object-cover"
              />
            )}
            <div>
              <h3 className="font-medium">{currentBeat.title}</h3>
              <p className="text-sm text-gray-400">{currentBeat.producer}</p>
            </div>
          </div>

          {/* Contrôles */}
          <div className="flex-1">
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={onPrevious}
                className="p-2 hover:text-primary-500 transition-colors"
              >
                <BackwardIcon className="w-6 h-6" />
              </button>

              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="p-3 bg-primary-500 rounded-full hover:bg-primary-600 transition-colors"
              >
                {isPlaying ? (
                  <PauseIcon className="w-6 h-6" />
                ) : (
                  <PlayIcon className="w-6 h-6" />
                )}
              </button>

              <button
                onClick={onNext}
                className="p-2 hover:text-primary-500 transition-colors"
              >
                <ForwardIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Barre de progression */}
            <div className="mt-2">
              <div
                ref={progressBarRef}
                className="h-1 bg-white/10 rounded-full cursor-pointer group"
                onClick={handleProgressBarClick}
              >
                <div
                  className="h-full bg-primary-500 rounded-full relative group-hover:bg-primary-400 transition-colors"
                  style={{ width: `${progress}%` }}
                >
                  <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Volume et Like */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <button onClick={toggleMute}>
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-6 h-6" />
                ) : (
                  <SpeakerWaveIcon className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={isMuted ? 0 : volume}
                onChange={handleVolumeChange}
                className="w-20"
              />
            </div>

            <button
              onClick={toggleLike}
              className="p-2 hover:text-primary-500 transition-colors"
            >
              {isLiked ? (
                <HeartIconSolid className="w-6 h-6 text-primary-500" />
              ) : (
                <HeartIcon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <audio
          ref={audioRef}
          onTimeUpdate={handleTimeUpdate}
          onLoadedMetadata={handleLoadedMetadata}
          onEnded={handleEnded}
        />
      </div>
    </div>
  )
}
