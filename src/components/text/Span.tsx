import { type ComponentPropsWithoutRef } from 'react'
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
  useTextStyle,
} from '~/src/components/text/typography'

const StyledSpan = styled.span<TextTypographyVars>`
  ${textTypographyCss}
  ${({ $customCss }) => $customCss ?? ''}
`

export type SpanProps = Omit<ComponentPropsWithoutRef<'span'>, 'align'> & {
  /** Font size token (`small`) or CSS. Nested in `Text` with omit = inherit that `Text`. Else theme `base`. */
  size?: FontSizeValue
  /**
   * Brand (`primary` → `brand.primary.base`), status (`danger` → `status.danger.base`), or raw CSS.
   * Wins over `muted` / `highlighted`. Omit = inherit parent color (panel `text.base` if none).
   */
  color?: ColorValue
  /** Use the nearest `Panel`’s `text.muted`. Ignored if `color` or `highlighted` is set. */
  muted?: boolean
  /** Use the nearest `Panel`’s `text.highlighted`. Ignored if `color` is set. Wins over `muted`. */
  highlighted?: boolean
  /** Font weight token or CSS. Nested omit = inherit parent `Text`. Else theme `base` (`400`). */
  weight?: FontWeightValue
  /** `fontFamilies` token. Nested omit = inherit parent `Text`. Else `base`. */
  family?: FontFamilyToken
  /** Italic. Default off (inherits parent `font-style`). */
  italic?: boolean
  /** Underline. Default off. */
  underlined?: boolean
  /** `text-transform: uppercase`. Default off (inherits parent transform). */
  uppercase?: boolean
  /**
   * `text-align` of the glyphs (`start` / `end` / `center` / `justify`). Omit = unset.
   * Not place — that stays on the wrapper (`alignX`). Inline until the span is wide enough.
   */
  align?: TextAlignValue
  /** Extra CSS appended to this component’s styles. */
  css?: string
}

/**
 * Inline run (`<span>`). Nested in `Text` / `Span`: omit size/weight/`family` → inherit that
 * line; omit color → CSS `inherit`. Not a layout shell.
 *
 * @example
 * ```tsx
 * <Text>
 *   Nested <Span weight='bold'>bold</Span>
 * </Text>
 * ```
 */
export function Span(props: SpanProps) {
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
    css: customCss,
    ...dom
  } = props
  const { fontSizes, fontWeights, fontFamilies, lineHeight, defaults, brand, status } =
    usePanelizeTheme()
  const parent = useTextStyle()
  const family =
    familyToken !== undefined ? fontFamilies[familyToken] : (parent?.family ?? fontFamilies.base)
  const resolvedSize =
    size !== undefined
      ? resolveScaleValue(size, defaults.text.size, fontSizes)
      : (parent?.size ?? resolveScaleValue(undefined, defaults.text.size, fontSizes))
  const resolvedWeight =
    weight !== undefined
      ? resolveScaleValue(weight, defaults.text.weight, fontWeights)
      : (parent?.weight ?? resolveScaleValue(undefined, defaults.text.weight, fontWeights))
  const resolvedLineHeight = parent?.lineHeight ?? lineHeight
  const resolvedColor =
    color !== undefined || highlighted || muted
      ? resolveTextColor(color, highlighted, muted, brand, status)
      : 'inherit'

  return (
    <TextStyleContext.Provider
      value={{
        family,
        size: resolvedSize,
        weight: resolvedWeight,
        lineHeight: resolvedLineHeight,
      }}
    >
      <StyledSpan
        $family={family}
        $size={resolvedSize}
        $color={resolvedColor}
        $weight={resolvedWeight}
        $lineHeight={resolvedLineHeight}
        $italic={italic}
        $underlined={underlined}
        $uppercase={uppercase}
        $align={align}
        $customCss={customCss}
        {...dom}
      />
    </TextStyleContext.Provider>
  )
}
