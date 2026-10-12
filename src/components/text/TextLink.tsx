import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import { resolveScaleValue } from '~/src/theme/internal'

import {
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  usePanelizeTheme,
} from '~/src/theme'

import { isChromaToken, resolveLinkHover, resolveTextColor } from '~/src/components/text/color'
import {
  textTypographyCss,
  type TextTypographyVars,
  useTextStyle,
} from '~/src/components/text/typography'

type StyledTextLinkProps = TextTypographyVars & {
  $hover: string
  $active: string
  $hoverUnderline?: boolean
}

const linkLineCss = css`
  text-decoration: underline;
`

const StyledTextLink = styled.a<StyledTextLinkProps>`
  padding: 0;
  border: 0;
  background: none;
  cursor: pointer;
  text-decoration: none;
  ${textTypographyCss}
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  &:hover {
    color: ${({ $hover }) => $hover};
    ${({ $hoverUnderline, $underlined }) => ($hoverUnderline || $underlined ? linkLineCss : '')}
  }
  &:active {
    color: ${({ $active }) => $active};
    ${({ $hoverUnderline, $underlined }) => ($hoverUnderline || $underlined ? linkLineCss : '')}
  }
  ${({ $customCss }) => $customCss ?? ''}
`

export type TextLinkProps = ComponentPropsWithoutRef<'a'> & {
  /** Font size token (`small`) or CSS. Nested in `Text` / `Span` with omit = inherit. Else theme `base`. */
  size?: FontSizeValue
  /**
   * Brand (`primary` → `brand.primary.base`), status (`danger` → `status.danger.base`), or raw CSS.
   * Theme default `primary`. Wins over `muted` / `highlighted`.
   */
  color?: ColorValue
  /** Use the nearest `Panel`’s `text.muted`. Ignored if `color` or `highlighted` is set. */
  muted?: boolean
  /** Use the nearest `Panel`’s `text.highlighted`. Ignored if `color` is set. Wins over `muted`. */
  highlighted?: boolean
  /** Font weight token or CSS. Nested omit = inherit parent `Text` / `Span`. Else theme `base`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Nested omit = inherit parent `Text` / `Span`. Else `base`. */
  family?: FontFamilyToken
  /** Italic. Default off. */
  italic?: boolean
  /** Underline at rest. Default off. */
  underlined?: boolean
  /** `text-transform: uppercase`. Default off. */
  uppercase?: boolean
  /** Extra CSS appended to this component’s styles. */
  css?: string
}

/**
 * Inline link (`<a>`). Default chroma `primary`. Nested omit size/weight/`family` → inherit.
 * Not a layout shell.
 *
 * @example
 * ```tsx
 * <Text>
 *   See <TextLink href='/docs'>docs</TextLink>
 * </Text>
 * ```
 */
export function TextLink(props: TextLinkProps) {
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
  const parent = useTextStyle()
  const restToken = color ?? (muted || highlighted ? undefined : defaults.textLink.color)
  const hoverToken =
    defaults.textLink.hover === 'inherit'
      ? 'inherit'
      : isChromaToken(color)
        ? color
        : defaults.textLink.hover
  const { hover, active } = resolveLinkHover(restToken, hoverToken, brand, status)
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

  return (
    <StyledTextLink
      $family={family}
      $size={resolvedSize}
      $color={resolveTextColor(restToken, highlighted, muted, brand, status)}
      $hover={hover}
      $active={active}
      $weight={resolvedWeight}
      $lineHeight={parent?.lineHeight ?? lineHeight}
      $italic={italic}
      $underlined={underlined}
      $hoverUnderline={defaults.textLink.hoverUnderline}
      $uppercase={uppercase}
      $customCss={customCss}
      {...dom}
    />
  )
}
