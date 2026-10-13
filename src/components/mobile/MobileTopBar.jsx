import { Link } from 'react-router-dom'
import { Globe, Moon, Sun } from 'lucide-react'
import LogoIcon from '../icons/LogoIcon.jsx'
import NotificationBell from '../NotificationBell.jsx'
import MenuSelect from '../ui/MenuSelect.jsx'
import { LANGUAGES } from '../../data/languages.js'
import { useLocalStorageState } from '../../hooks/useLocalStorageState.js'
import { useTheme } from '../../hooks/useTheme.js'
import './MobileTopBar.css'

// Har bir til o'z yozuvida va qisqa izoh bilan
const LANGUAGE_HINTS = { uz: 'Lotin yozuvi', 'uz-cyrl': 'Kirill yozuvi', ru: 'Rus tili', en: 'Ingliz tili' }
const LANGUAGE_OPTIONS = LANGUAGES.map((item) => ({
  value: item.id,
  label: item.label,
  hint: LANGUAGE_HINTS[item.id],
  badge: item.short,
}))

/** Mobil header: logo, til, mavzu va bildirishnomalar — qidiruv sahifalarning o'zida */
export default function MobileTopBar() {
  const { theme, toggleTheme } = useTheme()
  const [langId, setLangId] = useLocalStorageState('ayolkaryera-lang', 'uz')
  const language = LANGUAGES.find((item) => item.id === langId) ?? LANGUAGES[0]

  return (
    <div className="m-topbar">
      <Link to="/" className="m-topbar__logo" aria-label="AyolKaryera — bosh sahifa">
        <span className="m-topbar__mark">
          <LogoIcon size={22} />
        </span>
        <span className="m-topbar__word">
          Ayol<span>Karyera</span>
        </span>
      </Link>

      <div className="m-topbar__actions">
        <MenuSelect
          value={language.id}
          onChange={setLangId}
          options={LANGUAGE_OPTIONS}
          ariaLabel={`Til: ${language.label}`}
          title="Til"
          triggerClassName="m-topbar__btn m-topbar__lang"
        >
          <Globe size={18} strokeWidth={2} aria-hidden="true" />
          <span aria-hidden="true">{language.short}</span>
        </MenuSelect>

        <button
          type="button"
          className="m-topbar__btn"
          onClick={toggleTheme}
          aria-label={theme === 'dark' ? "Yorug' mavzuga o'tish" : "Qorong'i mavzuga o'tish"}
        >
          {theme === 'dark' ? <Sun size={19} strokeWidth={2} /> : <Moon size={19} strokeWidth={2} />}
        </button>

        <NotificationBell className="m-topbar__btn" size={19} />
      </div>
    </div>
  )
}
