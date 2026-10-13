import { Link } from 'react-router-dom'
import { ArrowUpRight, Bookmark, Check, Clock3, Flame, MapPin, MessageCircle, Zap } from 'lucide-react'
import { useJobList } from '../../hooks/useJobLists.js'
import './JobCards.css'

// Ariza topshirganlar avatarlari (demo)
const APPLICANT_PHOTOS = [
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80',
]

function applicantCount(job) {
  return 6 + ((job.id * 7) % 23)
}

export function CompanyLogo({ job, size = 44, className = '' }) {
  return (
    <span
      className={`mj-logo ${className}`}
      style={{ width: size, height: size, ...(job.logo ? null : { background: job.companyColor, color: '#fff' }) }}
    >
      {job.logo ? <img src={`${job.logo}?v=2`} alt="" loading="lazy" decoding="async" /> : job.company.charAt(0)}
    </span>
  )
}

export function VerifiedMark({ label = true }) {
  return (
    <span className="mj-verified">
      <span className="mj-verified__icon" aria-hidden="true">
        <Check size={9} strokeWidth={3.5} />
      </span>
      {label ? 'Tasdiqlangan' : <span className="sr-only">Tasdiqlangan</span>}
    </span>
  )
}

export function SaveButton({ job, className = '' }) {
  const saved = useJobList('saved')
  const active = saved.has(job.id)
  return (
    <button
      type="button"
      className={`mj-save ${active ? 'is-active' : ''} ${className}`}
      aria-pressed={active}
      aria-label={active ? 'Saqlanganlardan olib tashlash' : 'Saqlash'}
      onClick={(event) => {
        event.preventDefault()
        event.stopPropagation()
        saved.toggle(job.id)
      }}
    >
      <Bookmark size={18} strokeWidth={2} fill={active ? 'currentColor' : 'none'} />
    </button>
  )
}

export function Applicants({ job }) {
  const count = applicantCount(job)
  const offset = job.id % APPLICANT_PHOTOS.length
  const photos = [0, 1, 2].map((i) => APPLICANT_PHOTOS[(offset + i) % APPLICANT_PHOTOS.length])
  return (
    <span className="mj-applicants" aria-label={`${count + 3} kishi ariza topshirgan`}>
      {photos.map((src) => (
        <img key={src} src={`${src}?w=64&h=64&fit=crop&crop=faces`} alt="" loading="lazy" decoding="async" />
      ))}
      <span className="mj-applicants__more" aria-hidden="true">
        +{count}
      </span>
    </span>
  )
}

function CardHead({ job }) {
  return (
    <div className="mj-head">
      <CompanyLogo job={job} />
      <div className="mj-head__text">
        <span className="mj-head__company">
          <span className="mj-head__name">{job.company}</span>
          {job.verified && <VerifiedMark label={false} />}
        </span>
        <span className="mj-head__meta">
          <span className="mj-head__loc">
            <MapPin size={12} strokeWidth={2.2} aria-hidden="true" />
            {job.location}
          </span>
          <span className="mj-head__dot" aria-hidden="true" />
          <span>{job.typeLabel}</span>
        </span>
      </div>
      <SaveButton job={job} />
    </div>
  )
}

/** Gorizontal "Tavsiya etilgan" kartasi; birinchisi brend rangida ajratiladi */
export function FeaturedJobCard({ job, highlight = false }) {
  return (
    <article className={`mj-card mj-feature ${highlight ? 'mj-feature--primary' : ''}`}>
      <Link to={`/ish/${job.id}`} className="mj-card__link" aria-label={`${job.title} — ${job.company}`} />
      <CardHead job={job} />
      <h3 className="mj-card__title">{job.title}</h3>
      <p className="mj-card__salary">
        {job.salary} <span>/ oy</span>
      </p>
      <div className="mj-card__foot">
        <Applicants job={job} />
        <Link to={`/ish/${job.id}`} className="mj-apply" tabIndex={-1} aria-hidden="true">
          Ariza
          <ArrowUpRight size={16} strokeWidth={2.2} />
        </Link>
      </div>
    </article>
  )
}

/** Ro'yxatdagi vakansiya kartasi */
export function JobCard({ job, showApply = true }) {
  const tags = [job.workMode, job.level].filter(Boolean)
  return (
    <article className="mj-card mj-job">
      <Link to={`/ish/${job.id}`} className="mj-card__link" aria-label={`${job.title} — ${job.company}`} />
      <CardHead job={job} />
      <h3 className="mj-card__title">{job.title}</h3>
      <p className="mj-card__salary">
        {job.salary} <span>/ oy</span>
      </p>
      {tags.length > 0 && (
        <div className="mj-job__tags">
          {tags.map((tag) => (
            <span key={tag} className="mj-tag mj-tag--muted">
              {tag}
            </span>
          ))}
        </div>
      )}
      {showApply && (
        <div className="mj-card__foot">
          <Applicants job={job} />
          <Link to={`/ish/${job.id}`} className="mj-apply mj-apply--soft" tabIndex={-1} aria-hidden="true">
            Ariza
            <ArrowUpRight size={16} strokeWidth={2.2} />
          </Link>
        </div>
      )}
    </article>
  )
}

