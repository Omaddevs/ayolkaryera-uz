import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Briefcase,
  Building2,
  Calculator,
  Check,
  ChefHat,
  Clock3,
  Code2,
  Eye,
  GraduationCap,
  Heart,
  Languages,
  MapPin,
  Megaphone,
  MoreVertical,
  Palette,
  Scissors,
  Search,
} from 'lucide-react'
import {
  FiArrowRight,
  FiBriefcase,
  FiClock,
  FiHeart,
  FiTrendingUp,
} from 'react-icons/fi'
import Select from '../components/ui/Select.jsx'
import { jobs } from '../data/jobs.js'
import { companies } from '../data/companies.js'
import { courses } from '../data/courses.js'
import './SavedPage.css'

const COURSE_ICONS = {
  code: Code2,
  palette: Palette,
  megaphone: Megaphone,
  calculator: Calculator,
  languages: Languages,
  scissors: Scissors,
  briefcase: Briefcase,
  chef: ChefHat,
}

const TABS = [
  { id: 'jobs', label: "Ish e'lonlari", icon: Briefcase },
  { id: 'companies', label: 'Kompaniyalar', icon: Building2 },
  { id: 'courses', label: 'Kurslar', icon: GraduationCap },
]

const SORT_OPTIONS = [
  { id: 'newest', label: 'Eng yangi' },
  { id: 'oldest', label: 'Eng eski' },
  { id: 'views', label: "Ko'p ko'rilgan" },
  { id: 'az', label: 'A–Z' },
]

const INITIAL_SAVED_JOBS = jobs.slice(0, 12).map((job) => job.id)
const INITIAL_SAVED_COMPANIES = companies.slice(0, 8).map((c) => c.id)
const INITIAL_SAVED_COURSES = courses.slice(0, 5).map((c) => c.id)

function VerifiedBadge() {
  return (
    <span className="saved-verified" title="Tasdiqlangan" aria-label="Tasdiqlangan">
      <Check size={9} strokeWidth={3.5} />
    </span>
  )
}

function LogoMark({ src, name, color, size = 52 }) {
  const initial = name?.charAt(0) || '?'
  return (
    <span
      className="saved-logo"
      style={{
        width: size,
        height: size,
        ...(src ? undefined : { background: color || 'var(--color-primary)', color: '#fff' }),
      }}
    >
      {src ? <img src={src} alt="" width={size} height={size} /> : initial}
    </span>
  )
}

function formatViews(n) {
  if (n >= 1000) return `${(n / 1000).toFixed(n % 1000 === 0 ? 0 : 1)}k`
  return String(n)
}

