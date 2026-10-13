// Yandex Maps JS API v3 — kalit .env.local faylidagi VITE_YANDEX_MAPS_API_KEY'dan olinadi.
// Kalit bo'lmasa xarita Leaflet'da ishlashda davom etadi.
export const YANDEX_MAPS_API_KEY = import.meta.env.VITE_YANDEX_MAPS_API_KEY?.trim() || ''

let pending = null

/** API skriptini bir marta yuklaydi va tayyor `ymaps3` obyektini qaytaradi */
export function loadYandexMaps() {
  if (!YANDEX_MAPS_API_KEY) return Promise.reject(new Error('VITE_YANDEX_MAPS_API_KEY topilmadi'))
  if (pending) return pending

  pending = new Promise((resolve, reject) => {
    const script = document.createElement('script')
    script.src = `https://api-maps.yandex.ru/v3/?apikey=${encodeURIComponent(YANDEX_MAPS_API_KEY)}&lang=uz_UZ`
    script.async = true
    script.onload = () => {
      if (!window.ymaps3) {
        reject(new Error('Yandex Maps API yuklanmadi'))
        return
      }
      window.ymaps3.ready.then(() => resolve(window.ymaps3), reject)
    }
    script.onerror = () => reject(new Error('Yandex Maps skripti yuklanmadi (kalit yoki tarmoqni tekshiring)'))
    document.head.appendChild(script)
  }).catch((error) => {
    // Keyingi urinishda qaytadan yuklash mumkin bo'lsin
    pending = null
    throw error
  })

  return pending
}
