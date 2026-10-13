import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check } from 'lucide-react'
import {
  FiArrowRight,
  FiBell,
  FiBriefcase,
  FiClock,
  FiHeart,
  FiHome,
  FiMapPin,
} from 'react-icons/fi'
import { HiOutlineAcademicCap } from 'react-icons/hi2'
import MessageIcon from '../icons/MessageIcon.jsx'
import { jobFilters, jobs } from '../../data/jobs.js'
import './JobListings.css'

const filterIcons = {
  briefcase: FiBriefcase,
  clock: FiClock,
  home: FiHome,
  grad: HiOutlineAcademicCap,
}

export default function JobListings({ embedded = false }) {
  const [activeFilter, setActiveFilter] = useState('all')

  const filteredJobs =
    activeFilter === 'all' ? jobs : jobs.filter((job) => job.type === activeFilter)

  const content = (
    <>
      <div className="job-listings__header">
        <h2 className="job-listings__title">So&apos;nggi ish e&apos;lonlari</h2>
        <a href="#" className="job-listings__view-all">
          Barchasini ko&apos;rish
          <FiArrowRight />
        </a>
      </div>

      <div className="job-listings__filters" role="tablist" aria-label="Ish turi">
        {jobFilters.map((filter) => {
          const Icon = filterIcons[filter.icon]
          const isActive = activeFilter === filter.id

          return (
            <button
              key={filter.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`job-filter ${isActive ? 'job-filter--active' : ''}`}
              onClick={() => setActiveFilter(filter.id)}
            >
              {Icon ? <Icon /> : null}
              {filter.label}
            </button>
          )
        })}
      </div>

      <ul className="job-listings__list">
        {filteredJobs.map((job) => (
          <li key={job.id}>
            <JobCard job={job} />
          </li>
        ))}
      </ul>

      <div className="job-listings__notify">
        <span className="job-listings__notify-icon" aria-hidden="true">
          <FiBell />
        </span>
        <div className="job-listings__notify-copy">
          <p className="job-listings__notify-title">
            Yangi ish e&apos;lonlarini birinchilardan bo&apos;lib oling!
          </p>
          <p className="job-listings__notify-sub">
            Bildirishnomani yoqing va yangi vakansiyalardan xabardor bo&apos;ling.
          </p>
        </div>
        <a href="#" className="job-listings__notify-cta">
          Bildirishnoma yoqish
          <FiArrowRight />
        </a>
      </div>
    </>
  )

  if (embedded) {
    return <div className="job-listings job-listings--embedded">{content}</div>
  }

  return (
    <section id="ishlar" className="job-listings container">
      {content}
    </section>
  )
}

function JobCard({ job }) {
  const [saved, setSaved] = useState(false)
  const initial = job.company.charAt(0)
  const postedLabel = job.postedAt || job.postedAgo

  return (
    <article className="job-row">
      <Link to={`/ish/${job.id}`} className="job-row__link">
        <span className="job-row__logo" style={job.logo ? undefined : { background: job.companyColor }}>
          {job.logo ? (
            <img src={job.logo} alt="" width={48} height={48} />
          ) : (
            initial
          )}
        </span>

        <span className="job-row__body">
          <span className="job-row__title">{job.title}</span>
          <span className="job-row__sub">
            <span className="job-row__company-line">
              <span className="job-row__company">{job.company}</span>
              {job.verified && (
                <span className="job-row__verified" title="Tasdiqlangan" aria-label="Tasdiqlangan">
                  <Check size={9} strokeWidth={3.5} />
                </span>
              )}
            </span>
            <span className="job-row__dot" aria-hidden="true" />
            <span className="job-row__location">
              <FiMapPin aria-hidden="true" />
              <span>{job.location}</span>
            </span>
          </span>
          <span className="job-row__meta">
            <span className={`job-row__tag job-row__tag--${job.typeTone}`}>{job.typeLabel}</span>
            <span className="job-row__tag job-row__tag--neutral">{job.category}</span>
          </span>
        </span>
      </Link>

      <div className="job-row__aside">
        <time className="job-row__time">{postedLabel}</time>
        <div className="job-row__actions">
          <Link
            to={`/xabarlar?company=${job.companyId}&job=${job.id}`}
            className="job-row__msg"
            aria-label="Xabar yozish"
          >
            <MessageIcon size={16} />
          </Link>
          <button
            type="button"
            className={`job-row__save ${saved ? 'job-row__save--active' : ''}`}
            aria-label="Saqlash"
            onClick={() => setSaved((value) => !value)}
          >
            <FiHeart />
          </button>
        </div>
      </div>
    </article>
  )
}
