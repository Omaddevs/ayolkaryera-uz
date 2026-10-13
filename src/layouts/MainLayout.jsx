import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import TopBar from '../components/TopBar/TopBar.jsx'
import Navbar from '../components/Navbar/Navbar.jsx'
import Footer from '../components/Footer/Footer.jsx'
import MobileTopBar from '../components/mobile/MobileTopBar.jsx'
import BottomNav from '../components/mobile/BottomNav.jsx'
import useIsMobile from '../hooks/useIsMobile.js'

export default function MainLayout({ children }) {
  const { pathname, hash } = useLocation()
  const isMobile = useIsMobile()
  const hideFooter = pathname.startsWith('/xabarlar') || pathname.startsWith('/xarita')
  // Vakansiya sahifasining mobil ko'rinishida o'z yuqori paneli va pastki "Ariza" tugmasi bor
  const immersive = isMobile && pathname.startsWith('/ish/')
  // Mobilda footer ko'rsatilmaydi — ekranlar ilovadek ixcham
  const showFooter = !hideFooter && !isMobile

  // "/#reels" kabi havolalar — sahifa chizilgach o'sha bo'limga silliq aylantirish
  useEffect(() => {
    // Yangi sahifa tepadan ochiladi (oldingi sahifaning aylantirish joyi saqlanib qolmasin)
    if (!hash) {
      window.scrollTo({ top: 0, behavior: 'instant' })
      return undefined
    }
    let tries = 0
    let timer = 0
    const scrollToTarget = () => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      else if (tries++ < 10) timer = setTimeout(scrollToTarget, 100)
    }
    scrollToTarget()
    return () => clearTimeout(timer)
  }, [pathname, hash])

  useEffect(() => {
    document.body.classList.toggle('no-bottom-nav', immersive || !isMobile)
  }, [immersive, isMobile])

  return (
    <div className={`app ${hideFooter ? 'app--chat' : ''}`}>
      {!immersive && (
        <header className="app-header">
          {isMobile ? (
            <MobileTopBar />
          ) : (
            <>
              <TopBar />
              <Navbar />
            </>
          )}
        </header>
      )}
      <main>{children}</main>
      {showFooter ? <Footer /> : null}
      {isMobile && !immersive && <BottomNav />}
    </div>
  )
}
