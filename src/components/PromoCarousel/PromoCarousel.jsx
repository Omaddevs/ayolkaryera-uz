import { useEffect, useState } from 'react'
import './PromoCarousel.css'

const SLIDES = [
  {
    id: 'telegram',
    src: '/images/promo/telegram.png',
    href: 'https://t.me/Ayol_Karyera',
    alt: 'AyolKaryera Telegram kanali — QR kodni skanerlang',
  },
  {
    id: 'instagram',
    src: '/images/promo/instagram.png',
    href: 'https://www.instagram.com/ayolkaryera',
    alt: 'AyolKaryera Instagram sahifasi — QR kodni skanerlang',
  },
]

const AUTOPLAY_MS = 4500

export default function PromoCarousel() {
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    if (paused) return undefined
    const timer = setTimeout(() => setIndex((i) => (i + 1) % SLIDES.length), AUTOPLAY_MS)
    return () => clearTimeout(timer)
  }, [index, paused])

  return (
    <section className="container promo-carousel-wrap">
      <div
        className="promo-carousel"
        role="region"
        aria-roledescription="carousel"
        aria-label="AyolKaryera ijtimoiy tarmoqlari"
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        onFocus={() => setPaused(true)}
        onBlur={() => setPaused(false)}
      >
        <div className="promo-carousel__decor" aria-hidden="true">
          <img className="promo-carousel__watermark promo-carousel__watermark--left" src="/images/logo-icon.svg" alt="" />
          <img className="promo-carousel__watermark promo-carousel__watermark--right" src="/images/logo-icon.svg" alt="" />
        </div>

        <div className="promo-carousel__track"style={{ transform: `translateX(-${index * 100}%)` }}>
          {SLIDES.map((slide, i) => (
            <div
              key={slide.id}
              className="promo-carousel__slide"
              role="group"
              aria-roledescription="slide"
              aria-label={`${i + 1} / ${SLIDES.length}`}
              aria-hidden={i !== index}
            >
              <a
                href={slide.href}
                className="promo-carousel__link"
                target="_blank"
                rel="noopener noreferrer"
                tabIndex={i === index ? undefined : -1}
              >
                <img src={slide.src} alt={slide.alt} width={851} height={315} draggable={false} />
              </a>
            </div>
          ))}
        </div>

        <div className="promo-carousel__dots">
          {SLIDES.map((slide, i) => (
            <button
              key={slide.id}
              type="button"
              className={`promo-carousel__dot${i === index ? ' promo-carousel__dot--active' : ''}`}
              aria-label={`${i + 1}-slayd`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
