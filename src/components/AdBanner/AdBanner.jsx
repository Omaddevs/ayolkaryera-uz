import { Megaphone } from 'lucide-react'
import { FiArrowRight, FiX } from 'react-icons/fi'
import { useState } from 'react'
import LogoIcon from '../icons/LogoIcon.jsx'
import './AdBanner.css'

export default function AdBanner({ banner }) {
  const [dismissed, setDismissed] = useState(false)
  if (dismissed) return null

  const useBrandLogo = banner.icon === 'sparkles' || banner.brandLogo

  return (
    <section className="container ad-banner-wrap">
      <a href={banner.href} className={`ad-banner ad-banner--${banner.tone}`}>
        <span className="ad-banner__blob ad-banner__blob--one" aria-hidden="true" />
        <span className="ad-banner__blob ad-banner__blob--two" aria-hidden="true" />

        {useBrandLogo ? (
          <LogoIcon className="ad-banner__icon ad-banner__icon--logo" size={120} />
        ) : (
          <Megaphone className="ad-banner__icon" aria-hidden="true" strokeWidth={1.5} />
        )}

        <div className="ad-banner__content">
          <span className="ad-banner__eyebrow">{banner.eyebrow}</span>
          <h3 className="ad-banner__title">{banner.title}</h3>
          <p className="ad-banner__subtitle">{banner.subtitle}</p>
          <span className="ad-banner__cta">
            {banner.ctaLabel}
            <FiArrowRight />
          </span>
        </div>

        <button
          type="button"
          className="ad-banner__close"
          aria-label="Reklamani yopish"
          onClick={(event) => {
            event.preventDefault()
            event.stopPropagation()
            setDismissed(true)
          }}
        >
          <FiX />
        </button>
      </a>
    </section>
  )
}
