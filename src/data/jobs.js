import { companies } from './companies.js'

export const jobFilters = [
  { id: 'all', label: 'Barchasi', icon: 'briefcase' },
  { id: 'full', label: "To'liq stavka", icon: 'clock' },
  { id: 'part', label: 'Qisman stavka', icon: 'clock' },
  { id: 'remote', label: 'Masofaviy ish', icon: 'home' },
  { id: 'intern', label: 'Stajirovka', icon: 'grad' },
]

const jobTypes = [
  { type: 'full', typeLabel: "To'liq stavka", typeTone: 'pink' },
  { type: 'part', typeLabel: 'Qisman stavka', typeTone: 'green' },
  { type: 'remote', typeLabel: 'Masofaviy ish', typeTone: 'blue' },
  { type: 'intern', typeLabel: 'Stajirovka', typeTone: 'purple' },
]

const titles = [
  'SMM mutaxassisi',
  'HR menejer',
  'Frontend dasturchi',
  'Backend dasturchi',
  'Sotuv konsultanti',
  'Marketing stajyori',
  'Call-markaz operatori',
  'Kontent menejer',
  'Mobil dasturchi',
  'Dizayner (UI/UX)',
  'Buxgalter',
  'Ofis menejeri',
  'Loyiha menejeri',
  'QA muhandisi',
  'Data analitik',
  'Produkt menejer',
  'PR mutaxassisi',
  'Kadrlar bo‘yicha mutaxassis',
  'Mijozlar bilan ishlash bo‘yicha menejer',
  'Logistika mutaxassisi',
  'Moliyaviy analitik',
  'Biznes-analitik',
  'DevOps muhandisi',
  'Grafik dizayner',
  'Video montajchi',
  'Copywriter',
  'Recruitment specialist',
  'Adminstrator',
  'Kassir',
  'Ombor mudiri',
  'Huquqshunos',
  'O‘qituvchi (online)',
  'Tarjimon',
  'Sotuv menejeri',
  'Brand menejer',
  'Email marketing mutaxassisi',
  'SEO mutaxassisi',
  'Support mutaxassisi',
  'Android dasturchi',
  'iOS dasturchi',
]

const categories = [
  'Marketing',
  'HR',
  'IT',
  'Sotuv',
  'Mijozlar',
  'Moliya',
  'Dizayn',
  'Logistika',
  'Ta’lim',
  'Huquq',
]

const locations = [
  'Toshkent',
  'Samarqand',
  'Buxoro',
  'Namangan',
  'Andijon',
  'Farg‘ona',
  'Nukus',
  'Xorazm',
  'Qarshi',
  'Jizzax',
]

// Shahar markazlari — ofislar shu nuqta atrofida joylashtiriladi
const CITY_CENTERS = {
  Toshkent: { lat: 41.2995, lng: 69.2401, spreadKm: 8 },
  Samarqand: { lat: 39.6542, lng: 66.9597, spreadKm: 4 },
  Buxoro: { lat: 39.7747, lng: 64.4286, spreadKm: 4 },
  Namangan: { lat: 40.9983, lng: 71.6726, spreadKm: 4 },
  Andijon: { lat: 40.7821, lng: 72.3442, spreadKm: 4 },
  'Farg‘ona': { lat: 40.3864, lng: 71.7864, spreadKm: 4 },
  Nukus: { lat: 42.4531, lng: 59.6103, spreadKm: 4 },
  Xorazm: { lat: 41.55, lng: 60.6333, spreadKm: 4 },
  Qarshi: { lat: 38.8606, lng: 65.7891, spreadKm: 4 },
  Jizzax: { lat: 40.1158, lng: 67.8422, spreadKm: 4 },
}

/** Ofis koordinatasi: id bo'yicha har doim bir xil, masofaviy ishlarda null */
function buildCoords(location, type, id) {
  const center = CITY_CENTERS[location]
  if (!center || type === 'remote') return null
  const angle = (id * 137.508 * Math.PI) / 180
  const distKm = Math.sqrt(((id * 7919) % 1000) / 1000) * center.spreadKm
  return {
    lat: center.lat + (distKm / 111) * Math.sin(angle),
    lng: center.lng + (distKm / (111 * Math.cos((center.lat * Math.PI) / 180))) * Math.cos(angle),
  }
}

