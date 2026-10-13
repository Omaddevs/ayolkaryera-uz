import { useEffect, useRef, useState } from 'react'
import { Mic, MicOff, Phone, PhoneOff, Video, VideoOff, Volume2, VolumeX, X } from 'lucide-react'
import './ChatExtras.css'

const EMOJIS = [
  '😊', '😂', '😍', '🥰', '😉', '😎', '🤔', '😢', '😅', '🙏',
  '👍', '👏', '🙌', '💪', '🤝', '👋', '✅', '❤️', '🔥', '🎉',
  '⭐', '💼', '📄', '📎', '📅', '⏰', '📍', '📞', '💬', '✨',
  '🌸', '☕', '🚀', '💡', '🎓', '💰', '🙂', '😇', '🤗', '👌',
]

/** Tashqariga bosilganda yoki Esc bosilganda yopish */
export function useDismiss(open, onClose, ref) {
  useEffect(() => {
    if (!open) return undefined
    const onPointer = (event) => {
      if (!ref.current?.contains(event.target)) onClose()
    }
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('pointerdown', onPointer)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onPointer)
      document.removeEventListener('keydown', onKey)
    }
  }, [open, onClose, ref])
}

export function EmojiPicker({ onPick }) {
  return (
    <div className="chat-emoji" role="dialog" aria-label="Emoji tanlash">
      {EMOJIS.map((emoji) => (
        <button key={emoji} type="button" className="chat-emoji__item" onClick={() => onPick(emoji)} aria-label={emoji}>
          {emoji}
        </button>
      ))}
    </div>
  )
}

export function formatDuration(seconds) {
  const m = Math.floor(seconds / 60)
  const s = String(seconds % 60).padStart(2, '0')
  return `${m}:${s}`
}

/**
 * Qo'ng'iroq oynasi. Video rejimida qurilma kamerasi (ruxsat berilsa) ko'rsatiladi.
 * Backend yo'qligi sababli suhbatdosh tomoni simulyatsiya qilinadi.
 */
export function CallOverlay({ type, peer, onEnd }) {
  const [phase, setPhase] = useState('ringing')
  const [seconds, setSeconds] = useState(0)
  const [micOn, setMicOn] = useState(true)
  const [camOn, setCamOn] = useState(type === 'video')
  const [speakerOn, setSpeakerOn] = useState(true)
  const [camError, setCamError] = useState(false)
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const secondsRef = useRef(0)
  const phaseRef = useRef('ringing')

  // Chaqiruv → ulanish
  useEffect(() => {
    const timer = setTimeout(() => {
      phaseRef.current = 'connected'
      setPhase('connected')
    }, 2600)
    return () => clearTimeout(timer)
  }, [])

  useEffect(() => {
    if (phase !== 'connected') return undefined
    const timer = setInterval(() => {
      secondsRef.current += 1
      setSeconds(secondsRef.current)
    }, 1000)
    return () => clearInterval(timer)
  }, [phase])

  // Kamera oqimi
  useEffect(() => {
    let cancelled = false
    const stop = () => {
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
    if (type !== 'video' || !camOn) {
      stop()
      return undefined
    }
    if (!navigator.mediaDevices?.getUserMedia) {
      queueMicrotask(() => setCamError(true))
      return undefined
    }
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: 'user' }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        if (videoRef.current) videoRef.current.srcObject = stream
        setCamError(false)
      })
      .catch(() => !cancelled && setCamError(true))
    return () => {
      cancelled = true
      stop()
    }
  }, [type, camOn])

  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && end()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
    // end barqaror: faqat ref'lardan o'qiydi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  function end() {
    streamRef.current?.getTracks().forEach((track) => track.stop())
    onEnd({ type, connected: phaseRef.current === 'connected', duration: secondsRef.current })
  }

  const showVideo = type === 'video' && camOn && !camError

  return (
    <div className={`chat-call chat-call--${type}`} role="dialog" aria-modal="true" aria-label={type === 'video' ? 'Video qo‘ng‘iroq' : 'Audio qo‘ng‘iroq'}>
      {showVideo && <video ref={videoRef} className="chat-call__video" autoPlay playsInline muted />}
      <div className="chat-call__top">
        <span className={`chat-call__avatar${phase === 'ringing' ? ' is-ringing' : ''}`}>
          {peer.avatar ? <img src={peer.avatar} alt="" /> : <span style={{ background: peer.avatarColor }}>{peer.name.charAt(0)}</span>}
        </span>
        <h2>{peer.name}</h2>
        <p aria-live="polite">{phase === 'ringing' ? 'Chaqirilmoqda…' : formatDuration(seconds)}</p>
        {type === 'video' && camError && camOn && (
          <p className="chat-call__note">Kamera ishlamadi — brauzerda kameraga ruxsat bering (faqat https yoki localhost’da ishlaydi).</p>
        )}
      </div>

      <div className="chat-call__controls">
        <button type="button" className={`chat-call__btn${micOn ? '' : ' is-off'}`} onClick={() => setMicOn((v) => !v)} aria-pressed={!micOn} aria-label={micOn ? 'Mikrofonni o‘chirish' : 'Mikrofonni yoqish'}>
          {micOn ? <Mic size={22} /> : <MicOff size={22} />}
        </button>
        {type === 'video' ? (
          <button type="button" className={`chat-call__btn${camOn ? '' : ' is-off'}`} onClick={() => setCamOn((v) => !v)} aria-pressed={!camOn} aria-label={camOn ? 'Kamerani o‘chirish' : 'Kamerani yoqish'}>
            {camOn ? <Video size={22} /> : <VideoOff size={22} />}
          </button>
        ) : (
          <button type="button" className={`chat-call__btn${speakerOn ? '' : ' is-off'}`} onClick={() => setSpeakerOn((v) => !v)} aria-pressed={!speakerOn} aria-label={speakerOn ? 'Karnayni o‘chirish' : 'Karnayni yoqish'}>
            {speakerOn ? <Volume2 size={22} /> : <VolumeX size={22} />}
          </button>
        )}
        <button type="button" className="chat-call__btn chat-call__btn--end" onClick={end} aria-label="Qo‘ng‘iroqni tugatish">
          <PhoneOff size={24} />
        </button>
      </div>
    </div>
  )
}

/** Xabar ichidagi qo'ng'iroq yozuvi */
export function CallLog({ call }) {
  const Icon = call.type === 'video' ? Video : Phone
  return (
    <div className="chat-calllog">
      <span className="chat-calllog__icon" aria-hidden="true">
        <Icon size={18} strokeWidth={2} />
      </span>
      <span>
        <strong>{call.type === 'video' ? 'Video qo‘ng‘iroq' : 'Audio qo‘ng‘iroq'}</strong>
        <span>{call.connected ? formatDuration(call.duration) : 'Bekor qilindi'}</span>
      </span>
    </div>
  )
}

export function Lightbox({ src, onClose }) {
  useEffect(() => {
    const onKey = (event) => event.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [onClose])
  return (
    <div className="chat-lightbox" role="dialog" aria-modal="true" aria-label="Rasm" onClick={onClose}>
      <button type="button" className="chat-lightbox__close" onClick={onClose} aria-label="Yopish">
        <X size={22} />
      </button>
      <img src={src} alt="" onClick={(event) => event.stopPropagation()} />
    </div>
  )
}
