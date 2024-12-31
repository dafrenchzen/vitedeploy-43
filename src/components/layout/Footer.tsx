import { Link } from 'react-router-dom'
import { InstagramIcon, YoutubeIcon, TiktokIcon } from '../icons/SocialIcons'

export function Footer() {
  return (
    <footer className="bg-dark-900 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et Description */}
          <div className="col-span-2">
            <h3 className="text-xl font-bold mb-4 gradient-text">43 Studio</h3>
            <p className="text-gray-400 mb-6">
              Studio professionnel d'enregistrement musical et de production photo/vidéo.
              Équipement haut de gamme et expertise à votre service.
            </p>
          </div>

          {/* Liens Rapides */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-gray-400 hover:text-white transition">
                  Accueil
                </Link>
              </li>
              <li>
                <Link to="/studio" className="text-gray-400 hover:text-white transition">
                  Studio
                </Link>
              </li>
              <li>
                <Link to="/booking" className="text-gray-400 hover:text-white transition">
                  Réservation
                </Link>
              </li>
              <li>
                <Link to="/profile" className="text-gray-400 hover:text-white transition">
                  Profil
                </Link>
              </li>
            </ul>
          </div>

          {/* Réseaux Sociaux */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-wider mb-4">
              Suivez-nous
            </h4>
            <div className="flex space-x-4">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <InstagramIcon />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <YoutubeIcon />
              </a>
              <a
                href="https://tiktok.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition"
              >
                <TiktokIcon />
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t border-white/5 mt-8 pt-8 text-center">
          <p className="text-gray-400 text-sm">
            © {new Date().getFullYear()} 43 Studio. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
