const baseCompanies = [
  {
    id: 'uzbektelecom',
    name: 'Uzbektelecom',
    adsCount: 12,
    verified: true,
    logo: '/images/companies/uzbektelecom.svg',
    color: '#0055a5',
  },
  {
    id: 'korzinka',
    name: 'Korzinka',
    adsCount: 8,
    verified: true,
    logo: '/images/companies/korzinka.svg',
    color: '#e0212b',
  },
  {
    id: 'tbc',
    name: 'TBC Bank',
    adsCount: 15,
    verified: true,
    logo: '/images/companies/tbc.svg',
    color: '#00a0e3',
  },
  {
    id: 'beeline',
    name: 'Beeline',
    adsCount: 6,
    verified: true,
    logo: '/images/companies/beeline.svg',
    color: '#ffcc00',
  },
  {
    id: 'artel',
    name: 'Artel',
    adsCount: 9,
    verified: true,
    logo: '/images/companies/artel.svg',
    color: '#0c3a26',
  },
  {
    id: 'ucell',
    name: 'Ucell',
    adsCount: 7,
    verified: true,
    logo: '/images/companies/ucell.svg',
    color: '#6c2c91',
  },
  {
    id: 'uzum',
    name: 'Uzum',
    adsCount: 18,
    verified: true,
    color: '#7000ff',
  },
  {
    id: 'click',
    name: 'Click',
    adsCount: 11,
    verified: true,
    color: '#00a651',
  },
  {
    id: 'payme',
    name: 'Payme',
    adsCount: 10,
    verified: true,
    color: '#00bcd4',
  },
  {
    id: 'epig',
    name: 'EPIG',
    adsCount: 5,
    verified: true,
    color: '#1a237e',
  },
  {
    id: 'humans',
    name: 'Humans',
    adsCount: 14,
    verified: true,
    color: '#e91e63',
  },
  {
    id: 'yandex',
    name: 'Yandex Go',
    adsCount: 16,
    verified: true,
    color: '#fc3f1d',
  },
  {
    id: 'mytaxi',
    name: 'MyTaxi',
    adsCount: 9,
    verified: true,
    color: '#ff6b00',
  },
  {
    id: 'express24',
    name: 'Express24',
    adsCount: 13,
    verified: true,
    color: '#ff5722',
  },
  {
    id: 'mediapark',
    name: 'MediaPark',
    adsCount: 7,
    verified: true,
    color: '#2196f3',
  },
  {
    id: 'texnomart',
    name: 'Texnomart',
    adsCount: 11,
    verified: true,
    color: '#f44336',
  },
  {
    id: 'makro',
    name: 'Makro',
    adsCount: 8,
    verified: true,
    color: '#4caf50',
  },
  {
    id: 'havas',
    name: 'Havas',
    adsCount: 6,
    verified: true,
    color: '#9c27b0',
  },
  {
    id: 'ipoteka',
    name: 'Ipoteka Bank',
    adsCount: 12,
    verified: true,
    color: '#1565c0',
  },
  {
    id: 'kapitalbank',
    name: 'Kapitalbank',
    adsCount: 10,
    verified: true,
    color: '#c62828',
  },
  {
    id: 'nbu',
    name: 'NBU',
    adsCount: 9,
    verified: true,
    color: '#0d47a1',
  },
  {
    id: 'sqb',
    name: 'SQB',
    adsCount: 7,
    verified: false,
    color: '#00695c',
  },
  {
    id: 'asaxiy',
    name: 'Asaxiy',
    adsCount: 14,
    verified: true,
    color: '#ff9800',
  },
  {
    id: 'olx',
    name: 'OLX',
    adsCount: 5,
    verified: true,
    color: '#3a77ff',
  },
  {
    id: 'imy',
    name: 'iMY',
    adsCount: 8,
    verified: true,
    color: '#673ab7',
  },
  {
    id: 'softclub',
    name: 'SoftClub',
    adsCount: 11,
    verified: true,
    color: '#00897b',
  },
  {
    id: 'epamus',
    name: 'Epam',
    adsCount: 17,
    verified: true,
    color: '#39c2d7',
  },
  {
    id: 'uzairways',
    name: 'Uzbekistan Airways',
    adsCount: 6,
    verified: true,
    color: '#1b5e20',
  },
  {
    id: 'silkroad',
    name: 'Silk Road Bank',
    adsCount: 4,
    verified: false,
    color: '#5d4037',
  },
  {
    id: 'anorbank',
    name: 'Anorbank',
    adsCount: 9,
    verified: true,
    color: '#d32f2f',
  },
  {
    id: 'hamkorbank',
    name: 'Hamkorbank',
    adsCount: 8,
    verified: true,
    color: '#2e7d32',
  },
  {
    id: 'orient',
    name: 'Orient Finans',
    adsCount: 5,
    verified: false,
    color: '#455a64',
  },
]

