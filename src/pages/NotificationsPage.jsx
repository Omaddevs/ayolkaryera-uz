import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Bell,
  BellOff,
  CalendarClock,
  CheckCheck,
  Eye,
  FileCheck2,
  Gift,
  Hourglass,
  ListChecks,
  MailOpen,
  Mail,
  MessageCircle,
  ShieldCheck,
  Sparkles,
  Trash2,
  X,
} from 'lucide-react'
import { CompanyLogo } from '../components/mobile/JobCards.jsx'
import { NOTIFICATION_TYPES } from '../data/notifications.js'
import { timeAgo, useNotifications } from '../hooks/useNotifications.js'
import './NotificationsPage.css'

const TYPE_ICONS = {
  application: FileCheck2,
  interview: CalendarClock,
  match: Sparkles,
  message: MessageCircle,
  offer: Gift,
  deadline: Hourglass,
  profile: Eye,
  system: ShieldCheck,
}

const TABS = [
  { id: 'all', label: 'Barchasi' },
  { id: 'unread', label: "O'qilmagan" },
  { id: 'read', label: "O'qilgan" },
  { id: 'old', label: 'Eski' },
]

const GROUPS = [
  { id: 'unread', title: 'Yangi' },
  { id: 'read', title: "O'qilgan" },
  { id: 'old', title: 'Eski', hint: '7 kundan oldingi' },
]

const EMPTY = {
  all: { title: "Bildirishnomalar yo'q", text: "Ariza holati, suhbat va yangi vakansiyalar haqida xabarlar shu yerda chiqadi." },
  unread: { title: "Hammasi o'qilgan", text: "Yangi bildirishnomalar kelganda shu yerda ko'rasiz." },
  read: { title: "O'qilgan bildirishnoma yo'q", text: "Ochib ko'rilgan bildirishnomalar shu bo'limga o'tadi." },
  old: { title: "Eski bildirishnoma yo'q", text: "7 kundan oldingi bildirishnomalar shu yerda saqlanadi." },
}

function formatDate(timestamp) {
  const d = new Date(timestamp)
  const pad = (n) => String(n).padStart(2, '0')
  return `${pad(d.getDate())}.${pad(d.getMonth() + 1)}.${d.getFullYear()} ${pad(d.getHours())}:${pad(d.getMinutes())}`
}

function actionUrl(item) {
  const { kind } = item.action ?? {}
  if (kind === 'chat' && item.job) return `/xabarlar?company=${item.job.companyId}&job=${item.job.id}`
  if (kind === 'job' && item.job) return `/ish/${item.job.id}`
  if (kind === 'jobs') return '/ishlar'
  if (kind === 'profile') return '/profil'
  return null
}

function TypeIcon({ item, size = 'md' }) {
  const Icon = TYPE_ICONS[item.type] ?? Bell
  const tone = NOTIFICATION_TYPES[item.type]?.tone ?? 'gray'
  return (
    <span className={`nt-icon nt-icon--${size} nt-tone--${tone}`} aria-hidden="true">
      <Icon size={size === 'lg' ? 26 : 20} strokeWidth={2} />
      {item.job && size !== 'lg' && <CompanyLogo job={item.job} size={22} className="nt-icon__company" />}
    </span>
  )
}

