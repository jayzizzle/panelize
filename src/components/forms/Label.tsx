import { type ComponentPropsWithRef } from 'react'
import { styled } from 'styled-components'

import { resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  type TextAlignValue,
  usePanelizeTheme,
} from '~/src/theme'

import { resolveTextColor } from '~/src/components/text/color'
import {
  TextStyleContext,
  textTypographyCss,
  type TextTypographyVars,
} from '~/src/components/text/typography'

type StyledLabelProps = TextTypographyVars & {
  $clickable?: boolean
}

const controlSel = ':is(button, input, select, textarea)'

const StyledLabel = styled.label<StyledLabelProps>`
  display: inline-block;
  cursor: ${({ $clickable }) => ($clickable ? 'pointer' : 'default')};
  ${textTypographyCss}
  line-height: 1;
  text-box: trim-both cap alphabetic;
  &[for],
  &:has(${controlSel}) {
    cursor: pointer;
  }
  &:has(${controlSel}:disabled) {
    cursor: not-allowed;
  }
  &:has(${controlSel}) {
    text-box: unset;
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type LabelProps = Omit<ComponentPropsWithRef<'label'>, 'align'> & {
  /** Font size token or CSS. Theme default `base` (`defaults.text`). */
  size?: FontSizeValue
  /**
   * Glyph ink. Brand, status, or raw CSS. Wins over `muted` / `highlighted`.
   * Omit = panel `text.base`. Fields use `ink` for glyphs (`color` there is focus).
   */
  color?: ColorValue
  /** Use the nearest `Panel`’s `text.muted`. Ignored if `color` or `highlighted` is set. */
  muted?: boolean
  /** Use the nearest `Panel`’s `text.highlighted`. Ignored if `color` is set. Wins over `muted`. */
  highlighted?: boolean
  /** Font weight token or CSS. Theme default `base`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Omit uses `base`. */
  family?: FontFamilyToken
  /** Italic. Default off. */
  italic?: boolean
  /** Underline. Default off. */
  underlined?: boolean
  /** `text-transform: uppercase`. Default off. */
  uppercase?: boolean
  /**
   * `text-align` of the glyphs (`start` / `end` / `center` / `justify`). Omit = unset.
   * Not place — that stays on the wrapper (`alignX`).
   */
  align?: TextAlignValue
  /**
   * Visible caption. Preferred over a string as `children`.
   * Custom insides (`Span` / host icons) go in `children`; those win if both are set.
   */
  label?: string
  /** Extra CSS appended to this component’s styles. */
  css?: string
}

/**
 * Caption (`<label>`). Ink like `Text`. Prefer `label` + `htmlFor` at a control `id`. Wrap
 * `Switch` / `Checkbox` / `Radio` (same `size`). Not a layout shell.
 *
 * @example
 * ```tsx
 * <Label htmlFor='email' label='Email' />
 * <Input id='email' />
 * ```
 */
export function Label(props: LabelProps) {
  const {
    size,
    color,
    muted,
    highlighted,
    weight,
    family: familyToken,
    italic,
    underlined,
    uppercase,
    align,
    label,
    css: customCss,
    children,
    onClick,
    ...dom
  } = props
  const { fontSizes, fontWeights, fontFamilies, defaults, brand, status } = usePanelizeTheme()
  const family = fontFamilies[familyToken ?? 'base']
  const resolvedSize = resolveScaleValue(size, defaults.text.size, fontSizes)
  const resolvedWeight = resolveScaleValue(weight, defaults.text.weight, fontWeights)

  return (
    <TextStyleContext.Provider
      value={{
        family,
        size: resolvedSize,
        weight: resolvedWeight,
        lineHeight: 1,
      }}
    >
      <StyledLabel
        $family={family}
        $size={resolvedSize}
        $color={resolveTextColor(color, highlighted, muted, brand, status)}
        $weight={resolvedWeight}
        $lineHeight={1}
        $italic={italic}
        $underlined={underlined}
        $uppercase={uppercase}
        $align={align}
        $clickable={typeof onClick === 'function'}
        $customCss={customCss}
        onClick={onClick}
        {...dom}
      >
        {children ?? label}
      </StyledLabel>
    </TextStyleContext.Provider>
  )
}

Label.displayName = 'Label'
