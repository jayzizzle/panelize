import { type ComponentPropsWithRef } from 'react'
import { styled } from 'styled-components'

import { resolvePaintValue, resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontSizeValue,
  type PaintValue,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

import { panelCssVars } from '~/src/components/layout/Panel'
import { resolveChromaSlot } from '~/src/components/text/color'

type StyledSwitchProps = {
  $width: string
  $height: string
  $size: string
  $thumb: string
  $inset: string
  $radius: string
  $off: string
  $on: string
  $hoverOn: string
  $activeOn: string
  $ink: string
  $customCss?: string
}

const StyledSwitch = styled.input<StyledSwitchProps>`
  appearance: none;
  margin: 0;
  flex-shrink: 0;
  box-sizing: border-box;
  position: relative;
  display: inline-block;
  vertical-align: middle;
  width: ${({ $width }) => $width};
  height: ${({ $height }) => $height};
  font-size: ${({ $size }) => $size};
  padding: 0;
  border: none;
  border-radius: ${({ $radius }) => $radius};
  background: ${({ $off }) => $off};
  cursor: pointer;
  transition:
    background 120ms ease,
    box-shadow 120ms ease;
  &::before {
    content: '';
    position: absolute;
    top: 50%;
    left: ${({ $inset }) => $inset};
    width: ${({ $thumb }) => $thumb};
    height: ${({ $thumb }) => $thumb};
    margin-top: calc(${({ $thumb }) => $thumb} / -2);
    border-radius: min(${({ $radius }) => $radius}, 50%);
    background: ${({ $ink }) => $ink};
    box-shadow: 0 1px 2px rgb(0 0 0 / 35%);
    transition: left 120ms ease;
  }
  &:checked {
    background: ${({ $on }) => $on};
  }
  &:checked:hover:not(:disabled) {
    background: ${({ $hoverOn }) => $hoverOn};
  }
  &:checked:active:not(:disabled) {
    background: ${({ $activeOn }) => $activeOn};
  }
  &:checked::before {
    left: calc(100% - ${({ $inset, $thumb }) => `${$inset} - ${$thumb}`});
  }
  &:focus-visible {
    outline: none;
    box-shadow: 0 0 0 2px color-mix(in srgb, ${({ $on }) => $on} 18%, transparent);
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
  @media (prefers-reduced-motion: reduce) {
    transition: none;
    &::before {
      transition: none;
    }
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type SwitchProps = Omit<ComponentPropsWithRef<'input'>, 'size' | 'type'> & {
  /**
   * On-track chroma. Brand (`primary` / `secondary` / `accent`), status (`danger` / …), or raw CSS.
   * Theme default `primary`. Off-track is not this slot — use `background`.
   */
  color?: ColorValue
  /**
   * Type size token or CSS. Track height is this size × theme `lineHeight` (keep `lineHeight`
   * unitless). Width is this size × `defaults.switch.widthFactor`. Theme default `base`. Native
   * HTML `size` is omitted. Use the same `size` on the paired `Label`.
   */
  size?: FontSizeValue
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /**
   * Off-track fill. Surface, brand, status, or CSS.
   * Omit = mix of `--panelize-text` into `--panelize-bg`.
   */
  background?: PaintValue
  /**
   * Thumb fill. Surface, brand, status, or CSS. Theme default `palette.white`.
   */
  ink?: PaintValue
  /** Track width. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  width?: SpaceValue
  /** Track height. Space token or CSS (not `fontSizes`). Overrides `size` on this axis. */
  height?: SpaceValue
  /**
   * Track radius. Space token or CSS. Theme default `999px` (capsule). Thumb uses
   * `min(this, 50%)` so a capsule stays round and a token like `small` squares both pieces.
   */
  borderRadius?: SpaceValue
}

/**
 * Native switch (`role='switch'`). On-track is `color` chroma; thumb is `ink`. Wrap with
 * `Label` (same `size`). No `fill` / `label` / `children`.
 *
 * @example
 * ```tsx
 * <Label htmlFor='air'>
 *   <Cols gap='small' alignY='center'>
 *     <Col>
 *       <Switch id='air' checked={on} onChange={(e) => setOn(e.target.checked)} />
 *     </Col>
 *     <Col>
 *       <Text>Airplane mode</Text>
 *     </Col>
 *   </Cols>
 * </Label>
 * ```
 */
export function Switch(props: SwitchProps) {
  const {
    color,
    size,
    css: customCss,
    background,
    ink,
    width,
    height,
    borderRadius,
    ...dom
  } = props
  const { space, radii, fontSizes, defaults, brand, status, colors, lineHeight } =
    usePanelizeTheme()
  const sw = defaults.switch
  const slot = resolveChromaSlot(color ?? sw.color, brand, status)
  const off =
    resolvePaintValue(background, 'background', colors, brand, status) ??
    `color-mix(in srgb, var(${panelCssVars.text}) 28%, var(${panelCssVars.background}))`
  const thumbInk = resolvePaintValue(ink, 'text', colors, brand, status) ?? sw.ink
  const typeSize = resolveScaleValue(size, sw.size, fontSizes)
  const trackHeight =
    height !== undefined
      ? resolveScaleValue(height, typeSize, space)
      : `calc(${typeSize} * ${lineHeight})`
  const trackWidth =
    width !== undefined
      ? resolveScaleValue(width, typeSize, space)
      : `calc(${typeSize} * ${sw.widthFactor})`
  const inset = `calc(${typeSize} * ${sw.insetFactor})`
  const thumb = `calc(${trackHeight} - 2 * ${inset})`

  return (
    <StyledSwitch
      $width={trackWidth}
      $height={trackHeight}
      $size={typeSize}
      $thumb={thumb}
      $inset={inset}
      $radius={resolveScaleValue(borderRadius, sw.borderRadius, radii)}
      $off={off}
      $on={slot.base}
      $hoverOn={slot.hover}
      $activeOn={slot.active}
      $ink={thumbInk}
      $customCss={customCss}
      {...dom}
      type='checkbox'
      role='switch'
    />
  )
}

Switch.displayName = 'Switch'
