import {
  collection,
  getDocs,
  query,
  where,
  orderBy,
  limit,
  addDoc,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
  increment,
  setDoc,
  deleteDoc,
} from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL, listAll, getMetadata } from 'firebase/storage'
import { db, storage } from '../config/firebase'
import { Beat, MusicStyle } from '../types/beat'

interface AddBeatData {
  title: string
  producer: string
  price: number
  style: MusicStyle
  duration: number
  audioPath: string
  imagePath?: string
}

class BeatError extends Error {
  constructor(
    message: string,
    public code: 'FETCH_ERROR' | 'ADD_ERROR' | 'UPDATE_ERROR' | 'DELETE_ERROR' | 'SEARCH_ERROR'
  ) {
    super(message)
    this.name = 'BeatError'
  }
}

export const beatService = {
  async getAllBeats(): Promise<Beat[]> {
    try {
      const beatsCollection = collection(db, 'beats')
      const beatsSnapshot = await getDocs(beatsCollection)
      
      const beats = await Promise.all(
        beatsSnapshot.docs.map(async (doc) => {
          const data = doc.data()
          try {
            // Récupérer l'URL du fichier audio
            const audioRef = ref(storage, data.audioPath)
            const audioUrl = await getDownloadURL(audioRef)
            
            // Récupérer l'URL de l'image si elle existe
            let imageUrl = ''
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            }

            return {
              id: doc.id,
              title: data.title,
              producer: data.producer,
              style: data.style as MusicStyle,
              price: data.price,
              duration: data.duration,
              audioUrl,
              imageUrl,
              createdAt: data.createdAt.toDate(),
              plays: data.plays || 0
            } as Beat
          } catch (error) {
            console.error('Error processing beat:', doc.id, error)
            return null
          }
        })
      )

      return beats.filter((beat): beat is Beat => beat !== null)
    } catch (error) {
      console.error('Error fetching beats:', error)
      throw new BeatError('Impossible de récupérer les beats', 'FETCH_ERROR')
    }
  },

  async addBeat(data: AddBeatData): Promise<void> {
    try {
      const beatData = {
        ...data,
        createdAt: Timestamp.now(),
        plays: 0,
        likes: 0
      }

      // Ajouter le document dans Firestore
      const beatsCollection = collection(db, 'beats')
      await addDoc(beatsCollection, beatData)
    } catch (error) {
      console.error('Error adding beat:', error)
      throw new BeatError('Impossible d\'ajouter le beat', 'ADD_ERROR')
    }
  },

  async updateBeat(beatId: string, data: Partial<AddBeatData>): Promise<void> {
    try {
      const beatRef = doc(db, 'beats', beatId)
      await updateDoc(beatRef, data)
    } catch (error) {
      console.error('Error updating beat:', error)
      throw new BeatError('Impossible de mettre à jour le beat', 'UPDATE_ERROR')
    }
  },

  async deleteBeat(beatId: string): Promise<void> {
    try {
      const beatRef = doc(db, 'beats', beatId)
      
      // Récupérer les informations du beat avant de le supprimer
      const beatDoc = await getDoc(beatRef)
      if (beatDoc.exists()) {
        const data = beatDoc.data()
        
        // Supprimer le fichier audio
        if (data.audioPath) {
          const audioRef = ref(storage, data.audioPath)
          await deleteDoc(doc(storage, audioRef.fullPath))
        }
        
        // Supprimer l'image si elle existe
        if (data.imagePath) {
          const imageRef = ref(storage, data.imagePath)
          await deleteDoc(doc(storage, imageRef.fullPath))
        }
      }
      
      // Supprimer le document Firestore
      await deleteDoc(beatRef)
    } catch (error) {
      console.error('Error deleting beat:', error)
      throw new BeatError('Impossible de supprimer le beat', 'DELETE_ERROR')
    }
  },

  async getPopularBeats(limit: number = 5): Promise<Beat[]> {
    try {
      const beatsCollection = collection(db, 'beats')
      const q = query(beatsCollection, orderBy('plays', 'desc'), limit(limit))
      const querySnapshot = await getDocs(q)
      
      const beats = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data()
          try {
            const audioRef = ref(storage, data.audioPath)
            const audioUrl = await getDownloadURL(audioRef)
            
            let imageUrl = ''
            if (data.imagePath) {
              const imageRef = ref(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            }

            return {
              id: doc.id,
              title: data.title,
              producer: data.producer,
              style: data.style as MusicStyle,
              price: data.price,
              duration: data.duration,
              audioUrl,
              imageUrl,
              createdAt: data.createdAt.toDate(),
              plays: data.plays || 0
            } as Beat
          } catch (error) {
            console.error('Error processing beat:', doc.id, error)
            return null
          }
        })
      )

      return beats.filter((beat): beat is Beat => beat !== null)
    } catch (error) {
      console.error('Error fetching popular beats:', error)
      throw new BeatError('Impossible de récupérer les beats populaires', 'FETCH_ERROR')
    }
  },

  async updateBeatPlays(beatId: string): Promise<void> {
    try {
      const beatRef = doc(db, 'beats', beatId)
      await updateDoc(beatRef, {
        plays: increment(1)
      })
    } catch (error) {
      console.error('Error updating beat plays:', error)
      throw new BeatError('Impossible de mettre à jour les lectures', 'UPDATE_ERROR')
    }
  },

  async toggleBeatLike(beatId: string, userId: string): Promise<void> {
    try {
      const likeRef = doc(db, 'beats', beatId, 'likes', userId)
      const likeDoc = await getDoc(likeRef)

      if (likeDoc.exists()) {
        await deleteDoc(likeRef)
        await updateDoc(doc(db, 'beats', beatId), {
          likes: increment(-1)
        })
      } else {
        await setDoc(likeRef, {
          userId,
          createdAt: Timestamp.now()
        })
        await updateDoc(doc(db, 'beats', beatId), {
          likes: increment(1)
        })
      }
    } catch (error) {
      console.error('Error toggling beat like:', error)
      throw new BeatError('Impossible de mettre à jour les likes', 'UPDATE_ERROR')
    }
  },

  async getBeatLikeStatus(beatId: string, userId: string): Promise<boolean> {
    try {
      const likeRef = doc(db, 'beats', beatId, 'likes', userId)
      const likeDoc = await getDoc(likeRef)
      return likeDoc.exists()
    } catch (error) {
      console.error('Error getting beat like status:', error)
      return false
    }
  },

  async getBeatById(id: string): Promise<Beat | null> {
    try {
      const beatDoc = await getDoc(doc(db, 'beats', id))
      
      if (!beatDoc.exists()) {
        return null
      }

      const data = beatDoc.data()
      
      // Récupérer l'URL de l'audio
      let audioUrl = ''
      if (data.audioPath) {
        try {
          const audioRef = ref(storage, data.audioPath)
          audioUrl = await getDownloadURL(audioRef)
        } catch (error) {
          console.error('Error getting audio URL:', error)
        }
      }

      // Récupérer l'URL de l'image
      let imageUrl = ''
      if (data.imagePath) {
        try {
          const imageRef = ref(storage, data.imagePath)
          imageUrl = await getDownloadURL(imageRef)
        } catch (error) {
          console.error('Error getting image URL:', error)
        }
      }

      return {
        id: beatDoc.id,
        title: data.title,
        producer: data.producer,
        price: data.price,
        bpm: data.bpm,
        audioUrl,
        imageUrl,
        tags: data.tags || [],
        plays: data.plays || 0,
        likes: data.likes || 0,
        createdAt: data.createdAt?.toDate() || new Date(),
      }
    } catch (error) {
      console.error('Error fetching beat:', error)
      throw new BeatError(
        'Impossible de récupérer le beat. Veuillez réessayer.',
        'FETCH_ERROR'
      )
    }
  },

  async searchBeats(searchTerm: string): Promise<Beat[]> {
    try {
      const beatsRef = collection(db, 'beats')
      const q = query(
        beatsRef,
        where('tags', 'array-contains', searchTerm.toLowerCase())
      )
      const querySnapshot = await getDocs(q)
      
      const beats = await Promise.all(
        querySnapshot.docs.map(async (doc) => {
          const data = doc.data()
          
          // Récupérer l'URL de l'audio
          let audioUrl = ''
          if (data.audioPath) {
            try {
              const audioRef = ref(storage, data.audioPath)
              audioUrl = await getDownloadURL(audioRef)
            } catch (error) {
              console.error('Error getting audio URL:', error)
            }
          }

          // Récupérer l'URL de l'image
          let imageUrl = ''
          if (data.imagePath) {
            try {
              const imageRef = ref(storage, data.imagePath)
              imageUrl = await getDownloadURL(imageRef)
            } catch (error) {
              console.error('Error getting image URL:', error)
            }
          }

          return {
            id: doc.id,
            title: data.title,
            producer: data.producer,
            price: data.price,
            bpm: data.bpm,
            audioUrl,
            imageUrl,
            tags: data.tags || [],
            plays: data.plays || 0,
            likes: data.likes || 0,
            createdAt: data.createdAt?.toDate() || new Date(),
          }
        })
      )

      return beats
    } catch (error) {
      console.error('Error searching beats:', error)
      throw new BeatError(
        'Impossible de rechercher les beats. Veuillez réessayer.',
        'SEARCH_ERROR'
      )
    }
  },

  async getLatestBeats(count: number = 6): Promise<Beat[]> {
    try {
      // Récupère tous les beats
      const allBeats = await this.getAllBeats()
      
      // Trie par date de création (du plus récent au plus ancien)
      const sortedBeats = allBeats.sort((a, b) => 
        b.createdAt.getTime() - a.createdAt.getTime()
      )
      
      // Retourne les n premiers
      return sortedBeats.slice(0, count)
    } catch (error) {
      console.error('Error fetching latest beats:', error)
      throw new BeatError(
        'Impossible de récupérer les derniers beats',
        'FETCH_ERROR'
      )
    }
  },

  async addTestBeats(): Promise<void> {
    const testBeats = [
      {
        title: 'Midnight Dreams',
        producer: '43 Art',
        price: 299,
        style: 'Trap',
        duration: 180,
        audioPath: 'beats/midnight-dreams.mp3',
        imagePath: 'beats/covers/midnight-dreams.jpg',
      },
      {
        title: 'Ocean Vibes',
        producer: '43 Art',
        price: 349,
        style: 'R&B',
        duration: 210,
        audioPath: 'beats/ocean-vibes.mp3',
        imagePath: 'beats/covers/ocean-vibes.jpg',
      },
      {
        title: 'Street Life',
        producer: '43 Art',
        price: 399,
        style: 'Drill',
        duration: 240,
        audioPath: 'beats/street-life.mp3',
        imagePath: 'beats/covers/street-life.jpg',
      },
      {
        title: 'Summer Nights',
        producer: '43 Art',
        price: 299,
        style: 'Afro',
        duration: 180,
        audioPath: 'beats/summer-nights.mp3',
        imagePath: 'beats/covers/summer-nights.jpg',
      },
      {
        title: 'City Lights',
        producer: '43 Art',
        price: 449,
        style: 'Trap',
        duration: 210,
        audioPath: 'beats/city-lights.mp3',
        imagePath: 'beats/covers/city-lights.jpg',
      },
    ]

    try {
      await Promise.all(testBeats.map((beat) => this.addBeat(beat)))
      console.log('Test beats added successfully')
    } catch (error) {
      console.error('Error adding test beats:', error)
      throw error
    }
  },

  async migrateBeatsToFirestore(): Promise<void> {
    try {
      console.log('Starting beats migration...')
      
      // Vérifier d'abord les permissions Firestore
      try {
        const testCollection = collection(db, 'beats')
        await addDoc(testCollection, { test: true })
        console.log('Firestore permissions OK')
      } catch (error) {
        console.error('Erreur de permissions Firestore:', error)
        throw new Error('Vous n\'avez pas les permissions nécessaires pour écrire dans Firestore. Veuillez vérifier les règles de sécurité.')
      }
      
      // Référence au dossier 'beats' dans Storage
      const beatsRef = ref(storage, 'beats')
      
      // Liste tous les fichiers audio dans le dossier beats
      const result = await listAll(beatsRef)
      
      let successCount = 0
      let errorCount = 0
      const errors: Array<{name: string, error: any}> = []
      
      // Pour chaque fichier audio
      for (const item of result.items) {
        try {
          console.log(`Processing beat: ${item.name}`)
          
          // Récupérer les métadonnées du fichier audio
          const metadata = await getMetadata(item)
          const customMetadata = metadata.customMetadata || {}
          
          // Construire le nom à partir du nom du fichier
          const fileName = item.name
          const title = customMetadata.title || fileName.split('.')[0].replace(/-/g, ' ')
          
          // Vérifier si une image existe dans différents emplacements possibles
          let imagePath = ''
          let imageUrl = ''
          const possibleImagePaths = [
            `beats/covers/${fileName.split('.')[0]}.jpg`,
            `beats/covers/${fileName.split('.')[0]}.png`,
            `beats/images/${fileName.split('.')[0]}.jpg`,
            `beats/images/${fileName.split('.')[0]}.png`,
            `covers/${fileName.split('.')[0]}.jpg`,
            `covers/${fileName.split('.')[0]}.png`
          ]

          for (const path of possibleImagePaths) {
            try {
              const imageRef = ref(storage, path)
              await getMetadata(imageRef)
              imagePath = path
              imageUrl = await getDownloadURL(imageRef)
              console.log(`Found image at: ${path}`)
              console.log(`Got image URL: ${imageUrl}`)
              break
            } catch (error) {
              continue
            }
          }

          if (!imagePath) {
            console.log('No cover image found for:', fileName)
          }

          // Obtenir l'URL audio
          const audioUrl = await getDownloadURL(item)

          // Créer le document dans Firestore
          const beatData = {
            title,
            producer: customMetadata.producer || '43 Art',
            style: (customMetadata.style as MusicStyle) || 'Trap',
            price: Number(customMetadata.price) || 0,
            duration: Number(customMetadata.duration) || 0,
            audioPath: item.fullPath,
            audioUrl,
            imagePath,
            imageUrl,
            createdAt: metadata.timeCreated ? Timestamp.fromDate(new Date(metadata.timeCreated)) : Timestamp.now(),
            plays: 0,
            likes: 0
          }

          // Vérifier si un document avec le même titre existe déjà
          const beatsCollection = collection(db, 'beats')
          const q = query(beatsCollection, where('title', '==', beatData.title))
          const existingDocs = await getDocs(q)

          if (existingDocs.empty) {
            // Ajouter le nouveau document
            const docRef = await addDoc(beatsCollection, beatData)
            console.log(`Created Firestore document for: ${beatData.title} with ID: ${docRef.id}`)
            successCount++
          } else {
            // Mettre à jour le document existant
            const existingDoc = existingDocs.docs[0]
            await updateDoc(existingDoc.ref, beatData)
            console.log(`Updated existing document for: ${beatData.title}`)
            successCount++
          }

        } catch (error) {
          console.error(`Error processing beat ${item.name}:`, error)
          errorCount++
          errors.push({ name: item.name, error })
        }
      }

      console.log('Migration completed!')
      console.log(`Successfully processed: ${successCount} beats`)
      console.log(`Errors encountered: ${errorCount} beats`)
      if (errors.length > 0) {
        console.log('Errors details:', errors)
      }
    } catch (error) {
      console.error('Migration failed:', error)
      throw error
    }
  },

  // Fonction utilitaire pour tester la migration
  async testMigration(): Promise<void> {
    try {
      // Vérifier le nombre de beats dans Storage
      const storageBeats = await listAll(ref(storage, 'beats'))
      console.log(`Nombre de beats dans Storage: ${storageBeats.items.length}`)

      // Vérifier le nombre de beats dans Firestore
      const firestoreBeats = await getDocs(collection(db, 'beats'))
      console.log(`Nombre de beats dans Firestore: ${firestoreBeats.size}`)

      // Afficher les détails de chaque beat dans Firestore
      firestoreBeats.forEach(doc => {
        const data = doc.data()
        console.log('Beat dans Firestore:', {
          id: doc.id,
          title: data.title,
          producer: data.producer,
          audioPath: data.audioPath
        })
      })
    } catch (error) {
      console.error('Test de migration échoué:', error)
    }
  }
}
