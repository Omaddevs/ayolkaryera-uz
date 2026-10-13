import { FiArrowRight, FiClock, FiUsers } from 'react-icons/fi'
import { campaigns } from '../../data/campaigns.js'
import './Campaigns.css'

export default function Campaigns() {
  return (
    <section className="campaigns container">
      <div className="campaigns__header">
        <div>
          <h2 className="campaigns__title">Kampaniyalar va grantlar</h2>
          <p className="campaigns__subtitle">
            Ayollar uchun maxsus tashkil etilgan tanlovlar, grantlar va karyera kampaniyalari
          </p>
        </div>
        <a href="#" className="campaigns__all">
          Barchasini ko'rish
          <FiArrowRight />
        </a>
      </div>

      <div className="campaigns__grid">
        {campaigns.map((campaign) => (
          <a href="#" key={campaign.id} className="campaign-card">
            <div className="campaign-card__top">
              <span className={`campaign-card__tag campaign-card__tag--${campaign.tone}`}>
                {campaign.tag}
              </span>
              <span className="campaign-card__deadline">
                <FiClock />
                {campaign.deadline}
              </span>
            </div>

            <h3 className="campaign-card__title">{campaign.title}</h3>
            <p className="campaign-card__description">{campaign.description}</p>

            <div className="campaign-card__footer">
              <span className="campaign-card__organizer">
                <FiUsers />
                {campaign.organizer}
              </span>
              <span className="campaign-card__cta">
                {campaign.cta}
                <FiArrowRight />
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}
