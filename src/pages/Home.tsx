import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { beatService } from '../services/beatService'
import { Beat } from '../types/beat'
import { AudioPlayer } from '../components/player/AudioPlayer'
import { Gallery } from '../components/gallery/Gallery'
import { musicStudioImages, photoStudioImages } from '../assets/images/studio'
import { 
  MusicalNoteIcon, 
  ClockIcon, 
  UserGroupIcon, 
  SparklesIcon,
  EnvelopeIcon
} from '@heroicons/react/24/outline'
import { Button } from '../components/ui/Button'
import Marquee from 'react-fast-marquee'

// Icônes de réseaux sociaux personnalisées
const InstagramIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.782-6.979-6.979-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.438-.645 1.438-1.44s-.643-1.44-1.438-1.44z"/>
  </svg>
)

const YoutubeIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
)

const TiktokIcon = () => (
  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
)

export function Home() {
  const [latestBeats, setLatestBeats] = useState<Beat[]>([])
  const [currentBeat, setCurrentBeat] = useState<Beat | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchLatestBeats = async () => {
      try {
        const beats = await beatService.getLatestBeats()
        setLatestBeats(beats)
      } catch (error) {
        console.error('Error fetching latest beats:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchLatestBeats()
  }, [])

  const handleBeatClick = (beat: Beat) => {
    setCurrentBeat(beat)
  }

  const handleNext = () => {
    if (currentBeat && latestBeats.length > 0) {
      const currentIndex = latestBeats.findIndex(beat => beat.id === currentBeat.id)
      const nextIndex = (currentIndex + 1) % latestBeats.length
      setCurrentBeat(latestBeats[nextIndex])
    }
  }

  const handlePrevious = () => {
    if (currentBeat && latestBeats.length > 0) {
      const currentIndex = latestBeats.findIndex(beat => beat.id === currentBeat.id)
      const previousIndex = (currentIndex - 1 + latestBeats.length) % latestBeats.length
      setCurrentBeat(latestBeats[previousIndex])
    }
  }

  const features = [
    {
      icon: <MusicalNoteIcon className="w-8 h-8 text-primary-500" />,
      title: "Professional Studio",
      description: "High-end equipment for exceptional sound quality"
    },
    {
      icon: <ClockIcon className="w-8 h-8 text-primary-500" />,
      title: "Flexibility",
      description: "Recording sessions of 1h or 2h according to your needs"
    },
    {
      icon: <UserGroupIcon className="w-8 h-8 text-primary-500" />,
      title: "Accompaniment",
      description: "An experienced sound engineer at your service"
    },
    {
      icon: <SparklesIcon className="w-8 h-8 text-primary-500" />,
      title: "Custom Production",
      description: "Unique beats tailored to your style"
    }
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="min-h-[80vh] flex flex-col items-center justify-center px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/studio-bg.jpg')] bg-cover bg-center opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark-900/50 to-dark-900" />
        
        {/* Textes défilants */}
        <div className="absolute inset-0 flex flex-col justify-center items-center space-y-2 overflow-hidden">
          <div className="w-full overflow-hidden pointer-events-none">
            <Marquee
              gradient={false}
              speed={50}
              direction="left"
            >
              <h1 className="text-8xl md:text-[10rem] lg:text-[12rem] font-bold bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent px-8 tracking-tighter opacity-60">
                CREATEYOURMUSICWITHUS
              </h1>
            </Marquee>
          </div>

          <div className="w-full overflow-hidden pointer-events-none">
            <Marquee
              gradient={false}
              speed={40}
              direction="right"
            >
              <p className="text-6xl md:text-8xl lg:text-9xl bg-gradient-to-r from-purple-400 to-purple-600 bg-clip-text text-transparent px-8 tracking-tighter opacity-60">
                PROFESSIONALRECORDINGSTUDIO&CUSTOMPRODUCTION
              </p>
            </Marquee>
          </div>

          <div className="w-full overflow-hidden pointer-events-none">
            <Marquee
              gradient={false}
              speed={60}
              direction="left"
            >
              <div className="flex items-center space-x-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                <span className="text-white opacity-60">STUDIO</span>
                <span className="text-purple-500 opacity-60">RECORDING</span>
                <span className="text-gray-900 opacity-60">PHOTOGRAPHY</span>
                <span className="text-white opacity-60">BEATS</span>
                <span className="text-purple-500 opacity-60">MIXING</span>
                <span className="text-gray-900 opacity-60">PRODUCTION</span>
                <span className="text-white opacity-60">VIDEOGRAPHY</span>
                <span className="text-purple-500 opacity-60">MASTERING</span>
                <span className="text-gray-900 opacity-60">CREATIVE</span>
                <span className="text-white opacity-60">PROFESSIONAL</span>
                <span className="text-purple-500 opacity-60">MUSIC</span>
                <span className="text-gray-900 opacity-60">CONTENT</span>
                <span className="text-white opacity-60">EXPERIENCE</span>
                <span className="text-purple-500 opacity-60">QUALITY</span>
                <span className="text-gray-900 opacity-60">PERFORMANCE</span>
              </div>
            </Marquee>
          </div>

          <div className="w-full overflow-hidden pointer-events-none">
            <Marquee
              gradient={false}
              speed={45}
              direction="right"
            >
              <div className="flex items-center space-x-4 text-5xl md:text-7xl lg:text-8xl font-bold tracking-tighter">
                <span className="text-white opacity-60">EXCELLENCE</span>
                <span className="text-purple-500 opacity-60">INNOVATION</span>
                <span className="text-gray-900 opacity-60">CREATIVITY</span>
                <span className="text-white opacity-60">EXPERTISE</span>
                <span className="text-purple-500 opacity-60">TECHNOLOGY</span>
                <span className="text-gray-900 opacity-60">ARTISTRY</span>
                <span className="text-white opacity-60">PASSION</span>
                <span className="text-purple-500 opacity-60">VISION</span>
                <span className="text-gray-900 opacity-60">SUCCESS</span>
                <span className="text-white opacity-60">TALENT</span>
                <span className="text-purple-500 opacity-60">INSPIRATION</span>
                <span className="text-gray-900 opacity-60">DREAMS</span>
              </div>
            </Marquee>
          </div>

          <div className="w-full overflow-hidden pointer-events-none">
            <Marquee
              gradient={false}
              speed={35}
              direction="left"
            >
              <div className="flex items-center space-x-8 text-7xl md:text-8xl lg:text-[10rem] font-bold tracking-tighter">
                <span className="text-white opacity-60">UNIQUE</span>
                <span className="text-purple-500 opacity-60">PREMIUM</span>
                <span className="text-gray-900 opacity-60">ELITE</span>
                <span className="text-white opacity-60">ICONIC</span>
                <span className="text-purple-500 opacity-60">LEGEND</span>
                <span className="text-gray-900 opacity-60">MASTER</span>
              </div>
            </Marquee>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="max-w-4xl mx-auto text-center z-10">
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            <Link to="/booking">
              <button className="bg-white hover:bg-gray-50 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 float-animation shadow-lg hover:shadow-xl group">
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500">
                  BOOK A SESSION
                </span>
              </button>
            </Link>
            <Link to="/beats">
              <button className="bg-black hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 px-8 py-4 rounded-full text-xl font-bold transition-all duration-300 transform hover:scale-105 group">
                <span className="bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent group-hover:from-purple-500 group-hover:to-pink-500">
                  DISCOVER OUR BEATS
                </span>
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* Latest Beats Section */}
      <section className="py-20 px-4 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center">
            LATEST{' '}
            <span className="bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">
              BEATS
            </span>
          </h2>
          
          {isLoading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {latestBeats.map((beat) => (
                <div
                  key={beat.id}
                  onClick={() => handleBeatClick(beat)}
                  className="bg-dark-800 rounded-lg p-4 hover:bg-dark-700 transition-colors cursor-pointer"
                >
                  <div className="aspect-square rounded-lg bg-dark-700 mb-4 overflow-hidden relative group">
                    <img
                      src={beat.imageUrl || '/images/default-cover.jpg'}
                      alt={beat.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement
                        target.src = '/images/default-cover.jpg'
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
                      <MusicalNoteIcon className="w-12 h-12 text-white" />
                    </div>
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold truncate">{beat.title}</h3>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-gray-400">{beat.producer}</p>
                      <p className="text-sm font-medium">{beat.price}€</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-dark-900">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-5xl font-bold mb-12 text-center">
            WHY CHOOSE OUR{' '}
            <span className="bg-gradient-to-r from-primary-400 to-pink-400 bg-clip-text text-transparent">
              STUDIO
            </span>
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 rounded-xl bg-dark-800/50 backdrop-blur-lg border border-white/5 hover:border-primary-500/30 transition-colors"
              >
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-2xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-400">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Sections */}
      <section className="py-16">
        {/* Studio Musical */}
        <div className="relative h-[600px] mb-16">
          <div className="absolute inset-0">
            <img
              src="/images/studio-musical.jpg"
              alt="Professional Recording Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-dark-900/90 to-dark-900/40"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center">
            <div className="max-w-xl">
              <h2 className="text-6xl font-bold mb-6">
                Recording Studio
                <span className="block text-3xl font-normal mt-2 text-gray-300">
                  A professional space to bring your projects to life
                </span>
              </h2>
              <p className="text-gray-300 text-2xl mb-8">
                Our recording studio is equipped with the latest technology to ensure exceptional sound quality. Whether you're a rapper, singer, or musician, our team of experienced sound engineers will guide you through your project.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  High-end equipment
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Experienced sound engineers
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Optimized acoustics
                </li>
              </ul>
              <Link 
                to="/booking"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition-colors"
              >
                BOOK A SESSION
              </Link>
            </div>
          </div>
        </div>

        {/* Studio Photo/Vidéo */}
        <div className="relative h-[600px]">
          <div className="absolute inset-0">
            <img
              src="/images/studio-photo.jpg"
              alt="Professional Photo and Video Studio"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-l from-dark-900/90 to-dark-900/40"></div>
          </div>
          <div className="relative max-w-7xl mx-auto px-4 h-full flex items-center justify-end">
            <div className="max-w-xl">
              <h2 className="text-6xl font-bold mb-6">
                Photo & Video Studio
                <span className="block text-3xl font-normal mt-2 text-gray-300">
                  Capture your moments with excellence
                </span>
              </h2>
              <p className="text-gray-300 text-2xl mb-8">
                Our photo and video studio offers a versatile space for all your visual projects. From music videos to professional photo shoots, we provide our expertise and equipment for exceptional results.
              </p>
              <ul className="space-y-4 mb-8">
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  4K video equipment
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Professional lighting
                </li>
                <li className="flex items-center text-gray-300">
                  <span className="w-2 h-2 bg-primary-500 rounded-full mr-3"></span>
                  Green screen available
                </li>
              </ul>
              <Link 
                to="/booking"
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary-600 hover:bg-gradient-to-r hover:from-gray-800 hover:to-gray-700 transition-colors"
              >
                BOOK THE STUDIO
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Section Studio Musical */}
      <section className="py-12 px-4 bg-dark-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-6xl font-bold mb-4">Recording Studio</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A professional space equipped with the best tools to bring your musical projects to life.
              From recording to mastering, we guide you through every step.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {musicStudioImages.map((image, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden group relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">VIEW</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <MusicalNoteIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">Pro Equipment</h3>
              <p className="text-gray-400">
                High-end microphones, preamps, audio interfaces, and monitoring.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">Optimized Acoustics</h3>
              <p className="text-gray-400">
                Studio treated acoustically for professional-grade recordings.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <UserGroupIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">Expertise</h3>
              <p className="text-gray-400">
                Experienced sound engineers to guide you through your project.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/booking">
              <Button size="lg" variant="gradient">BOOK A SESSION</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Studio Photo & Vidéo */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-6xl font-bold mb-4">Photo & Video Studio</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              A versatile space for your photo and video projects, equipped with the latest technology and adapted to all types of productions.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {photoStudioImages.map((image, index) => (
              <div key={index} className="aspect-square rounded-xl overflow-hidden group relative">
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-900/80 via-dark-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                  <span className="text-white text-sm font-medium">VIEW</span>
                </div>
              </div>
            ))}
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-3xl font-semibold mb-2">Modular Studio</h3>
              <p className="text-gray-400">
                Adaptable space to your needs with multiple configurations possible.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-primary-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.438-.645 1.438-1.44s-.643-1.44-1.438-1.44z"/>
                </svg>
              </div>
              <h3 className="text-3xl font-semibold mb-2">Video Equipment</h3>
              <p className="text-gray-400">
                4K cameras, stabilizers, LED lighting, and professional green screen.
              </p>
            </div>

            <div className="bg-dark-100/50 backdrop-blur-lg rounded-2xl border border-white/10 p-6">
              <div className="w-12 h-12 bg-primary-500/10 rounded-xl flex items-center justify-center mb-4">
                <SparklesIcon className="w-6 h-6 text-primary-500" />
              </div>
              <h3 className="text-3xl font-semibold mb-2">Post-Production</h3>
              <p className="text-gray-400">
                Complete photo retouching and video editing services available.
              </p>
            </div>
          </div>

          <div className="text-center">
            <Link to="/booking">
              <Button size="lg" variant="gradient">BOOK THE STUDIO</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Audio Player */}
      {currentBeat && (
        <AudioPlayer
          currentBeat={currentBeat}
          playlist={latestBeats}
          onNext={handleNext}
          onPrevious={handlePrevious}
        />
      )}
    </div>
  )
}
