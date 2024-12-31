import { useState, useRef } from 'react'
import { useAuth } from '../context/AuthContext'
import { beatService } from '../services/beatService'
import { ref, uploadBytes } from 'firebase/storage'
import { storage } from '../config/firebase'
import { Button } from '../components/ui/Button'
import { MusicStyle } from '../types/beat'
import toast from 'react-hot-toast'
import { MusicalNoteIcon } from '@heroicons/react/24/solid'

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

export function Admin() {
  const { user } = useAuth()
  const [loading, setLoading] = useState(false)
  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const [audioDuration, setAudioDuration] = useState<number>(0)
  const [formData, setFormData] = useState({
    title: '',
    producer: '',
    style: 'Trap' as MusicStyle,
    price: '',
  })

  const handleAudioLoad = () => {
    if (audioRef.current) {
      setAudioDuration(audioRef.current.duration)
    }
  }

  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      // Créer une URL temporaire pour l'audio
      const audioUrl = URL.createObjectURL(file)
      if (audioRef.current) {
        audioRef.current.src = audioUrl
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    try {
      setLoading(true)

      // Upload audio file
      let audioPath = ''
      if (audioFile) {
        const fileName = `${formData.title.toLowerCase().replace(/\s+/g, '-')}.mp3`
        const audioRef = ref(storage, `beats/${fileName}`)
        await uploadBytes(audioRef, audioFile)
        audioPath = audioRef.fullPath
      } else {
        throw new Error('Audio file is required')
      }

      // Upload image file
      let imagePath = ''
      if (imageFile) {
        const fileName = `${formData.title.toLowerCase().replace(/\s+/g, '-')}.jpg`
        const imageRef = ref(storage, `beats/covers/${fileName}`)
        await uploadBytes(imageRef, imageFile)
        imagePath = imageRef.fullPath
      }

      // Create beat document
      await beatService.addBeat({
        title: formData.title,
        producer: formData.producer,
        price: Number(formData.price),
        style: formData.style,
        duration: audioDuration,
        audioPath,
        imagePath,
      })

      toast.success('Beat ajouté avec succès')
      
      // Reset form
      setFormData({
        title: '',
        producer: '',
        style: 'Trap',
        price: '',
      })
      setAudioFile(null)
      setImageFile(null)
      setAudioDuration(0)
    } catch (error) {
      console.error('Error adding beat:', error)
      toast.error('Erreur lors de l\'ajout du beat')
    } finally {
      setLoading(false)
    }
  }

  if (!user?.email?.includes('@43art.fr')) {
    return (
      <div className="min-h-screen pt-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <p className="text-gray-400">
              Vous n'avez pas accès à cette page
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-8">
          <h1 className="text-2xl font-bold mb-8">Administration des beats</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label
                htmlFor="title"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Titre
              </label>
              <input
                type="text"
                id="title"
                required
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="producer"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Producteur
              </label>
              <input
                type="text"
                id="producer"
                required
                value={formData.producer}
                onChange={(e) =>
                  setFormData({ ...formData, producer: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="style"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Style musical
              </label>
              <select
                id="style"
                required
                value={formData.style}
                onChange={(e) =>
                  setFormData({ ...formData, style: e.target.value as MusicStyle })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              >
                {MUSIC_STYLES.map((style) => (
                  <option key={style} value={style}>
                    {style}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label
                htmlFor="price"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Prix (€)
              </label>
              <input
                type="number"
                id="price"
                required
                min="0"
                value={formData.price}
                onChange={(e) =>
                  setFormData({ ...formData, price: e.target.value })
                }
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <div>
              <label
                htmlFor="audio"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Fichier audio
              </label>
              <input
                type="file"
                id="audio"
                required
                accept="audio/*"
                onChange={handleAudioFileChange}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
              <audio
                ref={audioRef}
                onLoadedMetadata={handleAudioLoad}
                className="hidden"
              />
              {audioDuration > 0 && (
                <p className="mt-1 text-sm text-gray-400">
                  Durée : {Math.floor(audioDuration / 60)}:
                  {Math.floor(audioDuration % 60)
                    .toString()
                    .padStart(2, '0')}
                </p>
              )}
            </div>

            <div>
              <label
                htmlFor="image"
                className="block text-sm font-medium text-gray-400 mb-1"
              >
                Image de couverture
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="w-full px-4 py-2 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Chargement...' : 'Ajouter le beat'}
            </Button>
          </form>

          {/* Section Migration */}
          <div className="mt-12 p-6 bg-dark-800 rounded-xl">
            <h2 className="text-2xl font-bold mb-6">Migration des Beats</h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Migrer les beats vers Firestore</h3>
                  <p className="text-gray-400 text-sm">
                    Transfère les métadonnées des beats de Storage vers Firestore.
                    Cette opération ne supprime pas les fichiers de Storage.
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      await beatService.migrateBeatsToFirestore()
                      toast.success('Migration réussie !')
                      // Tester la migration
                      await beatService.testMigration()
                    } catch (error) {
                      console.error('Migration error:', error)
                      toast.error('Erreur lors de la migration')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                >
                  {loading ? 'Migration en cours...' : 'Lancer la migration'}
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold">Tester la migration</h3>
                  <p className="text-gray-400 text-sm">
                    Vérifie le nombre de beats dans Storage et Firestore.
                    Affiche les détails dans la console.
                  </p>
                </div>
                <Button
                  onClick={async () => {
                    try {
                      setLoading(true)
                      await beatService.testMigration()
                      toast.success('Test terminé ! Vérifiez la console')
                    } catch (error) {
                      console.error('Test error:', error)
                      toast.error('Erreur lors du test')
                    } finally {
                      setLoading(false)
                    }
                  }}
                  disabled={loading}
                  variant="outline"
                >
                  Tester la migration
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
