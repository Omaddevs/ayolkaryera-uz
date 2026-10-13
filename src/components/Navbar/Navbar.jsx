import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  FiBriefcase,
  FiMoreHorizontal,
  FiPlus,
  FiUser,
  FiX,
} from 'react-icons/fi'
import { LayoutGrid, Map as MapIcon } from 'lucide-react'
import { HiOutlineBuildingOffice2 } from 'react-icons/hi2'
import CategoriesMenu from '../CategoriesMenu/CategoriesMenu.jsx'
import HeartIcon from '../icons/HeartIcon.jsx'
import MessageIcon from '../icons/MessageIcon.jsx'
import Button from '../ui/Button.jsx'
import DropPanel from '../ui/DropPanel.jsx'
import IconButton from '../ui/IconButton.jsx'
import SearchBar from '../SearchBar/SearchBar.jsx'
import NotificationBell from '../NotificationBell.jsx'
import { loadJobsMapPage } from '../../pages/jobsMapLoader.js'
import '../ui/IconButton.css'
import './Navbar.css'

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [categoriesOpen, setCategoriesOpen] = useState(false)

  return (
    <div className="navbar">
      <div className="container navbar__inner">
        <CategoriesMenu
          open={categoriesOpen}
          onOpenChange={setCategoriesOpen}
          trigger={({ buttonProps }) => (
            <Button
              variant="primary"
              icon={<LayoutGrid size={18} strokeWidth={2.4} />}
              {...buttonProps}
            >
              Kategoriyalar
            </Button>
          )}
        />

        <SearchBar />

        <div className="navbar__actions">
          <Link
            to="/xabarlar"
            className="icon-btn icon-btn--outline navbar__msg navbar__action-hide-sm"
            aria-label="Xabarlar"
          >
            <MessageIcon size={22} />
            <span className="navbar__msg-dot" aria-hidden="true" />
          </Link>
          <NotificationBell className="icon-btn icon-btn--outline navbar__action-hide-sm" size={21} />
          <Link
            to="/saqlanganlar"
            className="icon-btn icon-btn--outline navbar__action-hide-sm"
            aria-label="Saqlanganlar"
          >
            <HeartIcon size={22} />
          </Link>
          <Link
            to="/xarita"
            className="icon-btn icon-btn--outline navbar__action-hide-sm"
            onMouseEnter={loadJobsMapPage}
            onFocus={loadJobsMapPage}
            onTouchStart={loadJobsMapPage}
            aria-label="Yaqin atrofdagi ishlar xaritasi"
            title="Yaqin atrofdagi ishlar"
          >
            <MapIcon size={21} strokeWidth={1.6} />
          </Link>

          <Link to="/ishlar" className="btn btn--outline navbar__jobs navbar__action-hide-md">
            <span className="btn__icon">
              <FiBriefcase />
            </span>
            <span className="btn__label">Ish e&apos;lonlari</span>
          </Link>

          <Link to="/kompaniyalar" className="navbar__companies navbar__action-hide-md">
            Kompaniyalar
          </Link>

          <Button
            variant="primary"
            icon={<FiPlus />}
            iconPosition="end"
            className="navbar__cta navbar__action-hide-lg"
          >
            E'lon joylashtirish
          </Button>

          <Link to="/profil" className="navbar__profile" aria-label="Profil">
            <FiUser />
          </Link>

          <button
            type="button"
            className="navbar__more"
            aria-label="Qo'shimcha menyu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            {menuOpen ? <FiX /> : <FiMoreHorizontal />}
          </button>
        </div>
      </div>

      <DropPanel open={menuOpen} className="navbar__mobile-menu container" origin="start">
          <Link
            to="/xabarlar"
            className="navbar__mobile-item"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <MessageIcon size={18} />
            <span>Xabarlar</span>
          </Link>
          <Link
            to="/saqlanganlar"
            className="navbar__mobile-item"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <HeartIcon size={18} />
            <span>Saqlanganlar</span>
          </Link>
          <Link
            to="/xarita"
            className="navbar__mobile-item"
            onTouchStart={loadJobsMapPage}
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <MapIcon size={18} strokeWidth={1.8} />
            <span>Yaqin atrofdagi ishlar</span>
          </Link>
          <Link
            to="/ishlar"
            className="navbar__mobile-item"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <FiBriefcase />
            <span>Ish e&apos;lonlari</span>
          </Link>
          <Link
            to="/kompaniyalar"
            className="navbar__mobile-item"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <HiOutlineBuildingOffice2 />
            <span>Kompaniyalar</span>
          </Link>
          <button
            type="button"
            className="navbar__mobile-item navbar__mobile-item--primary"
            tabIndex={menuOpen ? 0 : -1}
          >
            <FiPlus />
            <span>E'lon joylashtirish</span>
          </button>
          <Link
            to="/profil"
            className="navbar__mobile-item"
            onClick={() => setMenuOpen(false)}
            tabIndex={menuOpen ? 0 : -1}
          >
            <FiUser />
            <span>Mening profilim</span>
          </Link>
      </DropPanel>
    </div>
  )
}
