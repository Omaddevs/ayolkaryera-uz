import {
  Briefcase,
  Calculator,
  ChefHat,
  Code2,
  Languages,
  Megaphone,
  Palette,
  Scissors,
} from 'lucide-react'
import { FiArrowRight, FiClock, FiTrendingUp } from 'react-icons/fi'
import { courses } from '../../data/courses.js'
import LogoIcon from '../icons/LogoIcon.jsx'
import './Courses.css'

const ICONS = {
  code: Code2,
  palette: Palette,
  megaphone: Megaphone,
  calculator: Calculator,
  languages: Languages,
  scissors: Scissors,
  briefcase: Briefcase,
  chef: ChefHat,
}

export default function Courses() {
  return (
    <section className="courses container" id="kurslar">
      <div className="courses__panel">
        <div className="courses__decor" aria-hidden="true">
          <LogoIcon className="courses__watermark courses__watermark--main" size={320} />
          <LogoIcon className="courses__watermark courses__watermark--soft" size={200} />
        </div>

        <div className="courses__header">
          <div className="courses__intro">
            <span className="courses__badge">
              <LogoIcon size={16} className="courses__badge-logo" />
              Bilim
            </span>
            <h2 className="courses__title">Ayollar uchun kurslar</h2>
            <p className="courses__subtitle">
              Yangi kasb, amaliy ko&apos;nikmalar va karyera o&apos;sishi — barchasi bir platformada.
            </p>
          </div>

          <a href="#" className="courses__all">
            Barcha kurslar
            <FiArrowRight />
          </a>
        </div>

        <div className="courses__grid">
          {courses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>
    </section>
  )
}

function CourseCard({ course }) {
  const Icon = ICONS[course.icon] ?? Code2

  return (
    <a href="#" className="course-card">
      <div className="course-card__top">
        <span className="course-card__icon" style={{ background: course.accent }}>
          <Icon size={22} strokeWidth={1.75} />
        </span>
        <span className={`course-card__price ${course.isFree ? 'course-card__price--free' : ''}`}>
          {course.price}
        </span>
      </div>

      <h3 className="course-card__title">{course.title}</h3>
      <p className="course-card__provider">{course.provider}</p>

      <div className="course-card__meta">
        <span className="course-card__meta-item">
          <FiClock />
          {course.duration}
        </span>
        <span className="course-card__meta-item">
          <FiTrendingUp />
          {course.level}
        </span>
      </div>
    </a>
  )
}
