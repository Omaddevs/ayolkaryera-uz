import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import {
  FiBell,
  FiBriefcase,
  FiCamera,
  FiCheck,
  FiCheckCircle,
  FiCopy,
  FiEdit2,
  FiFileText,
  FiHeart,
  FiHelpCircle,
  FiLink,
  FiLogOut,
  FiMail,
  FiMapPin,
  FiMessageSquare,
  FiPhone,
  FiPlus,
  FiSend,
  FiSettings,
  FiShield,
  FiUser,
} from 'react-icons/fi'
import { FaFacebookF, FaLinkedinIn, FaTelegram, FaXTwitter } from 'react-icons/fa6'
import { HiOutlineSparkles } from 'react-icons/hi2'
import Button from '../components/ui/Button.jsx'
import LogoIcon from '../components/icons/LogoIcon.jsx'
import {
  currentUserProfile as profile,
  profileNavItems,
  profileTabs,
} from '../data/profile.js'
import { useNotifications } from '../hooks/useNotifications.js'
import MobileProfile from '../components/mobile/MobileProfile.jsx'
import useIsMobile from '../hooks/useIsMobile.js'
import './ProfilePage.css'

const navIcons = {
  user: FiUser,
  file: FiFileText,
  send: FiSend,
  heart: FiHeart,
  bell: FiBell,
  message: FiMessageSquare,
  settings: FiSettings,
  shield: FiShield,
  help: FiHelpCircle,
  logout: FiLogOut,
}

function ProfileSidebar({ activeId = 'profile' }) {
  // Bildirishnomalar soni — haqiqiy o'qilmaganlar bo'yicha
  const { unreadCount } = useNotifications()
  return (
    <aside className="profile-side">
      <nav className="profile-nav" aria-label="Profil menyusi">
        {profileNavItems.map((item) => {
          const Icon = navIcons[item.icon] || FiUser
          const className = [
            'profile-nav__item',
            item.id === activeId ? 'is-active' : '',
            item.danger ? 'is-danger' : '',
          ]
            .filter(Boolean)
            .join(' ')

          const content = (
            <>
              <Icon aria-hidden />
              <span>{item.label}</span>
              {(item.id === 'notifications' ? unreadCount || null : item.badge) != null && (
                <em className="profile-nav__badge">{item.id === 'notifications' ? unreadCount : item.badge}</em>
              )}
            </>
          )

          if (item.to && item.to !== '#') {
            return (
              <NavLink key={item.id} to={item.to} className={className} end>
                {content}
              </NavLink>
            )
          }

          return (
            <button key={item.id} type="button" className={className}>
              {content}
            </button>
          )
        })}
      </nav>

      <div className="profile-premium-card">
        <div className="profile-premium-card__icon" aria-hidden>
          <HiOutlineSparkles />
        </div>
        <h3>Premium bo‘ling</h3>
        <p>Ish beruvchilar oldida ko‘proq ko‘rining va imkoniyatlarni oshiring.</p>
        <Button variant="primary" className="profile-premium-card__btn">
          Premiumga o‘tish
        </Button>
      </div>
    </aside>
  )
}

function ProfileHero() {
  return (
    <section className="profile-hero">
      <div className="profile-hero__bg" aria-hidden>
        <LogoIcon className="profile-hero__watermark profile-hero__watermark--main" size={280} />
        <LogoIcon className="profile-hero__watermark profile-hero__watermark--soft" size={180} />
      </div>
      <Button variant="outline" className="profile-hero__edit" icon={<FiEdit2 />}>
        Profilni tahrirlash
      </Button>

      <div className="profile-hero__top">
        <div className="profile-hero__avatar-wrap">
          <img src={profile.avatar} alt={profile.name} className="profile-hero__avatar" />
          <button type="button" className="profile-hero__camera" aria-label="Rasmni o‘zgartirish">
            <FiCamera />
          </button>
        </div>

        <div className="profile-hero__info">
          <div className="profile-hero__name-row">
            <h1>{profile.name}</h1>
            {profile.verified && (
              <span className="profile-hero__verified" title="Tasdiqlangan">
                <FiCheckCircle />
              </span>
            )}
            <span className="profile-hero__status">{profile.status}</span>
          </div>
          <p className="profile-hero__title">{profile.title}</p>
          <ul className="profile-hero__meta">
            <li>
              <FiMapPin aria-hidden />
              {profile.location}
            </li>
            <li>
              <FiMail aria-hidden />
              {profile.email}
            </li>
            <li>
              <FiPhone aria-hidden />
              {profile.phone}
            </li>
          </ul>
          <p className="profile-hero__bio">{profile.bio}</p>
        </div>
      </div>

      <div className="profile-hero__stats">
        {profile.stats.map((stat) => (
          <div key={stat.label} className="profile-hero__stat">
            <strong>{stat.value}</strong>
            <span>{stat.label}</span>
          </div>
        ))}
      </div>
    </section>
  )
}

