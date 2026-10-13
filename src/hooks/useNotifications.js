import { useMemo, useSyncExternalStore } from 'react'
import { buildNotifications, OLD_AFTER_MS } from '../data/notifications.js'

// O'qilgan/o'qilmagan holati va o'chirilganlar localStorage'da — sahifalar va header orasida sinxron
const KEY = 'ayolkaryera-notifications'
const SEED = buildNotifications()
const listeners = new Set()
let state = null

function load() {
  if (state) return state
  try {
    const saved = JSON.parse(localStorage.getItem(KEY))
    state = { read: saved?.read ?? {}, deleted: saved?.deleted ?? [] }
  } catch {
    state = { read: {}, deleted: [] }
  }
  return state
}

function commit(next) {
  state = next
  try {
    localStorage.setItem(KEY, JSON.stringify(next))
  } catch {
    // localStorage yopiq bo'lsa ham holat sessiya davomida saqlanadi
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

const setRead = (ids, value) => {
  const current = load()
  const read = { ...current.read }
  ids.forEach((id) => {
    read[id] = value
  })
  commit({ ...current, read })
}

const actions = {
  markRead: (id) => setRead([id], true),
  markUnread: (id) => setRead([id], false),
  markAllRead: (ids) => setRead(ids, true),
  remove: (ids) => {
    const current = load()
    commit({ ...current, deleted: [...new Set([...current.deleted, ...ids])] })
  },
  restore: (ids) => {
    const current = load()
    commit({ ...current, deleted: current.deleted.filter((id) => !ids.includes(id)) })
  },
}

/** Har bir bildirishnoma: isRead va group ('unread' | 'read' | 'old') bilan */
export function useNotifications() {
  const snapshot = useSyncExternalStore(subscribe, load, load)

  const items = useMemo(() => {
    const deleted = new Set(snapshot.deleted)
    return SEED.filter((item) => !deleted.has(item.id))
      .map((item) => {
        const isRead = snapshot.read[item.id] ?? Boolean(item.read)
        const isOld = item.ago > OLD_AFTER_MS
        return { ...item, isRead, group: isOld ? 'old' : isRead ? 'read' : 'unread' }
      })
      .sort((a, b) => b.createdAt - a.createdAt)
  }, [snapshot])

  // Belgidagi son "O'qilmagan" tabi bilan bir xil: 7 kundan eskilari kirmaydi
  const unreadCount = items.filter((item) => item.group === 'unread').length
  const hasUnread = items.some((item) => !item.isRead)

  return { items, unreadCount, hasUnread, ...actions }
}

/** "6 daqiqa oldin", "kecha", "12 kun oldin" — brauzer ICU'siga bog'liq emas (Chrome "uz" uchun qisqartma beradi) */
export function timeAgo(timestamp, now = Date.now()) {
  const minutes = Math.floor((now - timestamp) / 60000)
  if (minutes < 1) return 'hozirgina'
  if (minutes < 60) return `${minutes} daqiqa oldin`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours} soat oldin`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'kecha'
  if (days < 7) return `${days} kun oldin`
  const weeks = Math.floor(days / 7)
  if (days < 30) return `${weeks} hafta oldin`
  return `${Math.floor(days / 30)} oy oldin`
}