export default function SavedPage() {
  const [tab, setTab] = useState('jobs')
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState('newest')
  const [savedJobs, setSavedJobs] = useState(() => new Set(INITIAL_SAVED_JOBS))
  const [savedCompanies, setSavedCompanies] = useState(() => new Set(INITIAL_SAVED_COMPANIES))
  const [savedCourses, setSavedCourses] = useState(() => new Set(INITIAL_SAVED_COURSES))

  const counts = {
    jobs: savedJobs.size,
    companies: savedCompanies.size,
    courses: savedCourses.size,
  }

  const jobItems = useMemo(() => {
    let list = jobs.filter((j) => savedJobs.has(j.id))
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.company.toLowerCase().includes(q) ||
          j.location.toLowerCase().includes(q) ||
          j.category.toLowerCase().includes(q),
      )
    }
    return sortItems(list, sort, (j) => j.title, (j) => j.views ?? 0, (j) => j.id)
  }, [savedJobs, query, sort])

  const companyItems = useMemo(() => {
    let list = companies.filter((c) => savedCompanies.has(c.id))
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter((c) => c.name.toLowerCase().includes(q))
    }
    return sortItems(list, sort, (c) => c.name, (c) => c.adsCount ?? 0, (c) => c.id)
  }, [savedCompanies, query, sort])

  const courseItems = useMemo(() => {
    let list = courses.filter((c) => savedCourses.has(c.id))
    const q = query.trim().toLowerCase()
    if (q) {
      list = list.filter(
        (c) =>
          c.title.toLowerCase().includes(q) ||
          c.provider.toLowerCase().includes(q) ||
          c.category.toLowerCase().includes(q),
      )
    }
    return sortItems(list, sort, (c) => c.title, () => 0, (c) => c.id)
  }, [savedCourses, query, sort])

  function unsaveJob(id) {
    setSavedJobs((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function unsaveCompany(id) {
    setSavedCompanies((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function unsaveCourse(id) {
    setSavedCourses((prev) => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  const emptyCopy = {
    jobs: {
      title: "Saqlangan ish e'lonlari yo'q",
      text: "Yoqtirgan vakansiyalaringizni yurakcha orqali saqlang — ular shu yerda paydo bo'ladi.",
      cta: "Ish e'lonlarini ko'rish",
      to: '/ish',
    },
    companies: {
      title: "Saqlangan kompaniyalar yo'q",
      text: "Qiziqarli kompaniyalarni saqlang va yangi vakansiyalarini kuzatib boring.",
      cta: "Kompaniyalarni ko'rish",
      to: '/kompaniyalar',
    },
    courses: {
      title: "Saqlangan kurslar yo'q",
      text: "Kelajak kasbingiz uchun kurslarni saqlang va keyinroq qayting.",
      cta: "Kurslarni ko'rish",
      to: '/#kurslar',
    },
  }

  const activeList =
    tab === 'jobs' ? jobItems : tab === 'companies' ? companyItems : courseItems
  const empty = emptyCopy[tab]

  return (
    <section className="saved-page">
      <div className="container saved-page__inner">
        <header className="saved-hero">
          <div className="saved-hero__copy">
            <h1 className="saved-hero__title">
              <span className="saved-hero__icon" aria-hidden="true">
                <Heart size={28} fill="currentColor" strokeWidth={0} />
              </span>
              Saqlangan e&apos;lonlar
            </h1>
            <p className="saved-hero__sub">
              Yoqtirgan ish e&apos;lonlari, kompaniyalar va kurslaringiz — barchasi bir joyda.
            </p>
          </div>
        </header>

        <div className="saved-tabs" role="tablist" aria-label="Saqlanganlar bo'limi">
          {TABS.map((item) => {
            const Icon = item.icon
            const active = tab === item.id
            return (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={active}
                className={`saved-tab ${active ? 'saved-tab--active' : ''}`}
                onClick={() => {
                  setTab(item.id)
                  setQuery('')
                }}
              >
                <Icon size={16} strokeWidth={2.25} aria-hidden />
                <span>{item.label}</span>
                <em className="saved-tab__count">{counts[item.id]}</em>
              </button>
            )
          })}
        </div>

        <div className="saved-toolbar">
          <label className="saved-search">
            <Search size={17} strokeWidth={2.25} aria-hidden />
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={
                tab === 'jobs'
                  ? "Saqlangan e'lonlar ichidan qidirish..."
                  : tab === 'companies'
                    ? 'Kompaniya nomi bo‘yicha qidirish...'
                    : 'Kurs yoki provayder bo‘yicha qidirish...'
              }
              aria-label="Saqlanganlar ichidan qidirish"
            />
          </label>

          <div className="saved-sort">
            <span className="saved-sort__label">Saralash</span>
            <Select
              value={sort}
              onChange={setSort}
              options={SORT_OPTIONS}
              ariaLabel="Saralash"
              size="sm"
              className="saved-sort__select"
            />
          </div>
        </div>

        {activeList.length === 0 ? (
          <div className="saved-empty">
            <span className="saved-empty__icon" aria-hidden="true">
              <FiHeart />
            </span>
            <h2 className="saved-empty__title">{empty.title}</h2>
            <p className="saved-empty__text">{empty.text}</p>
            <Link to={empty.to} className="saved-empty__cta">
              {empty.cta}
              <FiArrowRight />
            </Link>
          </div>
        ) : (
          <ul className="saved-list" role="list">
            {tab === 'jobs' &&
              jobItems.map((job, index) => (
                <li key={job.id} style={{ '--i': index }}>
                  <SavedJobCard job={job} onUnsave={() => unsaveJob(job.id)} />
                </li>
              ))}
            {tab === 'companies' &&
              companyItems.map((company, index) => (
                <li key={company.id} style={{ '--i': index }}>
                  <SavedCompanyCard
                    company={company}
                    onUnsave={() => unsaveCompany(company.id)}
                  />
                </li>
              ))}
            {tab === 'courses' &&
              courseItems.map((course, index) => (
                <li key={course.id} style={{ '--i': index }}>
                  <SavedCourseCard
                    course={course}
                    onUnsave={() => unsaveCourse(course.id)}
                  />
                </li>
              ))}
          </ul>
        )}
      </div>
    </section>
  )
}

function sortItems(list, sort, getName, getViews, getId) {
  const next = [...list]
  if (sort === 'az') {
    next.sort((a, b) => getName(a).localeCompare(getName(b), 'uz'))
  } else if (sort === 'views') {
    next.sort((a, b) => getViews(b) - getViews(a))
  } else if (sort === 'oldest') {
    next.sort((a, b) => String(getId(a)).localeCompare(String(getId(b))))
  } else {
    next.sort((a, b) => String(getId(b)).localeCompare(String(getId(a))))
  }
  return next
}

function SavedJobCard({ job, onUnsave }) {
  return (
    <article className="saved-card">
      <LogoMark src={job.logo} name={job.company} color={job.companyColor} />

      <div className="saved-card__body">
        <div className="saved-card__main">
          <h2 className="saved-card__title">
            <Link to={`/ish/${job.id}`}>{job.title}</Link>
          </h2>
          <div className="saved-card__sub">
            <span className="saved-card__company">
              {job.company}
              {job.verified ? <VerifiedBadge /> : null}
            </span>
            <span className="saved-card__dot" aria-hidden="true" />
            <span className="saved-card__loc">
              <MapPin size={13} strokeWidth={2.25} aria-hidden />
              {job.location}
            </span>
          </div>
          <div className="saved-card__tags">
            <span className={`saved-tag saved-tag--${job.typeTone}`}>{job.typeLabel}</span>
            <span className="saved-tag saved-tag--neutral">{job.category}</span>
          </div>
        </div>

        <div className="saved-card__meta">
          <span className="saved-card__stat">
            <Clock3 size={14} strokeWidth={2.25} aria-hidden />
            {job.postedAgo}
          </span>
          <span className="saved-card__stat">
            <Eye size={14} strokeWidth={2.25} aria-hidden />
            {formatViews(job.views ?? 0)}
          </span>
        </div>
      </div>

      <div className="saved-card__actions">
        <Link to={`/ish/${job.id}`} className="saved-card__cta">
          Batafsil ko&apos;rish
          <FiArrowRight />
        </Link>
        <button
          type="button"
          className="saved-card__heart is-active"
          aria-label="Saqlashdan olib tashlash"
          onClick={onUnsave}
        >
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
        <button type="button" className="saved-card__more" aria-label="Qo'shimcha">
          <MoreVertical size={18} strokeWidth={2.25} />
        </button>
      </div>
    </article>
  )
}

function SavedCompanyCard({ company, onUnsave }) {
  return (
    <article className="saved-card">
      <LogoMark
        src={company.logo ? `${company.logo}?v=2` : undefined}
        name={company.name}
        color={company.color}
      />

      <div className="saved-card__body">
        <div className="saved-card__main">
          <h2 className="saved-card__title">
            <Link to={`/kompaniya/${company.id}`}>{company.name}</Link>
            {company.verified ? <VerifiedBadge /> : null}
          </h2>
          <div className="saved-card__sub">
            <span className="saved-card__loc">
              <FiBriefcase aria-hidden />
              {company.adsCount} ta ochiq e&apos;lon
            </span>
          </div>
          <div className="saved-card__tags">
            <span className="saved-tag saved-tag--pink">Kompaniya</span>
            {company.verified ? (
              <span className="saved-tag saved-tag--green">Tasdiqlangan</span>
            ) : null}
          </div>
        </div>

        <div className="saved-card__meta">
          <span className="saved-card__stat">
            <FiTrendingUp aria-hidden />
            Faol ish beruvchi
          </span>
        </div>
      </div>

      <div className="saved-card__actions">
        <Link to={`/kompaniya/${company.id}`} className="saved-card__cta">
          Profilni ko&apos;rish
          <FiArrowRight />
        </Link>
        <button
          type="button"
          className="saved-card__heart is-active"
          aria-label="Saqlashdan olib tashlash"
          onClick={onUnsave}
        >
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
        <button type="button" className="saved-card__more" aria-label="Qo'shimcha">
          <MoreVertical size={18} strokeWidth={2.25} />
        </button>
      </div>
    </article>
  )
}

function SavedCourseCard({ course, onUnsave }) {
  const Icon = COURSE_ICONS[course.icon] ?? GraduationCap

  return (
    <article className="saved-card">
      <span className="saved-logo saved-logo--course" style={{ background: course.accent }}>
        <Icon size={22} strokeWidth={1.75} />
      </span>

      <div className="saved-card__body">
        <div className="saved-card__main">
          <h2 className="saved-card__title">{course.title}</h2>
          <div className="saved-card__sub">
            <span className="saved-card__company">{course.provider}</span>
            <span className="saved-card__dot" aria-hidden="true" />
            <span className="saved-card__loc">
              <FiClock aria-hidden />
              {course.duration}
            </span>
          </div>
          <div className="saved-card__tags">
            <span className={`saved-tag ${course.isFree ? 'saved-tag--green' : 'saved-tag--pink'}`}>
              {course.price}
            </span>
            <span className="saved-tag saved-tag--neutral">{course.category}</span>
            <span className="saved-tag saved-tag--blue">{course.level}</span>
          </div>
        </div>
      </div>

      <div className="saved-card__actions">
        <a href="/#kurslar" className="saved-card__cta">
          Kursni ko&apos;rish
          <FiArrowRight />
        </a>
        <button
          type="button"
          className="saved-card__heart is-active"
          aria-label="Saqlashdan olib tashlash"
          onClick={onUnsave}
        >
          <Heart size={18} fill="currentColor" strokeWidth={0} />
        </button>
        <button type="button" className="saved-card__more" aria-label="Qo'shimcha">
          <MoreVertical size={18} strokeWidth={2.25} />
        </button>
      </div>
    </article>
  )
}
