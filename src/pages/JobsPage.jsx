import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import {
  Heart,
  ChevronDown,
  ChevronRight,
  Clapperboard,
  LayoutGrid,
  Map as MapIcon,
  MapPinned,
  Search,
  SearchX,
  SlidersHorizontal,
  UserRoundCheck,
  X,
} from 'lucide-react'
import { JobFeedCard } from '../components/mobile/JobCards.jsx'
import MenuSelect from '../components/ui/MenuSelect.jsx'
import { currentUserProfile } from '../data/profile.js'
import { jobFilters, jobs } from '../data/jobs.js'
import { useJobList } from '../hooks/useJobLists.js'
import { loadJobsMapPage } from './jobsMapLoader.js'
import './JobsPage.css'

const unique = (key) => [...new Set(jobs.map((job) => job[key]).filter(Boolean))]
const CATEGORIES = unique('category')
const LOCATIONS = unique('location')
const WORK_MODES = unique('workMode')
const EXPERIENCES = unique('experience')
const TYPES = jobFilters.filter((filter) => filter.id !== 'all')

const SORTS = [
  { id: 'newest', label: 'Eng yangi' },
  { id: 'salary', label: 'Maosh: yuqori' },
  { id: 'title', label: 'A dan Z gacha' },
]

// Lenta bo'limlari: har biri ro'yxatni o'ziga xos saralaydi yoki toraytiradi
const FEEDS = [
  { id: 'foryou', label: 'Siz uchun' },
  { id: 'new', label: 'Yangi' },
  { id: 'remote', label: 'Uydan ish' },
  { id: 'noexp', label: 'Tajribasiz' },
  { id: 'saved', label: 'Saqlangan' },
  { id: 'applied', label: 'Arizalarim' },
]

const SHORTCUTS = [
  {
    to: '/profil',
    Icon: UserRoundCheck,
    tone: 'var(--color-primary)',
    title: `Profil ${currentUserProfile.completeness.percent}% tayyor`,
    hint: "To'ldirish",
  },
  { to: '/xarita', Icon: MapPinned, tone: '#0ea5e9', title: 'Sizga yaqin vakansiyalar', hint: 'Xaritada', prefetch: true },
  { to: '/reels', Icon: Clapperboard, tone: '#8b5cf6', title: 'Karyera maslahatlari', hint: 'Videolar' },
  { to: '/kategoriyalar', Icon: LayoutGrid, tone: '#f59e0b', title: "Barcha yo'nalishlar", hint: `${CATEGORIES.length}+ soha` },
]

const EMPTY_FILTERS = { types: [], categories: [], locations: [], modes: [], experiences: [] }

function salaryValue(job) {
  const match = String(job.salary).replace(/\s/g, '').match(/\d+/)
  return match ? Number(match[0]) : 0
}

function toggleIn(list, value) {
  return list.includes(value) ? list.filter((item) => item !== value) : [...list, value]
}

function applyFilters(list, filters) {
  return list.filter(
    (job) =>
      (!filters.types.length || filters.types.includes(job.type)) &&
      (!filters.categories.length || filters.categories.includes(job.category)) &&
      (!filters.locations.length || filters.locations.includes(job.location)) &&
      (!filters.modes.length || filters.modes.includes(job.workMode)) &&
      (!filters.experiences.length || filters.experiences.includes(job.experience)),
  )
}

