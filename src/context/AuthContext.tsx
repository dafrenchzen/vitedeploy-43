import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  onAuthStateChanged,
  updateProfile,
  GoogleAuthProvider,
  signInWithPopup,
  User,
} from 'firebase/auth'
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { auth, db, storage } from '../config/firebase'
import { UserProfile } from '../types/profile'
import toast from 'react-hot-toast'

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  isAdmin: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<void>
  signUp: (email: string, password: string, displayName: string) => Promise<void>
  signOut: () => Promise<void>
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>
  updateProfilePhoto: (file: File) => Promise<void>
}

const ADMIN_EMAILS = ['me@davidmeyer.be', '@43art.fr']

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [isAdmin, setIsAdmin] = useState(false)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      setIsAdmin(
        !!user?.email &&
        ADMIN_EMAILS.some((adminEmail) =>
          user.email === adminEmail || user.email?.endsWith(adminEmail)
        )
      )
      if (user) {
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        if (userDoc.exists()) {
          setUserProfile(userDoc.data() as UserProfile)
        } else {
          // Créer un profil pour les nouveaux utilisateurs
          const newProfile: UserProfile = {
            id: user.uid,
            email: user.email || '',
            displayName: user.displayName || '',
            photoURL: user.photoURL || '',
          }
          await setDoc(doc(db, 'users', user.uid), newProfile)
          setUserProfile(newProfile)
        }
      } else {
        setUserProfile(null)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const { user } = result
      
      // Mettre à jour ou créer le profil utilisateur avec les informations Google
      const userDoc = await getDoc(doc(db, 'users', user.uid))
      if (!userDoc.exists()) {
        const newProfile: UserProfile = {
          id: user.uid,
          email: user.email || '',
          displayName: user.displayName || '',
          photoURL: user.photoURL || '',
        }
        await setDoc(doc(db, 'users', user.uid), newProfile)
      }
      toast.success('Connexion réussie')
    } catch (error) {
      console.error('Error signing in with Google:', error)
      toast.error('Erreur lors de la connexion avec Google')
    }
  }

  const updateProfilePhoto = async (file: File) => {
    if (!user) throw new Error('User not authenticated')

    try {
      // Upload the file to Firebase Storage
      const storageRef = ref(storage, `profile-photos/${user.uid}`)
      await uploadBytes(storageRef, file)
      
      // Get the download URL
      const photoURL = await getDownloadURL(storageRef)
      
      // Update Auth profile
      await updateProfile(user, { photoURL })
      
      // Update Firestore profile
      await updateDoc(doc(db, 'users', user.uid), {
        photoURL,
      })
      
      // Update local state
      setUserProfile(prev => prev ? { ...prev, photoURL } : null)
      
      toast.success('Photo de profil mise à jour')
    } catch (error) {
      console.error('Error updating profile photo:', error)
      toast.error('Erreur lors de la mise à jour de la photo de profil')
      throw error
    }
  }

  const signIn = async (email: string, password: string) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      toast.success('Connexion réussie !')
      return userCredential.user
    } catch (error) {
      console.error('Erreur de connexion:', error)
      toast.error('Erreur de connexion. Vérifiez vos identifiants.')
      throw error
    }
  }

  const signUp = async (email: string, password: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      )
      
      await updateProfile(userCredential.user, {
        displayName,
      })

      const newUser: UserProfile = {
        id: userCredential.user.uid,
        email,
        displayName,
        createdAt: new Date(),
        updatedAt: new Date(),
        favoriteBeats: [],
      }

      await setDoc(doc(db, 'users', userCredential.user.uid), newUser)
      toast.success('Compte créé avec succès !')
      return userCredential.user
    } catch (error) {
      console.error('Erreur d\'inscription:', error)
      toast.error('Erreur lors de la création du compte.')
      throw error
    }
  }

  const signOut = async () => {
    try {
      await firebaseSignOut(auth)
      toast.success('Déconnexion réussie')
    } catch (error) {
      console.error('Erreur de déconnexion:', error)
      toast.error('Erreur lors de la déconnexion')
      throw error
    }
  }

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!user) throw new Error('Utilisateur non connecté')

    try {
      const userRef = doc(db, 'users', user.uid)
      await updateDoc(userRef, {
        ...data,
        updatedAt: new Date(),
      })

      if (data.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        })
      }

      const updatedDoc = await getDoc(userRef)
      setUserProfile(updatedDoc.data() as UserProfile)
      toast.success('Profil mis à jour avec succès !')
    } catch (error) {
      console.error('Erreur de mise à jour du profil:', error)
      toast.error('Erreur lors de la mise à jour du profil')
      throw error
    }
  }

  const value = {
    user,
    userProfile,
    loading,
    isAdmin,
    signIn,
    signInWithGoogle,
    signUp,
    signOut,
    updateUserProfile,
    updateProfilePhoto,
  }

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
