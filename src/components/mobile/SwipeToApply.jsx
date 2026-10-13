import { useRef, useState } from 'react'
import { Check, ChevronRight } from 'lucide-react'

const COMPLETE_AT = 0.85
const PADDING = 6

/**
 * "Surib ariza topshirish": tugmani o'ngga oxirigacha surish kerak — tasodifiy bosish yubormaydi.
 * Klaviatura: Enter / Space / → bilan yuboriladi (surish imkoni bo'lmaganlar uchun).
 */
export default function SwipeToApply({ onComplete, label = 'Ariza topshirish' }) {
  const trackRef = useRef(null)
  const knobRef = useRef(null)
  const drag = useRef(null)
  const [x, setX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const [done, setDone] = useState(false)
  const [nudge, setNudge] = useState(false)
  const [max, setMax] = useState(0)

  const maxX = () => {
    const track = trackRef.current
    const knob = knobRef.current
    return track && knob ? track.clientWidth - knob.offsetWidth - PADDING * 2 : 0
  }

  function complete() {
    if (done) return
    setX(maxX())
    setDone(true)
    navigator.vibrate?.(20)
    setTimeout(onComplete, 320)
  }

  function onPointerDown(event) {
    if (done) return
    event.currentTarget.setPointerCapture(event.pointerId)
    const limit = maxX()
    setMax(limit)
    drag.current = { startX: event.clientX - x, moved: false, max: limit, last: x }
    setDragging(true)
  }

  function onPointerMove(event) {
    if (!drag.current) return
    const next = Math.min(Math.max(event.clientX - drag.current.startX, 0), drag.current.max)
    if (next > 6) drag.current.moved = true
    drag.current.last = next
    setX(next)
  }

  function onPointerUp() {
    if (!drag.current) return
    const { moved, max: limit, last } = drag.current
    drag.current = null
    setDragging(false)
    if (limit && last >= limit * COMPLETE_AT) {
      complete()
      return
    }
    setX(0)
    // Shunchaki bosildi — surish kerakligini ko'rsatamiz
    if (!moved) {
      setNudge(true)
      setTimeout(() => setNudge(false), 600)
    }
  }

  function onKeyDown(event) {
    if (event.key === 'Enter' || event.key === ' ' || event.key === 'ArrowRight') {
      event.preventDefault()
      complete()
    }
  }

  const progress = done ? 1 : max ? x / max : 0

  return (
    <div
      ref={trackRef}
      className={`swipe-apply${done ? ' is-done' : ''}${dragging ? ' is-dragging' : ''}`}
      style={{ '--swipe-x': `${x}px`, '--swipe-progress': progress }}
    >
      <span className="swipe-apply__fill" aria-hidden="true" />
      <span className="swipe-apply__hint" aria-hidden="true">
        {done ? 'Yuborilmoqda…' : 'Surib yuboring'}
        <span className="swipe-apply__chevrons">
          <ChevronRight size={18} strokeWidth={2.6} />
          <ChevronRight size={18} strokeWidth={2.6} />
          <ChevronRight size={18} strokeWidth={2.6} />
        </span>
      </span>
      <button
        ref={knobRef}
        type="button"
        className={`swipe-apply__knob${nudge ? ' is-nudging' : ''}`}
        aria-label={`${label}: o'ngga suring yoki Enter bosing`}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onKeyDown={onKeyDown}
        disabled={done}
      >
        {done ? <Check size={22} strokeWidth={3} aria-hidden="true" /> : label}
      </button>
    </div>
  )
}
