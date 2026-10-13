import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import {
  ArrowRight,
  Briefcase,
  Heart,
  MapPin,
  MessageCircle,
  RotateCcw,
  Share2,
} from 'lucide-react'
import { categoryMenuById } from '../data/categoryMenu.js'
import { getCandidatesForCategory } from '../data/candidates.js'
import { REGIONS } from '../data/regions.js'
import Select from '../components/ui/Select.jsx'
import './CategoryPage.css'

const JOB_TYPES = [
  { id: 'full', label: "To'liq stavka" },
  { id: 'part', label: 'Qisman stavka' },
  { id: 'remote', label: 'Masofaviy' },
  { id: 'intern', label: 'Stajirovka' },
]

const FIELDS = [
  { id: 'accounting', label: 'Buxgalteriya' },
  { id: 'hr', label: 'Kadrlar' },
  { id: 'marketing', label: 'Marketing' },
  { id: 'management', label: 'Menejment' },
  { id: 'reception', label: "Qabulxona / Resepshn" },
]

const SORT_OPTIONS = [
  { id: 'recommended', label: 'Tavsiya etilgan' },
  { id: 'newest', label: 'Eng yangi' },
  { id: 'salary', label: 'Maosh bo‘yicha' },
]

const SALARY_OPTIONS = [
  { id: 'all', label: 'Barchasi' },
  { id: '3', label: '3 mln gacha' },
  { id: '3-5', label: '3–5 mln' },
  { id: '5-7', label: '5–7 mln' },
  { id: '7', label: '7 mln+' },
]

const EXPERIENCE_OPTIONS = [
  { id: 'all', label: 'Barchasi' },
  { id: '0', label: 'Tajribasiz' },
  { id: '1', label: '1–2 yil' },
  { id: '3', label: '3–5 yil' },
  { id: '5', label: '5+ yil' },
]

