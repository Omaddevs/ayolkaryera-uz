import { FiArrowRight, FiBriefcase } from 'react-icons/fi'
import { Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { categories } from '../../data/categories.js'
import { getTopCompanies } from '../../data/companies.js'
import './CategoryGrid.css'

const ROW_ONE_SIZE = 6
const COMPANY_LIMIT = 10

function CategoriesGridIcon() {
  return (
    <svg
      className="category-card__cta-grid"
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      aria-hidden="true"
    >
      <rect x="1" y="1" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="13" y="1" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="1" y="13" width="8" height="8" rx="2" fill="currentColor" />
      <rect x="13" y="13" width="8" height="8" rx="2" fill="currentColor" />
    </svg>
  )
}

function CtaCard({ to, label, className = '' }) {
  return (
    <Link to={to} className={`category-card category-card--cta ${className}`.trim()}>
      <span className="category-card__cta-icon" aria-hidden="true">
        <CategoriesGridIcon />
      </span>
      <span className="category-card__cta-text">
        <span className="category-card__cta-label">{label}</span>
        <FiArrowRight className="category-card__cta-arrow" aria-hidden="true" />
      </span>
    </Link>
  )
}

export default function CategoryGrid({ activeTab = 'jobs' }) {
  const content = activeTab === 'companies' ? <CompanyCategories /> : <JobCategories />

  return (
    <section className="category-grid container" id="kategoriyalar" key={activeTab}>
      {content}
    </section>
  )
}

function JobCategories() {
  const rowOne = categories.slice(0, ROW_ONE_SIZE)
  const rowTwo = categories.slice(ROW_ONE_SIZE)

  return (
    <>
      <div className="category-grid__row category-grid__row--one">
        {rowOne.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
      </div>

      <div className="category-grid__row category-grid__row--two">
        {rowTwo.map((category) => (
          <CategoryCard key={category.id} category={category} />
        ))}
        <CtaCard to="/kategoriyalar" label="Barcha kategoriyalar" />
      </div>
    </>
  )
}

function CategoryCard({ category }) {
  return (
    <Link to={`/kategoriya/${category.id}`} className="category-card">
      <span
        className="category-card__title"
        style={category.titleWidth ? { maxWidth: `${category.titleWidth}%` } : undefined}
      >
        {category.title}
      </span>
      <span
        className="category-card__image"
        role="img"
        aria-hidden="true"
        style={{
          backgroundImage: `url(${category.image})`,
          backgroundSize: `${category.zoom ?? 100}% auto`,
          backgroundPosition: `${category.focusX ?? 50}% ${category.focusY ?? 50}%`,
        }}
      />
    </Link>
  )
}

function CompanyCategories() {
  return (
    <div className="category-grid__companies">
      {getTopCompanies(COMPANY_LIMIT).map((company) => (
        <CompanyCard key={company.id} company={company} />
      ))}
      <CtaCard to="/kompaniyalar" label="Barcha kompaniyalar" className="category-card--cta-wide" />
    </div>
  )
}

function CompanyCard({ company }) {
  return (
    <Link to={`/kompaniya/${company.id}`} className="category-card company-card">
      <span className="company-card__top">
        <span
          className="company-card__logo"
          style={company.logo ? undefined : { background: company.color, color: '#fff' }}
        >
          {company.logo ? (
            <img src={`${company.logo}?v=2`} alt="" width={44} height={44} />
          ) : (
            company.name.charAt(0)
          )}
        </span>
        <FiArrowRight className="company-card__arrow" aria-hidden="true" />
      </span>

      <span className="company-card__info">
        <span className="company-card__name-line">
          <span className="company-card__name">{company.name}</span>
          {company.verified && (
            <span className="company-card__verified" title="Tasdiqlangan" aria-label="Tasdiqlangan">
              <Check size={9} strokeWidth={3.5} />
            </span>
          )}
        </span>
        <span className="company-card__meta">
          <FiBriefcase aria-hidden="true" />
          {company.adsCount} ta e&apos;lon
        </span>
      </span>
    </Link>
  )
}
