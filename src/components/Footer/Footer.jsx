import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiArrowRight,
  FiChevronDown,
  FiChevronUp,
  FiGlobe,
  FiHeart,
  FiMail,
} from 'react-icons/fi'
import { ShieldCheck } from 'lucide-react'
import {
  FaInstagram,
  FaTelegram,
} from 'react-icons/fa6'
import { LANGUAGES } from '../../data/languages.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import LogoIcon from '../icons/LogoIcon.jsx'
import './Footer.css'

const SOCIALS = [
  { id: 'telegram', label: 'Telegram', Icon: FaTelegram, href: 'https://t.me/Ayol_Karyera' },
  { id: 'instagram', label: 'Instagram', Icon: FaInstagram, href: 'https://www.instagram.com/ayolkaryera' },
]

const PLATFORM_LINKS = [
  { label: 'Bosh sahifa', to: '/' },
  { label: 'Loyiha haqida', to: '/sahifa/loyiha-haqida' },
  { label: "E'lon joylash", to: '/sahifa/elon-joylash' },
  { label: 'Kompaniyalar', href: '/#kompaniyalar' },
  { label: 'Karyera maslahatlari', href: '/#reels' },
  { label: 'Aloqa', to: '/sahifa/aloqa' },
]

const CATEGORY_LINKS = [
  { label: 'Barcha kategoriyalar', to: '/kategoriyalar' },
  { label: 'Ofis ishlari', to: '/kategoriya/ofis-ishlari' },
  { label: "Ta'lim va pedagogika", to: '/kategoriya/talim-pedagogika' },
  { label: "Tibbiyot va sog'liqni saqlash", to: '/kategoriya/tibbiyot' },
  { label: 'Savdo va mijozlar bilan ishlash', to: '/kategoriya/savdo' },
  { label: 'IT va dizayn', to: '/kategoriya/it-dizayn' },
  { label: 'Boshqa kategoriyalar', to: '/kategoriya/boshqa', accent: true },
]

const SUPPORT_LINKS = [
  { label: 'Yordam markazi', to: '/sahifa/yordam-markazi' },
  { label: 'Savol-javob', to: '/sahifa/savol-javob' },
  { label: 'Bizga yozing', to: '/sahifa/bizga-yozing' },
  { label: 'Foydalanish shartlari', to: '/sahifa/foydalanish-shartlari' },
  { label: 'Maxfiylik siyosati', to: '/sahifa/maxfiylik-siyosati' },
  { label: 'Xavfsizlik', to: '/sahifa/xavfsizlik' },
]

