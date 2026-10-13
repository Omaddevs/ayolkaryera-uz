// Leaflet va Yandex xaritalari uchun umumiy marker belgilari va yordamchilar

export const UZBEKISTAN_VIEW = { center: { lat: 41.2, lng: 64.6 }, zoom: 6 }

export function currentTheme() {
  return document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light'
}

export function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, (ch) => `&#${ch.charCodeAt(0)};`)
}

export function pinHtml(job) {
  const logo = job.logo
    ? `<img src="${escapeHtml(job.logo)}?v=2" alt="" loading="lazy" decoding="async" />`
    : `<span style="background:${escapeHtml(job.companyColor)}">${escapeHtml(job.company.charAt(0))}</span>`
  return `<div class="jm-pin"><div class="jm-pin__badge">${logo}</div></div>`
}

export const USER_HTML =
  '<div class="jm-user"><span class="jm-user__pulse"></span><span class="jm-user__dot"></span></div>'

/** Radiusga mos taxminiy zoom — birinchi kadrdanoq kerakli hudud yuklanadi */
export function initialView(origin, radiusKm) {
  if (!origin) return UZBEKISTAN_VIEW
  const zoom = radiusKm ? Math.round(14 - Math.log2(radiusKm / 1.5)) : 11
  return { center: origin, zoom: Math.min(15, Math.max(6, zoom)) }
}
