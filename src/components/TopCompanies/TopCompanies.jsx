import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FiArrowRight, FiBriefcase } from 'react-icons/fi'
import { Check } from 'lucide-react'
import { companies } from '../../data/companies.js'
import './TopCompanies.css'

export default function TopCompanies({ embedded = false }) {
  const content = (
    <div className="top-companies__panel">
      <div className="top-companies__card">
        <div className="top-companies__header">
          <h2 className="top-companies__title">Top kompaniyalar</h2>
          <Link to="/kompaniyalar" className="top-companies__view-all">
            Barchasini ko&apos;rish
            <FiArrowRight />
          </Link>
        </div>

        <ul className="top-companies__list">
          {companies.map((company) => (
            <li key={company.id}>
              <Link to={`/kompaniya/${company.id}`} className="company-row">
                <span
                  className="company-row__logo"
                  style={company.logo ? undefined : { background: company.color || '#e0212b', color: '#fff' }}
                >
                  {company.logo ? (
                    <img src={`${company.logo}?v=2`} alt="" width={44} height={44} />
                  ) : (
                    company.name.charAt(0)
                  )}
                </span>

                <span className="company-row__info">
                  <span className="company-row__name-line">
                    <span className="company-row__name">{company.name}</span>
                    {company.verified && (
                      <span className="company-row__verified" title="Tasdiqlangan" aria-label="Tasdiqlangan">
                        <Check size={9} strokeWidth={3.5} />
                      </span>
                    )}
                  </span>
                  <span className="company-row__meta">
                    <FiBriefcase aria-hidden="true" />
                    <span>{company.adsCount} ta e&apos;lon</span>
                  </span>
                </span>

                <span className="company-row__arrow" aria-hidden="true">
                  <FiArrowRight />
                </span>
              </Link>
            </li>
          ))}
        </ul>

        <Link to="/kompaniyalar" className="top-companies__cta">
          Barcha kompaniyalar
          <FiArrowRight />
        </Link>
      </div>

      <div className="top-companies__teaser">
        <img
          className="top-companies__teaser-icon"
          src="/images/companies/buildings.svg"
          alt=""
          width={52}
          height={44}
        />
        <p className="top-companies__teaser-text">
          <span>Ishonchli kompaniyalar —</span>
          <span>katta imkoniyatlar!</span>
        </p>
      </div>
    </div>
  )

  if (embedded) {
    return <div className="top-companies top-companies--embedded">{content}</div>
  }

  return (
    <section className="top-companies container" id="kompaniyalar">
      {content}
    </section>
  )
}
