import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiSearch } from 'react-icons/fi'
import { categoryMenuItems } from '../data/categoryMenu.js'
import { categories } from '../data/categories.js'
import MobileCategories from '../components/mobile/MobileCategories.jsx'
import useIsMobile from '../hooks/useIsMobile.js'
import './CategoriesPage.css'

const categoryImageById = Object.fromEntries(categories.map((c) => [c.id, c]))

export default function CategoriesPage() {
  const [query, setQuery] = useState('')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return categoryMenuItems
    return categoryMenuItems.filter((item) => item.title.toLowerCase().includes(q))
  }, [query])

  const totalAds = useMemo(
    () =>
      categoryMenuItems.reduce((sum, item) => {
        const n = Number(String(item.count).replace(/\s/g, ''))
        return sum + (Number.isFinite(n) ? n : 0)
      }, 0),
    [],
  )
  const isMobile = useIsMobile()

  if (isMobile) return <MobileCategories />

  return (
    <div className="categories-page">
      <div className="container categories-page__inner">
        <nav className="categories-page__crumbs" aria-label="Navigatsiya">
          <Link to="/">Bosh sahifa</Link>
          <span aria-hidden="true">/</span>
          <span>Kategoriyalar</span>
        </nav>

        <header className="categories-page__header">
          <div className="categories-page__intro">
            <h1>Barcha kategoriyalar</h1>
            <p>
              Ayollar uchun {categoryMenuItems.length} ta yo&apos;nalish — jami{' '}
              {totalAds.toLocaleString('uz-UZ')} ta ochiq imkoniyat
            </p>
          </div>

          <label className="categories-page__search">
            <FiSearch aria-hidden="true" />
            <input
              type="search"
              placeholder="Kategoriya qidirish..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              aria-label="Kategoriya qidirish"
            />
          </label>
        </header>

        <ul className="categories-page__grid">
          {filtered.map((item) => {
            const Icon = item.Icon
            const visual = categoryImageById[item.id] ?? item

            return (
              <li key={item.id}>
                <Link to={`/kategoriya/${item.id}`} className="cat-tile">
                  <span
                    className="cat-tile__icon"
                    style={{ background: item.iconBg, color: item.iconColor }}
                    aria-hidden="true"
                  >
                    <Icon size={22} strokeWidth={2.2} />
                  </span>

                  <span className="cat-tile__body">
                    <span className="cat-tile__title">{item.title}</span>
                    <span className="cat-tile__count">{item.count} ta e&apos;lon</span>
                  </span>

                  {visual?.image ? (
                    <span
                      className="cat-tile__visual"
                      aria-hidden="true"
                      style={{
                        backgroundImage: `url(${visual.image})`,
                        backgroundSize: `${visual.zoom ?? 100}% auto`,
                        backgroundPosition: `${visual.focusX ?? 50}% ${visual.focusY ?? 50}%`,
                      }}
                    />
                  ) : (
                    <span
                      className="cat-tile__visual cat-tile__visual--accent"
                      aria-hidden="true"
                      style={{ background: item.iconBg }}
                    />
                  )}

                  <span className="cat-tile__go" aria-hidden="true">
                    <FiArrowRight />
                  </span>
                </Link>
              </li>
            )
          })}
        </ul>

        {!filtered.length && (
          <p className="categories-page__empty">
            «{query}» bo&apos;yicha kategoriya topilmadi.
          </p>
        )}
      </div>
    </div>
  )
}
