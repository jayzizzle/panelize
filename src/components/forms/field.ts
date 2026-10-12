import { css } from 'styled-components'

import { panelCssVars } from '~/src/components/layout/Panel'

export type FieldChromeVars = {
  $size: string
  $weight: string
  $family: string
  $lineHeight: number | string
  $paddingX: string
  $paddingY: string
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $bg: string
  $ink: string
  $focus: string
  $invalid: string
  $italic?: boolean
  $uppercase?: boolean
  $fill?: boolean
  $customCss?: string
}

/** Shared Input / Textarea / Select / MultiSelect chrome. Instance `color` is focus chroma, not ink. */
export const fieldChromeCss = css<FieldChromeVars>`
  appearance: none;
  margin: 0;
  box-sizing: border-box;
  min-width: 0;
  ${({ $fill }) =>
    $fill
      ? css`
          display: block;
          width: 100%;
          height: 100%;
        `
      : ''}
  font-family: ${({ $family }) => $family};
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $lineHeight }) => $lineHeight};
  padding: ${({ $paddingY, $paddingX }) => `${$paddingY} ${$paddingX}`};
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  background: ${({ $bg }) => $bg};
  color: ${({ $ink }) => $ink};
  caret-color: ${({ $focus }) => $focus};
  &::placeholder {
    color: var(${panelCssVars.textMuted});
    opacity: 1;
  }
  ${({ $focus, $invalid }) => css`
    &:focus {
      outline: none;
      border-color: ${$focus};
      box-shadow: 0 0 0 2px color-mix(in srgb, ${$focus} 18%, transparent);
    }
    &:user-invalid,
    &[aria-invalid='true'] {
      border-color: ${$invalid};
      box-shadow: 0 0 0 2px color-mix(in srgb, ${$invalid} 18%, transparent);
      caret-color: ${$invalid};
    }
    &:user-invalid:focus,
    &[aria-invalid='true']:focus {
      border-color: ${$invalid};
      box-shadow: 0 0 0 2px color-mix(in srgb, ${$invalid} 18%, transparent);
      caret-color: ${$invalid};
    }
  `}
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
  &:is(input, textarea):read-only {
    opacity: 0.45;
  }
  ${({ $italic }) =>
    $italic
      ? css`
          font-style: italic;
        `
      : ''}
  ${({ $uppercase }) =>
    $uppercase
      ? css`
          text-transform: uppercase;
        `
      : ''}
`
