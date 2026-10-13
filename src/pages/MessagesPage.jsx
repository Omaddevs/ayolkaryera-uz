import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import {
  FiCalendar,
  FiCheck,
  FiFileText,
  FiMapPin,
  FiMoreHorizontal,
  FiPaperclip,
  FiPhone,
  FiSearch,
  FiSend,
  FiSmile,
  FiUsers,
  FiVideo,
  FiX,
} from 'react-icons/fi'
import { ArrowLeft, BellOff, BellRing, Building2, Check, Edit3, Eraser, Image as ImageIcon, Trash2, UserRound } from 'lucide-react'
import MessageIcon from '../components/icons/MessageIcon.jsx'
import { CallLog, CallOverlay, EmojiPicker, Lightbox, useDismiss } from '../components/chat/ChatExtras.jsx'
import { companies } from '../data/companies.js'
import { candidatesByCategory } from '../data/candidates.js'
import { jobs } from '../data/jobs.js'
import {
  buildCandidateConversation,
  buildCompanyConversation,
  initialConversations,
  messageFilters,
  unreadTotal,
} from '../data/messages.js'
import './MessagesPage.css'

const allCandidates = Object.values(candidatesByCategory).flat()

// Suhbatlar brauzerda saqlanadi — sahifa yangilanganda xabarlar yo'qolmaydi
const STORAGE_KEY = 'ayolkaryera-chats-v1'
const MAX_FILE_BYTES = 10 * 1024 * 1024
// Shu hajmgacha bo'lgan fayllar suhbat bilan birga saqlanadi (kattaroqlari faqat joriy seansda ochiladi)
const PERSIST_FILE_BYTES = 400 * 1024

function loadConversations() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (Array.isArray(saved) && saved.length) return saved
  } catch {
    // buzilgan yozuv — boshlang'ich holatdan boshlaymiz
  }
  return initialConversations
}

function saveConversations(list) {
  // blob: havolalar keyingi seansda ishlamaydi — saqlashdan oldin olib tashlanadi
  const clean = list.map((c) => ({
    ...c,
    messages: c.messages.map((m) =>
      m.attachment?.url?.startsWith('blob:') ? { ...m, attachment: { ...m.attachment, url: null } } : m,
    ),
  }))
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(clean))
  } catch {
    // joy to'lgan bo'lsa — biriktirmalarsiz saqlab ko'ramiz
    try {
      const light = clean.map((c) => ({
        ...c,
        messages: c.messages.map((m) => (m.attachment ? { ...m, attachment: { ...m.attachment, url: null } } : m)),
      }))
      localStorage.setItem(STORAGE_KEY, JSON.stringify(light))
    } catch {
      // saqlab bo'lmadi — seans davomida ishlayveradi
    }
  }
}

const nowTime = () => new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })

function formatSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

const readAsDataUrl = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = reject
    reader.readAsDataURL(file)
  })

// Backend ulanmaguncha suhbatdosh javobi namunaviy
const AUTO_REPLIES = {
  employer: [
    'Rahmat, xabaringizni oldik. HR mutaxassisimiz tez orada javob beradi.',
    'Rezyumeingizni shu yerga yuborsangiz, ko‘rib chiqamiz.',
    'Suhbat uchun sizga qulay kun va vaqtni yozib qoldiring.',
  ],
  candidate: ['Rahmat! Taklifingizni ko‘rib chiqib, javob yozaman.', 'Yaxshi, batafsil ma’lumot yubora olasizmi?'],
  file: 'Faylingizni oldik, rahmat! Ko‘rib chiqib javob beramiz.',
}

function previewOf(message) {
  if (message.call) return message.call.type === 'video' ? 'Video qo‘ng‘iroq' : 'Audio qo‘ng‘iroq'
  if (message.attachment) return `📎 ${message.attachment.name}`
  return message.text
}

const statIcons = {
  calendar: FiCalendar,
  users: FiUsers,
  map: FiMapPin,
}

function Avatar({ name, src, color, size = 44, online }) {
  const initial = name?.charAt(0) || '?'
  return (
    <span className="msg-avatar" style={{ width: size, height: size }} data-online={online || undefined}>
      {src ? (
        <img src={src} alt="" width={size} height={size} />
      ) : (
        <span className="msg-avatar__fallback" style={{ background: color || 'var(--color-primary)' }}>
          {initial}
        </span>
      )}
      {online ? <em className="msg-avatar__dot" aria-hidden /> : null}
    </span>
  )
}

