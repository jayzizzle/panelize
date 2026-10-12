import { createContext, useContext } from 'react'
import { css } from 'styled-components'

export type TextStyleValue = {
  family: string
  size: string
  weight: string
  lineHeight: number | string
}

export const TextStyleContext = createContext<TextStyleValue | null>(null)

export function useTextStyle() {
  return useContext(TextStyleContext)
}

export type TextTypographyVars = {
  $family: string
  $size: string
  $color: string
  $weight: string
  $lineHeight: number | string
  $italic?: boolean
  $underlined?: boolean
  $uppercase?: boolean
  $customCss?: string
}

export const textTypographyCss = css<TextTypographyVars>`
  margin: 0;
  padding: 0;
  font-family: ${({ $family }) => $family};
  font-size: ${({ $size }) => $size};
  color: ${({ $color }) => $color};
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $lineHeight }) => $lineHeight};
  ${({ $italic }) =>
    $italic
      ? css`
          font-style: italic;
        `
      : ''}
  ${({ $underlined }) =>
    $underlined
      ? css`
          text-decoration: underline;
        `
      : ''}
  ${({ $uppercase }) =>
    $uppercase
      ? css`
          text-transform: uppercase;
        `
      : ''}
`
