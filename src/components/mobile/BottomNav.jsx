import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { Link, NavLink, useLocation } from 'react-router-dom'
import {
  Bookmark,
  Building2,
  BriefcaseBusiness,
  House,
  LayoutGrid,
  MapPinned,
  MessageCircle,
  Plus,
  Clapperboard,
  UserRound,
} from 'lucide-react'
import { loadJobsMapPage } from '../../pages/jobsMapLoader.js'
import './BottomNav.css'

const TABS = [
  { to: '/', label: 'Asosiy', Icon: House, end: true },
  { to: '/ishlar', label: 'Ishlar', Icon: BriefcaseBusiness },
  null, // markazdagi "+" tugmasi
  { to: '/xabarlar', label: 'Xabarlar', Icon: MessageCircle },
  { to: '/profil', label: 'Profil', Icon: UserRound },
]

// Yoy bo'ylab chiqadigan amallar (chapdan o'ngga); burchak — gradusda, 90° = tepada
const ACTIONS = [
  { to: '/saqlanganlar', label: 'Saqlangan', Icon: Bookmark, tone: '#8b5cf6', angle: 168, shift: 10 },
  { to: '/kategoriyalar', label: 'Kategoriyalar', Icon: LayoutGrid, tone: 'var(--color-primary)', angle: 129 },
  { to: '/xarita', label: 'Yaqin ishlar', Icon: MapPinned, tone: '#0ea5e9', angle: 90, prefetch: true },
  { to: '/kompaniyalar', label: 'Kompaniyalar', Icon: Building2, tone: '#16a34a', angle: 51 },
  { to: '/reels', label: 'Reels', Icon: Clapperboard, tone: '#ef4444', angle: 12 },
]
const RADIUS = 150

export default function BottomNav() {
  const [open, setOpen] = useState(false)
  const { pathname, hash } = useLocation()
  const fabRef = useRef(null)
  const firstActionRef = useRef(null)

  // Sahifa almashganda menyu yopiladi
  const [lastPath, setLastPath] = useState(pathname)
  if (pathname !== lastPath) {
    setLastPath(pathname)
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return undefined
    firstActionRef.current?.focus({ preventScroll: true })
    const onKey = (event) => {
      if (event.key === 'Escape') {
        setOpen(false)
        fabRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    document.documentElement.classList.add('quick-menu-open')
    return () => {
      document.removeEventListener('keydown', onKey)
      document.documentElement.classList.remove('quick-menu-open')
    }
  }, [open])

  return (
    <>
      {createPortal(
        <div className={`quick-menu${open ? ' is-open' : ''}`} aria-hidden={!open} inert={open ? undefined : true}>
          <button type="button" className="quick-menu__backdrop" tabIndex={-1} aria-label="Yopish" onClick={() => setOpen(false)} />
          <nav className="quick-menu__arc" id="quick-menu" aria-label="Tezkor bo'limlar">
            {ACTIONS.map(({ to, label, Icon, tone, angle, prefetch, shift = 0 }, index) => {
              const rad = (angle * Math.PI) / 180
              return (
                <Link
                  key={to}
                  ref={index === 0 ? firstActionRef : undefined}
                  to={to}
                  className="quick-menu__item"
                  style={{
                    '--tx': `${Math.cos(rad) * RADIUS}px`,
                    '--ty': `${-Math.sin(rad) * RADIUS}px`,
                    '--tone': tone,
                    '--i': index,
                    '--ri': ACTIONS.length - 1 - index,
                    '--shift': `${shift}px`,
                  }}
                  onClick={() => {
                    setOpen(false)
                    // Allaqachon shu manzilda bo'lsak (masalan, /#reels) URL o'zgarmaydi — o'zimiz aylantiramiz
                    const [path, anchor] = to.split('#')
                    if (anchor && path === pathname && hash === `#${anchor}`) {
                      document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                    }
                  }}
                  onTouchStart={prefetch ? loadJobsMapPage : undefined}
                >
                  <span className="quick-menu__icon">
                    <Icon size={22} strokeWidth={2} aria-hidden="true" />
                  </span>
                  <span className="quick-menu__label">{label}</span>
                </Link>
              )
            })}
          </nav>
        </div>,
        document.body,
      )}

      <nav className={`bottom-nav${open ? ' is-menu-open' : ''}`} aria-label="Asosiy navigatsiya">
        {TABS.map((tab) =>
          tab ? (
            <NavLink
              key={tab.to}
              to={tab.to}
              end={tab.end}
              className={({ isActive }) => `bottom-nav__item${isActive ? ' is-active' : ''}`}
            >
              <span className="bottom-nav__icon">
                <tab.Icon size={22} strokeWidth={1.9} aria-hidden="true" />
              </span>
              <span className="bottom-nav__label">{tab.label}</span>
            </NavLink>
          ) : (
            <button
              key="fab"
              ref={fabRef}
              type="button"
              className="bottom-nav__item bottom-nav__item--center"
              aria-expanded={open}
              aria-controls="quick-menu"
              aria-label={open ? 'Tezkor menyuni yopish' : 'Tezkor menyuni ochish'}
              onClick={() => setOpen((value) => !value)}
            >
              <span className="bottom-nav__icon">
                <Plus size={26} strokeWidth={2.4} aria-hidden="true" />
              </span>
            </button>
          ),
        )}
      </nav>
    </>
  )
}