function VerifiedBadge() {
  return (
    <span className="msg-verified" title="Tasdiqlangan" aria-label="Tasdiqlangan">
      <Check size={9} strokeWidth={3.5} />
    </span>
  )
}

function FileChip({ attachment }) {
  const inner = (
    <>
      <span className="msg-file__icon">
        <FiFileText />
      </span>
      <span className="msg-file__meta">
        <strong>{attachment.name}</strong>
        <span>
          {attachment.size} · {attachment.ext}
        </span>
      </span>
    </>
  )
  // Havolasi bor fayl bosilganda yuklab olinadi
  return attachment.url ? (
    <a className="msg-file" href={attachment.url} download={attachment.name}>
      {inner}
    </a>
  ) : (
    <div className="msg-file">{inner}</div>
  )
}

export default function MessagesPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [conversations, setConversations] = useState(loadConversations)
  const [filter, setFilter] = useState('all')
  const [query, setQuery] = useState('')
  const [draft, setDraft] = useState('')
  const [mobilePane, setMobilePane] = useState('list')
  const [composeOpen, setComposeOpen] = useState(false)
  const [emojiOpen, setEmojiOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [call, setCall] = useState(null)
  const [typingId, setTypingId] = useState(null)
  const [lightbox, setLightbox] = useState(null)
  const [toast, setToast] = useState(null)
  const threadEndRef = useRef(null)
  const inputRef = useRef(null)
  const fileRef = useRef(null)
  const emojiRef = useRef(null)
  const menuRef = useRef(null)
  const timers = useRef([])
  const replyIndex = useRef(0)
  const toastTimer = useRef(0)
  const activeIdRef = useRef(null)

  const activeId = searchParams.get('c')

  useEffect(() => {
    saveConversations(conversations)
  }, [conversations])

  // Sahifadan chiqilganda kutilayotgan javob taymerlari to'xtatiladi
  useEffect(() => {
    const pending = timers.current
    return () => pending.forEach(clearTimeout)
  }, [])

  useDismiss(emojiOpen, () => setEmojiOpen(false), emojiRef)
  useDismiss(menuOpen, () => setMenuOpen(false), menuRef)

  useEffect(() => {
    const companyId = searchParams.get('company')
    const jobId = searchParams.get('job')
    const candidateId = searchParams.get('candidate')

    if (!companyId && !candidateId) return

    setConversations((prev) => {
      let next = [...prev]
      let targetId = null

      if (companyId) {
        const existing = next.find((c) => c.companyId === companyId)
        if (existing) {
          targetId = existing.id
          if (jobId) {
            const job = jobs.find((j) => String(j.id) === String(jobId))
            if (job) {
              next = next.map((c) =>
                c.id === existing.id
                  ? {
                      ...c,
                      jobContext: {
                        jobId: job.id,
                        title: job.title,
                        location: job.location,
                        typeLabel: job.typeLabel,
                        typeTone: job.typeTone,
                      },
                    }
                  : c,
              )
            }
          }
        } else {
          const company = companies.find((c) => c.id === companyId)
          if (company) {
            const job = jobId ? jobs.find((j) => String(j.id) === String(jobId)) : null
            const created = buildCompanyConversation(company, job || null)
            next = [created, ...next]
            targetId = created.id
          }
        }
      }

      if (candidateId) {
        const existing = next.find((c) => c.id === `c-cand-${candidateId}`)
        if (existing) {
          targetId = existing.id
        } else {
          const candidate = allCandidates.find((c) => c.id === candidateId)
          if (candidate) {
            const created = buildCandidateConversation(candidate)
            next = [created, ...next]
            targetId = created.id
          }
        }
      }

      if (targetId) {
        queueMicrotask(() => {
          setSearchParams({ c: targetId }, { replace: true })
          setMobilePane('chat')
        })
      }

      return next
    })
  }, [searchParams, setSearchParams])

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return conversations.filter((c) => {
      if (filter !== 'all' && c.peerType !== filter) return false
      if (!q) return true
      return (
        c.name.toLowerCase().includes(q) ||
        c.preview.toLowerCase().includes(q) ||
        c.jobContext?.title?.toLowerCase().includes(q)
      )
    })
  }, [conversations, filter, query])

  const active =
    conversations.find((c) => c.id === activeId) ||
    filtered[0] ||
    conversations[0] ||
    null

  useEffect(() => {
    if (searchParams.get('company') || searchParams.get('candidate')) return
    if (!activeId && active) {
      setSearchParams({ c: active.id }, { replace: true })
    }
  }, [active, activeId, searchParams, setSearchParams])

  useEffect(() => {
    // Faqat suhbat oynasining o'zi aylanadi — butun sahifa joyidan siljimaydi
    const body = threadEndRef.current?.closest('.messages-chat__body')
    body?.scrollTo({ top: body.scrollHeight, behavior: 'smooth' })
  }, [active?.id, active?.messages?.length])

  useEffect(() => {
    activeIdRef.current = active?.id ?? null
  }, [active?.id])

  const totalUnread = unreadTotal(conversations)

  function selectConversation(id) {
    setSearchParams({ c: id })
    setMobilePane('chat')
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, unread: 0 } : c)),
    )
  }

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms))
  }

  const patchConversation = (id, patch) =>
    setConversations((prev) => prev.map((c) => (c.id === id ? { ...c, ...(typeof patch === 'function' ? patch(c) : patch) } : c)))

  function pushMessage(convId, message) {
    const full = { id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`, time: nowTime(), ...message }
    patchConversation(convId, (c) => ({
      preview: previewOf(full),
      timeLabel: full.time,
      messages: [...c.messages, full],
    }))
    return full.id
  }

  const setStatus = (convId, messageId, status) =>
    patchConversation(convId, (c) => ({
      messages: c.messages.map((m) => (m.id === messageId ? { ...m, status } : m)),
    }))

  // Yuborilgan xabar: yetkazildi → o'qildi → suhbatdosh javobi (namunaviy)
  function deliverAndReply(conv, messageId, kind) {
    const convId = conv.id
    later(() => setStatus(convId, messageId, 'delivered'), 600)
    later(() => {
      setStatus(convId, messageId, 'read')
      setTypingId(convId)
    }, 1400)
    later(() => {
      setTypingId((current) => (current === convId ? null : current))
      const pool = AUTO_REPLIES[conv.peerType] ?? AUTO_REPLIES.employer
      const text = kind === 'file' ? AUTO_REPLIES.file : pool[replyIndex.current++ % pool.length]
      const reply = { id: `reply-${Date.now()}`, from: 'them', text, time: nowTime(), status: 'delivered' }
      setConversations((prev) =>
        prev.map((c) =>
          c.id === convId
            ? {
                ...c,
                preview: text,
                timeLabel: reply.time,
                messages: [...c.messages, reply],
                // Boshqa suhbat ochiq bo'lsa — o'qilmagan sifatida belgilanadi
                unread: activeIdRef.current === convId ? 0 : (c.unread || 0) + 1,
              }
            : c,
        ),
      )
    }, 3200)
  }

  function sendMessage(event) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || !active) return
    const id = pushMessage(active.id, { from: 'me', text, status: 'sent' })
    deliverAndReply(active, id, 'text')
    setDraft('')
    setEmojiOpen(false)
    inputRef.current?.focus()
  }

  async function attachFiles(event) {
    const files = [...event.target.files]
    event.target.value = ''
    if (!active) return
    for (const file of files) {
      if (file.size > MAX_FILE_BYTES) {
        showToast(`«${file.name}» juda katta — 10 MB gacha fayl yuborish mumkin`)
        continue
      }
      let url = null
      try {
        url = file.size <= PERSIST_FILE_BYTES ? await readAsDataUrl(file) : URL.createObjectURL(file)
      } catch {
        showToast(`«${file.name}» faylini o‘qib bo‘lmadi`)
        continue
      }
      const ext = (file.name.includes('.') ? file.name.split('.').pop() : file.type.split('/').pop() || 'fayl').toUpperCase()
      const id = pushMessage(active.id, {
        from: 'me',
        status: 'sent',
        attachment: { name: file.name, size: formatSize(file.size), ext, url, kind: file.type.startsWith('image/') ? 'image' : 'file' },
      })
      deliverAndReply(active, id, 'file')
    }
  }

  function insertEmoji(emoji) {
    const input = inputRef.current
    const start = input?.selectionStart ?? draft.length
    const end = input?.selectionEnd ?? draft.length
    setDraft(draft.slice(0, start) + emoji + draft.slice(end))
    requestAnimationFrame(() => {
      input?.focus()
      input?.setSelectionRange(start + emoji.length, start + emoji.length)
    })
  }

  function showToast(text, undo) {
    clearTimeout(toastTimer.current)
    setToast({ text, undo })
    toastTimer.current = setTimeout(() => setToast(null), 5000)
  }

  function endCall(result) {
    if (call) pushMessage(call.convId, { from: 'me', status: 'read', call: result })
    setCall(null)
  }

  function clearChat() {
    if (!active) return
    const backup = conversations
    patchConversation(active.id, { messages: [], preview: 'Suhbat tozalandi' })
    setMenuOpen(false)
    showToast('Suhbat tozalandi', () => setConversations(backup))
  }

  function deleteChat() {
    if (!active) return
    const backup = conversations
    const removedId = active.id
    setConversations((prev) => prev.filter((c) => c.id !== removedId))
    setMenuOpen(false)
    setMobilePane('list')
    setSearchParams({}, { replace: true })
    showToast('Suhbat o‘chirildi', () => {
      setConversations(backup)
      setSearchParams({ c: removedId }, { replace: true })
    })
  }

  function toggleMute() {
    if (!active) return
    patchConversation(active.id, { muted: !active.muted })
    setMenuOpen(false)
    showToast(active.muted ? 'Bildirishnomalar yoqildi' : 'Bildirishnomalar o‘chirildi')
  }

  const peerUrl = active?.companyId ? `/kompaniya/${active.companyId}` : null

  function startWithCompany(company) {
    setComposeOpen(false)
    navigate(`/xabarlar?company=${company.id}`)
  }

  return (
    <div className="messages-page">
      <div className="container messages-page__shell">
        <aside
          className={`messages-rail ${mobilePane === 'list' ? 'is-mobile-visible' : ''}`}
          aria-label="Xabarlar ro‘yxati"
        >
          <div className="messages-rail__head">
            <div className="messages-rail__title-row">
              <h1 className="messages-rail__title">
                Xabarlar
                {totalUnread > 0 ? <span className="messages-rail__badge">{totalUnread}</span> : null}
              </h1>
              <button
                type="button"
                className="messages-rail__compose"
                aria-label="Yangi xabar"
                onClick={() => setComposeOpen(true)}
              >
                <Edit3 size={16} strokeWidth={2.2} />
              </button>
            </div>

            <label className="messages-rail__search">
              <FiSearch aria-hidden />
              <input
                type="search"
                placeholder="Qidirish..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>

            <div className="messages-rail__tabs" role="tablist" aria-label="Filtr">
              {messageFilters.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={filter === item.id}
                  className={`messages-rail__tab ${filter === item.id ? 'is-active' : ''}`}
                  onClick={() => setFilter(item.id)}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          <ul className="messages-rail__list">
            {filtered.map((item) => {
              const isActive = active?.id === item.id
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    className={`msg-thread ${isActive ? 'is-active' : ''}`}
                    onClick={() => selectConversation(item.id)}
                  >
                    <Avatar
                      name={item.name}
                      src={item.avatar}
                      color={item.avatarColor}
                      online={item.online}
                      size={48}
                    />
                    <span className="msg-thread__body">
                      <span className="msg-thread__top">
                        <span className="msg-thread__name">
                          {item.name}
                          {item.verified ? <VerifiedBadge /> : null}
                        </span>
                        <time className="msg-thread__time">{item.timeLabel}</time>
                      </span>
                      <span className="msg-thread__bottom">
                        <span className="msg-thread__preview">{item.preview}</span>
                        {item.unread > 0 ? (
                          <span className="msg-thread__unread">{item.unread}</span>
                        ) : null}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
            {filtered.length === 0 ? (
              <li className="messages-rail__empty">Hech narsa topilmadi</li>
            ) : null}
          </ul>

          <div className="messages-rail__promo">
            <MessageIcon size={22} />
            <div>
              <strong>Yangi imkoniyatlar</strong>
              <p>Faol bo‘ling — ish beruvchilar sizni tezroq topadi.</p>
            </div>
          </div>
        </aside>

        <section
          className={`messages-chat ${mobilePane === 'chat' ? 'is-mobile-visible' : ''}`}
          aria-label="Suhbat"
        >
          {active ? (
            <>
              <header className="messages-chat__head">
                <button
                  type="button"
                  className="messages-chat__back"
                  aria-label="Ro‘yxatga qaytish"
                  onClick={() => setMobilePane('list')}
                >
                  <ArrowLeft size={18} strokeWidth={2.2} />
                </button>
                <button
                  type="button"
                  className="messages-chat__peer"
                  onClick={() => setMobilePane('info')}
                >
                  <Avatar
                    name={active.name}
                    src={active.avatar}
                    color={active.avatarColor}
                    online={active.online}
                    size={44}
                  />
                  <span>
                    <span className="messages-chat__peer-name">
                      <span className="messages-chat__peer-title">{active.name}</span>
                      {active.verified ? <VerifiedBadge /> : null}
                    </span>
                    <span className="messages-chat__peer-meta">
                      {typingId === active.id ? 'yozmoqda…' : `${active.roleLabel} • ${active.lastSeen}`}
                      {active.muted ? (
                        <span className="chat-muted" title="Ovozsiz" aria-label="Ovozsiz">
                          <BellOff size={12} />
                        </span>
                      ) : null}
                    </span>
                  </span>
                </button>
                <div className="messages-chat__actions">
                  <button
                    type="button"
                    aria-label="Audio qo‘ng‘iroq"
                    className="messages-chat__icon-btn"
                    onClick={() => setCall({ type: 'audio', convId: active.id })}
                  >
                    <FiPhone />
                  </button>
                  <button
                    type="button"
                    aria-label="Video qo‘ng‘iroq"
                    className="messages-chat__icon-btn"
                    onClick={() => setCall({ type: 'video', convId: active.id })}
                  >
                    <FiVideo />
                  </button>
                  <div className="chat-menu-wrap" ref={menuRef}>
                    <button
                      type="button"
                      aria-label="Qo‘shimcha amallar"
                      aria-haspopup="menu"
                      aria-expanded={menuOpen}
                      className="messages-chat__icon-btn"
                      onClick={() => setMenuOpen((open) => !open)}
                    >
                      <FiMoreHorizontal />
                    </button>
                    {menuOpen ? (
                      <div className="chat-menu" role="menu">
                        <button
                          type="button"
                          role="menuitem"
                          className="chat-menu__item"
                          onClick={() => {
                            setMenuOpen(false)
                            setMobilePane('info')
                          }}
                        >
                          <UserRound size={18} /> Profil ma’lumoti
                        </button>
                        {peerUrl ? (
                          <button type="button" role="menuitem" className="chat-menu__item" onClick={() => navigate(peerUrl)}>
                            <Building2 size={18} /> Kompaniya sahifasi
                          </button>
                        ) : null}
                        <button type="button" role="menuitem" className="chat-menu__item" onClick={toggleMute}>
                          {active.muted ? <BellRing size={18} /> : <BellOff size={18} />}
                          {active.muted ? 'Bildirishnomani yoqish' : 'Ovozsiz qilish'}
                        </button>
                        <span className="chat-menu__sep" aria-hidden="true" />
                        <button
                          type="button"
                          role="menuitem"
                          className="chat-menu__item"
                          onClick={clearChat}
                          disabled={!active.messages.length}
                        >
                          <Eraser size={18} /> Suhbatni tozalash
                        </button>
                        <button type="button" role="menuitem" className="chat-menu__item chat-menu__item--danger" onClick={deleteChat}>
                          <Trash2 size={18} /> Suhbatni o‘chirish
                        </button>
                      </div>
                    ) : null}
                  </div>
                </div>
              </header>

              <div className="messages-chat__body">
                {active.jobContext ? (
                  <div className="msg-job-card">
                    <div className="msg-job-card__copy">
                      <strong>{active.jobContext.title}</strong>
                      <span>
                        <FiMapPin />
                        {active.jobContext.location}
                        <em className={`msg-job-card__tag msg-job-card__tag--${active.jobContext.typeTone}`}>
                          {active.jobContext.typeLabel}
                        </em>
                      </span>
                    </div>
                    <Link to={`/ish/${active.jobContext.jobId}`} className="msg-job-card__cta">
                      E&apos;lonni ko&apos;rish
                    </Link>
                  </div>
                ) : null}

                <div className="msg-day">
                  <span>Bugun</span>
                </div>

                <ul className="msg-bubbles">
                  {active.messages.map((message) => (
                    <li
                      key={message.id}
                      className={`msg-row msg-row--${message.from === 'me' ? 'out' : 'in'}`}
                    >
                      {message.from !== 'me' ? (
                        <Avatar
                          name={active.name}
                          src={active.avatar}
                          color={active.avatarColor}
                          size={32}
                        />
                      ) : null}
                      <div className="msg-bubble">
                        {message.call ? <CallLog call={message.call} /> : null}
                        {message.attachment?.kind === 'image' && message.attachment.url ? (
                          <button
                            type="button"
                            className="chat-image"
                            onClick={() => setLightbox(message.attachment.url)}
                            aria-label={`Rasmni ochish: ${message.attachment.name}`}
                          >
                            <img src={message.attachment.url} alt={message.attachment.name} />
                          </button>
                        ) : message.attachment ? (
                          <FileChip attachment={message.attachment} />
                        ) : null}
                        {message.text ? <p>{message.text}</p> : null}
                        <footer className="msg-bubble__meta">
                          <time>{message.time}</time>
                          {message.from === 'me' ? (
                            <span className="msg-bubble__ticks" aria-label="Yuborildi">
                              <FiCheck />
                              {(message.status === 'read' || message.status === 'delivered') && (
                                <FiCheck className="msg-bubble__tick2" />
                              )}
                            </span>
                          ) : null}
                        </footer>
                      </div>
                    </li>
                  ))}
                  {typingId === active.id ? (
                    <li className="msg-row msg-row--in" aria-label={`${active.name} yozmoqda`}>
                      <Avatar name={active.name} src={active.avatar} color={active.avatarColor} size={32} />
                      <div className="msg-bubble">
                        <span className="chat-typing" aria-hidden="true">
                          <i />
                          <i />
                          <i />
                        </span>
                      </div>
                    </li>
                  ) : null}
                  <li ref={threadEndRef} aria-hidden />
                </ul>
              </div>

              <form className="messages-chat__composer" onSubmit={sendMessage}>
                <input ref={fileRef} type="file" multiple hidden onChange={attachFiles} />
                <button
                  type="button"
                  className="messages-chat__tool"
                  aria-label="Fayl biriktirish"
                  onClick={() => fileRef.current?.click()}
                >
                  <FiPaperclip />
                </button>
                <input
                  ref={inputRef}
                  type="text"
                  placeholder="Xabar yozing..."
                  value={draft}
                  onChange={(e) => setDraft(e.target.value)}
                  aria-label="Xabar"
                />
                <div className="chat-emoji-wrap" ref={emojiRef}>
                  <button
                    type="button"
                    className="messages-chat__tool"
                    aria-label="Emoji"
                    aria-expanded={emojiOpen}
                    onClick={() => setEmojiOpen((open) => !open)}
                  >
                    <FiSmile />
                  </button>
                  {emojiOpen ? <EmojiPicker onPick={insertEmoji} /> : null}
                </div>
                <button
                  type="submit"
                  className="messages-chat__send"
                  aria-label="Yuborish"
                  disabled={!draft.trim()}
                >
                  <FiSend />
                </button>
              </form>
            </>
          ) : (
            <div className="messages-chat__empty">
              <MessageIcon size={40} />
              <h2>Suhbat tanlang</h2>
              <p>Ish e&apos;loni yoki kompaniya bo&apos;yicha yozishni boshlang.</p>
            </div>
          )}
        </section>

        <aside
          className={`messages-info ${mobilePane === 'info' ? 'is-mobile-visible' : ''}`}
          aria-label="Profil ma’lumoti"
        >
          {active ? (
            <>
              <button
                type="button"
                className="messages-info__close"
                aria-label="Yopish"
                onClick={() => setMobilePane('chat')}
              >
                <FiX />
              </button>

              <div className="messages-info__hero">
                <Avatar
                  name={active.name}
                  src={active.avatar}
                  color={active.avatarColor}
                  size={88}
                  online={active.online}
                />
                <h2>
                  {active.name}
                  {active.verified ? <VerifiedBadge /> : null}
                </h2>
                <p>{active.roleLabel}</p>
                <button
                  type="button"
                  className={`messages-info__follow${active.following ? ' is-following' : ''}`}
                  aria-pressed={Boolean(active.following)}
                  onClick={() => patchConversation(active.id, { following: !active.following })}
                >
                  {active.following ? 'Kuzatilmoqda ✓' : 'Kuzatish'}
                </button>
              </div>

              <div className="messages-info__stats">
                {active.stats?.map((stat) => {
                  const Icon = statIcons[stat.icon] || FiUsers
                  return (
                    <div key={stat.id} className="messages-info__stat">
                      <Icon aria-hidden />
                      <strong>{stat.value}</strong>
                      <span>{stat.label}</span>
                    </div>
                  )
                })}
              </div>

              {active.about ? (
                <section className="messages-info__block">
                  <h3>
                    {active.peerType === 'employer' ? 'Kompaniya haqida' : 'Nomzod haqida'}
                  </h3>
                  <p>{active.about}</p>
                  {peerUrl ? (
                    <Link to={peerUrl} className="messages-info__more">
                      Batafsil ma&apos;lumot
                    </Link>
                  ) : null}
                </section>
              ) : null}

              {active.activeJobs?.length > 0 ? (
                <section className="messages-info__block">
                  <h3>Faol e&apos;lonlar</h3>
                  <ul className="messages-info__jobs">
                    {active.activeJobs.map((job) => (
                      <li key={job.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setConversations((prev) =>
                              prev.map((c) =>
                                c.id === active.id
                                  ? {
                                      ...c,
                                      jobContext: {
                                        jobId: job.id,
                                        title: job.title,
                                        location: job.location,
                                        typeLabel: job.typeLabel,
                                        typeTone: job.typeTone,
                                      },
                                    }
                                  : c,
                              ),
                            )
                            setMobilePane('chat')
                          }}
                        >
                          <strong>{job.title}</strong>
                          <span>
                            <FiMapPin /> {job.location} · {job.typeLabel}
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                </section>
              ) : null}

              {active.media?.length > 0 ? (
                <section className="messages-info__block">
                  <h3>
                    <ImageIcon size={15} /> Media
                  </h3>
                  <div className="messages-info__media">
                    {active.media.map((src) => (
                      <button key={src} type="button" className="messages-info__media-btn" onClick={() => setLightbox(src)} aria-label="Rasmni ochish">
                        <img src={src} alt="" width={72} height={72} />
                      </button>
                    ))}
                  </div>
                </section>
              ) : null}
            </>
          ) : null}
        </aside>
      </div>

      {call ? (
        <CallOverlay
          type={call.type}
          peer={conversations.find((c) => c.id === call.convId) ?? active}
          onEnd={endCall}
        />
      ) : null}
      {lightbox ? <Lightbox src={lightbox} onClose={() => setLightbox(null)} /> : null}
      {toast ? (
        <div className="chat-toast" role="status">
          <span>{toast.text}</span>
          {toast.undo ? (
            <button
              type="button"
              onClick={() => {
                toast.undo()
                setToast(null)
              }}
            >
              Bekor qilish
            </button>
          ) : null}
        </div>
      ) : null}

      {composeOpen ? (
        <div className="msg-compose" role="dialog" aria-modal="true" aria-label="Yangi xabar">
          <button
            type="button"
            className="msg-compose__backdrop"
            aria-label="Yopish"
            onClick={() => setComposeOpen(false)}
          />
          <div className="msg-compose__panel">
            <header>
              <h2>Yangi xabar</h2>
              <button type="button" aria-label="Yopish" onClick={() => setComposeOpen(false)}>
                <FiX />
              </button>
            </header>
            <p className="msg-compose__hint">Kompaniya yoki ish e&apos;loni bo&apos;yicha yozing</p>
            <ul>
              {companies.slice(0, 10).map((company) => (
                <li key={company.id}>
                  <button type="button" onClick={() => startWithCompany(company)}>
                    <Avatar
                      name={company.name}
                      src={company.logo}
                      color={company.color}
                      size={40}
                    />
                    <span>
                      <strong>
                        {company.name}
                        {company.verified ? <VerifiedBadge /> : null}
                      </strong>
                      <em>{company.adsCount} ta e&apos;lon</em>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ) : null}
    </div>
  )
}