export default function NotificationsPage() {
  const { items, unreadCount, hasUnread, markRead, markUnread, markAllRead, remove, restore } = useNotifications()
  const [tab, setTab] = useState('all')
  const [openId, setOpenId] = useState(null)
  const [selecting, setSelecting] = useState(false)
  const [selected, setSelected] = useState(() => new Set())
  const [toast, setToast] = useState(null)
  const toastTimer = useRef(null)

  const counts = useMemo(
    () => ({
      all: items.length,
      unread: items.filter((item) => item.group === 'unread').length,
      read: items.filter((item) => item.group === 'read').length,
      old: items.filter((item) => item.group === 'old').length,
    }),
    [items],
  )

  const visible = tab === 'all' ? items : items.filter((item) => item.group === tab)
  const openItem = items.find((item) => item.id === openId) ?? null

  useEffect(() => () => clearTimeout(toastTimer.current), [])

  function showToast(ids) {
    clearTimeout(toastTimer.current)
    setToast({ ids, text: ids.length > 1 ? `${ids.length} ta bildirishnoma o'chirildi` : "Bildirishnoma o'chirildi" })
    toastTimer.current = setTimeout(() => setToast(null), 5000)
  }

  function deleteIds(ids) {
    if (!ids.length) return
    remove(ids)
    setSelected(new Set())
    if (ids.includes(openId)) setOpenId(null)
    showToast(ids)
  }

  function open(item) {
    if (selecting) {
      toggleSelected(item.id)
      return
    }
    if (!item.isRead) markRead(item.id)
    setOpenId(item.id)
  }

  function toggleSelected(id) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function exitSelecting() {
    setSelecting(false)
    setSelected(new Set())
  }

  const allVisibleSelected = visible.length > 0 && visible.every((item) => selected.has(item.id))

  return (
    <div className="notifications-page">
      <div className="nt-inner">
        <header className="nt-head">
          <div className="nt-head__title">
            <h1>Bildirishnomalar</h1>
            {unreadCount > 0 && <span className="nt-badge">{unreadCount} ta yangi</span>}
          </div>
          <div className="nt-head__actions">
            {selecting ? (
              <button type="button" className="nt-btn nt-btn--ghost" onClick={exitSelecting}>
                Bekor qilish
              </button>
            ) : (
              <>
                <button
                  type="button"
                  className="nt-icon-btn"
                  onClick={() => markAllRead(items.map((item) => item.id))}
                  disabled={!hasUnread}
                  aria-label="Hammasini o'qilgan deb belgilash"
                  title="Hammasini o'qilgan deb belgilash"
                >
                  <CheckCheck size={20} strokeWidth={2} />
                </button>
                <button
                  type="button"
                  className="nt-icon-btn"
                  onClick={() => setSelecting(true)}
                  disabled={!items.length}
                  aria-label="Tanlab o'chirish"
                  title="Tanlab o'chirish"
                >
                  <ListChecks size={20} strokeWidth={2} />
                </button>
              </>
            )}
          </div>
        </header>

        <div className="nt-tabs" role="tablist" aria-label="Bildirishnomalar bo'limi">
          {TABS.map((item) => (
            <button
              key={item.id}
              type="button"
              role="tab"
              aria-selected={tab === item.id}
              className={`nt-tab${tab === item.id ? ' is-active' : ''}`}
              onClick={() => {
                setTab(item.id)
                setSelected(new Set())
              }}
            >
              {item.label}
              <span className="nt-tab__count">{counts[item.id]}</span>
            </button>
          ))}
        </div>

        {selecting && visible.length > 0 && (
          <label className="nt-select-all">
            <input
              type="checkbox"
              checked={allVisibleSelected}
              onChange={() => setSelected(allVisibleSelected ? new Set() : new Set(visible.map((item) => item.id)))}
            />
            <span className="nt-check" aria-hidden="true" />
            Hammasini tanlash
          </label>
        )}

        {tab === 'old' && !selecting && counts.old > 0 && (
          <div className="nt-note">
            <span>7 kundan oldingi bildirishnomalar</span>
            <button type="button" className="nt-link nt-link--danger" onClick={() => deleteIds(visible.map((item) => item.id))}>
              Hammasini tozalash
            </button>
          </div>
        )}

        {visible.length === 0 ? (
          <div className="nt-empty">
            <span className="nt-empty__icon" aria-hidden="true">
              <BellOff size={28} strokeWidth={1.8} />
            </span>
            <p className="nt-empty__title">{EMPTY[tab].title}</p>
            <p className="nt-empty__text">{EMPTY[tab].text}</p>
          </div>
        ) : tab === 'all' ? (
          GROUPS.map((group) => {
            const list = visible.filter((item) => item.group === group.id)
            if (!list.length) return null
            return (
              <section key={group.id} className="nt-group" aria-labelledby={`nt-group-${group.id}`}>
                <h2 className="nt-group__title" id={`nt-group-${group.id}`}>
                  {group.title}
                  {group.hint && <span>{group.hint}</span>}
                </h2>
                <NotificationList
                  items={list}
                  selecting={selecting}
                  selected={selected}
                  onOpen={open}
                  onToggle={toggleSelected}
                  onDelete={(id) => deleteIds([id])}
                />
              </section>
            )
          })
        ) : (
          <NotificationList
            items={visible}
            selecting={selecting}
            selected={selected}
            onOpen={open}
            onToggle={toggleSelected}
            onDelete={(id) => deleteIds([id])}
          />
        )}
      </div>

      {selecting && (
        <div className="nt-bulk" role="toolbar" aria-label="Tanlanganlar bilan amallar">
          <span className="nt-bulk__count">{selected.size} ta tanlandi</span>
          <button
            type="button"
            className="nt-btn nt-btn--soft"
            disabled={!selected.size}
            onClick={() => {
              markAllRead([...selected])
              exitSelecting()
            }}
          >
            <MailOpen size={17} strokeWidth={2} aria-hidden="true" />
            O&apos;qilgan
          </button>
          <button
            type="button"
            className="nt-btn nt-btn--danger"
            disabled={!selected.size}
            onClick={() => {
              deleteIds([...selected])
              setSelecting(false)
            }}
          >
            <Trash2 size={17} strokeWidth={2} aria-hidden="true" />
            O&apos;chirish
          </button>
        </div>
      )}

      <NotificationSheet
        item={openItem}
        onClose={() => setOpenId(null)}
        onMarkUnread={(id) => {
          markUnread(id)
          setOpenId(null)
        }}
        onDelete={(id) => deleteIds([id])}
      />

      {toast && (
        <div className="nt-toast" role="status">
          <span>{toast.text}</span>
          <button
            type="button"
            onClick={() => {
              restore(toast.ids)
              setToast(null)
            }}
          >
            Bekor qilish
          </button>
        </div>
      )}
    </div>
  )
}

