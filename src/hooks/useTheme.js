import { useCallback, useEffect, useState } from 'react'

const STORAGE_KEY = 'ayolkaryera-theme'

function getInitialTheme() {
  if (typeof window === 'undefined') return 'dark'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  if (stored === 'light' || stored === 'dark') return stored
  return window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark'
}

function applyTheme(theme) {
  document.documentElement.setAttribute('data-theme', theme)
  window.localStorage.setItem(STORAGE_KEY, theme)
}

export function useTheme() {
  const [theme, setThemeState] = useState(getInitialTheme)

  useEffect(() => {
    applyTheme(theme)
  }, [theme])

  const setTheme = useCallback((next) => {
    const value = next === 'light' ? 'light' : 'dark'
    applyTheme(value)
    setThemeState(value)
  }, [])

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const value = prev === 'dark' ? 'light' : 'dark'
      applyTheme(value)
      return value
    })
  }, [])

  return { theme, setTheme, toggleTheme }
}
