import { useCallback, useSyncExternalStore } from 'react'

// Saqlangan va ariza topshirilgan vakansiyalar — localStorage'da, barcha komponentlar orasida sinxron
const KEYS = { saved: 'ayolkaryera-saved-jobs', applied: 'ayolkaryera-applied-jobs' }
const listeners = new Set()
const cache = {}

function read(list) {
  if (!cache[list]) {
    let ids = []
    try {
      ids = JSON.parse(localStorage.getItem(KEYS[list])) ?? []
    } catch {
      ids = []
    }
    cache[list] = new Set(Array.isArray(ids) ? ids : [])
  }
  return cache[list]
}

function write(list, next) {
  cache[list] = next
  try {
    localStorage.setItem(KEYS[list], JSON.stringify([...next]))
  } catch {
    // localStorage yopiq bo'lsa ham holat sessiya davomida ishlaydi
  }
  listeners.forEach((listener) => listener())
}

function subscribe(listener) {
  listeners.add(listener)
  return () => listeners.delete(listener)
}

/** list: 'saved' | 'applied' */
export function useJobList(list) {
  const ids = useSyncExternalStore(subscribe, () => read(list), () => read(list))

  const toggle = useCallback((id) => {
    const next = new Set(read(list))
    if (next.has(id)) next.delete(id)
    else next.add(id)
    write(list, next)
  }, [list])

  const add = useCallback((id) => {
    if (read(list).has(id)) return
    write(list, new Set(read(list)).add(id))
  }, [list])

  return { ids, has: (id) => ids.has(id), toggle, add }
}