function pad2(value) {
  return String(value).padStart(2, '0')
}

/** Professional display: DD.MM.YYYY HH:MM */
export function formatPostedAt(date) {
  const d = date instanceof Date ? date : new Date(date)
  return `${pad2(d.getDate())}.${pad2(d.getMonth() + 1)}.${d.getFullYear()} ${pad2(d.getHours())}:${pad2(d.getMinutes())}`
}

function buildPostedAt(index) {
  const date = new Date()
  date.setSeconds(0, 0)
  date.setDate(date.getDate() - (index % 14))
  date.setHours(9 + (index % 10), (index * 7) % 60, 0, 0)
  return formatPostedAt(date)
}

const salaries = [
  '6 000 000 - 10 000 000 so‘m',
  '4 000 000 - 7 000 000 so‘m',
  '8 000 000 - 15 000 000 so‘m',
  '3 000 000 - 5 000 000 so‘m',
  'Kelishiladi',
]

const experiences = ['Tajriba shart emas', '1-3 yil', '3-5 yil', '5+ yil']
const hours = ['09:00 - 18:00', '10:00 - 19:00', 'Moslashuvchan', 'Smena']
const workModes = ['Onlayn va oflayn', 'Faqat ofis', 'Masofaviy', 'Gibrid']
const levels = ["O'rta daraja", 'Junior', 'Senior', 'Lead']

const companyMeta = {
  korzinka: {
    industry: 'Chakana savdo',
    about:
      "Korzinka — O‘zbekistondagi eng yirik chakana savdo tarmoqlaridan biri. Biz mijozlarga sifatli mahsulotlar va qulay xizmatni taqdim etamiz.",
    stats: [
      { label: '12+ yil', sub: 'Bozorda' },
      { label: '1000+', sub: 'Xodimlar' },
      { label: '50+', sub: "Do'konlar" },
    ],
    quote: 'Yaxshi mahsulotlar orqali odamlar hayotini yaxshilaymiz.',
    bannerText: 'Yaxshilik har kuni yaqinroq',
    bannerImage: '/images/jobs/korzinka-banner.jpg',
    gallery: [
      '/images/jobs/gallery-1.jpg',
      '/images/jobs/gallery-2.jpg',
      '/images/jobs/gallery-3.jpg',
    ],
  },
}

function defaultCompanyMeta(company) {
  return (
    companyMeta[company.id] || {
      industry: 'Kompaniya',
      about: `${company.name} jamoasi malakali mutaxassislarni izlaydi. Biz bilan o‘sish va professional rivojlanish imkoniyatiga ega bo‘ling.`,
      stats: [
        { label: '5+ yil', sub: 'Bozorda' },
        { label: '100+', sub: 'Xodimlar' },
        { label: '10+', sub: 'Filiallar' },
      ],
      quote: 'Birgalikda natijaga erishamiz.',
      bannerText: company.name,
      bannerImage: null,
      gallery: [],
    }
  )
}

function buildDetail(job) {
  const meta = defaultCompanyMeta({ id: job.companyId, name: job.company })
  return {
    views: 800 + ((job.id * 37) % 900),
    salary: salaries[job.id % salaries.length],
    experience: experiences[job.id % experiences.length],
    hours: hours[job.id % hours.length],
    workMode: workModes[job.id % workModes.length],
    level: levels[job.id % levels.length],
    description: `${job.company} kompaniyasida «${job.title}» lavozimi uchun ochiq vakansiya. Jamoamizga ijodiy, mas’uliyatli va natijaga yo‘naltirilgan mutaxassisni qidiramiz. Siz marketing/kommunikatsiya yo‘nalishida brendni rivojlantirishda ishtirok etasiz.`,
    tasks: [
      'Ijtimoiy tarmoqlar uchun kontent rejasini tuzish va amalga oshirish',
      'Post, stories va reklamalar dizaynini nazorat qilish',
      'Auditoriya bilan muloqot va analitika hisobotlarini yuritish',
      'Kampaniyalar samaradorligini oshirish bo‘yicha takliflar berish',
      'Ichki jamoalar bilan hamkorlikda brend ovozini saqlash',
    ],
    requirements: [
      'SMM yoki digital marketing bo‘yicha kamida 1 yillik tajriba',
      'Instagram, Telegram, Facebook bilan ishlash ko‘nikmasi',
      'Canva / Figma / CapCut dasturlarini bilish',
      'Yozma savodxonlik (o‘zbek / rus)',
      'Jamoada ishlash va muddatlarga rioya qilish',
    ],
    offers: [
      'Raqobatbardosh maosh va bonus tizimi',
      'Rasmiy mehnat shartnomasi',
      'O‘quv va rivojlanish dasturlari',
      'Do‘stona jamoa va zamonaviy ofis',
      'Dam olish kunlari va bayramlar',
    ],
    companyMeta: meta,
  }
}

