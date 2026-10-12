import { describe, expect, it } from 'vitest'

import { createPanelizeTheme, defaultTheme, palette } from '~/src/theme'

describe('createPanelizeTheme', () => {
  it('starts in dark mode with the dark scheme active', () => {
    const theme = createPanelizeTheme()
    expect(theme.mode).toBe('dark')
    expect(theme.colors).toEqual(theme.colorSchemes.dark)
  })

  it('expands a brand hex into base / hover / active', () => {
    const { brand } = createPanelizeTheme({ brand: { primary: '#336699' } })
    expect(brand.primary.base).toBe('#336699')
    expect(brand.primary.hover).not.toBe(brand.primary.base)
    expect(brand.primary.active).not.toBe(brand.primary.base)
  })

  it('makes secondary and accent follow primary until set', () => {
    const { brand } = createPanelizeTheme({
      brand: { primary: '#336699', accent: '#00ff00' },
    })
    expect(brand.secondary).toEqual(brand.primary)
    expect(brand.accent.base).toBe('#00ff00')
  })

  it('does not make status follow primary', () => {
    const { status } = createPanelizeTheme({ brand: { primary: '#336699' } })
    expect(status.danger).toEqual(defaultTheme.status.danger)
  })

  it('overrides one surface and keeps the rest of the scheme', () => {
    const theme = createPanelizeTheme({
      colors: { dark: { muted: { background: '#010101' } } },
    })
    expect(theme.colorSchemes.dark.muted.background).toBe('#010101')
    expect(theme.colorSchemes.dark.muted.text).toEqual(defaultTheme.colorSchemes.dark.muted.text)
    expect(theme.colorSchemes.dark.base).toEqual(defaultTheme.colorSchemes.dark.base)
    expect(theme.colorSchemes.light).toEqual(defaultTheme.colorSchemes.light)
  })

  it('ignores a top-level colors.muted', () => {
    const theme = createPanelizeTheme({
      // @ts-expect-error surfaces belong under a scheme
      colors: { muted: { background: '#010101' } },
    })
    expect(theme.colorSchemes.dark.muted.background).toBe(
      defaultTheme.colorSchemes.dark.muted.background,
    )
  })

  it('starts defaults.textarea and defaults.select from the merged defaults.input', () => {
    const theme = createPanelizeTheme({ defaults: { input: { borderRadius: 'large' } } })
    expect(theme.defaults.textarea.borderRadius).toBe('large')
    expect(theme.defaults.select.borderRadius).toBe('large')
  })
})

describe('palette', () => {
  it('is a 7-step ramp from black to white with aliases', () => {
    expect(palette.gray[0]).toBe('#000000')
    expect(palette.gray[6]).toBe('#ffffff')
    expect(palette.black).toBe(palette.gray[0])
    expect(palette.white).toBe(palette.gray[6])
    expect(palette.gray.extraDark).toBe(palette.gray[1])
    expect(palette.gray.extraLight).toBe(palette.gray[5])
  })
})