export default function JobsPage() {
  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState(() => params.get('q') ?? '')
  const [sort, setSort] = useState('newest')
  const [feed, setFeed] = useState(() => (FEEDS.some((item) => item.id === params.get('feed')) ? params.get('feed') : 'foryou'))
  const [filters, setFilters] = useState(() => ({
    ...EMPTY_FILTERS,
    types: params.get('type') ? [params.get('type')] : [],
  }))
  const [sheetOpen, setSheetOpen] = useState(() => params.get('filters') === '1')
  const saved = useJobList('saved')
  const applied = useJobList('applied')

  // URL'dagi bir martalik "filters=1" belgisini tozalash
  useEffect(() => {
    if (params.get('filters')) {
      const next = new URLSearchParams(params)
      next.delete('filters')
      setParams(next, { replace: true })
    }
  }, [params, setParams])

  // Qidiruv va bo'lim bo'yicha — filtr oynasidagi son ham shundan hisoblanadi
  const baseList = useMemo(() => {
    const q = query.trim().toLowerCase()
    const inFeed = {
      foryou: () => true,
      new: () => true,
      remote: (job) => job.type === 'remote' || job.workMode === 'Masofaviy',
      noexp: (job) => job.experience === 'Tajriba shart emas',
      saved: (job) => saved.ids.has(job.id),
      applied: (job) => applied.ids.has(job.id),
    }[feed]
    return jobs.filter(
      (job) => (!q || `${job.title} ${job.company} ${job.category}`.toLowerCase().includes(q)) && inFeed(job),
    )
  }, [query, feed, saved.ids, applied.ids])

  const results = useMemo(() => {
    let list = applyFilters(baseList, filters)
    // "Siz uchun": tasdiqlangan kompaniyalar va foydalanuvchi sohasi (marketing) oldinda
    if (feed === 'foryou' && sort === 'newest') {
      const score = (job) => (job.category === 'Marketing' ? 2 : 0) + (job.verified ? 1 : 0)
      list = [...list].sort((a, b) => score(b) - score(a))
    }
    if (sort === 'salary') list = [...list].sort((a, b) => salaryValue(b) - salaryValue(a))
    if (sort === 'title') list = [...list].sort((a, b) => a.title.localeCompare(b.title, 'uz'))
    return list
  }, [baseList, filters, sort, feed])

  const activeFilterCount = Object.values(filters).reduce((sum, list) => sum + list.length, 0)
  const sortLabel = SORTS.find((item) => item.id === sort)?.label
  // Bitta ish turi tanlangan bo'lsa, xarita ham shu tur bilan ochiladi
  const mapLink = filters.types.length === 1 ? `/xarita?type=${filters.types[0]}` : '/xarita'

  return (
    <div className="jobs-page">
      <div className="jobs-page__inner">
        <header className="jobs-page__top">
          <h1 className="jobs-page__title">Ish e&apos;lonlari</h1>

          <div className="jp-searchrow">
            <form className="jp-search" role="search" onSubmit={(event) => event.preventDefault()}>
              <Search size={20} strokeWidth={2} aria-hidden="true" />
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Lavozim, kompaniya…"
                aria-label="Ish qidirish"
                enterKeyHint="search"
              />
              {query && (
                <button type="button" className="jp-search__clear" onClick={() => setQuery('')} aria-label="Qidiruvni tozalash">
                  <X size={16} strokeWidth={2.4} />
                </button>
              )}
            </form>
            <button
              type="button"
              className={`jp-square${activeFilterCount ? ' is-active' : ''}`}
              onClick={() => setSheetOpen(true)}
              aria-haspopup="dialog"
              aria-label={activeFilterCount ? `Filtrlar, ${activeFilterCount} ta tanlangan` : 'Filtrlar'}
            >
              <SlidersHorizontal size={20} strokeWidth={2.1} />
              {activeFilterCount > 0 && <span className="jp-square__badge">{activeFilterCount}</span>}
            </button>
            <button
              type="button"
              className={`jp-square${feed === 'saved' ? ' is-active' : ''}`}
              onClick={() => setFeed(feed === 'saved' ? 'foryou' : 'saved')}
              aria-pressed={feed === 'saved'}
              aria-label={`Saqlangan e'lonlar${saved.ids.size ? `, ${saved.ids.size} ta` : ''}`}
            >
              <Heart size={20} strokeWidth={2.1} fill={feed === 'saved' ? 'currentColor' : 'none'} />
              {saved.ids.size > 0 && <span className="jp-square__badge">{saved.ids.size}</span>}
            </button>
          </div>

          <nav className="jp-shortcuts" aria-label="Tezkor havolalar">
            {SHORTCUTS.map(({ to, Icon, tone, title, hint, prefetch }) => (
              <Link
                key={to}
                to={to}
                className="jp-shortcut"
                style={{ '--tone': tone }}
                onTouchStart={prefetch ? loadJobsMapPage : undefined}
              >
                <span className="jp-shortcut__icon" aria-hidden="true">
                  <Icon size={20} strokeWidth={2} />
                </span>
                <span className="jp-shortcut__title">{title}</span>
                <span className="jp-shortcut__hint">
                  {hint}
                  <ChevronRight size={14} strokeWidth={2.6} aria-hidden="true" />
                </span>
              </Link>
            ))}
          </nav>

          <div className="jp-feeds" role="tablist" aria-label="Lenta bo'limi">
            {FEEDS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={feed === item.id}
                className={`jp-feed${feed === item.id ? ' is-active' : ''}`}
                onClick={() => setFeed(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>
        </header>

        <div className="jp-count">
          <p aria-live="polite">
            <strong>{results.length}</strong> ta vakansiya
          </p>
          <MenuSelect
            value={sort}
            onChange={setSort}
            options={SORTS.map((item) => ({ value: item.id, label: item.label }))}
            ariaLabel={`Saralash: ${sortLabel}`}
            title="Saralash"
            triggerClassName="jp-sort"
          >
            <span>{sortLabel}</span>
            <ChevronDown className="jp-sort__chevron" size={16} strokeWidth={2.4} aria-hidden="true" />
          </MenuSelect>
        </div>

        {results.length ? (
          <ul className="jp-list">
            {results.map((job) => (
              <li key={job.id}>
                <JobFeedCard job={job} />
              </li>
            ))}
          </ul>
        ) : (
          <EmptyState
            view={feed}
            onReset={() => {
              setQuery('')
              setFilters(EMPTY_FILTERS)
              setFeed('foryou')
            }}
          />
        )}
      </div>

      <Link
        to={mapLink}
        className="jp-map-fab"
        onTouchStart={loadJobsMapPage}
        onMouseEnter={loadJobsMapPage}
        onFocus={loadJobsMapPage}
        aria-label="Vakansiyalarni xaritada ko'rish"
      >
        <MapIcon size={20} strokeWidth={2.1} aria-hidden="true" />
        Xarita
      </Link>

      <FilterSheet
        open={sheetOpen}
        filters={filters}
        onClose={() => setSheetOpen(false)}
        onApply={(next) => {
          setFilters(next)
          setSheetOpen(false)
        }}
        countFor={(next) => applyFilters(baseList, next).length}
      />
    </div>
  )
}

function EmptyState({ view, onReset }) {
  const copy =
    view === 'saved'
      ? { title: "Saqlangan e'lonlar yo'q", text: "Yoqqan vakansiyani belgi tugmasi bilan saqlang — ular shu yerda chiqadi." }
      : view === 'applied'
        ? { title: "Hali ariza topshirmagansiz", text: "Vakansiya sahifasida «Ariza topshirish» tugmasini bosing." }
        : { title: 'Hech narsa topilmadi', text: "Qidiruv so'zini yoki filtrlarni o'zgartirib ko'ring." }
  return (
    <div className="jp-empty">
      <span className="jp-empty__icon" aria-hidden="true">
        <SearchX size={26} strokeWidth={1.9} />
      </span>
      <p className="jp-empty__title">{copy.title}</p>
      <p className="jp-empty__text">{copy.text}</p>
      <button type="button" className="jp-btn jp-btn--primary" onClick={onReset}>
        Barcha vakansiyalar
      </button>
    </div>
  )
}

function FilterSheet({ open, filters, onClose, onApply, countFor }) {
  const dialogRef = useRef(null)
  const [draft, setDraft] = useState(filters)

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) {
      setDraft(filters)
      dialog.showModal()
    } else if (!open && dialog.open) {
      dialog.close()
    }
    // filters faqat ochilganda nusxalanadi
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const groups = [
    { key: 'types', title: 'Ish turi', options: TYPES.map((t) => ({ value: t.id, label: t.label })) },
    { key: 'categories', title: "Yo'nalish", options: CATEGORIES.map((v) => ({ value: v, label: v })) },
    { key: 'locations', title: 'Hudud', options: LOCATIONS.map((v) => ({ value: v, label: v })) },
    { key: 'modes', title: 'Ish formati', options: WORK_MODES.map((v) => ({ value: v, label: v })) },
    { key: 'experiences', title: 'Tajriba', options: EXPERIENCES.map((v) => ({ value: v, label: v })) },
  ]

  return (
    <dialog
      ref={dialogRef}
      className="jp-sheet"
      aria-labelledby="jp-sheet-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className="jp-sheet__panel">
        <span className="jp-sheet__handle" aria-hidden="true" />
        <div className="jp-sheet__head">
          <h2 id="jp-sheet-title">Filtrlar</h2>
          <button type="button" className="jp-sheet__close" onClick={onClose} aria-label="Yopish">
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        <div className="jp-sheet__body">
          {groups.map((group) => (
            <fieldset key={group.key} className="jp-sheet__group">
              <legend>{group.title}</legend>
              <div className="jp-sheet__options">
                {group.options.map((option) => {
                  const checked = draft[group.key].includes(option.value)
                  return (
                    <label key={option.value} className={`jp-option${checked ? ' is-active' : ''}`}>
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => setDraft((prev) => ({ ...prev, [group.key]: toggleIn(prev[group.key], option.value) }))}
                      />
                      {option.label}
                    </label>
                  )
                })}
              </div>
            </fieldset>
          ))}
        </div>

        <div className="jp-sheet__foot">
          <button type="button" className="jp-btn jp-btn--ghost" onClick={() => setDraft(EMPTY_FILTERS)}>
            Tozalash
          </button>
          <button type="button" className="jp-btn jp-btn--primary" onClick={() => onApply(draft)}>
            {countFor(draft)} ta natijani ko&apos;rsatish
          </button>
        </div>
      </div>
    </dialog>
  )
}
