import { type ComponentPropsWithoutRef } from 'react'
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

import { panelCssVars } from '~/src/components/layout/Panel'
import { resolveChromaSlot } from '~/src/components/text/color'

type StyledChipProps = {
  $size: string
  $weight: string
  $family: string
  $lineHeight: number | string
  $paddingX: string
  $paddingY: string
  $gap: string
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $bg: string
  $fg: string
  $uppercase?: boolean
  $customCss?: string
}

const StyledChip = styled.span<StyledChipProps>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap};
  margin: 0;
  box-sizing: border-box;
  white-space: nowrap;
  font-family: ${({ $family }) => $family};
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $lineHeight }) => $lineHeight};
  padding: ${({ $paddingY, $paddingX }) => `${$paddingY} ${$paddingX}`};
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-color: ${({ $borderColor }) => $borderColor};
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background: ${({ $bg }) => $bg};
  color: ${({ $fg }) => $fg};
  ${({ $uppercase }) => ($uppercase ? 'text-transform: uppercase;' : '')}
  ${({ $customCss }) => $customCss ?? ''}
`

export type ChipProps = ComponentPropsWithoutRef<'span'> & {
  /**
   * Brand (`primary` / `secondary` / `accent`), status (`danger` / …), or raw CSS.
   * Omit `ink` = this chroma on the label. Omit `background` = 12% mix into `--panelize-bg`.
   * Theme default `primary`.
   */
  color?: ColorValue
  /** Font size token or CSS. Theme default `extraSmall`. */
  size?: FontSizeValue
  /** Font weight token or CSS. Theme default `bold`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Omit uses `base`. */
  family?: FontFamilyToken
  /** `text-transform: uppercase`. Theme default `true`. */
  uppercase?: boolean
  /**
   * Visible caption. Preferred over a string as `children`.
   * Custom insides go in `children`; those win if both are set.
   */
  label?: string
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /** Padding on all axes. Space token or CSS. Overrides theme until `paddingX` / `paddingY`. */
  padding?: SpaceValue
  /** Horizontal padding. Overrides `padding`. */
  paddingX?: SpaceValue
  /** Vertical padding. Overrides `padding`. */
  paddingY?: SpaceValue
  /** Border width token or CSS. Theme default `none` (no stroke). */
  borderWidth?: SpaceValue
  /** Border radius token or CSS. Theme default `999px` (capsule). */
  borderRadius?: SpaceValue
  /**
   * Rest fill. Surface, brand, status, or CSS. Omit = tint of `color` into `--panelize-bg`.
   */
  background?: PaintValue
  /**
   * Label ink. Surface, brand, status, or CSS. Omit = `color` chroma (`.base`).
   */
  ink?: PaintValue
  /**
   * Rest border. Surface, brand, status, or CSS. Omit = label chroma. Invisible until `borderWidth`.
   */
  borderColor?: PaintValue
}

/**
 * Badge (`<span>`), not a button. Label uses the chroma slot until `ink`. Place it with layout
 * — no hover, no `alignX`.
 *
 * @example
 * ```tsx
 * <Chip color='accent' label='New' />
 * ```
 */
export function Chip(props: ChipProps) {
  const {
    color,
    size,
    weight,
    family: familyToken,
    uppercase,
    label,
    css: customCss,
    padding,
    paddingX,
    paddingY,
    borderWidth,
    borderRadius,
    background,
    ink,
    borderColor,
    children,
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
  const chip = defaults.chip
  const chroma = resolveChromaSlot(color ?? chip.color, brand, status).base
  const tint = chip.tint
  const tinted = `color-mix(in srgb, ${chroma} ${tint}, var(${panelCssVars.background}, transparent))`
  const bg = resolvePaintValue(background, 'background', colors, brand, status) ?? tinted
  const fg = resolvePaintValue(ink, 'text', colors, brand, status) ?? chroma
  const stroke = resolvePaintValue(borderColor, 'border', colors, brand, status) ?? chroma

  return (
    <StyledChip
      $family={fontFamilies[familyToken ?? 'base']}
      $size={resolveScaleValue(size, chip.size, fontSizes)}
      $weight={resolveScaleValue(weight, chip.weight, fontWeights)}
      $lineHeight={lineHeight}
      $paddingX={resolveScaleValue(paddingX ?? padding, chip.paddingX, space)}
      $paddingY={resolveScaleValue(paddingY ?? padding, chip.paddingY, space)}
      $gap={resolveScaleValue(undefined, chip.gap, space)}
      $borderWidth={resolveScaleValue(borderWidth, 'none', borderWidths)}
      $borderRadius={resolveScaleValue(borderRadius, chip.borderRadius, radii)}
      $borderColor={stroke}
      $bg={bg}
      $fg={fg}
      $uppercase={uppercase ?? chip.uppercase}
      $customCss={customCss}
      {...dom}
    >
      {children ?? label}
    </StyledChip>
  )
}
