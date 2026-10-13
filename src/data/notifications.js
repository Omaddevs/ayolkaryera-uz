import { jobs } from './jobs.js'

const MIN = 60 * 1000
const HOUR = 60 * MIN
const DAY = 24 * HOUR

/** 7 kundan eski bildirishnomalar "Eski" bo'limiga tushadi */
export const OLD_AFTER_MS = 7 * DAY

export const NOTIFICATION_TYPES = {
  application: { label: 'Ariza holati', tone: 'pink' },
  interview: { label: 'Suhbat', tone: 'violet' },
  match: { label: 'Mos vakansiya', tone: 'blue' },
  message: { label: 'Xabar', tone: 'green' },
  offer: { label: 'Taklif', tone: 'amber' },
  deadline: { label: 'Muddat', tone: 'orange' },
  profile: { label: 'Profil', tone: 'teal' },
  system: { label: 'Tizim', tone: 'gray' },
}

const jobOf = (companyId) => jobs.find((job) => job.companyId === companyId) ?? jobs[0]

// Demo bildirishnomalar: vaqt sahifa ochilgan paytga nisbatan hisoblanadi
const SEED = [
  {
    id: 'n-interview-korzinka',
    type: 'interview',
    ago: 6 * MIN,
    company: 'korzinka',
    title: 'Suhbatga taklif qilindingiz',
    preview: 'Korzinka sizni ertaga 15:00 da onlayn suhbatga taklif qildi.',
    body: "Assalomu alaykum! «{job}» lavozimi bo'yicha arizangiz ko'rib chiqildi va sizni ertaga soat 15:00 da onlayn suhbatga taklif qilamiz. Suhbat Google Meet orqali o'tadi, havola xabarlar bo'limida yuboriladi. Iltimos, ishtirokingizni tasdiqlang.",
    action: { label: 'Suhbatni ochish', kind: 'chat' },
  },
  {
    id: 'n-application-tbc',
    type: 'application',
    ago: 42 * MIN,
    company: 'tbc',
    title: 'Arizangiz ko\'rib chiqildi',
    preview: 'TBC Bank «{job}» bo\'yicha arizangizni keyingi bosqichga o\'tkazdi.',
    body: "Tabriklaymiz! TBC Bank «{job}» lavozimi bo'yicha arizangizni keyingi bosqichga o'tkazdi. Yaqin kunlarda HR mutaxassisi siz bilan bog'lanadi. Profilingiz va rezyumeingiz yangilanganligiga ishonch hosil qiling.",
    action: { label: 'Vakansiyani ko\'rish', kind: 'job' },
  },
  {
    id: 'n-match-uzbektelecom',
    type: 'match',
    ago: 2 * HOUR,
    company: 'uzbektelecom',
    title: 'Siz uchun yangi vakansiya',
    preview: '«{job}» — profilingizga 92% mos keladi.',
    body: "Uzbektelecom kompaniyasida «{job}» lavozimi uchun yangi vakansiya e'lon qilindi. Ko'nikmalaringiz va tajribangiz bu vakansiyaga 92% mos keladi. Erta ariza topshirganlar ko'proq e'tiborga tushadi.",
    action: { label: 'Vakansiyani ko\'rish', kind: 'job' },
  },
  {
    id: 'n-message-artel',
    type: 'message',
    ago: 5 * HOUR,
    company: 'artel',
    title: 'Artel\'dan yangi xabar',
    preview: '«Ofisga tashrif buyurishingiz mumkin, manzilni yubordik.»',
    body: "Artel HR bo'limi sizga xabar yubordi: «Ofisga tashrif buyurishingiz mumkin, manzil va vaqtni xabarda yubordik. Savollaringiz bo'lsa, shu yerda yozing.»",
    action: { label: 'Xabarni ochish', kind: 'chat' },
  },
  {
    id: 'n-profile-views',
    type: 'profile',
    ago: 26 * HOUR,
    read: true,
    title: 'Profilingizni 5 ta kompaniya ko\'rdi',
    preview: 'So\'nggi 24 soatda profilingiz ko\'rishlari 38% ga oshdi.',
    body: "So'nggi 24 soatda profilingizni 5 ta kompaniya, jumladan Uzum va Click ko'rib chiqdi. Profil ko'rishlari 38% ga oshdi. Ko'nikmalar bo'limini to'ldirsangiz, yanada ko'proq ish beruvchilar sizni topadi.",
    action: { label: 'Profilni ochish', kind: 'profile' },
  },
  {
    id: 'n-deadline-beeline',
    type: 'deadline',
    ago: 2 * DAY,
    company: 'beeline',
    title: 'Saqlangan vakansiya muddati tugayapti',
    preview: '«{job}» uchun ariza qabul qilish 2 kundan keyin yopiladi.',
    body: "Siz saqlagan «{job}» (Beeline) vakansiyasi uchun ariza qabul qilish 2 kundan keyin yopiladi. Agar qiziqsangiz, hoziroq ariza topshiring.",
    action: { label: 'Ariza topshirish', kind: 'job' },
  },
  {
    id: 'n-offer-uzum',
    type: 'offer',
    ago: 3 * DAY,
    read: true,
    company: 'uzum',
    title: 'Sizga ish taklifi keldi',
    preview: 'Uzum «{job}» lavozimi uchun taklif yubordi.',
    body: "Uzum kompaniyasi «{job}» lavozimi uchun sizga rasmiy ish taklifini yubordi. Taklif shartlari bilan xabarlar bo'limida tanishing va 5 kun ichida javob bering.",
    action: { label: 'Taklifni ko\'rish', kind: 'chat' },
  },
  {
    id: 'n-system-profile',
    type: 'system',
    ago: 5 * DAY,
    read: true,
    title: 'Profilingizni 80% gacha to\'ldiring',
    preview: 'To\'liq profillar 3 barobar ko\'proq taklif oladi.',
    body: "Profilingiz 64% to'ldirilgan. Tajriba va ta'lim bo'limlarini to'ldirib, rezyume yuklasangiz, ish beruvchilardan 3 barobar ko'proq taklif olasiz.",
    action: { label: 'Profilni to\'ldirish', kind: 'profile' },
  },
  {
    id: 'n-application-ucell',
    type: 'application',
    ago: 9 * DAY,
    read: true,
    company: 'ucell',
    title: 'Ariza qabul qilindi',
    preview: 'Ucell «{job}» bo\'yicha arizangizni qabul qildi.',
    body: "Ucell «{job}» lavozimi bo'yicha arizangizni qabul qildi. Ko'rib chiqish odatda 5–7 ish kuni davom etadi.",
    action: { label: 'Vakansiyani ko\'rish', kind: 'job' },
  },
  {
    id: 'n-match-click',
    type: 'match',
    ago: 12 * DAY,
    company: 'click',
    title: 'Haftalik mos vakansiyalar',
    preview: 'Bu hafta sizga mos 14 ta yangi vakansiya topildi.',
    body: "Bu hafta profilingizga mos 14 ta yangi vakansiya topildi, jumladan Click kompaniyasidagi «{job}» lavozimi.",
    action: { label: 'Vakansiyalarni ko\'rish', kind: 'jobs' },
  },
  {
    id: 'n-system-security',
    type: 'system',
    ago: 20 * DAY,
    read: true,
    title: 'Yangi qurilmadan kirildi',
    preview: 'iPhone, Toshkent — agar bu siz bo\'lmasangiz, parolni o\'zgartiring.',
    body: "Hisobingizga yangi qurilmadan (iPhone, Toshkent) kirildi. Agar bu siz bo'lmasangiz, darhol parolni o'zgartiring va barcha seanslarni yakunlang.",
    action: { label: 'Xavfsizlik sozlamalari', kind: 'profile' },
  },
  {
    id: 'n-application-payme',
    type: 'application',
    ago: 31 * DAY,
    read: true,
    company: 'payme',
    title: 'Ariza holati yangilandi',
    preview: 'Payme boshqa nomzodni tanladi. Omad keyingi safar!',
    body: "Afsuski, Payme «{job}» lavozimi uchun boshqa nomzodni tanladi. Bu tajribangizni kamaytirmaydi — sizga mos boshqa vakansiyalarni ko'rib chiqing.",
    action: { label: 'O\'xshash vakansiyalar', kind: 'jobs' },
  },
]

const fill = (text, job) => (job ? text.replaceAll('{job}', job.title) : text)

export function buildNotifications(now = Date.now()) {
  return SEED.map((item) => {
    const job = item.company ? jobOf(item.company) : null
    return {
      ...item,
      job,
      createdAt: now - item.ago,
      preview: fill(item.preview, job),
      body: fill(item.body, job),
    }
  })
}
