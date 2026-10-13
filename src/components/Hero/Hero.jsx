import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import './Hero.css'

const TABS = [
  { id: 'jobs', label: "Ish yo'nalishlari" },
  { id: 'companies', label: 'Kompaniyalar' },
  { id: 'courses', label: 'Kurslar', soon: true },
]

export default function Hero({ activeTab = 'jobs', onTabChange }) {
  const [pill, setPill] = useState({ left: 0, width: 0, ready: false })
  const tabsRef = useRef(null)
  const tabRefs = useRef({})

  const updatePill = useCallback(() => {
    const activeEl = tabRefs.current[activeTab]
    if (!activeEl) return

    setPill({
      left: activeEl.offsetLeft,
      width: activeEl.offsetWidth,
      ready: true,
    })
  }, [activeTab])

  useLayoutEffect(() => {
    updatePill()
  }, [updatePill])

  useEffect(() => {
    const tabsEl = tabsRef.current
    if (!tabsEl) return

    const observer = new ResizeObserver(() => updatePill())
    observer.observe(tabsEl)
    Object.values(tabRefs.current).forEach((el) => el && observer.observe(el))

    window.addEventListener('resize', updatePill)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', updatePill)
    }
  }, [updatePill])

  function onTabClick(tab) {
    onTabChange?.(tab.id)
    const target = document.querySelector('#kategoriyalar')
    if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <section className="hero">
      <div className="container hero__inner">
        <div className="hero__text">
          <h1 className="hero__title">Ish e&apos;lonlari O&apos;zbekistonda</h1>
          <p className="hero__subtitle">Ayollar uchun eng yaxshi imkoniyatlar</p>
        </div>

        <div className="hero__tabs" role="tablist" ref={tabsRef}>
          <span
            className={`hero__tab-pill${pill.ready ? ' hero__tab-pill--ready' : ''}`}
            style={{
              transform: `translateX(${pill.left}px)`,
              width: pill.width,
            }}
            aria-hidden="true"
          />

          {TABS.map((tab) => {
            const isActive = activeTab === tab.id
            return (
              <button
                key={tab.id}
                ref={(el) => {
                  tabRefs.current[tab.id] = el
                }}
                type="button"
                role="tab"
                aria-selected={isActive}
                disabled={tab.soon}
                title={tab.soon ? 'Tez orada' : undefined}
                className={`hero__tab${isActive ? ' hero__tab--active' : ''}${tab.soon ? ' hero__tab--soon' : ''}`}
                onClick={() => onTabClick(tab)}
              >
                {tab.label}
                {tab.soon && <span className="hero__tab-badge">Soon</span>}
              </button>
            )
          })}
        </div>
      </div>
    </section>
  )
}
