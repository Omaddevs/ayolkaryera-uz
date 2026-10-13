import { useEffect, useId, useRef, useState } from 'react'
import { Check } from 'lucide-react'
import DropPanel from './DropPanel.jsx'
import './MenuSelect.css'

/**
 * Brend uslubidagi tanlash menyusi (native select o'rniga).
 * options: [{ value, label, hint?, badge? }]
 * Klaviatura: ↑/↓, Home/End, Enter/Space — tanlash, Esc/Tab — yopish.
 */
export default function MenuSelect({
  value,
  onChange,
  options,
  ariaLabel,
  title,
  align = 'end',
  triggerClassName = '',
  className = '',
  children,
}) {
  const [open, setOpen] = useState(false)
  const [active, setActive] = useState(0)
  const rootRef = useRef(null)
  const triggerRef = useRef(null)
  const optionRefs = useRef([])
  const listId = useId()
  const selectedIndex = Math.max(0, options.findIndex((option) => option.value === value))

  function openMenu(index = selectedIndex) {
    setActive(index)
    setOpen(true)
  }

  function close(returnFocus = true) {
    setOpen(false)
    if (returnFocus) triggerRef.current?.focus()
  }

  function choose(option) {
    onChange(option.value)
    close()
  }

  // Ochilganda faol variantga fokus
  useEffect(() => {
    if (open) optionRefs.current[active]?.focus({ preventScroll: false })
  }, [open, active])

  // Tashqariga bosilganda yopish
  useEffect(() => {
    if (!open) return undefined
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) close(false)
    }
    document.addEventListener('pointerdown', onPointerDown)
    return () => document.removeEventListener('pointerdown', onPointerDown)
  }, [open])

  function onTriggerKeyDown(event) {
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault()
      openMenu(event.key === 'ArrowUp' ? options.length - 1 : selectedIndex)
    }
  }

  function onListKeyDown(event) {
    const last = options.length - 1
    const moves = { ArrowDown: active === last ? 0 : active + 1, ArrowUp: active === 0 ? last : active - 1, Home: 0, End: last }
    if (event.key in moves) {
      event.preventDefault()
      setActive(moves[event.key])
    } else if (event.key === 'Escape') {
      event.preventDefault()
      close()
    } else if (event.key === 'Tab') {
      close(false)
    }
  }

  return (
    <div className={`menu-select ${open ? 'is-open' : ''} ${className}`} ref={rootRef}>
      <button
        ref={triggerRef}
        type="button"
        className={triggerClassName}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        aria-label={ariaLabel}
        onClick={() => (open ? close() : openMenu())}
        onKeyDown={onTriggerKeyDown}
      >
        {children}
      </button>

      <DropPanel
        open={open}
        className={`menu-select__panel menu-select__panel--${align}`}
        origin={align === 'end' ? 'end' : 'start'}
      >
        {title && <p className="menu-select__title">{title}</p>}
        <ul id={listId} role="listbox" aria-label={ariaLabel} className="menu-select__list" onKeyDown={onListKeyDown}>
          {options.map((option, index) => {
            const selected = option.value === value
            return (
              <li
                key={option.value}
                ref={(node) => {
                  optionRefs.current[index] = node
                }}
                role="option"
                aria-selected={selected}
                tabIndex={index === active ? 0 : -1}
                className={`menu-select__option${selected ? ' is-selected' : ''}`}
                onClick={() => choose(option)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault()
                    choose(option)
                  }
                }}
                onMouseMove={() => index !== active && setActive(index)}
              >
                {option.badge && <span className="menu-select__badge">{option.badge}</span>}
                <span className="menu-select__text">
                  <span className="menu-select__label">{option.label}</span>
                  {option.hint && <span className="menu-select__hint">{option.hint}</span>}
                </span>
                <span className="menu-select__check" aria-hidden="true">
                  <Check size={14} strokeWidth={3} />
                </span>
              </li>
            )
          })}
        </ul>
      </DropPanel>
    </div>
  )
}