function SectionHead({ title, action = 'Tahrirlash' }) {
  return (
    <div className="profile-section__head">
      <h2>{title}</h2>
      <button type="button" className="profile-section__edit">
        <FiEdit2 aria-hidden />
        {action}
      </button>
    </div>
  )
}

function ProfileMain() {
  const [tab, setTab] = useState('basic')

  return (
    <section className="profile-main">
      <div className="profile-tabs" role="tablist" aria-label="Profil bo‘limlari">
        {profileTabs.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={`profile-tabs__btn${tab === item.id ? ' is-active' : ''}`}
            onClick={() => setTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {tab === 'basic' && (
        <div className="profile-panels">
          <article className="profile-card">
            <SectionHead title="Shaxsiy ma’lumot" />
            <div className="profile-fields">
              {profile.personal.map((field) => (
                <div key={field.label} className="profile-field">
                  <span>{field.label}</span>
                  <strong>{field.value}</strong>
                </div>
              ))}
            </div>
          </article>

          <article className="profile-card">
            <SectionHead title="Men haqimda" />
            <p className="profile-about">{profile.about}</p>
          </article>

          <article className="profile-card">
            <SectionHead title="Ko‘nikmalar" action="Qo‘shish" />
            <div className="profile-tags">
              {profile.skills.map((skill) => (
                <span key={skill} className="profile-tag">
                  {skill}
                </span>
              ))}
              <button type="button" className="profile-tag profile-tag--add">
                <FiPlus aria-hidden />
                Skill
              </button>
            </div>
          </article>

          <article className="profile-card">
            <SectionHead title="Tillar" />
            <ul className="profile-langs">
              {profile.languages.map((lang) => (
                <li key={lang.name}>
                  <span className="profile-langs__flag" aria-hidden>
                    {lang.flag}
                  </span>
                  <div>
                    <strong>{lang.name}</strong>
                    <span>{lang.level}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>

          <article className="profile-card">
            <SectionHead title="Qiziqishlar" />
            <div className="profile-tags profile-tags--outline">
              {profile.interests.map((item) => (
                <span key={item} className="profile-tag profile-tag--outline">
                  {item}
                </span>
              ))}
            </div>
          </article>

          <article className="profile-card">
            <SectionHead title="So‘nggi faoliyat" action="Barchasi" />
            <div className="profile-activity">
              {profile.activity.map((row) => (
                <div key={row.id} className="profile-activity__row">
                  <div className="profile-activity__icon" aria-hidden>
                    <FiBriefcase />
                  </div>
                  <div className="profile-activity__body">
                    <strong>{row.title}</strong>
                    <span>{row.meta}</span>
                  </div>
                  <div className="profile-activity__meta">
                    <time>{row.date}</time>
                    <em className={`profile-activity__status is-${row.tone}`}>{row.status}</em>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}

      {tab === 'experience' && (
        <div className="profile-panels">
          <article className="profile-card">
            <SectionHead title="Ish tajribasi" />
            <ul className="profile-timeline">
              {profile.experience.map((job) => (
                <li key={`${job.company}-${job.role}`}>
                  <div className="profile-timeline__dot" aria-hidden />
                  <div>
                    <strong>{job.role}</strong>
                    <span className="profile-timeline__sub">
                      {job.company} · {job.years}
                    </span>
                    <ul>
                      {job.points.map((point) => (
                        <li key={point}>{point}</li>
                      ))}
                    </ul>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}

      {tab === 'education' && (
        <div className="profile-panels">
          <article className="profile-card">
            <SectionHead title="Ta’lim" />
            <ul className="profile-timeline">
              {profile.education.map((edu) => (
                <li key={`${edu.school}-${edu.degree}`}>
                  <div className="profile-timeline__dot" aria-hidden />
                  <div>
                    <strong>{edu.degree}</strong>
                    <span className="profile-timeline__sub">
                      {edu.school} · {edu.years}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </div>
      )}

      {tab === 'skills' && (
        <div className="profile-panels">
          <article className="profile-card">
            <SectionHead title="Ko‘nikmalar" action="Qo‘shish" />
            <div className="profile-tags">
              {profile.skills.map((skill) => (
                <span key={skill} className="profile-tag">
                  {skill}
                </span>
              ))}
              <button type="button" className="profile-tag profile-tag--add">
                <FiPlus aria-hidden />
                Skill
              </button>
            </div>
          </article>
        </div>
      )}

      {tab === 'resume' && (
        <div className="profile-panels">
          <article className="profile-card profile-resume">
            <div className="profile-resume__icon" aria-hidden>
              <FiFileText />
            </div>
            <h2>Rezyume fayli</h2>
            <p>PDF yoki DOC formatida rezyumengizni yuklang va ish beruvchilar bilan ulashing.</p>
            <Button variant="primary" icon={<FiPlus />}>
              Rezyume yuklash
            </Button>
          </article>
        </div>
      )}

      {tab === 'activity' && (
        <div className="profile-panels">
          <article className="profile-card">
            <SectionHead title="Faoliyat tarixi" action="Barchasi" />
            <div className="profile-activity">
              {profile.activity.map((row) => (
                <div key={row.id} className="profile-activity__row">
                  <div className="profile-activity__icon" aria-hidden>
                    <FiBriefcase />
                  </div>
                  <div className="profile-activity__body">
                    <strong>{row.title}</strong>
                    <span>{row.meta}</span>
                  </div>
                  <div className="profile-activity__meta">
                    <time>{row.date}</time>
                    <em className={`profile-activity__status is-${row.tone}`}>{row.status}</em>
                  </div>
                </div>
              ))}
            </div>
          </article>
        </div>
      )}
    </section>
  )
}

function CompletenessRing({ percent }) {
  const size = 118
  const stroke = 10
  const radius = (size - stroke) / 2
  const circumference = 2 * Math.PI * radius
  const offset = circumference - (percent / 100) * circumference

  return (
    <div className="profile-ring" aria-label={`Profil to‘ldirilishi ${percent}%`}>
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="profile-ring__track"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          className="profile-ring__progress"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
        />
      </svg>
      <div className="profile-ring__label">
        <strong>{percent}%</strong>
        <span>to‘ldirilgan</span>
      </div>
    </div>
  )
}

function ProfileWidgets() {
  return (
    <aside className="profile-widgets">
      <article className="profile-card profile-complete">
        <h2>Profil to‘ldirilishi</h2>
        <CompletenessRing percent={profile.completeness.percent} />
        <ul className="profile-complete__list">
          {profile.completeness.items.map((item) => (
            <li key={item.label} className={item.done ? 'is-done' : ''}>
              <span className="profile-complete__check" aria-hidden>
                {item.done ? <FiCheck /> : null}
              </span>
              {item.label}
            </li>
          ))}
        </ul>
        <Button variant="primary" className="profile-complete__btn">
          Profilni to‘ldirish
        </Button>
      </article>

      <article className="profile-card profile-upsell">
        <h2>Premium imkoniyatlar</h2>
        <ul>
          {profile.premiumBenefits.map((benefit) => (
            <li key={benefit}>
              <FiCheckCircle aria-hidden />
              <span>{benefit}</span>
            </li>
          ))}
        </ul>
        <Button variant="primary" className="profile-upsell__btn">
          Premiumga o‘tish
        </Button>
      </article>

      <article className="profile-card profile-share">
        <h2>Profilni ulashish</h2>
        <div className="profile-share__row">
          <button type="button" aria-label="Havolani nusxalash">
            <FiCopy />
          </button>
          <button type="button" aria-label="LinkedIn">
            <FaLinkedinIn />
          </button>
          <button type="button" aria-label="Telegram">
            <FaTelegram />
          </button>
          <button type="button" aria-label="Facebook">
            <FaFacebookF />
          </button>
          <button type="button" aria-label="X">
            <FaXTwitter />
          </button>
          <button type="button" aria-label="Havola">
            <FiLink />
          </button>
        </div>
      </article>
    </aside>
  )
}

export default function ProfilePage() {
  const isMobile = useIsMobile()
  if (isMobile) return <MobileProfile />

  return (
    <div className="profile-page">
      <div className="container profile-page__inner">
        <div className="profile-page__crumb">
          <Link to="/">Bosh sahifa</Link>
          <span>/</span>
          <span>Mening profilim</span>
        </div>

        <div className="profile-page__grid">
          <ProfileSidebar />
          <div className="profile-page__center">
            <ProfileHero />
            <ProfileMain />
          </div>
          <ProfileWidgets />
        </div>
      </div>
    </div>
  )
}
