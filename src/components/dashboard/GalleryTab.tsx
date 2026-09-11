import React, { useState, useRef } from 'react'
import { GalleryPhoto } from '../../types'
import { uploadGalleryPhoto, deleteGalleryPhoto, toggleGalleryPhotoEnabled } from '../../services/eventService'

interface GalleryTabProps {
  photos?: GalleryPhoto[]
  invitationId?: string
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB

export default function GalleryTab({ photos = [], invitationId }: GalleryTabProps) {
  const [uploading, setUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const processFiles = async (files: FileList | File[]) => {
    if (!files || files.length === 0 || !invitationId) return

    setErrorMessage(null)
    setUploading(true)

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]

        // Validate MIME type
        if (!ALLOWED_MIME_TYPES.includes(file.type)) {
          setErrorMessage(`El archivo "${file.name}" no es un formato de imagen válido (solo JPG, PNG, WEBP).`)
          continue
        }

        // Validate File Size
        if (file.size > MAX_FILE_SIZE) {
          setErrorMessage(`El archivo "${file.name}" excede el tamaño máximo permitido de 10MB.`)
          continue
        }

        await uploadGalleryPhoto(invitationId, file)
      }
    } catch (err) {
      console.error('Error al subir fotografía a Firebase Storage:', err)
      setErrorMessage('Ocurrió un error al subir la imagen. Intenta de nuevo por favor.')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(e.target.files)
  }

  const handleToggleEnabled = async (photo: GalleryPhoto) => {
    if (!invitationId) return
    try {
      await toggleGalleryPhotoEnabled(invitationId, photo.id, !photo.enabled)
    } catch (err) {
      console.error('Error al cambiar visibilidad:', err)
    }
  }

  const handleDelete = async (photo: GalleryPhoto) => {
    if (!invitationId) return
    try {
      await deleteGalleryPhoto(invitationId, photo.id, photo.url)
    } catch (err) {
      console.error('Error al eliminar fotografía:', err)
    }
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12 select-none">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="font-body text-[0.62rem] tracking-[0.25em] text-champagne uppercase font-medium">
            Multimedia
          </span>
          <h1 className="font-display text-3xl lg:text-4xl text-brown font-light mt-1">
            Galería de Fotografías
          </h1>
        </div>

        {invitationId && (
          <div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              multiple
              onChange={handleFileChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="bg-brown text-ivory font-body font-medium text-xs px-6 py-3 rounded-full hover:bg-ink transition-colors cursor-pointer shadow-xs flex items-center gap-2 disabled:opacity-50"
            >
              <span>📸</span>
              <span>{uploading ? 'Subiendo fotos...' : 'Subir fotografías'}</span>
            </button>
          </div>
        )}
      </div>

      {errorMessage && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl font-body text-xs text-center flex items-center justify-between">
          <span>⚠️ {errorMessage}</span>
          <button onClick={() => setErrorMessage(null)} className="text-rose-600 font-bold ml-2">✕</button>
        </div>
      )}

      {/* Drag & Drop zone */}
      {invitationId && (
        <div
          onDragOver={e => {
            e.preventDefault()
            setDragOver(true)
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={e => {
            e.preventDefault()
            setDragOver(false)
            if (e.dataTransfer.files) processFiles(e.dataTransfer.files)
          }}
          onClick={() => fileInputRef.current?.click()}
          className={`bg-white border-2 border-dashed rounded-3xl p-8 text-center transition-all cursor-pointer shadow-xs ${
            dragOver ? 'border-champagne bg-champagne/10' : 'border-beige hover:border-champagne'
          }`}
        >
          <span className="text-4xl block mb-2">☁️</span>
          <h3 className="font-display text-2xl text-brown font-light">
            Arrastra tus fotos aquí o haz clic para seleccionar
          </h3>
          <p className="font-body text-xs text-brown/50 mt-1">
            Formatos válidos: JPG, PNG, WEBP (máx. 10MB por archivo).
          </p>
        </div>
      )}

      {/* Photo Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.length === 0 ? (
          <div className="col-span-full bg-white border border-beige/80 rounded-3xl p-10 text-center space-y-2">
            <span className="text-3xl block">🖼️</span>
            <p className="font-display text-xl text-brown font-light">No hay fotografías en la galería</p>
            <p className="font-body text-xs text-brown/50">Sube tus fotos para que tus invitados las disfruten.</p>
          </div>
        ) : (
          photos.map(photo => (
            <div
              key={photo.id}
              className={`group relative aspect-square rounded-2xl overflow-hidden bg-beige border transition-all ${
                photo.enabled ? 'border-beige/80' : 'border-beige/40 opacity-50'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.name || 'Galería'}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />

              {/* Status Badge */}
              <div className="absolute top-2 left-2 z-10">
                <button
                  onClick={() => handleToggleEnabled(photo)}
                  className={`font-body text-[0.58rem] uppercase font-semibold px-2 py-0.5 rounded-full backdrop-blur-md cursor-pointer ${
                    photo.enabled ? 'bg-emerald-600 text-white' : 'bg-brown/80 text-white'
                  }`}
                >
                  {photo.enabled ? 'Público ✓' : 'Oculto 🙈'}
                </button>
              </div>

              <div className="absolute inset-0 bg-brown/40 opacity-0 group-hover:opacity-100 transition-opacity p-3 flex items-start justify-end z-10">
                <button
                  onClick={e => {
                    e.stopPropagation()
                    handleDelete(photo)
                  }}
                  className="bg-white/90 text-brown w-8 h-8 rounded-full flex items-center justify-center text-xs shadow-xs hover:bg-white cursor-pointer"
                  title="Eliminar foto"
                  aria-label="Eliminar fotografía"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
