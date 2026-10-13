export const currentUserProfile = {
  id: 'dilshoda-karimova',
  name: 'Dilshoda Karimova',
  title: 'Marketing mutaxassisi',
  verified: true,
  status: 'Faol qidiruvda',
  location: 'Toshkent, Yunusobod',
  email: 'dilshoda.k@email.com',
  phone: '+998 90 123 45 67',
  avatar:
    'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=400&h=400&fit=crop&crop=faces',
  bio: "2+ yillik marketing va brend rivojlantirish tajribasiga egaman. Kontent strategiya, SMM va raqamli kampaniyalarni rejalashtirishda kuchliman. Jamoa bilan ishlashni va natijaga yo‘naltirilgan yondashuvni qadrlayman.",
  stats: [
    { label: 'Ariza yuborilgan', value: 12 },
    { label: 'Saqlangan e’lonlar', value: 8 },
    { label: 'Profil ko‘rishlar', value: 248 },
    { label: 'Takliflar', value: 5 },
  ],
  personal: [
    { label: 'To‘liq ism', value: 'Dilshoda Karimova' },
    { label: 'Telefon', value: '+998 90 123 45 67' },
    { label: 'Email', value: 'dilshoda.k@email.com' },
    { label: 'Tug‘ilgan sana', value: '15.03.1998' },
    { label: 'Manzil', value: 'Toshkent, Yunusobod tumani' },
    { label: 'Fuqarolik', value: 'O‘zbekiston' },
  ],
  about:
    "Marketing sohasida 2 yildan ortiq tajribaga egaman. Brend pozitsiyalash, kontent yaratish va ijtimoiy tarmoqlar orqali auditoriyani jalb qilishda ishlayman. Maqsadim — ayollar uchun ochiq va qulay kasbiy imkoniyatlar yaratishga hissa qo‘shish.",
  skills: [
    'Marketing',
    'SMM',
    'Content Creation',
    'Adobe Photoshop',
    'Canva',
    'Google Analytics',
    'Copywriting',
    'Brand Strategy',
  ],
  languages: [
    { name: 'O‘zbek tili', level: 'Ona tili', flag: '🇺🇿' },
    { name: 'Rus tili', level: 'Erkin', flag: '🇷🇺' },
    { name: 'Ingliz tili', level: 'O‘rta', flag: '🇬🇧' },
  ],
  interests: ['Kitoblar', 'Sayohat', 'Fotografiya', 'Psixologiya', 'Dizayn', 'Yoga'],
  experience: [
    {
      role: 'Marketing mutaxassisi',
      company: 'Bright Media',
      years: '2023 — hozirgacha',
      points: [
        'Brend kontent strategiyasini ishlab chiqish',
        'SMM kampaniyalarni boshqarish',
        'Analitika va hisobotlar tayyorlash',
      ],
    },
    {
      role: 'SMM mutaxassisi',
      company: 'Nova Agency',
      years: '2022 — 2023',
      points: [
        'Kontent-plan tuzish va nashr qilish',
        'Reklama budjetini boshqarish',
        'Hamkorliklar va blogerlar bilan ishlash',
      ],
    },
  ],
  education: [
    {
      school: 'Toshkent Davlat Iqtisodiyot Universiteti',
      degree: 'Bakalavr — Marketing',
      years: '2016 — 2020',
    },
    {
      school: 'Digital Marketing Bootcamp',
      degree: 'Sertifikat — Performance Marketing',
      years: '2021',
    },
  ],
  activity: [
    {
      id: 1,
      title: 'Artel Group ga ariza yuborildi',
      meta: 'Marketing mutaxassisi',
      date: '12.09.2026',
      status: 'Ko‘rib chiqilmoqda',
      tone: 'pending',
    },
    {
      id: 2,
      title: 'Profilingiz ko‘rildi',
      meta: 'Uzum Market · HR',
      date: '11.09.2026',
      status: 'Ko‘rildi',
      tone: 'info',
    },
    {
      id: 3,
      title: 'E’lon saqlandi',
      meta: 'SMM mutaxassisi · Epigra',
      date: '10.09.2026',
      status: 'Saqlangan',
      tone: 'success',
    },
    {
      id: 4,
      title: 'Taklif kelib tushdi',
      meta: 'Content Manager · SoftClub',
      date: '08.09.2026',
      status: 'Yangi',
      tone: 'new',
    },
  ],
  completeness: {
    percent: 80,
    items: [
      { label: 'Shaxsiy ma’lumot', done: true },
      { label: 'Ish tajribasi', done: true },
      { label: 'Ta’lim', done: true },
      { label: 'Ko‘nikmalar', done: true },
      { label: 'Profil rasmi', done: false },
    ],
  },
  premiumBenefits: [
    'Yuqori ko‘rinish — ish beruvchilar oldida birinchi o‘rinda',
    'Batafsil statistika va profil tahlili',
    'Cheksiz ariza yuborish imkoniyati',
    'Premium holat belgisi',
  ],
}

export const profileNavItems = [
  { id: 'profile', label: 'Mening profilim', icon: 'user', to: '/profil' },
  { id: 'resume', label: 'Mening rezyumem', icon: 'file', to: '#' },
  { id: 'applications', label: 'Mening arizalarim', icon: 'send', to: '#' },
  { id: 'saved', label: 'Saqlangan e’lonlar', icon: 'heart', to: '/saqlanganlar' },
  { id: 'notifications', label: 'Bildirishnomalar', icon: 'bell', to: '/bildirishnomalar' },
  { id: 'messages', label: 'Xabarlar', icon: 'message', badge: 5, to: '/xabarlar' },
  { id: 'settings', label: 'Sozlamalar', icon: 'settings', to: '#' },
  { id: 'security', label: 'Hisob xavfsizligi', icon: 'shield', to: '#' },
  { id: 'help', label: 'Yordam', icon: 'help', to: '#' },
  { id: 'logout', label: 'Chiqish', icon: 'logout', to: '#', danger: true },
]

export const profileTabs = [
  { id: 'basic', label: 'Asosiy ma’lumot' },
  { id: 'experience', label: 'Tajriba' },
  { id: 'education', label: 'Ta’lim' },
  { id: 'skills', label: 'Ko‘nikmalar' },
  { id: 'resume', label: 'Rezyume' },
  { id: 'activity', label: 'Faoliyat' },
]
