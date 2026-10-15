import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  flexItemCss,
  resolveBorderColor,
  resolveBorderEdges,
  resolveBoxEdges,
  resolveBoxSize,
  type ResolvedBoxSize,
  resolveScaleValue,
  scrollCss,
  selfAlignCss,
  sizeCss,
  takeBoxLayout,
  type TrackKind,
  useTrackKind,
} from '~/src/theme/internal'

import {
  type AlignValue,
  type BorderColorValue,
  type BoxSpacingProps,
  type DirectionalBorderProps,
  type PanelColors,
  type PanelVariant,
  type ScrollProps,
  type ScrollValue,
  type SelfAlignProps,
  type SizeProps,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

export const panelCssVars = {
  background: '--panelize-bg',
  text: '--panelize-text',
  textMuted: '--panelize-text-muted',
  textHighlighted: '--panelize-text-highlighted',
  border: '--panelize-border',
} as const

type StyledPanelProps = {
  $flex?: boolean
  $colors: PanelColors
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $scroll?: ScrollValue
  $fill?: boolean
  $alignX?: AlignValue
  $alignY?: AlignValue
  $trackKind?: TrackKind
  $customCss?: string
}

const StyledPanel = styled.div<StyledPanelProps>`
  position: relative;
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  background: var(${panelCssVars.background});
  color: var(${panelCssVars.text});
  border-color: var(${panelCssVars.border});
  ${({ $colors, $borderColor }) => css`
    ${panelCssVars.background}: ${$colors.background};
    ${panelCssVars.text}: ${$colors.text.base};
    ${panelCssVars.textMuted}: ${$colors.text.muted};
    ${panelCssVars.textHighlighted}: ${$colors.text.highlighted};
    ${panelCssVars.border}: ${$borderColor};
  `}
  ${({ $flex }) => flexItemCss($flex, true)}
  ${({ $scroll }) => scrollCss($scroll)}
  ${({ $trackKind, $alignX, $alignY }) => selfAlignCss($trackKind, $alignX, $alignY)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type PanelProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  SelfAlignProps &
  ScrollProps &
  DirectionalBorderProps & {
    /**
     * Grow to fill remaining flex space (`flex: 1 1 0%`, `min-width` / `min-height` 0 so nested
     * `scroll` can shrink). Until then this box is `flex-shrink: 0` so a column of panels does not
     * collapse.
     */
    flex?: boolean
    /**
     * Size to the parent (`height` and `width` 100%). Explicit `width` / `height` win on that axis.
     * Do not use on the inner surface of a scrolling shell — that locks height and the paint
     * will not grow. Use `minHeight="100%"` instead.
     */
    fill?: boolean
    /** Color palette: `muted`, `base`, or `highlighted`. Default `base`. */
    variant?: PanelVariant
    /** Border radius token (`small`) or CSS length. Default `none`. */
    borderRadius?: SpaceValue
    /**
     * Panel surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`), or CSS.
     * Default is this panel’s variant border. `base` is the surface, not a brand slot.
     */
    borderColor?: BorderColorValue
    /** Extra CSS appended to this component’s styles. */
    css?: string
  }

/**
 * Section surface. Direct child of `Panels`, or of a `Cell` / `Col` / `Row` when that spot needs
 * its own surface. Open inside: tracks, `Div`, type, controls, nested `Panels`, custom
 * components. One item sits directly in it; two or more go in `Rows` / `Cols` / `Grid`. Not a
 * stray `Row` / `Col` / `Cell`. `variant` paints `--panelize-*` for descendants.
 *
 * @example
 * ```tsx
 * <Panels fill>
 *   <Panel variant='base' padding='base'>
 *     <Heading level={2}>Account</Heading>
 *   </Panel>
 * </Panels>
 * ```
 */
export function Panel(props: PanelProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    alignX,
    alignY,
    variant = 'base',
    css: customCss,
    borderWidth,
    borderX,
    borderY,
    borderTop,
    borderRight,
    borderBottom,
    borderLeft,
    borderRadius,
    borderColor,
    scroll,
    ...dom
  } = rest
  const { colors, space, borderWidths, radii, defaults, brand, status } = usePanelizeTheme()
  const trackKind = useTrackKind()

  return (
    <StyledPanel
      $flex={flex}
      $fill={fill}
      $colors={colors[variant]}
      $edges={resolveBoxEdges(spacing, defaults.panel, space)}
      $size={resolveBoxSize(size, space)}
      $borderWidth={resolveBorderEdges(
        { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
        defaults.panel.borderWidth,
        borderWidths,
      )}
      $borderRadius={resolveScaleValue(borderRadius, defaults.panel.borderRadius, radii)}
      $borderColor={resolveBorderColor(borderColor, variant, colors, brand, status)}
      $scroll={scroll}
      $alignX={alignX}
      $alignY={alignY}
      $trackKind={trackKind}
      $customCss={customCss}
      {...dom}
    />
  )
}