export default function CategoryPage() {
  const { categoryId = 'ofis-ishlari' } = useParams()
  const navigate = useNavigate()
  const category = categoryMenuById[categoryId] ?? categoryMenuById['ofis-ishlari']
  const candidates = useMemo(() => getCandidatesForCategory(category.id), [category.id])

  const [selectedId, setSelectedId] = useState(candidates[0]?.id)
  const [saved, setSaved] = useState(() => new Set())
  const [region, setRegion] = useState('toshkent-shahar')
  const [jobTypes, setJobTypes] = useState(() => new Set(['full']))
  const [fields, setFields] = useState(() => new Set())
  const [salary, setSalary] = useState('all')
  const [experience, setExperience] = useState('all')
  const [sortBy, setSortBy] = useState('recommended')

  useEffect(() => {
    setSelectedId(candidates[0]?.id)
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [candidates])

  const selected = candidates.find((item) => item.id === selectedId) ?? candidates[0]
  const Icon = category.Icon

  function toggleSet(setter, id) {
    setter((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleSaved(id) {
    setSaved((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function clearFilters() {
    setRegion('all')
    setJobTypes(new Set())
    setFields(new Set())
    setSalary('all')
    setExperience('all')
  }

  return (
    <div className="category-page">
      <div className="container category-page__inner">
        <aside className="cat-filters">
          <FilterGroup title="Viloyat / Shahar">
            <Select
              value={region}
              onChange={setRegion}
              options={REGIONS}
              ariaLabel="Viloyat / Shahar"
            />
          </FilterGroup>

          <FilterGroup title="Ish turi">
            <div className="cat-checks">
              {JOB_TYPES.map((item) => (
                <label key={item.id} className="cat-check">
                  <input
                    type="checkbox"
                    checked={jobTypes.has(item.id)}
                    onChange={() => toggleSet(setJobTypes, item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <FilterGroup title="Maosh">
            <Select
              value={salary}
              onChange={setSalary}
              options={SALARY_OPTIONS}
              ariaLabel="Maosh"
            />
          </FilterGroup>

          <FilterGroup title="Tajriba">
            <Select
              value={experience}
              onChange={setExperience}
              options={EXPERIENCE_OPTIONS}
              ariaLabel="Tajriba"
            />
          </FilterGroup>

          <FilterGroup title="Ma'lumot sohasi">
            <div className="cat-checks">
              {FIELDS.map((item) => (
                <label key={item.id} className="cat-check">
                  <input
                    type="checkbox"
                    checked={fields.has(item.id)}
                    onChange={() => toggleSet(setFields, item.id)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </div>
          </FilterGroup>

          <button type="button" className="cat-filters__apply">
            Qidiruvni qo‘llash
          </button>
          <button type="button" className="cat-filters__clear" onClick={clearFilters}>
            <RotateCcw size={14} />
            Filtrlarni tozalash
          </button>
        </aside>

        <section className="cat-results">
          <nav className="cat-results__crumbs" aria-label="Breadcrumb">
            <Link to="/">Bosh sahifa</Link>
            <span>/</span>
            <Link to="/kategoriyalar">Kategoriyalar</Link>
            <span>/</span>
            <span>{category.title}</span>
          </nav>

          <div className="cat-results__head">
            <div className="cat-results__title">
              <span
                className="cat-results__icon"
                style={{ background: category.iconBg, color: category.iconColor }}
              >
                <Icon size={20} strokeWidth={2} />
              </span>
              <div>
                <h1>{category.title}</h1>
                <p>Ayollar uchun «{category.title}» yo‘nalishidagi ochiq imkoniyatlar</p>
              </div>
            </div>

            <div className="cat-results__meta">
              <span>Topilgan natijalar: {candidates.length * 20 + 24} ta</span>
              <Select
                value={sortBy}
                onChange={setSortBy}
                options={SORT_OPTIONS}
                ariaLabel="Saralash"
                size="sm"
              />
            </div>
          </div>

          <div className="cat-results__list">
            {candidates.map((person) => (
              <article
                key={person.id}
                className={`cand-card ${selected?.id === person.id ? 'cand-card--active' : ''} ${
                  person.premium ? 'cand-card--premium' : ''
                }`}
                onClick={() => setSelectedId(person.id)}
              >
                <img className="cand-card__avatar" src={person.avatar} alt="" />
                <div className="cand-card__body">
                  <div className="cand-card__top">
                    <div>
                      <div className="cand-card__name-row">
                        <h3>{person.name}</h3>
                        {person.premium && <span className="cand-card__badge">Premium</span>}
                        {person.online && <span className="cand-card__online" title="Online" />}
                      </div>
                      <p className="cand-card__role">{person.title}</p>
                    </div>
                  </div>

                  <div className="cand-card__facts">
                    <span>
                      <MapPin size={14} />
                      {person.location}
                    </span>
                    <span>
                      <Briefcase size={14} />
                      {person.experience}
                    </span>
                    <span>{person.salary}</span>
                  </div>

                  <div className="cand-card__skills">
                    {person.skills.map((skill) => (
                      <span key={skill}>{skill}</span>
                    ))}
                  </div>
                </div>

                <div className="cand-card__actions">
                  <button
                    type="button"
                    className="cand-card__detail"
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedId(person.id)
                    }}
                  >
                    Batafsil
                    <ArrowRight size={15} />
                  </button>
                  <button
                    type="button"
                    className={`cand-card__heart ${saved.has(person.id) ? 'is-active' : ''}`}
                    aria-label="Saqlash"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleSaved(person.id)
                    }}
                  >
                    <Heart size={17} fill={saved.has(person.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>

        {selected && (
          <aside className="cat-detail">
            <div className="cat-detail__toolbar">
              <button type="button" aria-label="Ulashish">
                <Share2 size={17} />
              </button>
              <button
                type="button"
                aria-label="Saqlash"
                className={saved.has(selected.id) ? 'is-active' : ''}
                onClick={() => toggleSaved(selected.id)}
              >
                <Heart size={17} fill={saved.has(selected.id) ? 'currentColor' : 'none'} />
              </button>
            </div>

            <div className="cat-detail__hero">
              <img src={selected.avatar} alt="" className="cat-detail__avatar" />
              <div>
                <div className="cand-card__name-row">
                  <h2>{selected.name}</h2>
                  {selected.online && <span className="cand-card__online" title="Online" />}
                </div>
                <p className="cat-detail__role">{selected.title}</p>
                <div className="cand-card__facts">
                  <span>
                    <MapPin size={14} />
                    {selected.district}
                  </span>
                  <span>
                    <Briefcase size={14} />
                    {selected.experience}
                  </span>
                  <span>{selected.salary}</span>
                </div>
              </div>
            </div>

            <section className="cat-detail__block">
              <h3>Shaxsiy ma’lumot</h3>
              <p>{selected.about}</p>
            </section>

            <section className="cat-detail__block">
              <h3>Ko‘nikmalar</h3>
              <div className="cand-card__skills">
                {selected.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </section>

            <section className="cat-detail__block">
              <h3>Ta’lim</h3>
              {selected.education.map((item) => (
                <div key={item.school} className="cat-detail__edu">
                  <strong>{item.school}</strong>
                  <span>{item.years}</span>
                  <p>{item.degree}</p>
                </div>
              ))}
            </section>

            <section className="cat-detail__block">
              <h3>Ish tajribasi</h3>
              {selected.work.map((item) => (
                <div key={`${item.company}-${item.role}`} className="cat-detail__job">
                  <div className="cat-detail__job-head">
                    <strong>{item.role}</strong>
                    <span>{item.years}</span>
                  </div>
                  <p className="cat-detail__company">{item.company}</p>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <div className="cat-detail__cta">
              <Link
                to={`/xabarlar?candidate=${selected.id}`}
                className="cat-detail__contact"
              >
                <MessageCircle size={17} />
                Bog‘lanish
              </Link>
              <button
                type="button"
                className={`cat-detail__save ${saved.has(selected.id) ? 'is-active' : ''}`}
                onClick={() => toggleSaved(selected.id)}
              >
                <Heart size={17} fill={saved.has(selected.id) ? 'currentColor' : 'none'} />
                Saqlash
              </button>
            </div>

            <button type="button" className="cat-detail__back" onClick={() => navigate('/')}>
              Bosh sahifaga qaytish
            </button>
          </aside>
        )}
      </div>
    </div>
  )
}

function FilterGroup({ title, children }) {
  return (
    <div className="cat-filters__group">
      <h3>{title}</h3>
      {children}
    </div>
  )
}
