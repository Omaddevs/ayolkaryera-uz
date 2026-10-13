import { useState } from 'react'
import { Check } from 'lucide-react'
import { FiArrowRight, FiX } from 'react-icons/fi'
import './AdSidebar.css'

const employerBenefits = [
  'Minglab talabgorlar',
  "Tez va qulay e'lon joylash",
  'Ishonchli platforma',
  'Maqsadli auditoriya',
]

export default function AdSidebar() {
  const [adDismissed, setAdDismissed] = useState(false)

  return (
    <div className="ad-sidebar">
      <article className="ad-sidebar__card ad-sidebar__card--employer">
        <div className="ad-sidebar__employer-copy">
          <h3 className="ad-sidebar__title">Kompaniyangiz uchun eng yaxshi kadrlar!</h3>
          <p className="ad-sidebar__subtitle">
            Bo&apos;sh ish o&apos;rinlaringizni tez va oson joylashtiring.
          </p>

          <ul className="ad-sidebar__benefits">
            {employerBenefits.map((item) => (
              <li key={item}>
                <span className="ad-sidebar__check" aria-hidden="true">
                  <Check size={11} strokeWidth={3} />
                </span>
                {item}
              </li>
            ))}
          </ul>

          <a href="#" className="ad-sidebar__cta">
            E&apos;lon joylashtirish
            <FiArrowRight />
          </a>
        </div>

        <div className="ad-sidebar__visual ad-sidebar__visual--chair" aria-hidden="true">
          <span className="ad-sidebar__chair" />
          <span className="ad-sidebar__badge-card" />
        </div>
      </article>

      {!adDismissed && (
        <article className="ad-sidebar__card ad-sidebar__card--promo">
          <span className="ad-sidebar__ad-label">REKLAMA</span>
          <button
            type="button"
            className="ad-sidebar__close"
            aria-label="Reklamani yopish"
            onClick={() => setAdDismissed(true)}
          >
            <FiX />
          </button>

          <div className="ad-sidebar__promo-body">
            <div className="ad-sidebar__promo-copy">
              <h3 className="ad-sidebar__title">Maxsus taklif!</h3>
              <p className="ad-sidebar__subtitle">
                Bu oyda reklama joylashtirishda 20% chegirma
              </p>
              <a href="#" className="ad-sidebar__cta">
                Batafsil
                <FiArrowRight />
              </a>
            </div>

            <div className="ad-sidebar__visual ad-sidebar__visual--gift" aria-hidden="true">
              <span className="ad-sidebar__gift" />
              <span className="ad-sidebar__percent">%</span>
            </div>
          </div>
        </article>
      )}
    </div>
  )
}
