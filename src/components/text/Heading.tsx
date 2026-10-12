import { type ComponentPropsWithoutRef } from 'react'
import { styled } from 'styled-components'

import { resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  type HeadingLevel,
  usePanelizeTheme,
} from '~/src/theme'

import { resolveTextColor } from '~/src/components/text/color'
import {
  TextStyleContext,
  textTypographyCss,
  type TextTypographyVars,
} from '~/src/components/text/typography'

type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6'

const headingTags: Record<HeadingLevel, HeadingTag> = {
  1: 'h1',
  2: 'h2',
  3: 'h3',
  4: 'h4',
  5: 'h5',
  6: 'h6',
}

const StyledHeading = styled.h1<TextTypographyVars>`
  ${textTypographyCss}
  line-height: 1;
  text-box: trim-both cap alphabetic;
  ${({ $customCss }) => $customCss ?? ''}
`

export type HeadingProps = ComponentPropsWithoutRef<'h1'> & {
  /**
   * HTML heading level (`h1`–`h6`). Required. Size comes from `defaults.heading.size` unless `size` is set.
   * No UA margin/padding. Line box hugs cap height (`line-height: 1` + `text-box` trim). Gap belongs on a layout parent.
   */
  level: HeadingLevel
  /** Font size token or CSS. Omit uses `defaults.heading.size[level]`. */
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
  /** Font weight token (`thin` / `base` / `bold` / `heavy`) or CSS (`600`). Theme default `bold`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Theme default `display`. */
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
 * Heading (`h1`–`h6`). Required `level`. Omit `size` → theme size for that level. Not a layout
 * shell — put gap on `Rows` / `Cols`.
 *
 * @example
 * ```tsx
 * <Heading level={1} uppercase color='primary'>
 *   Panelize
 * </Heading>
 * ```
 */
export function Heading(props: HeadingProps) {
  const {
    level,
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
  const { fontSizes, fontWeights, fontFamilies, defaults, brand, status } = usePanelizeTheme()
  const family = fontFamilies[familyToken ?? defaults.heading.family]
  const levelSize = defaults.heading.size[level]
  const resolvedSize =
    size === undefined ? levelSize : resolveScaleValue(size, levelSize, fontSizes)
  const resolvedWeight = resolveScaleValue(weight, defaults.heading.weight, fontWeights)
  const headingLineHeight = 1

  return (
    <TextStyleContext.Provider
      value={{
        family,
        size: resolvedSize,
        weight: resolvedWeight,
        lineHeight: headingLineHeight,
      }}
    >
      <StyledHeading
        as={headingTags[level]}
        $family={family}
        $size={resolvedSize}
        $color={resolveTextColor(color, highlighted, muted, brand, status)}
        $weight={resolvedWeight}
        $lineHeight={headingLineHeight}
        $italic={italic}
        $underlined={underlined}
        $uppercase={uppercase}
        $customCss={customCss}
        {...dom}
      />
    </TextStyleContext.Provider>
  )
}
