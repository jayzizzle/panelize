import { createContext, type ReactNode, useContext, useMemo } from 'react'
import { css, styled } from 'styled-components'

import { applyColorScheme, createPanelizeTheme, defaultTheme } from '~/src/theme/defaults'
import type { ColorScheme, PanelizeTheme, PanelizeThemeOverrides } from '~/src/theme/types'

function isResolvedTheme(
  theme: PanelizeTheme | PanelizeThemeOverrides | undefined,
): theme is PanelizeTheme {
  return (
    !!theme &&
    'colorSchemes' in theme &&
    theme.colorSchemes?.dark?.muted != null &&
    theme.colorSchemes?.light?.muted != null
  )
}

export const appCssVars = {
  background: '--panelize-app-bg',
  text: '--panelize-app-text',
} as const

const PanelizeThemeContext = createContext<PanelizeTheme>(defaultTheme)

const AppCanvas = styled.div<{
  $colorScheme: ColorScheme
  $background?: string
  $text?: string
}>`
  position: relative;
  min-height: 100%;
  height: 100%;
  color-scheme: ${({ $colorScheme }) => $colorScheme};
  ${({ $background }) =>
    $background
      ? css`
          ${appCssVars.background}: ${$background};
          background: var(${appCssVars.background});
        `
      : ''}
  ${({ $text }) =>
    $text
      ? css`
          ${appCssVars.text}: ${$text};
          color: var(${appCssVars.text});
        `
      : ''}
`

/**
 * Puts the theme on the tree. Wrap the host once. Does not replace the host’s styled-components
 * `ThemeProvider`. Does not set `html` / `body`. `mode` selects `dark` / `light`.
 *
 * @example
 * ```tsx
 * <PanelizeProvider theme={panelizeTheme} mode={mode}>
 *   <App />
 * </PanelizeProvider>
 * ```
 */
export function PanelizeProvider({
  theme,
  mode = 'dark',
  children,
}: {
  theme?: PanelizeTheme | PanelizeThemeOverrides
  /**
   * Active color scheme. Default `dark`. Hosts toggle by passing the other value.
   * Sets CSS `color-scheme` on the canvas wrapper (native scrollbars / form controls).
   */
  mode?: ColorScheme
  children: ReactNode
}) {
  const built = useMemo(
    () => (isResolvedTheme(theme) ? theme : createPanelizeTheme(theme)),
    [theme],
  )
  const value = useMemo(() => applyColorScheme(built, mode), [built, mode])
  const app = value.colors.app

  return (
    <PanelizeThemeContext.Provider value={value}>
      <AppCanvas $colorScheme={mode} $background={app?.background} $text={app?.text}>
        {children}
      </AppCanvas>
    </PanelizeThemeContext.Provider>
  )
}

/**
 * Active theme for views and custom components. `.colors` is the current scheme’s surfaces
 * (`muted` / `base` / `highlighted` / `app`), not `{ dark, light }`. `.mode` is the scheme name.
 * `.brand` / `.status` are shared. Prefer inheriting `--panelize-*` from the nearest `Panel`
 * when you only need surface paint.
 *
 * @example
 * ```tsx
 * const { colors, space } = usePanelizeTheme()
 * ```
 */
export function usePanelizeTheme() {
  return useContext(PanelizeThemeContext)
}
