import { NavLink } from 'react-router-dom'
import { Bell } from 'lucide-react'
import { useNotifications } from '../hooks/useNotifications.js'
import './NotificationBell.css'

/** Bildirishnomalar sahifasiga havola, o'qilmaganlar soni bilan */
export default function NotificationBell({ className = '', size = 20 }) {
  const { unreadCount } = useNotifications()
  const label = unreadCount ? `Bildirishnomalar, ${unreadCount} ta o'qilmagan` : 'Bildirishnomalar'
  return (
    <NavLink to="/bildirishnomalar" className={`notif-bell ${className}`} aria-label={label} title="Bildirishnomalar">
      <Bell size={size} strokeWidth={2} aria-hidden="true" />
      {unreadCount > 0 && (
        <span className="notif-bell__count" aria-hidden="true">
          {unreadCount > 9 ? '9+' : unreadCount}
        </span>
      )}
    </NavLink>
  )
}