function NotificationList({ items, selecting, selected, onOpen, onToggle, onDelete }) {
  return (
    <ul className="nt-list">
      {items.map((item) => {
        const isSelected = selected.has(item.id)
        return (
          <li key={item.id} className={`nt-item${item.isRead ? '' : ' is-unread'}${isSelected ? ' is-selected' : ''}`}>
            {selecting && (
              <label className="nt-item__select">
                <input type="checkbox" checked={isSelected} onChange={() => onToggle(item.id)} aria-label={`Tanlash: ${item.title}`} />
                <span className="nt-check" aria-hidden="true" />
              </label>
            )}
            <button type="button" className="nt-item__main" onClick={() => onOpen(item)}>
              <TypeIcon item={item} />
              <span className="nt-item__body">
                <span className="nt-item__top">
                  <span className="nt-item__title">{item.title}</span>
                  {!item.isRead && <span className="nt-item__dot" aria-label="O'qilmagan" />}
                </span>
                <span className="nt-item__preview">{item.preview}</span>
                <span className="nt-item__meta">
                  <time dateTime={new Date(item.createdAt).toISOString()}>{timeAgo(item.createdAt)}</time>
                  <span aria-hidden="true">·</span>
                  {NOTIFICATION_TYPES[item.type]?.label}
                </span>
              </span>
            </button>
            {!selecting && (
              <button type="button" className="nt-item__delete" onClick={() => onDelete(item.id)} aria-label={`O'chirish: ${item.title}`} title="O'chirish">
                <Trash2 size={18} strokeWidth={2} />
              </button>
            )}
          </li>
        )
      })}
    </ul>
  )
}

function NotificationSheet({ item, onClose, onMarkUnread, onDelete }) {
  const dialogRef = useRef(null)
  const navigate = useNavigate()
  const [shown, setShown] = useState(item)

  // Yopilish animatsiyasi davomida oxirgi bildirishnoma ko'rinib turadi
  if (item && item !== shown) setShown(item)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (item && !dialog.open) dialog.showModal()
    if (!item && dialog.open) dialog.close()
  }, [item])

  const current = item ?? shown
  const url = current ? actionUrl(current) : null

  return (
    <dialog
      ref={dialogRef}
      className="nt-sheet"
      aria-labelledby="nt-sheet-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      {current && (
        <div className="nt-sheet__panel">
          <span className="nt-sheet__handle" aria-hidden="true" />
          <button type="button" className="nt-sheet__close" onClick={onClose} aria-label="Yopish">
            <X size={20} strokeWidth={2.2} />
          </button>

          <div className="nt-sheet__head">
            <TypeIcon item={current} size="lg" />
            <span className={`nt-chip nt-tone--${NOTIFICATION_TYPES[current.type]?.tone ?? 'gray'}`}>
              {NOTIFICATION_TYPES[current.type]?.label}
            </span>
            <h2 id="nt-sheet-title">{current.title}</h2>
            <p className="nt-sheet__time">
              {timeAgo(current.createdAt)} · {formatDate(current.createdAt)}
            </p>
          </div>

          <p className="nt-sheet__body">{current.body}</p>

          {current.job && (
            <Link to={`/ish/${current.job.id}`} className="nt-job" onClick={onClose}>
              <CompanyLogo job={current.job} size={44} />
              <span className="nt-job__text">
                <strong>{current.job.title}</strong>
                <span>
                  {current.job.company} · {current.job.location}
                </span>
                <span className="nt-job__salary">{current.job.salary}</span>
              </span>
              <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
            </Link>
          )}

          <div className="nt-sheet__actions">
            {url && (
              <button
                type="button"
                className="nt-btn nt-btn--primary nt-btn--block"
                onClick={() => {
                  onClose()
                  navigate(url)
                }}
              >
                {current.action.label}
                <ArrowRight size={18} strokeWidth={2.2} aria-hidden="true" />
              </button>
            )}
            <div className="nt-sheet__secondary">
              <button type="button" className="nt-btn nt-btn--ghost" onClick={() => onMarkUnread(current.id)}>
                <Mail size={17} strokeWidth={2} aria-hidden="true" />
                O&apos;qilmagan qilish
              </button>
              <button type="button" className="nt-btn nt-btn--danger-soft" onClick={() => onDelete(current.id)}>
                <Trash2 size={17} strokeWidth={2} aria-hidden="true" />
                O&apos;chirish
              </button>
            </div>
          </div>
        </div>
      )}
    </dialog>
  )
}
