import React, { useState } from 'react'
import { GALLERY_IMAGES } from '../../data/mockData'

interface PhotoPickerModalProps {
  onSelectPhoto: (url: string) => void
  onClose: () => void
}

export default function PhotoPickerModal({
  onSelectPhoto,
  onClose,
}: PhotoPickerModalProps) {
  const [images, setImages] = useState<string[]>(GALLERY_IMAGES)
  const [dragOver, setDragOver] = useState(false)

  const handleSimulatedUpload = () => {
    const newImg = 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&h=800&fit=crop&auto=format'
    setImages([newImg, ...images])
  }

  return (
    <div className="fixed inset-0 z-50 bg-ink/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-beige space-y-6">
        <div className="flex items-center justify-between pb-4 border-b border-beige/60">
          <div>
            <span className="font-body text-[0.6rem] tracking-[0.2em] text-champagne uppercase block">
              Galería VÉLIA
            </span>
            <h3 className="font-display text-2xl text-brown font-light">
              Seleccionar Fotografía
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-ivory border border-beige flex items-center justify-center text-xs text-brown/60 hover:text-brown cursor-pointer"
          >
            ✕
          </button>
        </div>

        {/* Drag & Drop simulated dropzone */}
        <div
          onDragOver={e => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            handleSimulatedUpload()
          }}
          onClick={handleSimulatedUpload}
          className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
            dragOver ? 'border-champagne bg-champagne/10' : 'border-beige bg-ivory/40 hover:bg-ivory'
          }`}
        >
          <span className="text-3xl block mb-2">📁</span>
          <p className="font-body text-xs font-medium text-brown">
            Arrastra tus fotografías aquí o haz clic para explorar
          </p>
          <p className="font-body text-[0.68rem] text-brown/40 mt-1">
            Soporta JPG, PNG, WEBP hasta 15MB
          </p>
        </div>

        {/* Image Grid */}
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-64 overflow-y-auto p-1">
          {images.map((img, i) => (
            <div
              key={i}
              onClick={() => onSelectPhoto(img)}
              className="group relative aspect-square rounded-xl overflow-hidden border border-beige cursor-pointer hover:shadow-md transition-all"
            >
              <img
                src={img}
                alt={`Photo ${i}`}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform"
              />
              <div className="absolute inset-0 bg-brown/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <span className="bg-white text-brown font-body text-[0.65rem] font-medium px-2 py-1 rounded shadow-xs">
                  Elegir
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
