import { useEffect, useState } from 'react'
import { Wifi, Phone, Loader2, Check } from 'lucide-react'
import { supabase } from '../lib/supabase'

export default function SettingsView() {
  const [wifiPassword, setWifiPassword] = useState('')
  const [reservationPhone, setReservationPhone] = useState('')
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    fetchSettings()
  }, [])

  async function fetchSettings() {
    setLoading(true)
    const { data, error } = await supabase.from('settings').select('*')
    if (!error && data) {
      setWifiPassword(data.find((s) => s.key === 'wifi_password')?.value || '')
      setReservationPhone(data.find((s) => s.key === 'reservation_phone')?.value || '')
    }
    setLoading(false)
  }

  async function handleSave() {
    setSaving(true)
    setSaved(false)
    await supabase.from('settings').update({ value: wifiPassword }).eq('key', 'wifi_password')
    await supabase.from('settings').update({ value: reservationPhone }).eq('key', 'reservation_phone')
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) {
    return (
      <div className="py-20 flex justify-center">
        <div className="w-6 h-6 border-2 border-amber-500/30 border-t-amber-500 rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-lg">
      <div className="mb-6">
        <h1 className="text-2xl font-light text-neutral-100 tracking-wide">Ayarlar</h1>
        <p className="text-neutral-500 text-sm mt-1">
          Bu bilgiler halka açık menüde müşterilere gösterilir.
        </p>
      </div>

      <div className="bg-neutral-900/40 border border-neutral-800 rounded-2xl p-6 space-y-6">
        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">
            <Wifi className="w-3.5 h-3.5" strokeWidth={1.5} />
            WiFi Şifresi
          </label>
          <input
            type="text"
            value={wifiPassword}
            onChange={(e) => setWifiPassword(e.target.value)}
            placeholder="ör. lobby2026"
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                       text-white placeholder-neutral-600
                       focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          />
          <p className="text-xs text-neutral-600 mt-1.5">Boş bırakırsan menüde WiFi bölümü görünmez.</p>
        </div>

        <div>
          <label className="flex items-center gap-2 text-xs font-medium text-neutral-400 mb-2.5 tracking-wide uppercase">
            <Phone className="w-3.5 h-3.5" strokeWidth={1.5} />
            Rezervasyon / İletişim Telefonu
          </label>
          <input
            type="text"
            value={reservationPhone}
            onChange={(e) => setReservationPhone(e.target.value)}
            placeholder="ör. +90 555 123 45 67"
            className="w-full bg-neutral-950/80 border border-neutral-800 rounded-xl px-4 py-3 text-sm
                       text-white placeholder-neutral-600
                       focus:outline-none focus:border-amber-500/50 focus:ring-1 focus:ring-amber-500/30"
          />
          <p className="text-xs text-neutral-600 mt-1.5">Menünün altında "Rezervasyon & İletişim" bölümünde tıklanabilir olarak çıkar.</p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-400 disabled:opacity-50
                     text-neutral-950 font-medium text-sm px-5 py-3 rounded-xl transition-colors w-full"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saving ? 'Kaydediliyor...' : saved ? 'Kaydedildi' : 'Kaydet'}
        </button>
      </div>
    </div>
  )
}
