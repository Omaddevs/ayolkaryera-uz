import { useRef } from 'react'
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiEye,
  FiHeart,
  FiPlay,
  FiVideo,
} from 'react-icons/fi'
import { reels } from '../../data/reels.js'
import './Reels.css'

export default function Reels() {
  const trackRef = useRef(null)

  const scrollByAmount = (direction) => {
    const track = trackRef.current
    if (!track) return
    const cardWidth = track.firstElementChild?.getBoundingClientRect().width ?? 220
    track.scrollBy({ left: direction * (cardWidth + 16), behavior: 'smooth' })
  }

  return (
    <section className="reels container" id="reels">
      <div className="reels__panel">
        <div className="reels__decor" aria-hidden="true">
          <img
            className="reels__watermark reels__watermark--left"
            src="/images/logo-icon.png?v=2"
            alt=""
          />
          <img
            className="reels__watermark reels__watermark--right"
            src="/images/logo-icon.png?v=2"
            alt=""
          />
        </div>

        <div className="reels__top">
          <div className="reels__intro">
            <span className="reels__badge">
              <FiVideo />
              Reels
            </span>
            <h2 className="reels__title">Qisqa videolar orqali imkoniyatlarni kashf eting</h2>
            <p className="reels__subtitle">
              Ish hayoti, kompaniya madaniyati, foydali maslahatlar va real tajribalar – barchasi bir
              joyda!
            </p>
          </div>

          <div className="reels__actions">
            <a href="#" className="reels__all">
              Barcha Reels
              <FiArrowRight />
            </a>
            <div className="reels__nav">
              <button
                type="button"
                className="reels__nav-btn"
                aria-label="Oldingi"
                onClick={() => scrollByAmount(-1)}
              >
                <FiChevronLeft />
              </button>
              <button
                type="button"
                className="reels__nav-btn"
                aria-label="Keyingi"
                onClick={() => scrollByAmount(1)}
              >
                <FiChevronRight />
              </button>
            </div>
          </div>
        </div>

        <div className="reels__track" ref={trackRef}>
          {reels.map((reel) => (
            <a href="#" key={reel.id} className="reel-card">
              <img className="reel-card__image" src={reel.image} alt="" />
              <span className="reel-card__shade" aria-hidden="true" />

              <span className={`reel-card__tag reel-card__tag--${reel.tagTone}`}>{reel.tag}</span>
              <span className="reel-card__duration">{reel.duration}</span>

              <span className="reel-card__play" aria-hidden="true">
                <FiPlay />
              </span>

              <div className="reel-card__content">
                <h3 className="reel-card__title">{reel.title}</h3>
                <div className="reel-card__meta">
                  <span className="reel-card__company">
                    <span
                      className="reel-card__logo"
                      style={{ background: reel.companyColor }}
                      aria-hidden="true"
                    >
                      {reel.company.charAt(0)}
                    </span>
                    {reel.company}
                  </span>
                  <span className="reel-card__stats">
                    <span>
                      <FiEye />
                      {reel.views}
                    </span>
                    <span>
                      <FiHeart />
                      {reel.likes}
                    </span>
                  </span>
                </div>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
