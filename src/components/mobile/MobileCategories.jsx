import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Search, SearchX } from 'lucide-react'
import { categoryMenuItems } from '../../data/categoryMenu.js'
import { categories } from '../../data/categories.js'
import CategoryFigure from './CategoryFigure.jsx'
import './MobileCategories.css'

const visualById = Object.fromEntries(categories.map((item) => [item.id, item]))

/** Mobil kategoriyalar: har biri o'z rangidagi katta karta, o'ngda kategoriya rasmi */
export default function MobileCategories() {
  const [query, setQuery] = useState('')

  const list = useMemo(() => {
    const q = query.trim().toLowerCase()
    return q ? categoryMenuItems.filter((item) => item.title.toLowerCase().includes(q)) : categoryMenuItems
  }, [query])

  return (
    <div className="m-cats">
      <header className="m-cats__head">
        <h1>Kategoriyalar</h1>
        <p>{categoryMenuItems.length} ta yo&apos;nalish — o&apos;zingizga mosini tanlang</p>
        <label className="m-cats__search">
          <Search size={20} strokeWidth={2} aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Kategoriya qidirish…"
            aria-label="Kategoriya qidirish"
          />
        </label>
      </header>

      {list.length ? (
        <ul className="m-cats__list">
          {list.map((item, index) => {
            const visual = visualById[item.id]
            const Icon = item.Icon
            return (
              <li key={item.id} style={{ '--i': Math.min(index, 8) }}>
                <Link
                  to={`/kategoriya/${item.id}`}
                  className="m-cat-card"
                  style={{ '--cat-bg': visual?.accent ?? item.iconBg, '--cat-color': item.iconColor }}
                >
                  <span className="m-cat-card__body">
                    <span className="m-cat-card__title">
                      <span className="m-cat-card__icon" aria-hidden="true">
                        <Icon size={18} strokeWidth={2.2} />
                      </span>
                      {item.title}
                    </span>
                    <span className="m-cat-card__text">
                      <mark>{item.count} ta</mark> ochiq vakansiya
                    </span>
                    <span className="m-cat-card__cta">
                      Ko&apos;rish
                      <ArrowRight size={15} strokeWidth={2.4} aria-hidden="true" />
                    </span>
                  </span>
                  {visual?.image ? (
                    <CategoryFigure image={visual.image} className="m-cat-card__img" />
                  ) : (
                    <span className="m-cat-card__art" aria-hidden="true">
                      <Icon size={64} strokeWidth={1.5} />
                    </span>
                  )}
                </Link>
              </li>
            )
          })}
        </ul>
      ) : (
        <div className="m-cats__empty">
          <SearchX size={28} strokeWidth={1.8} aria-hidden="true" />
          <p>«{query}» bo&apos;yicha kategoriya topilmadi</p>
        </div>
      )}
    </div>
  )
}
