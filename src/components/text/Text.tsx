import { type ComponentPropsWithoutRef } from 'react'
import { styled } from 'styled-components'

import { resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  usePanelizeTheme,
} from '~/src/theme'

import { resolveTextColor } from '~/src/components/text/color'
import {
  TextStyleContext,
  textTypographyCss,
  type TextTypographyVars,
} from '~/src/components/text/typography'

const StyledText = styled.p<TextTypographyVars>`
  ${textTypographyCss}
  ${({ $customCss }) => $customCss ?? ''}
`

export type TextProps = ComponentPropsWithoutRef<'p'> & {
  /** Font size token (`small`) or CSS. Theme default `base`. */
  size?: FontSizeValue
  /**
   * Brand (`primary` → `brand.primary.base`), status (`danger` → `status.danger.base`), or raw CSS.
   * Wins over `muted` / `highlighted`. Omit with no flags = that panel’s `text.base`.
   */
  color?: ColorValue
  /** Use the nearest `Panel`’s `text.muted`. Ignored if `color` or `highlighted` is set. */
  muted?: boolean
  /** Use the nearest `Panel`’s `text.highlighted`. Ignored if `color` is set. Wins over `muted`. */
  highlighted?: boolean
  /** Font weight token (`thin` / `base` / `bold` / `heavy`) or CSS (`600`). Theme default `base` (`400`). */
  weight?: FontWeightValue
  /** `fontFamilies` token. Omit uses `base`. */
  family?: FontFamilyToken
  /** Italic. Default off. */
  italic?: boolean
  /** Underline. Default off. */
  underlined?: boolean
  /** `text-transform: uppercase`. Default off. */
  uppercase?: boolean
  /** Extra CSS appended to this component’s styles. */
  css?: string
}

/**
 * Body copy (`<p>`). Use this (or `Heading` / `Span` / `TextLink` / `Label`) for visible writing
 * so it inherits the nearest `Panel` text tokens. Not a layout shell.
 *
 * @example
 * ```tsx
 * <Text muted>A React panel layout library.</Text>
 * ```
 */
export function Text(props: TextProps) {
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
    css: customCss,
    ...dom
  } = props
  const { fontSizes, fontWeights, fontFamilies, lineHeight, defaults, brand, status } =
    usePanelizeTheme()
  const family = fontFamilies[familyToken ?? 'base']
  const resolvedSize = resolveScaleValue(size, defaults.text.size, fontSizes)
  const resolvedWeight = resolveScaleValue(weight, defaults.text.weight, fontWeights)

  return (
    <TextStyleContext.Provider
      value={{
        family,
        size: resolvedSize,
        weight: resolvedWeight,
        lineHeight,
      }}
    >
      <StyledText
        $family={family}
        $size={resolvedSize}
        $color={resolveTextColor(color, highlighted, muted, brand, status)}
        $weight={resolvedWeight}
        $lineHeight={lineHeight}
        $italic={italic}
        $underlined={underlined}
        $uppercase={uppercase}
        $customCss={customCss}
        {...dom}
      />
    </TextStyleContext.Provider>
  )
}
