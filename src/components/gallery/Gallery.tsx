import { useState } from 'react'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

interface GalleryProps {
  images: {
    src: string
    alt: string
    width?: string
  }[]
  columns?: number
}

export function Gallery({ images, columns = 3 }: GalleryProps) {
  const [selectedImage, setSelectedImage] = useState<string | null>(null)

  return (
    <>
      <div
        className={`grid gap-4`}
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {images.map((image, index) => (
          <div
            key={index}
            className={`relative group cursor-pointer ${
              image.width ? `col-span-${image.width}` : ''
            }`}
            onClick={() => setSelectedImage(image.src)}
          >
            <div className="aspect-square overflow-hidden rounded-xl">
              <img
                src={image.src}
                alt={image.alt}
                className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300"
              />
            </div>
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-xl">
              <span className="text-white text-sm font-medium">Voir</span>
            </div>
          </div>
        ))}
      </div>

      <Dialog
        open={selectedImage !== null}
        onClose={() => setSelectedImage(null)}
        className="relative z-50"
      >
        <div className="fixed inset-0 bg-black/90" aria-hidden="true" />

        <div className="fixed inset-0 flex items-center justify-center p-4">
          <Dialog.Panel className="relative max-w-4xl w-full">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute -top-12 right-0 text-white hover:text-gray-300"
            >
              <XMarkIcon className="w-8 h-8" />
            </button>
            <img
              src={selectedImage || ''}
              alt="Vue agrandie"
              className="w-full h-auto rounded-lg"
            />
          </Dialog.Panel>
        </div>
      </Dialog>
    </>
  )
}
