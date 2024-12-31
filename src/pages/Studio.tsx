import { Link } from 'react-router-dom'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Gallery } from '../components/gallery/Gallery'
import { musicStudioImages, photoStudioImages } from '../assets/images/studio'
import {
  MusicalNoteIcon,
  FilmIcon,
  UserGroupIcon,
  SparklesIcon,
} from '@heroicons/react/24/outline'

export function Studio() {
  return (
    <div className="min-h-screen pt-20">
      {/* Hero Section */}
      <div className="px-4 py-12">
        <div className="max-w-7xl mx-auto">
          <GlassCard className="p-8 md:p-12">
            <div className="max-w-3xl">
              <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-6">
                Studio Professionnel
              </h1>
              <p className="text-gray-400 text-lg mb-8">
                Un espace créatif équipé des meilleurs outils pour vos projets musicaux et visuels.
                Notre studio offre un environnement optimal pour l'enregistrement, le mixage, 
                la photographie et la production vidéo.
              </p>
              <Link to="/booking">
                <Button variant="gradient" size="lg">
                  Réserver le Studio
                </Button>
              </Link>
            </div>
          </GlassCard>
        </div>
      </div>

      {/* Studio Musical Section */}
      <section className="py-20 px-4 bg-dark-100/50">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Studio Musical</h2>
            <p className="text-gray-400">
              Un environnement acoustique optimisé et un équipement professionnel pour des productions de qualité.
            </p>
          </div>

          <div className="mb-12">
            <Gallery images={musicStudioImages} columns={3} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <MusicalNoteIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Recording</h3>
              <p className="text-gray-400 text-sm">
                Cabine isolée et matériel haut de gamme pour des enregistrements professionnels.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Mixing</h3>
              <p className="text-gray-400 text-sm">
                Station de mixage professionnelle avec monitoring de référence.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Mastering</h3>
              <p className="text-gray-400 text-sm">
                Finalisation professionnelle pour un son optimal sur tous les supports.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Production</h3>
              <p className="text-gray-400 text-sm">
                Accompagnement artistique complet pour vos projets musicaux.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Studio Photo Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <h2 className="text-3xl font-bold mb-4">Studio Photo & Vidéo</h2>
            <p className="text-gray-400">
              Un espace modulable équipé pour tous types de productions visuelles.
            </p>
          </div>

          <div className="mb-12">
            <Gallery images={photoStudioImages} columns={3} />
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <FilmIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Photo Studio</h3>
              <p className="text-gray-400 text-sm">
                Espace modulable avec multiples fonds et éclairages professionnels.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Vidéo</h3>
              <p className="text-gray-400 text-sm">
                Équipement complet pour la production vidéo professionnelle.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Fond Vert</h3>
              <p className="text-gray-400 text-sm">
                Studio équipé d'un fond vert professionnel pour vos effets spéciaux.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-xl p-6 border border-white/10">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="font-semibold mb-2">Post-Production</h3>
              <p className="text-gray-400 text-sm">
                Services de retouche photo et montage vidéo disponibles.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-dark-100/50">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-6">Prêt à Créer ?</h2>
          <p className="text-gray-400 mb-8">
            Réservez dès maintenant votre session et donnez vie à vos projets créatifs.
          </p>
          <Link to="/booking">
            <Button variant="gradient" size="lg">
              Réserver une Session
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}
