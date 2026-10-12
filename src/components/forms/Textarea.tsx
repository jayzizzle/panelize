import { type ComponentPropsWithRef } from 'react'
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

import { fieldChromeCss, type FieldChromeVars } from '~/src/components/forms/field'
import { panelCssVars } from '~/src/components/layout/Panel'
import { resolveFocusColor } from '~/src/components/text/color'

type StyledTextareaProps = FieldChromeVars & {
  $resize: boolean
}

const StyledTextarea = styled.textarea<StyledTextareaProps>`
  ${fieldChromeCss}
  vertical-align: top;
  overflow: auto;
  resize: ${({ $resize }) => ($resize ? 'vertical' : 'none')};
  &:disabled {
    resize: none;
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type TextareaProps = ComponentPropsWithRef<'textarea'> & {
  /**
   * Focus chroma only (border, glow, caret). Not glyph ink — use `ink` (omit = `--panelize-text`).
   * Brand (`primary` / `secondary` / `accent`), status (`danger` / …), or raw CSS. Theme default `primary`.
   */
  color?: ColorValue
  /** Font size token or CSS. Theme default `small`. */
  size?: FontSizeValue
  /** Font weight token or CSS. Theme default `base`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Omit uses `base`. */
  family?: FontFamilyToken
  /** Italic. Default off. */
  italic?: boolean
  /** `text-transform: uppercase`. Default off. */
  uppercase?: boolean
  /**
   * Width and height 100% of the parent. Height `%` only applies when the parent has a
   * definite height. Same idea as layout `fill`.
   */
  fill?: boolean
  /** Vertical resize handle. Theme default `false`. `true` opts in; does not depend on `fill`. */
  resize?: boolean
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /** Padding on all axes. Space token or CSS. Overrides theme until `paddingX` / `paddingY`. */
  padding?: SpaceValue
  /** Horizontal padding. Overrides `padding`. */
  paddingX?: SpaceValue
  /** Vertical padding. Overrides `padding`. */
  paddingY?: SpaceValue
  /** Border width token or CSS. Theme default `extraSmall`. */
  borderWidth?: SpaceValue
  /** Border radius token or CSS. Theme default `base`. */
  borderRadius?: SpaceValue
  /**
   * Rest fill. Surface (`muted` / `base` / `highlighted`), brand, status, or CSS.
   * Omit = nearest panel `--panelize-bg`.
   */
  background?: PaintValue
  /**
   * Glyph ink. Surface (`muted` / `base` / `highlighted` → that text.base), brand, status, or CSS.
   * Omit = `--panelize-text`. Not focus chroma (`color`).
   */
  ink?: PaintValue
  /**
   * Rest border. Surface (`muted` / `base` / `highlighted` → that border), brand, status, or CSS.
   * Omit = `--panelize-border`. Focus / `:user-invalid` still own the stroke.
   */
  borderColor?: PaintValue
}

/**
 * Multiline field. Same chrome as `Input`. Theme starts from merged `defaults.input`. Default
 * `resize` off, `rows` 3. Place with layout.
 *
 * @example
 * ```tsx
 * <Label htmlFor='notes' label='Notes' />
 * <Textarea id='notes' placeholder='Notes' />
 * ```
 */
export function Textarea(props: TextareaProps) {
  const {
    color,
    size,
    weight,
    family: familyToken,
    italic,
    uppercase,
    fill,
    resize,
    css: customCss,
    padding,
    paddingX,
    paddingY,
    borderWidth,
    borderRadius,
    background,
    ink,
    borderColor,
    rows,
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
  const textarea = defaults.textarea

  return (
    <StyledTextarea
      rows={rows ?? textarea.rows}
      $family={fontFamilies[familyToken ?? 'base']}
      $size={resolveScaleValue(size, textarea.size, fontSizes)}
      $weight={resolveScaleValue(weight, textarea.weight, fontWeights)}
      $lineHeight={lineHeight}
      $paddingX={resolveScaleValue(paddingX ?? padding, textarea.paddingX, space)}
      $paddingY={resolveScaleValue(paddingY ?? padding, textarea.paddingY, space)}
      $borderWidth={resolveScaleValue(borderWidth, textarea.borderWidth, borderWidths)}
      $borderRadius={resolveScaleValue(borderRadius, textarea.borderRadius, radii)}
      $bg={
        resolvePaintValue(background, 'background', colors, brand, status) ??
        `var(${panelCssVars.background})`
      }
      $ink={resolvePaintValue(ink, 'text', colors, brand, status) ?? `var(${panelCssVars.text})`}
      $borderColor={
        resolvePaintValue(borderColor, 'border', colors, brand, status) ??
        `var(${panelCssVars.border})`
      }
      $focus={resolveFocusColor(color ?? textarea.color, brand, status)}
      $invalid={status.danger.base}
      $resize={resize ?? textarea.resize}
      $italic={italic}
      $uppercase={uppercase}
      $fill={fill}
      $customCss={customCss}
      {...dom}
    />
  )
}
