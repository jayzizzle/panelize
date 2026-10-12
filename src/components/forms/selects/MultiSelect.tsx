import {
  type ComponentPropsWithRef,
  type FocusEvent,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
  useId,
  useState,
} from 'react'
import { createPortal } from 'react-dom'
import { styled } from 'styled-components'

import { resolvePaintValue, resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  type PaintValue,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

import { Checkbox } from '~/src/components/forms/Checkbox'
import {
  collectItems,
  firstEnabledIndex,
  lastEnabledIndex,
  runListboxKeyDown,
  type SelectOptionData,
  useListboxMenu,
  withSelectedSetAtTop,
} from '~/src/components/forms/selects/listbox'
import {
  ClearButton,
  StyledList,
  StyledTrigger,
  TriggerLabel,
  TriggerWrap,
} from '~/src/components/forms/selects/listboxChrome'
import { panelCssVars } from '~/src/components/layout/Panel'
import { resolveFocusColor } from '~/src/components/text/color'

const StyledOption = styled.li<{
  $padX: string
  $padY: string
  $chroma: string
  $ink: string
  $selected: boolean
  $active: boolean
  $disabled: boolean
}>`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.5em;
  padding: ${({ $padY, $padX }) => `${$padY} ${$padX}`};
  cursor: ${({ $disabled }) => ($disabled ? 'not-allowed' : 'pointer')};
  opacity: ${({ $disabled }) => ($disabled ? 0.45 : 1)};
  color: ${({ $selected, $chroma, $ink }) => ($selected ? $chroma : $ink)};
  -webkit-text-fill-color: ${({ $selected, $chroma, $ink }) => ($selected ? $chroma : $ink)};
  background: ${({ $active, $disabled }) =>
    $active && !$disabled
      ? `color-mix(in srgb, var(${panelCssVars.textHighlighted}) 18%, var(${panelCssVars.background}))`
      : 'transparent'};
`

const CheckHit = styled.span`
  display: flex;
  flex-shrink: 0;
  pointer-events: none;
`

export type MultiSelectProps = Omit<
  ComponentPropsWithRef<'button'>,
  'type' | 'onChange' | 'value'
> & {
  /**
   * Focus chroma (open ring) and checked-option ink. Brand / status / CSS.
   * Theme default `primary`. Glyph on the trigger is `ink` (omit = panel highlighted text).
   */
  color?: ColorValue
  /** Type size token or CSS. Theme default `small`. Native HTML `size` is omitted. */
  size?: FontSizeValue
  weight?: FontWeightValue
  family?: FontFamilyToken
  italic?: boolean
  uppercase?: boolean
  fill?: boolean
  css?: string
  padding?: SpaceValue
  /** Horizontal padding. Overrides `padding`. */
  paddingX?: SpaceValue
  /** Vertical padding. Overrides `padding`. */
  paddingY?: SpaceValue
  borderWidth?: SpaceValue
  borderRadius?: SpaceValue
  background?: PaintValue
  ink?: PaintValue
  borderColor?: PaintValue
  /**
   * Menu open. Omit = internal (click / keyboard / outside / Escape). Pass with
   * `onOpenChange` to control.
   */
  open?: boolean
  onOpenChange?: (open: boolean) => void
  /** Options. Merged with child `Option` (children win on the same `value`). */
  options?: SelectOptionData[]
  /** Shown when nothing is selected. Muted ink. */
  placeholder?: string
  /** Hidden input `name` for native form submit (one input per selected value). */
  name?: string
  /**
   * When true, the value cannot be cleared to empty (no clear-all, last check cannot
   * uncheck). Default `false`.
   */
  required?: boolean
  /**
   * Show a clear-all control when there is a value. Default `false`. Ignored when `required`.
   */
  clearable?: boolean
  /**
   * When true, checked options are listed first (original order within each group).
   * Default `false`.
   */
  selectedAtTop?: boolean
  /**
   * Open to inspect; no toggle / clear / type-ahead commit. Not dimmed (`disabled` is).
   * Default `false`.
   */
  readOnly?: boolean
  /** Selected values. Omit with `defaultValue` for uncontrolled. */
  value?: string[]
  defaultValue?: string[]
  /** Called with the selected values when the set changes. Empty array when cleared. */
  onChange?: (value: string[]) => void
  children?: ReactNode
}

/**
 * Custom multi listbox. Host `value` / `onChange` are `string[]`. Trigger shows a count
 * (`N selected`), not chips. Menu stays open while toggling. Place with layout.
 *
 * @example
 * ```tsx
 * <Label htmlFor='tags' label='Tags' />
 * <MultiSelect id='tags' value={tags} onChange={setTags} clearable>
 *   <Option value='a' label='Alpha' />
 *   <Option value='b' label='Beta' />
 * </MultiSelect>
 * ```
 */
export function MultiSelect(props: MultiSelectProps) {
  const {
    ref,
    color,
    size,
    weight,
    family: familyToken,
    italic,
    uppercase,
    fill,
    css: customCss,
    padding,
    paddingX,
    paddingY,
    borderWidth,
    borderRadius,
    background,
    ink,
    borderColor,
    value,
    defaultValue,
    onChange,
    open: openProp,
    onOpenChange,
    options,
    placeholder,
    name,
    required,
    clearable,
    selectedAtTop,
    children,
    disabled,
    readOnly,
    id,
    onKeyDown,
    onClick,
    onBlur,
    ...dom
  } = props
  const {
    fontSizes,
    fontWeights,
    fontFamilies,
    lineHeight,
    space,
    borderWidths,
    radii,
    defaults,
    brand,
    status,
    colors,
  } = usePanelizeTheme()
  const sel = defaults.select
  const isValueControlled = value !== undefined
  const [uncontrolledValue, setUncontrolledValue] = useState<string[]>(() => defaultValue ?? [])
  const current = isValueControlled ? (value ?? []) : uncontrolledValue
  const selectedSet = new Set(current)
  const items = withSelectedSetAtTop(
    collectItems(options, children),
    current,
    Boolean(selectedAtTop),
  )
  const firstSelectedIndex = items.findIndex((item) => selectedSet.has(item.value))
  const activeOnOpen = firstSelectedIndex >= 0 ? firstSelectedIndex : firstEnabledIndex(items)
  const {
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
  } = useListboxMenu({
    items,
    open: openProp,
    onOpenChange,
    activeOnOpen,
    listMaxHeight: sel.listMaxHeight,
    listOffset: sel.listOffset,
    space,
  })
  const listId = useId()
  const assignTriggerRef = (node: HTMLButtonElement | null) => {
    triggerRef.current = node
    if (typeof ref === 'function') {
      ref(node)
    } else if (ref) {
      ref.current = node
    }
  }

  const focus = resolveFocusColor(color ?? sel.color, brand, status)
  const invalid = status.danger.base
  const typeSize = resolveScaleValue(size, sel.size, fontSizes)
  const padX = resolveScaleValue(paddingX ?? padding, sel.paddingX, space)
  const padY = resolveScaleValue(paddingY ?? padding, sel.paddingY, space)
  const radius = resolveScaleValue(borderRadius, sel.borderRadius, radii)
  const stroke = resolveScaleValue(borderWidth, sel.borderWidth, borderWidths)
  const bg =
    resolvePaintValue(background, 'background', colors, brand, status) ??
    `var(${panelCssVars.background})`
  const textInk =
    resolvePaintValue(ink, 'text', colors, brand, status) ?? `var(${panelCssVars.textHighlighted})`
  const restBorder =
    resolvePaintValue(borderColor, 'border', colors, brand, status) ?? `var(${panelCssVars.border})`
  const empty = current.length === 0
  const showClear = Boolean(clearable) && !required && !empty && !disabled && !readOnly
  const mutedInk = `var(${panelCssVars.textMuted})`
  const labelInk = empty ? mutedInk : textInk
  const caption = empty ? (placeholder ?? '') : `${current.length} selected`
  const optionPadX = resolveScaleValue(undefined, sel.optionPaddingX, space)
  const optionPadY = resolveScaleValue(undefined, sel.optionPaddingY, space)
  const typeWeight = resolveScaleValue(weight, sel.weight, fontWeights)
  const typeFamily = fontFamilies[familyToken ?? 'base']
  const checkColor = color ?? sel.color

  const emit = (next: string[]) => {
    if (!isValueControlled) {
      setUncontrolledValue(next)
    }
    onChange?.(next)
  }

  const toggle = (entry: string) => {
    if (readOnly) {
      return
    }
    if (selectedSet.has(entry)) {
      if (required && current.length <= 1) {
        return
      }
      emit(current.filter((value) => value !== entry))
      return
    }
    emit([...current, entry])
  }

  const clear = (blur: boolean) => {
    if (readOnly || required || empty) {
      return
    }
    emit([])
    setOpen(false)
    if (blur) {
      triggerRef.current?.blur()
    }
  }

  const onTriggerKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    onKeyDown?.(event)
    runListboxKeyDown(event, {
      disabled,
      readOnly,
      isOpen,
      items,
      activeIndex,
      showClear,
      typeRef,
      placeList,
      setOpen,
      moveActive,
      openHighlightDown: activeOnOpen,
      openHighlightUp: firstSelectedIndex >= 0 ? firstSelectedIndex : lastEnabledIndex(items),
      closedTypeaheadFrom: firstSelectedIndex,
      onCommit: (item) => toggle(item.value),
      onClear: () => clear(false),
      onClosedTypeahead: (item) => {
        const i = items.findIndex((row) => row.value === item.value)
        placeList()
        setOpen(true, i >= 0 ? i : undefined)
      },
    })
  }

  const activeId =
    isOpen && activeIndex >= 0 && items[activeIndex]
      ? `${listId}-${items[activeIndex].value}`
      : undefined

  return (
    <>
      {name !== undefined ? (
        empty ? (
          <input
            type='hidden'
            name={name}
            value=''
            required={required || undefined}
            disabled={disabled || undefined}
          />
        ) : (
          current.map((entry) => (
            <input
              key={entry}
              type='hidden'
              name={name}
              value={entry}
              disabled={disabled || undefined}
            />
          ))
        )
      ) : null}
      <TriggerWrap ref={wrapRef} $fill={fill}>
        <StyledTrigger
          {...dom}
          ref={assignTriggerRef}
          id={id}
          type='button'
          disabled={disabled}
          role='combobox'
          aria-haspopup='listbox'
          aria-autocomplete='none'
          aria-expanded={isOpen}
          aria-controls={isOpen ? listId : undefined}
          aria-activedescendant={activeId}
          aria-required={required || undefined}
          aria-readonly={readOnly || undefined}
          $family={typeFamily}
          $size={typeSize}
          $weight={typeWeight}
          $lineHeight={lineHeight}
          $paddingX={padX}
          $paddingY={padY}
          $borderWidth={stroke}
          $borderRadius={radius}
          $bg={bg}
          $ink={textInk}
          $muted={mutedInk}
          $borderColor={restBorder}
          $focus={focus}
          $invalid={invalid}
          $italic={italic}
          $uppercase={uppercase}
          $fill={fill}
          $open={isOpen}
          $clearable={showClear}
          $customCss={customCss}
          onKeyDown={onTriggerKeyDown}
          onBlur={(event: FocusEvent<HTMLButtonElement>) => {
            onBlur?.(event)
            if (event.defaultPrevented) {
              return
            }
            const next = event.relatedTarget
            if (next instanceof Node) {
              if (wrapRef.current?.contains(next) || listRef.current?.contains(next)) {
                return
              }
            }
            if (isOpen) {
              setOpen(false)
            }
          }}
          onClick={(event: MouseEvent<HTMLButtonElement>) => {
            onClick?.(event)
            if (event.defaultPrevented || disabled) {
              return
            }
            if (!isOpen) {
              placeList()
              setOpen(true)
              return
            }
            setOpen(false)
            triggerRef.current?.blur()
          }}
        >
          <TriggerLabel $ink={labelInk}>{caption}</TriggerLabel>
        </StyledTrigger>
        {showClear ? (
          <ClearButton
            type='button'
            tabIndex={-1}
            aria-label='Clear'
            $end={`calc(${padX} + 0.95em)`}
            $ink={mutedInk}
            $hoverInk={textInk}
            onMouseDown={(event) => event.preventDefault()}
            onClick={(event) => {
              event.stopPropagation()
              clear(true)
            }}
          />
        ) : null}
      </TriggerWrap>
      {isOpen && box && typeof document !== 'undefined'
        ? createPortal(
            <StyledList
              ref={listRef}
              id={listId}
              role='listbox'
              aria-multiselectable
              aria-labelledby={id || undefined}
              style={listVars}
              $top={box.top}
              $left={box.left}
              $width={box.width}
              $maxHeight={box.maxHeight}
              $zIndex={sel.listZIndex}
              $shadow={sel.listShadow}
              $radius={radius}
              $borderWidth={stroke}
              $borderColor={restBorder}
              $bg={bg}
              $ink={textInk}
              $size={typeSize}
              $weight={typeWeight}
              $family={typeFamily}
              $lineHeight={lineHeight}
            >
              {items.map((item, index) => {
                const on = selectedSet.has(item.value)
                return (
                  <StyledOption
                    key={item.value}
                    id={`${listId}-${item.value}`}
                    role='option'
                    aria-selected={on}
                    aria-disabled={item.disabled || undefined}
                    data-active={index === activeIndex ? 'true' : undefined}
                    $padX={optionPadX}
                    $padY={optionPadY}
                    $chroma={focus}
                    $ink={textInk}
                    $selected={on}
                    $active={index === activeIndex}
                    $disabled={Boolean(item.disabled)}
                    onMouseEnter={() => {
                      if (!item.disabled) {
                        moveActive(index)
                      }
                    }}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => {
                      if (!item.disabled) {
                        moveActive(index)
                        toggle(item.value)
                      }
                    }}
                  >
                    <CheckHit aria-hidden>
                      <Checkbox
                        tabIndex={-1}
                        checked={on}
                        disabled={item.disabled}
                        color={checkColor}
                        size={size ?? sel.size}
                        onChange={() => undefined}
                      />
                    </CheckHit>
                    {item.label}
                  </StyledOption>
                )
              })}
            </StyledList>,
            document.body,
          )
        : null}
    </>
  )
}

MultiSelect.displayName = 'MultiSelect'