export default function Footer() {
  const [email, setEmail] = useState('')
  const [langId, setLangId] = useLocalStorageState('ayolkaryera-lang', 'uz')
  const [langOpen, setLangOpen] = useState(false)
  const langRef = useRef(null)
  const language = LANGUAGES.find((item) => item.id === langId) ?? LANGUAGES[0]

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  useEffect(() => {
    if (!langOpen) return undefined

    function onPointerDown(event) {
      if (langRef.current?.contains(event.target)) return
      setLangOpen(false)
    }

    function onKeyDown(event) {
      if (event.key === 'Escape') setLangOpen(false)
    }

    document.addEventListener('pointerdown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('pointerdown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [langOpen])

  return (
    <footer className="site-footer">
      <div className="site-footer__decor" aria-hidden="true">
        <img
          className="site-footer__watermark site-footer__watermark--left"
          src="/images/logo-icon.png?v=2"
          alt=""
        />
        <img
          className="site-footer__watermark site-footer__watermark--right"
          src="/images/logo-icon.png?v=2"
          alt=""
        />
      </div>
      <div className="container">
        <div className="footer-cta">
          <div className="footer-cta__inner">
            <div className="footer-cta__copy">
              <h3 className="footer-cta__title">
                Yangi ish imkoniyatlaridan birinchi bo&apos;lib xabardor bo&apos;ling!
              </h3>
              <p className="footer-cta__subtitle">
                Yangiliklar, foydali maslahatlar va eng yaxshi vakansiyalar endilikda email orqali.
              </p>
            </div>

            <div className="footer-cta__form-wrap">
              <form
                className="footer-cta__form"
                onSubmit={(event) => event.preventDefault()}
              >
                <FiMail className="footer-cta__mail" aria-hidden="true" />
                <input
                  type="email"
                  required
                  placeholder="Email manzilingizni kiriting..."
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  aria-label="Email manzilingizni kiriting"
                />
                <button type="submit" className="footer-cta__submit">
                  Obuna bo&apos;lish
                  <FiArrowRight aria-hidden="true" />
                </button>
              </form>
              <p className="footer-cta__note">
                <ShieldCheck aria-hidden="true" strokeWidth={2.25} />
                Biz sizning ma&apos;lumotlaringizni hech qachon uchinchi shaxslarga bermaymiz.
              </p>
            </div>

            <div className="footer-cta__visual" aria-hidden="true">
              <svg className="footer-cta__sparks" viewBox="0 0 48 48" fill="none">
                <path d="M30 6 L18 34" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
                <path d="M38 10 L26 38" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
                <path d="M22 4 L10 32" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" />
              </svg>
              <img
                className="footer-cta__photo"
                src="/images/footer/newsletter-woman.png?v=6"
                alt=""
                width={320}
                height={360}
              />
              <div className="footer-cta__scribble">
                <p className="footer-cta__handwrite">
                  Yaxshiroq kelajak
                  <br />
                  shu yerdan boshlanadi!
                </p>
                <svg className="footer-cta__arrow" viewBox="0 0 80 90" fill="none">
                  <path
                    d="M48 6 C66 22, 70 42, 52 62 C42 74, 28 80, 12 82"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M28 70 L10 84 L30 82"
                    stroke="#fff"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-main">
          <div className="footer-brand">
            <Link to="/" className="footer-brand__logo">
              <LogoIcon className="footer-brand__logo-icon" size={28} />
              <span>
                Ayol<span>Karyera</span>
              </span>
            </Link>
            <p className="footer-brand__tagline">Ayollar uchun eng yaxshi ish imkoniyatlari</p>
            <p className="footer-brand__text">
              AyolKaryera – O&apos;zbekistondagi ayollar uchun ish, ta&apos;lim va karyera
              imkoniyatlarini birlashtirgan zamonaviy platforma. Biz ayollarning o&apos;sishi va
              muvaffaqiyatiga ishonamiz.
            </p>
            <div className="footer-brand__socials">
              {SOCIALS.map(({ id, label, Icon, href }) => (
                <a
                  key={id}
                  href={href}
                  className="footer-brand__social"
                  aria-label={label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Icon />
                </a>
              ))}
            </div>
          </div>

          <FooterNav title="Platforma" links={PLATFORM_LINKS} />
          <FooterNav title="Kategoriyalar" links={CATEGORY_LINKS} />
          <FooterNav title="Qo'llab-quvvatlash" links={SUPPORT_LINKS} />


          <p className="footer-main__quote" aria-hidden="true">
            Katta maqsadlar kichik qadamlar bilan boshlanadi ♡
          </p>
        </div>

        <div className="footer-bottom">
          <div className="footer-bottom__copy">
            <p>&copy; 2024 AyolKaryera.</p>
            <span>Barcha huquqlar himoyalangan.</span>
          </div>

          <p className="footer-bottom__motto">
            <FiHeart aria-hidden="true" />
            Ayollarning muvaffaqiyati — jamiyatning yuksalishi!
          </p>

          <div className="footer-bottom__tools">
            <div className="footer-lang" ref={langRef}>
              <button
                type="button"
                className="footer-lang__btn"
                aria-label="Tilni tanlash"
                aria-expanded={langOpen}
                onClick={() => setLangOpen((open) => !open)}
              >
                <FiGlobe />
                <span>{language.short}</span>
                <FiChevronDown className={langOpen ? 'is-open' : undefined} />
              </button>
              {langOpen ? (
                <div className="footer-lang__menu" role="listbox">
                  {LANGUAGES.map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      role="option"
                      aria-selected={item.id === language.id}
                      className={item.id === language.id ? 'is-active' : undefined}
                      onClick={() => {
                        setLangId(item.id)
                        setLangOpen(false)
                      }}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <button
              type="button"
              className="footer-top"
              aria-label="Yuqoriga qaytish"
              onClick={scrollToTop}
            >
              <FiChevronUp />
            </button>
          </div>
        </div>
      </div>
    </footer>
  )
}

function FooterNav({ title, links }) {
  return (
    <nav className="footer-nav" aria-label={title}>
      <h4 className="footer-nav__title">{title}</h4>
      <ul className="footer-nav__list">
        {links.map(({ label, href, to, accent }) => {
          const className = accent
            ? 'footer-nav__link footer-nav__link--accent'
            : 'footer-nav__link'

          return (
            <li key={label}>
              {to ? (
                <Link to={to} className={className}>
                  {label}
                </Link>
              ) : (
                <a href={href} className={className}>
                  {label}
                </a>
              )}
            </li>
          )
        })}
      </ul>
    </nav>
  )
}
