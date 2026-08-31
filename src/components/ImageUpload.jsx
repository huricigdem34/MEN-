import { useState } from 'react'
import { Upload, X, Loader2 } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function ImageUpload({ value, onChange, label = 'Fotoğraf' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return

    if (!file.type.startsWith('image/')) {
      setError('Lütfen bir görsel dosyası seç.')
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      setError('Görsel 5MB\'tan küçük olmalı.')
      return
    }

    setError('')
    setUploading(true)

    const fileExt = file.name.split('.').pop()
    const fileName = `${crypto.randomUUID()}.${fileExt}`

    const { error: uploadError } = await supabase.storage
      .from('menu-images')
      .upload(fileName, file)

    if (uploadError) {
      setError('Yükleme başarısız oldu. Tekrar dene.')
      setUploading(false)
      return
    }

    const { data } = supabase.storage.from('menu-images').getPublicUrl(fileName)
    onChange(data.publicUrl)
    setUploading(false)
  }

  return (
    <div>
      {value ? (
        <div className="relative w-full h-40 rounded-xl overflow-hidden border border-neutral-800 group">
          <img src={value} alt={label} className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-2 right-2 p-1.5 bg-neutral-950/80 rounded-full text-neutral-300
                       hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <X className="w-4 h-4" strokeWidth={2} />
          </button>
        </div>
      ) : (
        <label className="flex flex-col items-center justify-center w-full h-40 rounded-xl
                          border-2 border-dashed border-neutral-800 hover:border-amber-500/40
                          cursor-pointer transition-colors">
          {uploading ? (
            <Loader2 className="w-6 h-6 text-amber-500 animate-spin" />
          ) : (
            <>
              <Upload className="w-6 h-6 text-neutral-600 mb-2" strokeWidth={1.5} />
              <span className="text-sm text-neutral-500">Yüklemek için dokun</span>
              <span className="text-xs text-neutral-700 mt-1">JPG veya PNG, en fazla 5MB</span>
            </>
          )}
          <input type="file" accept="image/*" onChange={handleFile} className="hidden" disabled={uploading} />
        </label>
      )}
      {error && <p className="text-xs text-red-400 mt-2">{error}</p>}
    </div>
  )
}
