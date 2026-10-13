import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  Award,
  BadgeCheck,
  Bell,
  BookOpen,
  Bookmark,
  BriefcaseBusiness,
  ChevronDown,
  ChevronRight,
  CircleHelp,
  Eye,
  FileText,
  FolderOpen,
  GraduationCap,
  Info,
  LogOut,
  Mail,
  Menu,
  MapPin,
  Pencil,
  Phone,
  Plus,
  Send,
  Settings,
  Share2,
  Trash2,
  Video,
  X,
} from 'lucide-react'
import { currentUserProfile as profile } from '../../data/profile.js'
import { useJobList } from '../../hooks/useJobLists.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useNotifications } from '../../hooks/useNotifications.js'
import MenuSelect from '../ui/MenuSelect.jsx'
import './MobileProfile.css'

const STATUS_OPTIONS = [
  { value: 'active', label: 'Faol ish qidiryapman', hint: "Ish beruvchilar sizga birinchi yozadi" },
  { value: 'open', label: "Takliflarni ko'rib chiqaman", hint: 'Hozir ishlayapman, lekin ochiqman' },
  { value: 'hidden', label: 'Ish qidirmayapman', hint: "Rezyume qidiruvda ko'rinmaydi" },
]

const MENU = [
  [
    { to: '/profil', label: 'Sozlamalar', Icon: Settings },
    { to: '/bildirishnomalar', label: 'Bildirishnomalar', Icon: Bell, badge: 'notifications' },
  ],
  [
    { to: '/ishlar', label: 'Arizalarim', Icon: Send, badge: 'applied' },
    { to: '/saqlanganlar', label: 'Saqlangan e\'lonlar', Icon: Bookmark },
    { to: '/reels', label: 'Maqolalar va videolar', Icon: BookOpen },
  ],
  [
    { to: '/sahifa/loyiha-haqida', label: 'Ilova haqida', Icon: Info },
    { to: '/sahifa/yordam-markazi', label: 'Yordam', Icon: CircleHelp },
  ],
]

function Section({ title, action, children }) {
  return (
    <section className="mp-section">
      <div className="mp-section__head">
        <h2>{title}</h2>
        {action}
      </div>
      {children}
    </section>
  )
}

function EmptyCard({ text, Icon }) {
  return (
    <div className="mp-card mp-empty">
      <span className="mp-empty__icon" aria-hidden="true">
        <Icon size={22} strokeWidth={2} />
      </span>
      <p>{text}</p>
      <button type="button" className="mp-btn mp-btn--primary">
        <Plus size={18} strokeWidth={2.4} aria-hidden="true" />
        Qo&apos;shish
      </button>
    </div>
  )
}

function Field({ label, value }) {
  return (
    <div className="mp-field">
      <span className="mp-field__label">{label}</span>
      <span className="mp-field__value">{value || "Ko'rsatilmagan"}</span>
    </div>
  )
}