const detailOverrides = {
  korzinka: {
    tagline: "O'zbekistonning yetakchi chakana savdo tarmog'i",
    location: "Toshkent, O'zbekiston",
    city: 'Toshkent',
    website: 'https://korzinka.uz',
    industry: 'Chakana savdo',
    years: '12+',
    employees: '1000+',
    reviews: 124,
    bannerImage: '/images/jobs/korzinka-banner.jpg',
    bannerSlogan: 'Har kuni yanada yaxshiroq',
    about:
      "Korzinka — O‘zbekistondagi eng yirik chakana savdo tarmoqlaridan biri. Biz mijozlarga sifatli mahsulotlar va qulay xizmatni taqdim etamiz.",
    similarIds: ['makro', 'havas', 'asaxiy', 'texnomart'],
  },
  uzbektelecom: {
    tagline: 'Milliy telekommunikatsiya operatori',
    location: "Toshkent, O'zbekiston",
    city: 'Toshkent',
    website: 'https://uztelecom.uz',
    industry: 'Telekom',
    years: '30+',
    employees: '5000+',
    reviews: 210,
    similarIds: ['beeline', 'ucell', 'humans'],
  },
  tbc: {
    tagline: 'Zamonaviy bank xizmatlari',
    location: "Toshkent, O'zbekiston",
    city: 'Toshkent',
    website: 'https://tbcbank.uz',
    industry: 'Bank',
    years: '10+',
    employees: '2000+',
    reviews: 180,
    similarIds: ['kapitalbank', 'ipoteka', 'nbu'],
  },
}

function enrichCompany(company) {
  const extra = detailOverrides[company.id] || {}
  return {
    tagline: `${company.name} — ishonchli ish beruvchi`,
    location: "Toshkent, O'zbekiston",
    city: 'Toshkent',
    website: `https://${company.id}.uz`,
    industry: 'Biznes',
    years: '5+',
    employees: '100+',
    reviews: 40 + (company.name.length * 7) % 90,
    bannerImage: null,
    bannerSlogan: company.name,
    about: `${company.name} jamoasi malakali mutaxassislar bilan ishlashni qadrlaydi. Bizda o‘sish va professional rivojlanish imkoniyatlari mavjud.`,
    similarIds: [],
    ...company,
    ...extra,
  }
}

export const companies = baseCompanies.map(enrichCompany)

export function getCompanyById(id) {
  return companies.find((c) => c.id === id) ?? companies.find((c) => c.id === 'korzinka') ?? companies[0]
}

export function getSimilarCompanies(company, limit = 4) {
  if (company.similarIds?.length) {
    const mapped = company.similarIds
      .map((id) => companies.find((c) => c.id === id))
      .filter(Boolean)
    if (mapped.length) return mapped.slice(0, limit)
  }
  return companies.filter((c) => c.id !== company.id).slice(0, limit)
}

export function getTopCompanies(limit = 10) {
  return companies.slice(0, limit)
}