function buildJobs(count) {
  const list = []

  for (let i = 0; i < count; i += 1) {
    const company = companies[i % companies.length]
    const jobType = jobTypes[i % jobTypes.length]
    const title = titles[i % titles.length]
    const category = categories[i % categories.length]
    const location = locations[i % locations.length]
    const postedAt = buildPostedAt(i)

    const base = {
      id: i + 1,
      title,
      company: company.name,
      companyId: company.id,
      companyColor: company.color,
      logo: company.logo,
      verified: company.verified,
      location,
      type: jobType.type,
      typeLabel: jobType.typeLabel,
      typeTone: jobType.typeTone,
      category,
      postedAt,
      postedAgo: postedAt,
      coords: buildCoords(location, jobType.type, i + 1),
    }

    list.push({ ...base, ...buildDetail(base) })
  }

  return list
}

export const jobs = buildJobs(100)

// Screenshot 1:1 demo — Korzinka SMM
const demo = jobs.find((j) => j.companyId === 'korzinka')
if (demo) {
  Object.assign(demo, {
    title: 'SMM mutaxassisi',
    category: 'Marketing',
    location: 'Toshkent',
    type: 'full',
    coords: buildCoords('Toshkent', 'full', demo.id),
    typeLabel: "To'liq stavka",
    typeTone: 'pink',
    postedAt: buildPostedAt(2),
    postedAgo: buildPostedAt(2),
    views: 1250,
    salary: '6 000 000 - 10 000 000 so‘m',
    experience: '1-3 yil',
    hours: '09:00 - 18:00',
    workMode: 'Onlayn va oflayn',
    level: "O'rta daraja",
    description:
      "Korzinka brendining ijtimoiy tarmoqlardagi mavjudligini rivojlantirish, auditoriya bilan muloqotni kuchaytirish va marketing kampaniyalarini boshqarish. Kreativ yondashuv va analitika asosida natijaga erishish sizning asosiy vazifangiz bo‘ladi.",
    tasks: [
      'Instagram, Telegram va Facebook uchun kontent-rejani ishlab chiqish',
      'Vizual va matn materiallarini tayyorlash / nazorat qilish',
      'Target reklama kampaniyalarini yo‘lga qo‘yish',
      'Haftalik va oylik analitika hisobotlarini taqdim etish',
      'Ichki marketing jamoasi bilan hamkorlik qilish',
    ],
    requirements: [
      'SMM sohasida 1–3 yillik amaliy tajriba',
      'Kontent yaratish va auditoriya bilan ishlash ko‘nikmasi',
      'Canva, CapCut, Meta Ads bilimi',
      'O‘zbek va rus tillarida savodxon yozish',
      'Mas’uliyat va muddatlarga rioya qilish',
    ],
    offers: [
      'Maosh: 6–10 mln so‘m + bonus',
      'Rasmiy ishga joylash',
      'O‘quv kurslari va mentorlik',
      'Zamonaviy ofis (Toshkent)',
      'Jamoa tadbirlari va imtiyozlar',
    ],
  })
}

export function getJobById(id) {
  const numeric = Number(id)
  return jobs.find((job) => job.id === numeric) ?? jobs.find((j) => j.companyId === 'korzinka') ?? jobs[0]
}

export function getSimilarJobs(job, limit = 6) {
  return jobs
    .filter((item) => item.id !== job.id && (item.category === job.category || item.type === job.type))
    .slice(0, limit)
}

export function getRelatedJobs(job, limit = 3) {
  return jobs.filter((item) => item.id !== job.id && item.companyId !== job.companyId).slice(0, limit)
}
