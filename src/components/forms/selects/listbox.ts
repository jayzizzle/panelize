import {
  Children,
  type CSSProperties,
  isValidElement,
  type KeyboardEvent,
  type ReactElement,
  type ReactNode,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'

import { resolveScaleValue } from '~/src/theme/internal'

import { type SpaceScale, type SpaceToken } from '~/src/theme'

import { panelCssVars } from '~/src/components/layout/Panel'

export type SelectOptionData = {
  value: string
  label: string
  disabled?: boolean
}

export type OptionProps = {
  /** Value written to `Select` / `MultiSelect` state. */
  value: string
  /** Visible caption. Omit = string `children`, else `value`. */
  label?: string
  /** Skip pointer / keyboard pick. Default `false`. */
  disabled?: boolean
  children?: ReactNode
}

/** Marker for `Select` / `MultiSelect` children. Not rendered on its own. */
export function Option(props: OptionProps) {
  void props
  return null
}

Option.displayName = 'Option'

function optionCaption(props: OptionProps) {
  if (props.label !== undefined) {
    return props.label
  }
  if (typeof props.children === 'string') {
    return props.children
  }
  return props.value
}

function isOptionElement(child: ReactNode): child is ReactElement<OptionProps> {
  return isValidElement(child) && child.type === Option
}

export function collectItems(
  options: SelectOptionData[] | undefined,
  children: ReactNode,
): SelectOptionData[] {
  const map = new Map<string, SelectOptionData>()
  for (const item of options ?? []) {
    map.set(item.value, {
      value: item.value,
      label: item.label,
      disabled: item.disabled,
    })
  }
  Children.forEach(children, (child) => {
    if (!isOptionElement(child)) {
      return
    }
    const { value, disabled } = child.props
    map.set(value, { value, label: optionCaption(child.props), disabled })
  })
  return [...map.values()]
}

export function withEmptyOption(
  items: SelectOptionData[],
  spec: boolean | string | undefined,
  placeholder: string | undefined,
  required: boolean | undefined,
) {
  if (!spec || required) {
    return items
  }
  if (items.some((item) => item.value === '')) {
    return items
  }
  const label = typeof spec === 'string' ? spec : (placeholder ?? '')
  return [{ value: '', label }, ...items]
}

export function withSelectedAtTop(items: SelectOptionData[], current: string, enabled: boolean) {
  if (!enabled || current === '') {
    return items
  }
  const i = items.findIndex((item) => item.value === current)
  if (i <= 0) {
    return items
  }
  const next = items.slice()
  const [picked] = next.splice(i, 1)
  if (picked) {
    next.unshift(picked)
  }
  return next
}

export function withSelectedSetAtTop(
  items: SelectOptionData[],
  selected: readonly string[],
  enabled: boolean,
) {
  if (!enabled || selected.length === 0) {
    return items
  }
  const set = new Set(selected)
  const top: SelectOptionData[] = []
  const rest: SelectOptionData[] = []
  for (const item of items) {
    if (set.has(item.value)) {
      top.push(item)
    } else {
      rest.push(item)
    }
  }
  return [...top, ...rest]
}

export function firstEnabledIndex(items: SelectOptionData[]) {
  return items.findIndex((item) => !item.disabled)
}

export function lastEnabledIndex(items: SelectOptionData[]) {
  for (let i = items.length - 1; i >= 0; i -= 1) {
    if (!items[i]?.disabled) {
      return i
    }
  }
  return -1
}

export function stepEnabled(items: SelectOptionData[], from: number, dir: 1 | -1) {
  if (items.length === 0) {
    return -1
  }
  let i = from
  for (let n = 0; n < items.length; n += 1) {
    i = (i + dir + items.length) % items.length
    if (!items[i]?.disabled) {
      return i
    }
  }
  return from
}

export function matchTypeahead(items: SelectOptionData[], query: string, from: number) {
  const q = query.toLowerCase()
  const start = from < 0 ? 0 : from
  const order = [...items.slice(start), ...items.slice(0, start)]
  const hit = order.find((item) => !item.disabled && item.label.toLowerCase().startsWith(q))
  return hit ? items.indexOf(hit) : -1
}

export function panelVarsFrom(node: HTMLElement): CSSProperties {
  const cs = getComputedStyle(node)
  const next: Record<string, string> = {}
  for (const name of Object.values(panelCssVars)) {
    next[name] = cs.getPropertyValue(name).trim()
  }
  return next
}

export function cssLengthToPx(value: string, emPx = 16) {
  const n = Number.parseFloat(value)
  if (!Number.isFinite(n)) {
    return 256
  }
  if (value.endsWith('rem')) {
    const root = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
    return n * (Number.isFinite(root) ? root : 16)
  }
  if (value.endsWith('em')) {
    return n * emPx
  }
  return n
}

export type ListBox = { top: number; left: number; width: number; maxHeight: number }

export function computeListBox(
  node: HTMLElement,
  listMaxHeight: string,
  listOffset: SpaceToken,
  space: SpaceScale,
): { box: ListBox; vars: CSSProperties } {
  const rect = node.getBoundingClientRect()
  const emPx = Number.parseFloat(getComputedStyle(node).fontSize)
  const em = Number.isFinite(emPx) ? emPx : 16
  const maxPx = cssLengthToPx(listMaxHeight, em)
  const gap = cssLengthToPx(resolveScaleValue(undefined, listOffset, space), em)
  const below = window.innerHeight - rect.bottom - gap
  const above = rect.top - gap
  const flip = below < Math.min(maxPx, 120) && above > below
  const maxHeight = Math.max(8, Math.min(maxPx, flip ? above : below))
  return {
    vars: panelVarsFrom(node),
    box: {
      top: flip ? rect.top - maxHeight - gap : rect.bottom + gap,
      left: rect.left,
      width: rect.width,
      maxHeight,
    },
  }
}

export function useListboxMenu({
  items,
  open: openProp,
  onOpenChange,
  activeOnOpen,
  listMaxHeight,
  listOffset,
  space,
}: {
  items: SelectOptionData[]
  open?: boolean
  onOpenChange?: (open: boolean) => void
  activeOnOpen: number
  listMaxHeight: string
  listOffset: SpaceToken
  space: SpaceScale
}) {
  const isOpenControlled = openProp !== undefined
  const [uncontrolledOpen, setUncontrolledOpen] = useState(false)
  const isOpen = isOpenControlled ? openProp : uncontrolledOpen
  const [activeIndex, setActiveIndex] = useState(-1)
  const [box, setBox] = useState<ListBox | null>(null)
  const [listVars, setListVars] = useState<CSSProperties>({})
  const triggerRef = useRef<HTMLButtonElement>(null)
  const wrapRef = useRef<HTMLSpanElement>(null)
  const listRef = useRef<HTMLUListElement>(null)
  const typeRef = useRef({ buffer: '', timer: 0 })
  const activeValueRef = useRef<string | undefined>(undefined)

  const pinActive = (index: number) => {
    setActiveIndex(index)
    activeValueRef.current = index >= 0 ? items[index]?.value : undefined
  }

  const setOpen = (next: boolean, highlight?: number) => {
    if (next) {
      pinActive(highlight ?? activeOnOpen)
    } else {
      pinActive(-1)
    }
    if (!isOpenControlled) {
      setUncontrolledOpen(next)
    }
    onOpenChange?.(next)
  }

  const moveActive = (index: number) => {
    if (index >= 0) {
      pinActive(index)
    }
  }

  const placeList = () => {
    const node = triggerRef.current
    if (!node) {
      return
    }
    const next = computeListBox(node, listMaxHeight, listOffset, space)
    setListVars(next.vars)
    setBox(next.box)
  }

  useEffect(() => {
    const typeState = typeRef.current
    return () => window.clearTimeout(typeState.timer)
  }, [])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }
    const value = activeValueRef.current
    if (value === undefined) {
      return
    }
    const i = items.findIndex((item) => item.value === value)
    if (i >= 0 && i !== activeIndex) {
      setActiveIndex(i)
    }
  }, [items, isOpen, activeIndex])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }
    placeList()
    const onReposition = () => placeList()
    window.addEventListener('resize', onReposition)
    window.addEventListener('scroll', onReposition, true)
    return () => {
      window.removeEventListener('resize', onReposition)
      window.removeEventListener('scroll', onReposition, true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- placeList reads layout, not render inputs
  }, [isOpen, listMaxHeight, listOffset, space])

  useLayoutEffect(() => {
    if (!isOpen) {
      return
    }
    const el = listRef.current?.querySelector('[data-active="true"]')
    if (el instanceof HTMLElement) {
      el.scrollIntoView?.({ block: 'nearest' })
    }
  }, [isOpen, activeIndex])

  useEffect(() => {
    if (!isOpen) {
      return
    }
    const onDoc = (event: globalThis.MouseEvent) => {
      const t = event.target
      if (!(t instanceof Node)) {
        return
      }
      if (wrapRef.current?.contains(t) || listRef.current?.contains(t)) {
        return
      }
      setOpen(false)
      triggerRef.current?.blur()
    }
    document.addEventListener('mousedown', onDoc)
    return () => {
      document.removeEventListener('mousedown', onDoc)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- setOpen reads items from this render
  }, [isOpen, isOpenControlled, onOpenChange, items, activeOnOpen])

  return {
    isOpen,
    activeIndex,
    box,
    listVars,
    triggerRef,
    wrapRef,
    listRef,
    typeRef,
    setOpen,
    moveActive,
    placeList,
  }
}

