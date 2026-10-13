import { useState } from 'react'
import Hero from '../components/Hero/Hero.jsx'
import CategoryGrid from '../components/CategoryGrid/CategoryGrid.jsx'
import AdBanner from '../components/AdBanner/AdBanner.jsx'
import PromoCarousel from '../components/PromoCarousel/PromoCarousel.jsx'
import HomeFeed from '../components/HomeFeed/HomeFeed.jsx'
import Reels from '../components/Reels/Reels.jsx'
import Campaigns from '../components/Campaigns/Campaigns.jsx'
import Courses from '../components/Courses/Courses.jsx'
import MobileHome from '../components/mobile/MobileHome.jsx'
import useIsMobile from '../hooks/useIsMobile.js'
import { banners } from '../data/banners.js'

export default function HomePage() {
  const [activeTab, setActiveTab] = useState('jobs')
  const isMobile = useIsMobile()

  // Mobilda bosh sahifa ixcham: Reels "+" menyusidagi alohida sahifada, kurslar va footer ko'rsatilmaydi
  if (isMobile) return <MobileHome />

  return (
    <>
      <Hero activeTab={activeTab} onTabChange={setActiveTab} />
      <CategoryGrid activeTab={activeTab} />
      <PromoCarousel />
      <HomeFeed />
      <Reels />
      <Campaigns />
      <Courses />
      <AdBanner banner={banners[1]} />
    </>
  )
}
