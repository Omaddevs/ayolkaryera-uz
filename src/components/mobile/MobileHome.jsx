import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ChevronRight, Heart, Search, SlidersHorizontal } from 'lucide-react'
import { categories } from '../../data/categories.js'
import { jobFilters, jobs } from '../../data/jobs.js'
import { useJobList } from '../../hooks/useJobLists.js'
import CategoryFigure from './CategoryFigure.jsx'
import { FeaturedJobCard, JobFeedCard } from './JobCards.jsx'
import './MobileHome.css'

function SectionHead({ title, to, id }) {
  return (
    <div className="mh-section__head">
      <h2 className="mh-section__title" id={id}>
        {title}
      </h2>
      {to && (
        <Link to={to} className="mh-section__more">
          Barchasi
          <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      )}
    </div>
  )
}

export default function MobileHome() {
  const navigate = useNavigate()
  const [type, setType] = useState('all')
  const [query, setQuery] = useState('')
  const saved = useJobList('saved')

  const filtered = useMemo(() => jobs.filter((job) => type === 'all' || job.type === type), [type])
  const recommended = filtered.filter((job) => job.verified).slice(0, 6)
  const latest = filtered.slice(0, 5)

  function submitSearch(event) {
    event.preventDefault()
    const params = new URLSearchParams()
    if (query.trim()) params.set('q', query.trim())
    if (type !== 'all') params.set('type', type)
    navigate(`/ishlar${params.size ? `?${params}` : ''}`)
  }

  return (
    <div className="m-home">
      {/* Qidiruv va tur chiplari */}
      <section className="mh-panel" aria-label="Qidiruv">
        <div className="mh-searchrow">
          <form className="mh-search" role="search" onSubmit={submitSearch}>
            <Search size={20} strokeWidth={2} aria-hidden="true" />
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Lavozim, kompaniya…"
              aria-label="Ish qidirish"
              enterKeyHint="search"
            />
          </form>
          <Link to="/ishlar?filters=1" className="mh-square" aria-label="Filtrlar">
            <SlidersHorizontal size={20} strokeWidth={2.1} />
          </Link>
          <Link
            to="/ishlar?feed=saved"
            className="mh-square"
            aria-label={`Saqlangan e'lonlar${saved.ids.size ? `, ${saved.ids.size} ta` : ''}`}
          >
            <Heart size={20} strokeWidth={2.1} />
            {saved.ids.size > 0 && <span className="mh-square__badge">{saved.ids.size}</span>}
          </Link>
        </div>

        <div className="mh-chips" role="tablist" aria-label="Ish turi">
          {jobFilters.map((filter) => (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={type === filter.id}
              className={`mh-chip${type === filter.id ? ' is-active' : ''}`}
              onClick={() => setType(filter.id)}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </section>

      {/* Tavsiya etilgan */}
      <section className="mh-section" aria-labelledby="mh-recommended">
        <SectionHead title="Siz uchun tavsiya" to="/ishlar" id="mh-recommended" />
        {recommended.length ? (
          <div className="mh-rail">
            {recommended.map((job, index) => (
              <FeaturedJobCard key={job.id} job={job} highlight={index === 0} />
            ))}
          </div>
        ) : (
          <p className="mh-empty">Bu turdagi tavsiyalar hozircha yo&apos;q.</p>
        )}
      </section>

      {/* Yo'nalishlar */}
      <section className="mh-section" aria-labelledby="mh-categories">
        <SectionHead title="Yo'nalishlar" to="/kategoriyalar" id="mh-categories" />
        <div className="mh-cats">
          {categories.slice(0, 10).map((category) => (
            <Link key={category.id} to={`/kategoriya/${category.id}`} className="mh-cat">
              <span className="mh-cat__img" style={{ '--cat-accent': category.accent }}>
                <CategoryFigure image={category.image} />
              </span>
              <span className="mh-cat__label">{category.title}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* So'nggi e'lonlar */}
      <section className="mh-section" aria-labelledby="mh-latest">
        <SectionHead title="So'nggi e'lonlar" to="/ishlar" id="mh-latest" />
        <ul className="mh-list">
          {latest.map((job) => (
            <li key={job.id}>
              <JobFeedCard job={job} />
            </li>
          ))}
        </ul>
        <Link to="/ishlar" className="mh-all">
          Barcha vakansiyalar
          <ChevronRight size={18} strokeWidth={2.4} aria-hidden="true" />
        </Link>
      </section>
    </div>
  )
}
