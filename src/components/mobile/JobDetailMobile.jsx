import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Check,
  ChevronRight,
  Clock3,
  Eye,
  FileText,
  GraduationCap,
  Laptop,
  MapPin,
  MessageCircle,
} from 'lucide-react'
import { useJobList } from '../../hooks/useJobLists.js'
import { CompanyLogo, FeaturedJobCard, SaveButton, VerifiedMark } from './JobCards.jsx'
import SwipeToApply from './SwipeToApply.jsx'
import './JobDetailMobile.css'

function Checklist({ items }) {
  return (
    <ul className="jdm-checklist">
      {items.map((item) => (
        <li key={item}>
          <span className="jdm-checklist__icon" aria-hidden="true">
            <Check size={12} strokeWidth={3} />
          </span>
          {item}
        </li>
      ))}
    </ul>
  )
}

export default function JobDetailMobile({ job, similar }) {
  const navigate = useNavigate()
  const [tab, setTab] = useState('about')
  const [expanded, setExpanded] = useState(false)
  const applied = useJobList('applied')
  const isApplied = applied.has(job.id)
  const meta = job.companyMeta
  const chatUrl = `/xabarlar?company=${job.companyId}&job=${job.id}`

  // Boshqa vakansiyaga o'tilganda sahifa boshidan ochiladi
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [job.id])

  // Yuqori panel fonini faqat sahifa aylantirilganda ko'rsatish
  const [scrolled, setScrolled] = useState(false)
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  function goBack() {
    if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/ishlar')
  }

  function apply() {
    applied.add(job.id)
    navigate(chatUrl)
  }

  return (
    <div className="jdm">
      <header className={`jdm-bar${scrolled ? ' is-scrolled' : ''}`}>
        <button type="button" className="jdm-bar__btn" onClick={goBack} aria-label="Orqaga">
          <ArrowLeft size={20} strokeWidth={2.2} />
        </button>
        <Link to={`/kompaniya/${job.companyId}`} className="jdm-bar__title">
          <span>{job.company}</span>
          {job.verified && <VerifiedMark label={false} />}
        </Link>
        <SaveButton job={job} className="jdm-bar__save" />
      </header>

      <section className="jdm-hero">
        <CompanyLogo job={job} size={76} className="jdm-hero__logo" />
        <h1 className="jdm-hero__title">{job.title}</h1>
        <p className="jdm-hero__salary">{job.salary}</p>
        <p className="jdm-hero__meta">
          <span>
            <MapPin size={13} strokeWidth={2.2} aria-hidden="true" />
            {job.location}
          </span>
          <span>
            <Eye size={13} strokeWidth={2.2} aria-hidden="true" />
            {job.views} ko&apos;rish
          </span>
        </p>
        <div className="jdm-hero__tags">
          {[job.typeLabel, job.workMode, job.level].filter(Boolean).map((tag) => (
            <span key={tag} className="jdm-pill">
              {tag}
            </span>
          ))}
        </div>

        <div className="jdm-tabs" role="tablist" aria-label="Vakansiya ma'lumotlari">
          <button
            type="button"
            role="tab"
            id="jdm-tab-about"
            aria-selected={tab === 'about'}
            aria-controls="jdm-panel"
            className={`jdm-tabs__item${tab === 'about' ? ' is-active' : ''}`}
            onClick={() => setTab('about')}
          >
            <FileText size={16} strokeWidth={2.2} aria-hidden="true" />
            Tavsif
          </button>
          <button
            type="button"
            role="tab"
            id="jdm-tab-company"
            aria-selected={tab === 'company'}
            aria-controls="jdm-panel"
            className={`jdm-tabs__item${tab === 'company' ? ' is-active' : ''}`}
            onClick={() => setTab('company')}
          >
            <Building2 size={16} strokeWidth={2.2} aria-hidden="true" />
            Kompaniya
          </button>
        </div>
      </section>

      <div className="jdm-body" id="jdm-panel" role="tabpanel" aria-labelledby={tab === 'about' ? 'jdm-tab-about' : 'jdm-tab-company'}>
        {tab === 'about' ? (
          <>
            <div className="jdm-strip">
              <div>
                <Briefcase size={18} strokeWidth={2} aria-hidden="true" />
                <strong>{job.typeLabel}</strong>
                <span>Ish turi</span>
              </div>
              <div>
                <Clock3 size={18} strokeWidth={2} aria-hidden="true" />
                <strong>{job.hours}</strong>
                <span>Ish vaqti</span>
              </div>
              <div>
                <Laptop size={18} strokeWidth={2} aria-hidden="true" />
                <strong>{job.workMode}</strong>
                <span>Ish formati</span>
              </div>
            </div>

            <section className="jdm-block">
              <h2>Vakansiya haqida</h2>
              <p className={`jdm-text${expanded ? ' is-expanded' : ''}`}>{job.description}</p>
              <button type="button" className="jdm-more" onClick={() => setExpanded((v) => !v)} aria-expanded={expanded}>
                {expanded ? 'Yopish' : "Ko'proq o'qish"}
              </button>
            </section>

            <div className="jdm-facts">
              <div className="jdm-fact">
                <span className="jdm-fact__icon" aria-hidden="true">
                  <GraduationCap size={20} strokeWidth={2} />
                </span>
                <span className="jdm-fact__label">Tajriba</span>
                <strong>{job.experience}</strong>
              </div>
              <div className="jdm-fact">
                <span className="jdm-fact__icon" aria-hidden="true">
                  <MapPin size={20} strokeWidth={2} />
                </span>
                <span className="jdm-fact__label">Manzil</span>
                <strong>{job.location}</strong>
              </div>
            </div>

            <section className="jdm-block">
              <h2>Asosiy vazifalar</h2>
              <Checklist items={job.tasks} />
            </section>

            <section className="jdm-block">
              <h2>Talablar</h2>
              <Checklist items={job.requirements} />
            </section>

            <section className="jdm-block jdm-block--offer">
              <h2>Biz taklif qilamiz</h2>
              <Checklist items={job.offers} />
            </section>

            {similar.length > 0 && (
              <section className="jdm-similar" aria-labelledby="jdm-similar-title">
                <div className="jdm-similar__head">
                  <h2 id="jdm-similar-title">O&apos;xshash vakansiyalar</h2>
                  <Link to="/ishlar">
                    Barchasi
                    <ChevronRight size={16} strokeWidth={2.4} aria-hidden="true" />
                  </Link>
                </div>
                <div className="jdm-similar__rail">
                  {similar.map((item) => (
                    <FeaturedJobCard key={item.id} job={item} />
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          <>
            <section className="jdm-block jdm-company">
              <div className="jdm-company__head">
                <CompanyLogo job={job} size={52} />
                <div>
                  <h2>{job.company}</h2>
                  <p>{meta.industry}</p>
                </div>
              </div>
              <p className="jdm-company__about">{meta.about}</p>
              <div className="jdm-company__stats">
                {meta.stats.map((stat) => (
                  <div key={stat.label}>
                    <strong>{stat.label}</strong>
                    <span>{stat.sub}</span>
                  </div>
                ))}
              </div>
            </section>

            {meta.gallery?.length ? (
              <div className="jdm-gallery">
                {meta.gallery.map((src) => (
                  <img key={src} src={src} alt="" loading="lazy" decoding="async" />
                ))}
              </div>
            ) : null}

            <blockquote className="jdm-quote">“{meta.quote}”</blockquote>

            <div className="jdm-company__actions">
              <Link to={`/kompaniya/${job.companyId}`} className="jdm-btn jdm-btn--outline">
                <Building2 size={18} strokeWidth={2} aria-hidden="true" />
                Kompaniya sahifasi
              </Link>
              <Link to={chatUrl} className="jdm-btn jdm-btn--soft">
                <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
                Xabar yozish
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="jdm-cta">
        {isApplied ? (
          <Link to={chatUrl} className="jdm-apply jdm-apply--done">
            <span className="jdm-apply__knob">
              <Check size={16} strokeWidth={3} aria-hidden="true" />
              Ariza yuborilgan
            </span>
            <span className="jdm-apply__hint">Suhbatni ochish</span>
          </Link>
        ) : (
          <SwipeToApply onComplete={apply} />
        )}
      </div>
    </div>
  )
}