export default function MobileProfile() {
  const [status, setStatus] = useLocalStorageState('ayolkaryera-search-status', 'active')
  const [videoHidden, setVideoHidden] = useLocalStorageState('ayolkaryera-hide-video-tip', '')
  const [menuOpen, setMenuOpen] = useState(false)
  const current = STATUS_OPTIONS.find((item) => item.value === status) ?? STATUS_OPTIONS[0]
  const { percent, items } = profile.completeness
  const missing = items.filter((item) => !item.done)
  const [city, district] = profile.location.split(',').map((part) => part.trim())

  return (
    <div className="m-profile">
      {/* ---------- Bosh qism ---------- */}
      <header className="mp-hero">
        <button type="button" className="mp-hero__menu" onClick={() => setMenuOpen(true)} aria-label="Qo'shimcha menyu">
          <Menu size={22} strokeWidth={2.2} />
        </button>

        <div className="mp-avatar">
          <img src={profile.avatar} alt="" width="120" height="120" />
          <button type="button" className="mp-avatar__edit" aria-label="Rasmni o'zgartirish">
            <Pencil size={15} strokeWidth={2.4} />
          </button>
        </div>

        <h1 className="mp-hero__name">
          {profile.name}
          {profile.verified && <BadgeCheck className="mp-hero__verified" size={22} strokeWidth={2.2} aria-label="Tasdiqlangan" />}
        </h1>
        <p className="mp-hero__title">{profile.title}</p>
        <button type="button" className="mp-hero__location">
          <MapPin size={15} strokeWidth={2.2} aria-hidden="true" />
          {profile.location}
          <ChevronRight size={16} strokeWidth={2.2} aria-hidden="true" />
        </button>

        <MenuSelect
          value={status}
          onChange={setStatus}
          options={STATUS_OPTIONS}
          ariaLabel={`Qidiruv holati: ${current.label}`}
          title="Qidiruv holati"
          align="start"
          className="mp-status-wrap"
          triggerClassName={`mp-status mp-status--${status}`}
        >
          <span className="mp-status__dot" aria-hidden="true" />
          <span className="mp-status__label">{current.label}</span>
          <ChevronDown className="mp-status__chevron" size={18} strokeWidth={2.2} aria-hidden="true" />
        </MenuSelect>

        <div className="mp-stats">
          {profile.stats.map((stat) => (
            <div key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* ---------- Profil to'liqligi ---------- */}
      {percent < 100 && (
        <div className="mp-card mp-progress">
          <div className="mp-progress__top">
            <div>
              <strong>Profil {percent}% to&apos;ldirilgan</strong>
              <span>
                {missing.length ? `Qoldi: ${missing.map((item) => item.label.toLowerCase()).join(', ')}` : "Deyarli tayyor"}
              </span>
            </div>
            <span className="mp-progress__pct">{percent}%</span>
          </div>
          <div className="mp-progress__bar" role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label="Profil to'liqligi">
            <span style={{ width: `${percent}%` }} />
          </div>
        </div>
      )}

      {/* ---------- Rezyume ---------- */}
      <Section
        title="Mening rezyumem"
        action={
          <button type="button" className="mp-link">
            <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
            Rezyume yaratish
          </button>
        }
      >
        <div className="mp-card mp-resume">
          <div className="mp-resume__top">
            <div>
              <h3>{profile.title}</h3>
              <p>Yangilangan: bugun</p>
            </div>
            <img src={profile.avatar} alt="" width="52" height="52" />
          </div>
          <div className={`mp-resume__state mp-resume__state--${status}`}>
            <div>
              <strong>{status === 'hidden' ? 'Rezyume yashirilgan' : 'Rezyume faol'}</strong>
              <span>
                {status === 'hidden'
                  ? "Ish beruvchilar uni qidiruvda ko'rmaydi"
                  : 'Ish beruvchilar qidiruvda ko\'radi va taklif yuboradi'}
              </span>
            </div>
            {status === 'hidden' ? <Eye size={22} strokeWidth={2} aria-hidden="true" /> : <BadgeCheck size={22} strokeWidth={2} aria-hidden="true" />}
          </div>
          <div className="mp-resume__metrics">
            <span>
              <Eye size={15} strokeWidth={2.2} aria-hidden="true" /> 248 ko&apos;rish
            </span>
            <span>
              <Send size={15} strokeWidth={2.2} aria-hidden="true" /> 5 taklif
            </span>
          </div>
          <div className="mp-resume__actions">
            <button type="button" className="mp-icon-btn mp-icon-btn--danger" aria-label="Rezyumeni o'chirish">
              <Trash2 size={18} strokeWidth={2} />
            </button>
            <button type="button" className="mp-icon-btn" aria-label="Rezyumeni ulashish">
              <Share2 size={18} strokeWidth={2} />
            </button>
            <button type="button" className="mp-btn mp-btn--primary mp-btn--grow">
              <FileText size={18} strokeWidth={2} aria-hidden="true" />
              Tahrirlash
            </button>
          </div>
        </div>
      </Section>

      {/* ---------- Qidiruv sozlamalari ---------- */}
      <Section title="Qidiruv sozlamalari">
        <div className="mp-card">
          <Field label="Sizni hozir nima qiziqtiryapti" value={`${profile.title}, SMM, kontent menejer`} />
          <Field label="Qayerda yashaysiz" value={`${city} · ${district ?? ''}`.replace(/ · $/, '')} />
          <Field label="Qayerda ish qidiryapsiz" value={`${city}, masofaviy`} />
          <Field label="Kutilayotgan maosh" value="6 000 000 so'mdan" />
          <button type="button" className="mp-btn mp-btn--soft">
            Tahrirlash
          </button>
        </div>
      </Section>

      {/* ---------- Kontaktlar ---------- */}
      <Section title="Kontaktlar">
        <div className="mp-contacts">
          <a href={`tel:${profile.phone.replace(/\s/g, '')}`} className="mp-contact mp-contact--wide">
            <span className="mp-contact__icon" aria-hidden="true">
              <Phone size={20} strokeWidth={2} />
            </span>
            <span className="mp-contact__text">
              <strong>Telefon</strong>
              <span>{profile.phone}</span>
            </span>
          </a>
          <a href={`mailto:${profile.email}`} className="mp-contact mp-contact--wide">
            <span className="mp-contact__icon" aria-hidden="true">
              <Mail size={20} strokeWidth={2} />
            </span>
            <span className="mp-contact__text">
              <strong>Email</strong>
              <span>{profile.email}</span>
            </span>
          </a>
          <a href="https://t.me/" target="_blank" rel="noopener noreferrer" className="mp-contact mp-contact--wide">
            <span className="mp-contact__icon mp-contact__icon--tg" aria-hidden="true">
              <Send size={19} strokeWidth={2} />
            </span>
            <span className="mp-contact__text">
              <strong>Telegram</strong>
              <span>@dilshoda_k</span>
            </span>
          </a>
        </div>
        <button type="button" className="mp-card mp-row">
          <span>
            <strong>Boshqa aloqa usullari</strong>
            <span>Ijtimoiy tarmoqlar va portfolio sayti</span>
          </span>
          <ChevronRight size={20} strokeWidth={2} aria-hidden="true" />
        </button>
      </Section>

      {/* ---------- Ish tajribasi ---------- */}
      <Section
        title="Ish tajribasi"
        action={
          <button type="button" className="mp-link">
            <Plus size={16} strokeWidth={2.4} aria-hidden="true" />
            Qo&apos;shish
          </button>
        }
      >
        <div className="mp-card mp-timeline">
          {profile.experience.map((item) => (
            <article key={item.role} className="mp-timeline__item">
              <span className="mp-timeline__icon" aria-hidden="true">
                <BriefcaseBusiness size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>{item.role}</h3>
                <p className="mp-timeline__meta">
                  {item.company} · {item.years}
                </p>
                <ul>
                  {item.points.map((point) => (
                    <li key={point}>{point}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
          <button type="button" className="mp-btn mp-btn--soft">
            Tahrirlash
          </button>
        </div>
      </Section>

      {/* ---------- Ta'lim ---------- */}
      <Section title="Ta'lim">
        <div className="mp-card mp-timeline">
          {profile.education.map((item) => (
            <article key={item.school} className="mp-timeline__item">
              <span className="mp-timeline__icon" aria-hidden="true">
                <GraduationCap size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>{item.school}</h3>
                <p className="mp-timeline__meta">
                  {item.years} · {item.degree}
                </p>
              </div>
            </article>
          ))}
          <button type="button" className="mp-btn mp-btn--soft">
            Tahrirlash
          </button>
        </div>
      </Section>

      {/* ---------- Ko'nikmalar ---------- */}
      <Section title="Ko'nikmalar">
        <div className="mp-card">
          <div className="mp-chips">
            {profile.skills.map((skill) => (
              <span key={skill} className="mp-chip">
                {skill}
              </span>
            ))}
          </div>
          <button type="button" className="mp-btn mp-btn--soft">
            Tahrirlash
          </button>
        </div>
      </Section>

      <Section title="Malakani oshirish, kurslar">
        <EmptyCard Icon={Award} text="Ish beruvchilar e'tiborini jalb qilish uchun malaka oshirish va kurslarni qo'shing" />
      </Section>

      <Section title="Portfolio">
        <EmptyCard Icon={FolderOpen} text="Ish beruvchilar e'tiborini tortish uchun portfolioga ishlaringizni qo'shing" />
      </Section>

      {!videoHidden && (
        <div className="mp-card mp-video">
          <button type="button" className="mp-video__close" onClick={() => setVideoHidden('1')} aria-label="Yopish">
            <X size={20} strokeWidth={2} />
          </button>
          <span className="mp-video__icon" aria-hidden="true">
            <Video size={24} strokeWidth={2} />
          </span>
          <h3>O&apos;zingiz haqingizda video</h3>
          <p>Tajribangiz va ko&apos;nikmalaringiz haqida ish beruvchilar uchun qisqa video yozib oling</p>
          <button type="button" className="mp-btn mp-btn--light">
            <Video size={18} strokeWidth={2} aria-hidden="true" />
            Yozish
          </button>
        </div>
      )}

      {/* ---------- Tillar ---------- */}
      <Section title="Tillar">
        <div className="mp-card">
          <div className="mp-langs">
            {profile.languages.map((lang) => (
              <div key={lang.name} className="mp-lang">
                <span className="mp-lang__flag" aria-hidden="true">
                  {lang.flag}
                </span>
                <span className="mp-lang__name">{lang.name}</span>
                <span className="mp-lang__level">{lang.level}</span>
              </div>
            ))}
          </div>
          <button type="button" className="mp-btn mp-btn--soft">
            Tahrirlash
          </button>
        </div>
      </Section>

      <Section title="Qiziqishlar">
        <div className="mp-card">
          <div className="mp-chips">
            {profile.interests.map((item) => (
              <span key={item} className="mp-chip mp-chip--muted">
                {item}
              </span>
            ))}
          </div>
        </div>
      </Section>

      <ProfileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

function ProfileMenu({ open, onClose }) {
  const dialogRef = useRef(null)
  const { unreadCount } = useNotifications()
  const applied = useJobList('applied')
  const badges = { notifications: unreadCount, applied: applied.ids.size }

  useEffect(() => {
    const dialog = dialogRef.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
  }, [open])

  return (
    <dialog
      ref={dialogRef}
      className="mp-menu"
      aria-labelledby="mp-menu-title"
      onClose={onClose}
      onClick={(event) => event.target === dialogRef.current && onClose()}
    >
      <div className="mp-menu__panel">
        <span className="mp-menu__handle" aria-hidden="true" />
        <div className="mp-menu__head">
          <h2 id="mp-menu-title">Qo&apos;shimcha</h2>
          <button type="button" className="mp-icon-btn" onClick={onClose} aria-label="Yopish">
            <X size={20} strokeWidth={2.2} />
          </button>
        </div>

        {MENU.map((group, index) => (
          <ul key={index} className="mp-menu__group">
            {group.map(({ to, label, Icon, badge }) => (
              <li key={label}>
                <Link to={to} className="mp-menu__item" onClick={onClose}>
                  <span className="mp-menu__icon" aria-hidden="true">
                    <Icon size={20} strokeWidth={2} />
                  </span>
                  <span className="mp-menu__label">{label}</span>
                  {badge && badges[badge] > 0 && <span className="mp-menu__badge">{badges[badge]}</span>}
                  <ChevronRight size={18} strokeWidth={2} aria-hidden="true" />
                </Link>
              </li>
            ))}
          </ul>
        ))}

        <button type="button" className="mp-menu__logout" onClick={onClose}>
          <LogOut size={20} strokeWidth={2} aria-hidden="true" />
          Chiqish
        </button>
      </div>
    </dialog>
  )
}
