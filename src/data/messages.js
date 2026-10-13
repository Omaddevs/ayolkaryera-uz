import { companies } from './companies.js'
import { jobs } from './jobs.js'

function companyById(id) {
  return companies.find((c) => c.id === id)
}

function jobsForCompany(companyName, limit = 3) {
  return jobs
    .filter((j) => j.company === companyName)
    .slice(0, limit)
    .map((j) => ({
      id: j.id,
      title: j.title,
      location: j.location,
      typeLabel: j.typeLabel,
      typeTone: j.typeTone,
    }))
}

const korzinka = companyById('korzinka')
const tbc = companyById('tbc')
const artel = companyById('artel')
const uzum = companyById('uzum')
const softclub = companyById('softclub')

export const messageFilters = [
  { id: 'all', label: 'Barchasi' },
  { id: 'employer', label: 'Ish beruvchilar' },
  { id: 'candidate', label: 'Nomzodlar' },
]

/** Seed conversations for the chat UI */
export const initialConversations = [
  {
    id: 'c-korzinka',
    peerType: 'employer',
    name: 'Korzinka',
    verified: true,
    avatar: korzinka?.logo,
    avatarColor: korzinka?.color || '#e0212b',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Oxirgi marta 5 daqiqa oldin',
    preview: 'Suhbatni boshlash uchun xabar yozing',
    timeLabel: '14:32',
    unread: 2,
    online: true,
    companyId: 'korzinka',
    about:
      "Korzinka — O'zbekistondagi yetakchi chakana savdo tarmog'i. Minglab xodimlar, zamonaviy do'konlar va barqaror o'sish imkoniyatlari.",
    stats: [
      { id: 'years', label: 'Bozorda', value: '12 yil', icon: 'calendar' },
      { id: 'staff', label: 'Xodimlar', value: '8 000+', icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: jobsForCompany('Korzinka', 3),
    media: [
      'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1578916171728-46686eac8d58?w=200&h=200&fit=crop',
    ],
    jobContext: {
      jobId: 1,
      title: 'SMM mutaxassisi',
      location: 'Toshkent',
      typeLabel: "To'liq stavka",
      typeTone: 'pink',
    },
    messages: [
      {
        id: 'm1',
        from: 'them',
        text: "Assalomu alaykum! «SMM mutaxassisi» vakansiyamizga qiziqishingiz uchun rahmat. Rezyumengizni ko'rib chiqdik.",
        time: '10:12',
        status: 'read',
      },
      {
        id: 'm2',
        from: 'me',
        text: "Va alaykum assalom! Qiziqish bildirganim uchun rahmat. Qo'shimcha ma'lumot kerak bo'lsa, yozing.",
        time: '10:18',
        status: 'read',
      },
      {
        id: 'm3',
        from: 'them',
        text: "Ajoyib. Iltimos, oxirgi ish tajribangiz haqida qisqacha yozing va CV faylini yuboring.",
        time: '10:24',
        status: 'read',
      },
      {
        id: 'm4',
        from: 'me',
        text: 'Albatta, CV ni yuboryapman.',
        time: '10:31',
        status: 'read',
      },
      {
        id: 'm5',
        from: 'me',
        time: '10:31',
        status: 'read',
        attachment: {
          name: 'CV_Omadbek.pdf',
          size: '245 KB',
          ext: 'PDF',
        },
      },
      {
        id: 'm6',
        from: 'them',
        text: "Rahmat! HR menejerimiz tez orada bog'lanadi. Suhbatni davom ettirish uchun xabar yozishingiz mumkin.",
        time: '14:32',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'c-tbc',
    peerType: 'employer',
    name: 'TBC Bank',
    verified: true,
    avatar: tbc?.logo,
    avatarColor: tbc?.color || '#00a0e3',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Oxirgi marta 1 soat oldin',
    preview: 'Intervyu sanasini tasdiqlay olasizmi?',
    timeLabel: 'Kecha',
    unread: 1,
    online: false,
    companyId: 'tbc',
    about:
      'TBC Bank — raqamli bank xizmatlari va innovatsion moliyaviy yechimlar bo‘yicha yetakchi brend.',
    stats: [
      { id: 'years', label: 'Bozorda', value: '8 yil', icon: 'calendar' },
      { id: 'staff', label: 'Xodimlar', value: '3 500+', icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: jobsForCompany('TBC Bank', 3),
    media: [
      'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1556742502-ec7c0e9f34b1?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=200&h=200&fit=crop',
      'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=200&h=200&fit=crop',
    ],
    jobContext: {
      jobId: 2,
      title: 'HR menejer',
      location: 'Toshkent',
      typeLabel: "To'liq stavka",
      typeTone: 'pink',
    },
    messages: [
      {
        id: 't1',
        from: 'them',
        text: 'Assalomu alaykum! Arizangiz qabul qilindi. Intervyu sanasini tasdiqlay olasizmi?',
        time: '16:40',
        status: 'delivered',
      },
    ],
  },
  {
    id: 'c-madina',
    peerType: 'candidate',
    name: 'Madina R.',
    verified: false,
    avatar:
      'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&h=200&fit=crop&crop=faces',
    avatarColor: '#ff2d87',
    roleLabel: 'Nomzod',
    lastSeen: 'Hozir onlayn',
    preview: 'Portfolio havolasini yubordim',
    timeLabel: '12:05',
    unread: 0,
    online: true,
    about:
      'Marketing va kontent yo‘nalishida 3 yillik tajriba. Brend ovozini yaratish va ijtimoiy tarmoqlarni rivojlantirishga ixtisoslashgan.',
    stats: [
      { id: 'exp', label: 'Tajriba', value: '3 yil', icon: 'calendar' },
      { id: 'role', label: 'Lavozim', value: 'SMM', icon: 'users' },
      { id: 'city', label: 'Shahar', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: [],
    media: [],
    jobContext: null,
    messages: [
      {
        id: 'n1',
        from: 'them',
        text: 'Assalomu alaykum! Vakansiyangizga ariza topshirdim. Portfolio havolasini yubordim.',
        time: '12:05',
        status: 'read',
      },
      {
        id: 'n2',
        from: 'me',
        text: 'Rahmat, ko‘rib chiqaman. Tez orada javob beraman.',
        time: '12:20',
        status: 'read',
      },
    ],
  },
  {
    id: 'c-artel',
    peerType: 'employer',
    name: 'Artel',
    verified: true,
    avatar: artel?.logo,
    avatarColor: artel?.color || '#0c3a26',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Oxirgi marta kecha',
    preview: 'Ofisga tashrif buyurishingiz mumkin',
    timeLabel: 'Du',
    unread: 0,
    online: false,
    companyId: 'artel',
    about: 'Artel — mahalliy ishlab chiqarish va texnika sohasidagi yirik kompaniya.',
    stats: [
      { id: 'years', label: 'Bozorda', value: '15 yil', icon: 'calendar' },
      { id: 'staff', label: 'Xodimlar', value: '10 000+', icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: jobsForCompany('Artel', 2),
    media: [],
    jobContext: {
      jobId: 4,
      title: 'Sotuv konsultanti',
      location: 'Samarqand',
      typeLabel: "To'liq stavka",
      typeTone: 'pink',
    },
    messages: [
      {
        id: 'a1',
        from: 'them',
        text: 'Salom! Dushanba kuni soat 11:00 da ofisga tashrif buyurishingiz mumkin.',
        time: '09:15',
        status: 'read',
      },
      {
        id: 'a2',
        from: 'me',
        text: 'Yaxshi, kelaman. Rahmat!',
        time: '09:40',
        status: 'read',
      },
    ],
  },
  {
    id: 'c-uzum',
    peerType: 'employer',
    name: 'Uzum',
    verified: true,
    avatar: null,
    avatarColor: uzum?.color || '#7000ff',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Oxirgi marta 3 soat oldin',
    preview: 'Test topshirig‘ini yuboring',
    timeLabel: '11:48',
    unread: 0,
    online: false,
    companyId: 'uzum',
    about: 'Uzum — e-commerce va fintech ekotizimi. Tez o‘suvchi jamoa va zamonaviy mahsulotlar.',
    stats: [
      { id: 'years', label: 'Bozorda', value: '4 yil', icon: 'calendar' },
      { id: 'staff', label: 'Xodimlar', value: '2 000+', icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: jobsForCompany('Uzum', 3),
    media: [],
    jobContext: {
      jobId: 3,
      title: 'Frontend dasturchi',
      location: 'Toshkent',
      typeLabel: 'Masofaviy ish',
      typeTone: 'blue',
    },
    messages: [
      {
        id: 'u1',
        from: 'them',
        text: 'Assalomu alaykum! Texnik test topshirig‘ini yuboring, iltimos.',
        time: '11:48',
        status: 'read',
      },
    ],
  },
  {
    id: 'c-softclub',
    peerType: 'employer',
    name: 'SoftClub',
    verified: true,
    avatar: null,
    avatarColor: softclub?.color || '#00897b',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Oxirgi marta 2 kun oldin',
    preview: 'Portfolio ko‘rib chiqildi',
    timeLabel: '28.03',
    unread: 0,
    online: false,
    companyId: 'softclub',
    about: 'SoftClub — dasturiy ta’minot ishlab chiqish va IT konsalting kompaniyasi.',
    stats: [
      { id: 'years', label: 'Bozorda', value: '7 yil', icon: 'calendar' },
      { id: 'staff', label: 'Xodimlar', value: '120+', icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'Toshkent', icon: 'map' },
    ],
    activeJobs: jobsForCompany('SoftClub', 2),
    media: [],
    jobContext: null,
    messages: [
      {
        id: 's1',
        from: 'them',
        text: 'Portfolioingizni ko‘rib chiqdik. Keyingi bosqich haqida xabar beramiz.',
        time: '18:02',
        status: 'read',
      },
    ],
  },
]

export function buildCompanyConversation(company, job = null) {
  const activeJobs = jobsForCompany(company.name, 3)
  const jobContext = job
    ? {
        jobId: job.id,
        title: job.title,
        location: job.location,
        typeLabel: job.typeLabel,
        typeTone: job.typeTone,
      }
    : activeJobs[0]
      ? {
          jobId: activeJobs[0].id,
          title: activeJobs[0].title,
          location: activeJobs[0].location,
          typeLabel: activeJobs[0].typeLabel,
          typeTone: activeJobs[0].typeTone,
        }
      : null

  return {
    id: `c-new-${company.id}${job ? `-j${job.id}` : ''}`,
    peerType: 'employer',
    name: company.name,
    verified: Boolean(company.verified),
    avatar: company.logo || null,
    avatarColor: company.color || '#ff2d87',
    roleLabel: 'Ish beruvchi',
    lastSeen: 'Hozir onlayn',
    preview: 'Yangi suhbat',
    timeLabel: 'Hozir',
    unread: 0,
    online: true,
    companyId: company.id,
    about: `${company.name} kompaniyasi bilan to‘g‘ridan-to‘g‘ri muloqot qiling. Vakansiya bo‘yicha savollaringizni yozing.`,
    stats: [
      { id: 'years', label: 'Bozorda', value: '—', icon: 'calendar' },
      { id: 'ads', label: "E'lonlar", value: `${company.adsCount || 0}`, icon: 'users' },
      { id: 'hq', label: 'Ofis', value: 'O‘zbekiston', icon: 'map' },
    ],
    activeJobs,
    media: [],
    jobContext,
    messages: [
      {
        id: `sys-${company.id}`,
        from: 'them',
        text: job
          ? `Assalomu alaykum! «${job.title}» e'loni bo‘yicha yozishingiz mumkin. Savollaringizni qoldiring.`
          : `Assalomu alaykum! ${company.name} jamoasi bilan bog‘landingiz. Xabaringizni yozing.`,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        status: 'delivered',
      },
    ],
  }
}

export function buildCandidateConversation(candidate) {
  return {
    id: `c-cand-${candidate.id}`,
    peerType: 'candidate',
    name: candidate.name,
    verified: Boolean(candidate.premium),
    avatar: candidate.avatar || null,
    avatarColor: '#ff2d87',
    roleLabel: 'Nomzod',
    lastSeen: candidate.online ? 'Hozir onlayn' : 'Oxirgi marta yaqinda',
    preview: 'Yangi suhbat',
    timeLabel: 'Hozir',
    unread: 0,
    online: Boolean(candidate.online),
    about: candidate.about || '',
    stats: [
      { id: 'exp', label: 'Tajriba', value: candidate.experience || '—', icon: 'calendar' },
      { id: 'role', label: 'Lavozim', value: candidate.title || '—', icon: 'users' },
      { id: 'city', label: 'Shahar', value: candidate.location || '—', icon: 'map' },
    ],
    activeJobs: [],
    media: [],
    jobContext: null,
    messages: [
      {
        id: `sys-cand-${candidate.id}`,
        from: 'me',
        text: `Assalomu alaykum, ${candidate.name.split(' ')[0]}! Profilingizga qiziqdim. Suhbatni boshlash uchun yozing.`,
        time: new Date().toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' }),
        status: 'sent',
      },
    ],
  }
}

export function unreadTotal(conversations) {
  return conversations.reduce((sum, c) => sum + (c.unread || 0), 0)
}