export function runListboxKeyDown(
  event: KeyboardEvent<HTMLButtonElement>,
  opts: {
    disabled?: boolean
    readOnly?: boolean
    isOpen: boolean
    items: SelectOptionData[]
    activeIndex: number
    showClear: boolean
    typeRef: { current: { buffer: string; timer: number } }
    placeList: () => void
    setOpen: (open: boolean, highlight?: number) => void
    moveActive: (index: number) => void
    openHighlightDown: number
    openHighlightUp: number
    onCommit: (item: SelectOptionData) => void
    onClear: () => void
    onClosedTypeahead: (item: SelectOptionData) => void
    /** Index to start closed type-ahead from (`selectedIndex`; `-1` → wrap from 0). */
    closedTypeaheadFrom: number
  },
) {
  if (event.defaultPrevented || opts.disabled) {
    return
  }
  const key = event.key
  const {
    isOpen,
    items,
    activeIndex,
    showClear,
    readOnly,
    typeRef,
    placeList,
    setOpen,
    moveActive,
    openHighlightDown,
    openHighlightUp,
    onCommit,
    onClear,
    onClosedTypeahead,
    closedTypeaheadFrom,
  } = opts
  if (!isOpen && (key === 'ArrowDown' || key === 'ArrowUp' || key === 'Enter' || key === ' ')) {
    event.preventDefault()
    placeList()
    if (key === 'ArrowUp') {
      setOpen(true, openHighlightUp)
    } else {
      setOpen(true, openHighlightDown)
    }
    return
  }
  if (!isOpen) {
    if ((key === 'Backspace' || key === 'Delete') && showClear) {
      event.preventDefault()
      onClear()
      return
    }
    if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey && !readOnly) {
      const i = matchTypeahead(items, key, closedTypeaheadFrom + 1)
      if (i >= 0 && items[i]) {
        onClosedTypeahead(items[i])
      }
    }
    return
  }
  if (key === 'Escape') {
    event.preventDefault()
    setOpen(false)
    return
  }
  if (key === 'ArrowDown') {
    event.preventDefault()
    moveActive(stepEnabled(items, activeIndex, 1))
    return
  }
  if (key === 'ArrowUp') {
    event.preventDefault()
    moveActive(stepEnabled(items, activeIndex, -1))
    return
  }
  if (key === 'Home') {
    event.preventDefault()
    moveActive(firstEnabledIndex(items))
    return
  }
  if (key === 'End') {
    event.preventDefault()
    moveActive(lastEnabledIndex(items))
    return
  }
  if (key === 'Enter' || key === ' ') {
    event.preventDefault()
    const item = items[activeIndex]
    if (item && !item.disabled) {
      onCommit(item)
    }
    return
  }
  if (key.length === 1 && !event.metaKey && !event.ctrlKey && !event.altKey) {
    event.preventDefault()
    window.clearTimeout(typeRef.current.timer)
    typeRef.current.buffer += key
    typeRef.current.timer = window.setTimeout(() => {
      typeRef.current.buffer = ''
    }, 400)
    const i = matchTypeahead(items, typeRef.current.buffer, activeIndex)
    if (i >= 0) {
      moveActive(i)
    }
  }
}