const MONTHS = ['yanvar', 'fevral', 'mart', 'aprel', 'may', 'iyun', 'iyul', 'avgust', 'sentabr', 'oktabr', 'noyabr', 'dekabr']

/** "13.10.2026 09:00" → "13-oktabr" */
function shortDate(postedAt) {
  const [day, month] = String(postedAt).split('.')
  return MONTHS[Number(month) - 1] ? `${Number(day)}-${MONTHS[Number(month) - 1]}` : postedAt
}

// Demo ko'rsatkichlar: id bo'yicha barqaror
const viewingNow = (job) => (job.id * 5) % 17
const isTop = (job) => job.id % 4 === 1
const isQuickApply = (job) => job.type === 'intern' || job.experience === 'Tajriba shart emas'

/** Ishlar lentasi kartasi: to'liq ma'lumot, belgilar va ikkita amal */
export function JobFeedCard({ job }) {
  const applied = useJobList('applied')
  const isApplied = applied.has(job.id)
  const viewers = viewingNow(job)
  const top = isTop(job)

  return (
    <article className={`mj-card mf-card${top ? ' mf-card--top' : ''}`}>
      <Link to={`/ish/${job.id}`} className="mj-card__link" aria-label={`${job.title} — ${job.company}`} />

      {(top || viewers > 4) && (
        <div className="mf-flags">
          {top && (
            <span className="mf-flag mf-flag--top">
              <Flame size={13} strokeWidth={2.4} aria-hidden="true" />
              Top vakansiya
            </span>
          )}
          {viewers > 4 && (
            <span className="mf-flag mf-flag--live">
              <span className="mf-flag__pulse" aria-hidden="true" />
              Hozir {viewers} kishi ko&apos;ryapti
            </span>
          )}
        </div>
      )}

      <div className="mj-head">
        <CompanyLogo job={job} />
        <div className="mj-head__text">
          <span className="mj-head__company">
            <span className="mj-head__name">{job.company}</span>
            {job.verified && <VerifiedMark label={false} />}
          </span>
          <span className="mj-head__meta">
            <span className="mj-head__loc">
              <MapPin size={12} strokeWidth={2.2} aria-hidden="true" />
              {job.location}
            </span>
            <span className="mj-head__dot" aria-hidden="true" />
            <span>{job.workMode}</span>
          </span>
        </div>
        <SaveButton job={job} />
      </div>

      <h3 className="mf-title">{job.title}</h3>
      <p className="mf-salary">
        {job.salary}
        {job.salary !== 'Kelishiladi' && <span> / oy</span>}
      </p>

      <div className="mf-tags">
        <span className="mj-tag">{job.typeLabel}</span>
        <span className="mj-tag mj-tag--muted">{job.experience}</span>
        <span className="mj-tag mj-tag--muted">
          <Clock3 size={12} strokeWidth={2.2} aria-hidden="true" />
          {job.hours}
        </span>
        {isQuickApply(job) && (
          <span className="mj-tag mf-tag--quick">
            <Zap size={12} strokeWidth={2.4} aria-hidden="true" />
            Rezyumesiz mumkin
          </span>
        )}
      </div>

      <div className="mf-foot">
        <span className="mf-date">{shortDate(job.postedAt)} · {job.views} ko&apos;rish</span>
        <div className="mf-actions">
          <Link
            to={`/xabarlar?company=${job.companyId}&job=${job.id}`}
            className="mf-btn mf-btn--soft"
            aria-label={`${job.company} bilan bog'lanish`}
          >
            <MessageCircle size={18} strokeWidth={2} aria-hidden="true" />
            Yozish
          </Link>
          <Link to={`/ish/${job.id}`} className={`mf-btn mf-btn--primary${isApplied ? ' is-done' : ''}`}>
            {isApplied ? (
              <>
                <Check size={17} strokeWidth={3} aria-hidden="true" />
                Yuborilgan
              </>
            ) : (
              <>
                Ariza yuborish
                <ArrowUpRight size={17} strokeWidth={2.2} aria-hidden="true" />
              </>
            )}
          </Link>
        </div>
      </div>
    </article>
  )
}
