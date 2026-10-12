import { type FontFamilyScale, type FontSizeScale, type FontWeightScale } from '~/src/theme/types'

/** Tailwind-adjacent rem scale (16px root). */
export const defaultFontSizes: FontSizeScale = {
  extraSmall: '0.75rem',
  small: '0.875rem',
  base: '1rem',
  large: '1.25rem',
  extraLarge: '1.5rem',
}

/** CSS `font-weight`. `Text` defaults to `base` so parent weight does not leak. Host must load `thin` (100). */
export const defaultFontWeights: FontWeightScale = {
  thin: '100',
  base: '400',
  bold: '700',
  heavy: '800',
}

/** Host apps must load these files. The library only sets `font-family`. */
export const defaultFontFamilies: FontFamilyScale = {
  base: '"Open Sans", sans-serif',
  display: 'Montserrat, sans-serif',
  mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
}

/** Unitless UI leading (`font-size × this`). Tight so flex centers the glyphs, not extra leading. */
export const defaultLineHeight = 1.2
