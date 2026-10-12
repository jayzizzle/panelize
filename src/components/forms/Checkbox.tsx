import { type ComponentPropsWithRef, type Ref } from 'react'
import { styled } from 'styled-components'

import { resolvePaintSteps, resolvePaintValue, resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontSizeValue,
  type PaintSteps,
  type PaintValue,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

import { resolveChromaSlot } from '~/src/components/text/color'

type StyledCheckboxProps = {
  $width: string
  $height: string
  $size: string
  $radius: string
  $borderWidth: string
  $borderColor: string
  $hoverBorder: string
  $activeBorder: string
  $off: string
  $on: string
  $hoverOn: string
  $activeOn: string
  $ink: string
  $hideCheckIcon: boolean
  $customCss?: string
}

function assignRef(ref: Ref<HTMLInputElement> | undefined, node: HTMLInputElement | null) {
  if (typeof ref === 'function') {
    ref(node)
  } else if (ref) {
    ref.current = node
  }
}

const StyledCheckbox = styled.input<StyledCheckboxProps>`
  appearance: none;
  margin: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  color: inherit;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  font-size: ${({ $size }) => $size};
  padding: 0;
  border: ${({ $borderWidth }) => $borderWidth} solid ${({ $borderColor }) => $borderColor};
  border-radius: ${({ $radius }) => $radius};
  background: ${({ $off }) => $off};
  cursor: pointer;
  transition:
    background 120ms ease,
    border-color 120ms ease,
    box-shadow 120ms ease;
  &::after {
    content: '';
    position: absolute;
    box-sizing: border-box;
    pointer-events: none;
    opacity: 0;
  }
  &:hover:not(:disabled):not(:checked):not(:indeterminate) {
    border-color: ${({ $hoverBorder }) => $hoverBorder};
  }
  &:active:not(:disabled):not(:checked):not(:indeterminate) {
    border-color: ${({ $activeBorder }) => $activeBorder};
  }
  &:checked,
  &:indeterminate {
    background: ${({ $on }) => $on};
    border-color: ${({ $on }) => $on};
  }
  &:is(:checked, :indeterminate):hover:not(:disabled) {
    background: ${({ $hoverOn }) => $hoverOn};
    border-color: ${({ $hoverOn }) => $hoverOn};
  }
  &:is(:checked, :indeterminate):active:not(:disabled) {
    background: ${({ $activeOn }) => $activeOn};
    border-color: ${({ $activeOn }) => $activeOn};
  }
  &:checked:not(:indeterminate)::after {
    opacity: ${({ $hideCheckIcon }) => ($hideCheckIcon ? 0 : 1)};
    left: 50%;
    top: 42%;
    width: 0.3em;
    height: 0.52em;
    border: solid ${({ $ink }) => $ink};
    border-width: 0 0.17em 0.17em 0;
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &:indeterminate::after {
    opacity: 1;
    left: 50%;
    top: 50%;
    width: 50%;
    height: 0.17em;
    border: none;
    border-radius: 999px;
    background: ${({ $ink }) => $ink};
    transform: translate(-50%, -50%);
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, ${({ $on }) => $on} 18%, transparent);
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:disabled:is(:checked, :indeterminate) {
    opacity: 0.45;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> & {
  /**
   * Brand (`primary` / `secondary` / `accent`), status (`danger` / …), or raw CSS.
   * Theme default `primary`. Checked / indeterminate fill uses this slot’s `.base` / `.hover` /
   * `.active` (same steps as `Button`). Empty rest / hover / active stroke is `currentColor`
   * (wrapping `Label` ink, else panel `text.base`) until `borderColor`.
   */
  color?: ColorValue
  /**
   * Type size token or CSS. Box is this size (`1em`), square. Theme default `base`. Native HTML
   * `size` is omitted. Use the same `size` on the paired `Label`.
   */
  size?: FontSizeValue
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /**
   * Rest fill. Surface, brand, status, or CSS. Omit = transparent (panel shows through).
   */
  background?: PaintValue
  /**
   * Check / dash. Token/CSS → `.base` (same as filled `Button` `ink`). `{ base, hover, active }`
   * for a one-off; omitted keys keep `defaults.checkbox.ink`. Hover/active are unused (no hover
   * on the mark). Theme default `palette.black`.
   */
  ink?: PaintSteps
  /**
   * Rest (empty) border. Surface, brand, status, or CSS. Omit = `currentColor` (same as the
   * wrapping `Label`, else panel `text.base`). Checked stroke follows the fill.
   */
  borderColor?: PaintValue
  /** Border width token or CSS. Theme default `extraSmall` (`1px`). */
  borderWidth?: SpaceValue
  /** Box radius. Space token or CSS. Theme default `small`. */
  borderRadius?: SpaceValue
  /** Box width. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  width?: SpaceValue
  /** Box height. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  height?: SpaceValue
  /**
   * Native `indeterminate` property (dash). Not an HTML attribute. Host owns it. Does not set
   * `checked`. The dash still draws when `hideCheckIcon`.
   */
  indeterminate?: boolean
  /**
   * Hide the check glyph when `checked`. Default `false`. `true` = fill-only (chroma well, no
   * check). Does not hide the indeterminate dash.
   */
  hideCheckIcon?: boolean
}

/**
 * Native checkbox. `color` is the checked fill. Empty stroke follows wrapping `Label`
 * (`currentColor`). Wrap with `Label` (same `size`).
 *
 * @example
 * ```tsx
 * <Label htmlFor='email' label='Email' />
 * <Checkbox id='email' checked={on} onChange={(e) => setOn(e.target.checked)} />
 * ```
 */
export function Checkbox(props: CheckboxProps) {
  const {
    color,
    size,
    css: customCss,
    background,
    ink,
    borderColor,
    borderWidth,
    borderRadius,
    width,
    height,
    indeterminate = false,
    hideCheckIcon = false,
    ref,
    ...dom
  } = props
  const { space, radii, fontSizes, borderWidths, defaults, brand, status, colors } =
    usePanelizeTheme()
  const box = defaults.checkbox
  const slot = resolveChromaSlot(color ?? box.color, brand, status)
  const off = resolvePaintValue(background, 'background', colors, brand, status) ?? 'transparent'
  const markInk = resolvePaintSteps(ink, 'text', 'base', colors, brand, status) ?? box.ink
  const restBorder =
    resolvePaintValue(borderColor, 'border', colors, brand, status) ?? 'currentColor'
  const typeSize = resolveScaleValue(size, box.size, fontSizes)
  const edge = typeSize
  const boxWidth = width !== undefined ? resolveScaleValue(width, typeSize, space) : edge
  const boxHeight = height !== undefined ? resolveScaleValue(height, typeSize, space) : edge

  return (
    <StyledCheckbox
      $width={boxWidth}
      $height={boxHeight}
      $size={typeSize}
      $radius={resolveScaleValue(borderRadius, box.borderRadius, radii)}
      $borderWidth={resolveScaleValue(borderWidth, box.borderWidth, borderWidths)}
      $borderColor={restBorder}
      $hoverBorder={restBorder}
      $activeBorder={restBorder}
      $off={off}
      $on={slot.base}
      $hoverOn={slot.hover}
      $activeOn={slot.active}
      $ink={markInk}
      $hideCheckIcon={hideCheckIcon}
      $customCss={customCss}
      {...dom}
      ref={(node) => {
        if (node) {
          node.indeterminate = indeterminate
        }
        assignRef(ref, node)
      }}
      type='checkbox'
    />
  )
}

Checkbox.displayName = 'Checkbox'
