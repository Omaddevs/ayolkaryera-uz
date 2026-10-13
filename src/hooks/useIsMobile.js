import useMediaQuery from './useMediaQuery.js'

/** Mobil ilova ko'rinishi (pastki navigatsiya, mobil header va ekranlar) uchun chegara */
export const MOBILE_QUERY = '(max-width: 767px)'

export default function useIsMobile() {
  return useMediaQuery(MOBILE_QUERY)
}
