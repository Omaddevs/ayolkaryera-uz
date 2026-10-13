import { useEffect, useRef, useState } from 'react'
import { loadYandexMaps } from '../../utils/yandexMaps.js'
import { currentTheme, initialView, pinHtml, USER_HTML, UZBEKISTAN_VIEW } from './markup.js'
import './JobsMap.css'

const BEHAVIORS = ['drag', 'scrollZoom', 'pinchZoom', 'dblClick']
const DURATION = 450
const LOAD_TIMEOUT = 12000

// Yandex [lng, lat] tartibini kutadi
const toLngLat = ({ lat, lng }) => [lng, lat]

function primaryRgba(alpha) {
  const hex = getComputedStyle(document.documentElement).getPropertyValue('--color-primary').trim() || '#ff2d87'
  const n = parseInt(hex.replace('#', ''), 16)
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`
}

/** Radius doirasini ko'pburchak sifatida hisoblash (Yandex v3'da tayyor doira yo'q) */
function circleRing({ lat, lng }, radiusKm, steps = 72) {
  const dLat = radiusKm / 111.32
  const dLng = radiusKm / (111.32 * Math.cos((lat * Math.PI) / 180))
  const ring = []
  for (let i = 0; i <= steps; i += 1) {
    const a = (i / steps) * 2 * Math.PI
    ring.push([lng + dLng * Math.cos(a), lat + dLat * Math.sin(a)])
  }
  return ring
}

/** [[g'arb, shimol], [sharq, janub]] ko'rinishidagi chegara */
function boundsOf(points) {
  const lngs = points.map((p) => p[0])
  const lats = points.map((p) => p[1])
  return [
    [Math.min(...lngs), Math.max(...lats)],
    [Math.max(...lngs), Math.min(...lats)],
  ]
}

export default function YandexJobsMap({ origin, jobs, radiusKm, selectedId, hoveredId, onSelect, onError, interactive = true }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const apiRef = useRef(null)
  const markersRef = useRef(new Map())
  const userObjectsRef = useRef([])
  const onSelectRef = useRef(onSelect)
  const onErrorRef = useRef(onError)
  const framedRef = useRef(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    onSelectRef.current = onSelect
    onErrorRef.current = onError
  }, [onSelect, onError])

  // API'ni yuklab, xaritani bir marta yaratish
  useEffect(() => {
    let cancelled = false
    let map = null
    const markers = markersRef.current

    const fail = (error) => {
      if (cancelled) return
      cancelled = true
      console.warn('[Yandex Maps]', error)
      onErrorRef.current?.(error)
    }
    const timer = setTimeout(() => fail(new Error('Yandex Maps javob bermadi')), LOAD_TIMEOUT)

    loadYandexMaps()
      .then((ymaps3) => {
        if (cancelled) return
        clearTimeout(timer)
        const view = initialView(origin, radiusKm)
        map = new ymaps3.YMap(
          containerRef.current,
          {
            location: { center: toLngLat(view.center), zoom: view.zoom },
            theme: currentTheme(),
            margin: [32, 32, 32, 32],
            behaviors: interactive ? BEHAVIORS : [],
            zoomRange: { min: 5, max: 19 },
          },
          [new ymaps3.YMapDefaultSchemeLayer({}), new ymaps3.YMapDefaultFeaturesLayer({})],
        )
        apiRef.current = ymaps3
        mapRef.current = map
        setReady(true)
      })
      .catch((error) => {
        clearTimeout(timer)
        fail(error)
      })

    // Mavzu almashganda xarita sxemasini ham almashtirish
    const themeObserver = new MutationObserver(() => mapRef.current?.update({ theme: currentTheme() }))
    themeObserver.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    return () => {
      cancelled = true
      clearTimeout(timer)
      themeObserver.disconnect()
      markers.clear()
      userObjectsRef.current = []
      map?.destroy()
      mapRef.current = null
    }
    // Boshlang'ich ko'rinish faqat yaratishda kerak, keyingi o'zgarishlarni pastdagi effektlar boshqaradi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    mapRef.current?.update({ behaviors: interactive ? BEHAVIORS : [] })
  }, [interactive, ready])

  // Ish markerlari: faqat qo'shilgan/olib tashlanganlari yangilanadi
  useEffect(() => {
    const map = mapRef.current
    const ymaps3 = apiRef.current
    if (!map || !ymaps3) return
    const markers = markersRef.current
    const nextIds = new Set(jobs.map((job) => job.id))

    markers.forEach(({ marker }, id) => {
      if (!nextIds.has(id)) {
        map.removeChild(marker)
        markers.delete(id)
      }
    })

    jobs.forEach((job) => {
      if (markers.has(job.id)) return
      const el = document.createElement('div')
      el.className = 'jm-pin-wrap ym-pin'
      el.innerHTML = pinHtml(job)
      el.tabIndex = 0
      el.setAttribute('role', 'button')
      el.setAttribute('aria-label', `${job.title} — ${job.company}`)
      el.title = `${job.title} — ${job.company}`
      el.addEventListener('click', () => onSelectRef.current?.(job.id))
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelectRef.current?.(job.id)
        }
      })
      const marker = new ymaps3.YMapMarker({ coordinates: toLngLat(job.coords), zIndex: 0 }, el)
      map.addChild(marker)
      markers.set(job.id, { marker, el })
    })
  }, [jobs, ready])

  // Tanlangan va ro'yxatda kursor turgan markerni ajratish
  useEffect(() => {
    markersRef.current.forEach(({ marker, el }, id) => {
      const active = id === selectedId
      const hover = id === hoveredId && !active
      el.classList.toggle('is-active', active)
      el.classList.toggle('is-hover', hover)
      marker.update({ zIndex: active ? 1000 : hover ? 500 : 0 })
    })
  }, [selectedId, hoveredId, jobs, ready])

  // Tanlangan ishga silliq o'tish
  useEffect(() => {
    const map = mapRef.current
    const selected = markersRef.current.get(selectedId)
    if (!map || !selected) return
    const job = jobs.find((j) => j.id === selectedId)
    if (!job) return
    map.update({ location: { center: toLngLat(job.coords), zoom: Math.max(map.zoom, 13), duration: DURATION } })
    // faqat tanlov o'zgarganda
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId])

  // Foydalanuvchi joylashuvi, radius doirasi va ko'rinish chegarasi
  useEffect(() => {
    const map = mapRef.current
    const ymaps3 = apiRef.current
    if (!map || !ymaps3) return
    userObjectsRef.current.forEach((object) => map.removeChild(object))
    userObjectsRef.current = []

    if (!origin) {
      framedRef.current = false
      map.update({ location: { center: toLngLat(UZBEKISTAN_VIEW.center), zoom: UZBEKISTAN_VIEW.zoom } })
      return
    }

    const objects = []
    let points
    if (radiusKm) {
      const ring = circleRing(origin, radiusKm)
      objects.push(
        new ymaps3.YMapFeature({
          geometry: { type: 'Polygon', coordinates: [ring] },
          style: {
            fill: primaryRgba(0.06),
            stroke: [{ color: primaryRgba(0.6), width: 1.5, dash: [6, 6] }],
            interactive: false,
          },
        }),
      )
      points = ring
    } else {
      points = [toLngLat(origin), ...jobs.map((job) => toLngLat(job.coords))]
    }

    const userEl = document.createElement('div')
    userEl.className = 'ym-user'
    userEl.innerHTML = USER_HTML
    objects.push(new ymaps3.YMapMarker({ coordinates: toLngLat(origin), zIndex: 2000 }, userEl))

    objects.forEach((object) => map.addChild(object))
    userObjectsRef.current = objects

    // Birinchi marta animatsiyasiz, keyingi radius o'zgarishlarida — qisqa animatsiya bilan
    map.update({ location: { bounds: boundsOf(points), duration: framedRef.current ? DURATION : 0 } })
    framedRef.current = true
    // jobs faqat "Barchasi" holatida chegarani hisoblash uchun kerak
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [origin?.lat, origin?.lng, radiusKm, ready])

  function zoomBy(delta) {
    const map = mapRef.current
    if (map) map.update({ location: { center: map.center, zoom: map.zoom + delta, duration: 200 } })
  }

  function recenter() {
    if (origin) mapRef.current?.update({ location: { center: toLngLat(origin), zoom: 14, duration: DURATION } })
  }

  return (
    <div className="jobs-map jobs-map--yandex">
      <div ref={containerRef} className={`jobs-map__canvas${ready ? '' : ' is-loading'}`} />
      <div className="jobs-map__progress" aria-hidden="true" />
      {ready && interactive && (
        <div className="jobs-map__controls">
          {origin && (
            <button type="button" className="jobs-map__btn jobs-map__btn--locate" onClick={recenter} aria-label="Mening joylashuvim" title="Mening joylashuvim">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                <circle cx="12" cy="12" r="3.5" fill="currentColor" />
                <circle cx="12" cy="12" r="8" />
                <path d="M12 1v3M12 20v3M1 12h3M20 12h3" />
              </svg>
            </button>
          )}
          <div className="jobs-map__zoom">
            <button type="button" className="jobs-map__btn" onClick={() => zoomBy(1)} aria-label="Yaqinlashtirish" title="Yaqinlashtirish">
              +
            </button>
            <button type="button" className="jobs-map__btn" onClick={() => zoomBy(-1)} aria-label="Uzoqlashtirish" title="Uzoqlashtirish">
              −
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
