/** Named aliases on the 7-step ramp. Same names as later hue ramps (`palette.red.dark`, …). */
export const grayTokens = ['extraDark', 'dark', 'base', 'light', 'extraLight'] as const

export type GrayToken = (typeof grayTokens)[number]

/** Even-L* grayscale including black (`0`) and white (`6`). */
export const grayRampTokens = [0, 1, 2, 3, 4, 5, 6] as const

export type GrayRampToken = (typeof grayRampTokens)[number]

export type GrayScale = Record<GrayToken | GrayRampToken, string>

const grayRamp = [
  '#000000',
  '#292929',
  '#4e4e4e',
  '#777777',
  '#a2a2a2',
  '#d0d0d0',
  '#ffffff',
] as const

/**
 * Importable color bank. Not a `createPanelizeTheme` key.
 * `palette.gray[0]`–`[6]` is the CVD-spaced ramp. Names alias those steps.
 * Adjacent steps are not a text-on-fill pair — skip at least one.
 */
export const palette = {
  black: grayRamp[0],
  white: grayRamp[6],
  gray: {
    0: grayRamp[0],
    1: grayRamp[1],
    2: grayRamp[2],
    3: grayRamp[3],
    4: grayRamp[4],
    5: grayRamp[5],
    6: grayRamp[6],
    extraDark: grayRamp[1],
    dark: grayRamp[2],
    base: grayRamp[3],
    light: grayRamp[4],
    extraLight: grayRamp[5],
  } satisfies GrayScale,
} as const

export type Palette = typeof palette
