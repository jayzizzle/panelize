import { type ComponentPropsWithRef } from 'react'
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

type StyledRadioProps = {
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
  $dot: string
  $hoverDot: string
  $activeDot: string
  $inset: string
  $customCss?: string
}

const StyledRadio = styled.input<StyledRadioProps>`
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
    left: 50%;
    top: 50%;
    width: calc(100% - 2 * ${({ $inset }) => $inset});
    height: calc(100% - 2 * ${({ $inset }) => $inset});
    border-radius: min(${({ $radius }) => $radius}, 50%);
    background: ${({ $dot }) => $dot};
    transform: translate(-50%, -50%);
    transition: background 120ms ease;
  }
  &:hover:not(:disabled):not(:checked) {
    border-color: ${({ $hoverBorder }) => $hoverBorder};
  }
  &:active:not(:disabled):not(:checked) {
    border-color: ${({ $activeBorder }) => $activeBorder};
  }
  &:checked {
    border-color: ${({ $on }) => $on};
  }
  &:checked::after {
    opacity: 1;
  }
  &:checked:hover:not(:disabled) {
    border-color: ${({ $hoverOn }) => $hoverOn};
  }
  &:checked:hover:not(:disabled)::after {
    background: ${({ $hoverDot }) => $hoverDot};
  }
  &:checked:active:not(:disabled) {
    border-color: ${({ $activeOn }) => $activeOn};
  }
  &:checked:active:not(:disabled)::after {
    background: ${({ $activeDot }) => $activeDot};
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, ${({ $on }) => $on} 18%, transparent);
  }
  &:disabled {
    cursor: not-allowed;
  }
  &:disabled:checked {
    opacity: 0.45;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &::after {
      transition: none;
    }
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type RadioProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> & {
  /**
   * Brand (`primary` / `secondary` / `accent`), status (`danger` / …), or raw CSS.
   * Theme default `primary`. Checked ring / inner disc use this slot’s `.base` / `.hover` /
   * `.active` (same steps as `Button`). Empty rest / hover / active stroke is `currentColor`
   * (wrapping `Label` ink, else panel `text.base`) until `borderColor`. Rest fill stays
   * transparent until `background` (the disc is the on mark, not a filled well).
   */
  color?: ColorValue
  /**
   * Type size token or CSS. Box is this size (`1em`), circle. Theme default `base`. Native HTML
   * `size` is omitted. Use the same `size` on the paired `Label`.
   */
  size?: FontSizeValue
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /**
   * Rest fill (the ring’s interior). Surface, brand, status, or CSS. Omit = transparent (panel
   * shows through around the disc).
   */
  background?: PaintValue
  /**
   * Inner disc. Token/CSS → `.base` (same as `Checkbox` `ink`). `{ base, hover, active }` for a
   * one-off; omitted keys keep the `color` slot. Omit entirely = disc follows the `color` slot
   * (lockstep with the ring, including hover/active).
   */
  ink?: PaintSteps
  /**
   * Rest (empty) border. Surface, brand, status, or CSS. Omit = `currentColor` (same as the
   * wrapping `Label`, else panel `text.base`). Checked stroke follows the `color` slot.
   */
  borderColor?: PaintValue
  /** Border width token or CSS. Theme default `extraSmall` (`1px`). */
  borderWidth?: SpaceValue
  /** Box radius. Space token or CSS. Theme default `999px` (circle). Inner disc uses `min(this, 50%)`. */
  borderRadius?: SpaceValue
  /** Box width. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  width?: SpaceValue
  /** Box height. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  height?: SpaceValue
}

/**
 * Native radio. `color` is the checked ring and disc. Empty stroke follows wrapping `Label`.
 * Wrap with `Label` (same `size`). Share `name` across the group.
 *
 * @example
 * ```tsx
 * <Label htmlFor='hobby' label='Hobby' />
 * <Radio id='hobby' name='plan' value='hobby' checked={plan === 'hobby'} onChange={(e) => setPlan(e.target.value)} />
 * ```
 */
export function Radio(props: RadioProps) {
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
    ...dom
  } = props
  const { space, radii, fontSizes, borderWidths, defaults, brand, status, colors } =
    usePanelizeTheme()
  const box = defaults.radio
  const slot = resolveChromaSlot(color ?? box.color, brand, status)
  const off = resolvePaintValue(background, 'background', colors, brand, status) ?? 'transparent'
  const disc = resolvePaintSteps(ink, 'text', 'base', colors, brand, status)
  const discHover = resolvePaintSteps(ink, 'text', 'hover', colors, brand, status)
  const discActive = resolvePaintSteps(ink, 'text', 'active', colors, brand, status)
  const restBorder =
    resolvePaintValue(borderColor, 'border', colors, brand, status) ?? 'currentColor'
  const typeSize = resolveScaleValue(size, box.size, fontSizes)
  const edge = typeSize
  const boxWidth = width !== undefined ? resolveScaleValue(width, typeSize, space) : edge
  const boxHeight = height !== undefined ? resolveScaleValue(height, typeSize, space) : edge
  const radius = resolveScaleValue(borderRadius, box.borderRadius, radii)

  return (
    <StyledRadio
      $width={boxWidth}
      $height={boxHeight}
      $size={typeSize}
      $radius={radius}
      $borderWidth={resolveScaleValue(borderWidth, box.borderWidth, borderWidths)}
      $borderColor={restBorder}
      $hoverBorder={restBorder}
      $activeBorder={restBorder}
      $off={off}
      $on={slot.base}
      $hoverOn={slot.hover}
      $activeOn={slot.active}
      $dot={disc ?? slot.base}
      $hoverDot={discHover ?? disc ?? slot.hover}
      $activeDot={discActive ?? disc ?? slot.active}
      $inset={`calc(${typeSize} * ${box.insetFactor})`}
      $customCss={customCss}
      {...dom}
      type='radio'
    />
  )
}

Radio.displayName = 'Radio'
