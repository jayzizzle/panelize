import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  defaultFlexAlign,
  flexAlignCss,
  flexItemCss,
  resolveAlignValue,
  resolveBorderColor,
  resolveBorderEdges,
  resolveBoxEdges,
  resolveBoxSize,
  resolveBreakpointValue,
  type ResolvedBoxSize,
  resolveScaleValue,
  scrollCss,
  sizeCss,
  stackedMainAlign,
  stackQueryCss,
  takeBoxLayout,
  TrackProvider,
} from '~/src/theme/internal'

import {
  type AlignValue,
  type BorderColorValue,
  type BoxSpacingProps,
  type DirectionalBorderProps,
  type FlexAlignProps,
  type ScrollProps,
  type ScrollValue,
  type SizeProps,
  type SpaceValue,
  type StackValue,
  usePanelizeTheme,
} from '~/src/theme'

type StyledPanelsProps = {
  $horizontal?: boolean
  $flex?: boolean
  $fill?: boolean
  $relative?: boolean
  $gap: string
  $stackMax?: string
  $stackedJustify: AlignValue
  $scroll?: ScrollValue
  $alignX: AlignValue
  $alignY: AlignValue
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $customCss?: string
}

/** Absolute `fill` stretches to the containing block. `width`/`height: 100%` overflows the page by a pixel. */
function panelsSizeCss(size: ResolvedBoxSize, fill?: boolean, relative?: boolean) {
  if (!fill || relative) {
    return sizeCss(size, fill)
  }

  const insetX = size.width === undefined
  const insetY = size.height === undefined

  return css`
    ${
      insetY
        ? css`
            top: 0;
            bottom: 0;
          `
        : ''
    }
    ${
      insetX
        ? css`
            left: 0;
            right: 0;
          `
        : ''
    }
    ${sizeCss(size, false)}
  `
}

const StyledPanels = styled.div<StyledPanelsProps>`
  display: flex;
  flex-direction: ${({ $horizontal }) => ($horizontal ? 'row' : 'column')};
  position: ${({ $relative }) => ($relative ? 'relative' : 'absolute')};
  gap: ${({ $gap }) => $gap};
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill, $relative }) => panelsSizeCss($size, $fill, $relative)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex)}
  ${({ $horizontal, $alignX, $alignY }) => flexAlignCss(!$horizontal, $alignX, $alignY)}
  ${({ $stackMax, $stackedJustify }) =>
    $stackMax ? stackQueryCss($stackMax, $stackedJustify) : ''}
  ${({ $scroll }) => scrollCss($scroll)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type PanelsProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  FlexAlignProps &
  ScrollProps &
  DirectionalBorderProps & {
    /** Lay children out in a row. Default is a column. */
    horizontal?: boolean
    /** Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). */
    flex?: boolean
    /**
     * Size to the parent. Default (absolute): `inset: 0` on axes without explicit `width` / `height`.
     * `relative`: `height` / `width` 100% instead. Explicit size still wins on that axis.
     * Does not change position (`absolute` unless `relative`).
     * Page: `<Panels fill scroll="vertical">` with inner `Panel minHeight="100%"` (not `fill`).
     * Split: `<Panels horizontal fill>` — `scroll` on the pane, not here.
     * Center in the window: `alignX="center"` `alignY="center"`, no `flex` on children, no `scroll` here.
     */
    fill?: boolean
    /** Stay in document flow (`position: relative`). Default is `absolute`. */
    relative?: boolean
    /** Space between child `Panel`s. Token or CSS length. Theme default is `none`. */
    gap?: SpaceValue
    /**
     * For `horizontal` `Panels` only (ignored on the default column).
     * Become a column when this box is at most this wide (`sm` / `md` / `lg`, or CSS).
     * Measures this `Panels`, not the viewport. `stack="md"` is not Tailwind `md:` (that is and-up).
     * While stacked, children stretch full width (`alignX` centering is ignored).
     * Column packing uses explicit `alignY`, or `start` if `alignY` was omitted (not row `stretch`).
     */
    stack?: StackValue
    /** Border radius token or CSS length. Default `none`. */
    borderRadius?: SpaceValue
    /**
     * Panel surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`), or CSS.
     * Default is `base` border. Does not paint a panel background.
     */
    borderColor?: BorderColorValue
    /** Extra CSS appended to this component’s styles. */
    css?: string
  }

/**
 * Outer shell of a view. Direct children must be `Panel` (one is allowed).
 * Default is an absolute column. `relative` stays in flow. `horizontal` is a row (sidebar + main).
 *
 * @example
 * ```tsx
 * <Panels fill scroll='vertical'>
 *   <Panel variant='muted' minHeight='100%'>
 *     <Heading level={1}>Title</Heading>
 *   </Panel>
 * </Panels>
 * ```
 */
export function Panels(props: PanelsProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    horizontal,
    flex,
    fill,
    relative,
    stack,
    scroll,
    alignX,
    alignY,
    gap,
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
    ...dom
  } = rest
  const { space, breakpoints, defaults, colors, borderWidths, radii, brand, status } =
    usePanelizeTheme()
  const fallbackAlign = defaultFlexAlign(!horizontal)

  return (
    <TrackProvider kind={horizontal ? 'row' : 'column'}>
      <StyledPanels
        $horizontal={horizontal}
        $flex={flex}
        $fill={fill}
        $relative={relative}
        $gap={resolveScaleValue(gap, defaults.panels.gap, space)}
        $stackMax={horizontal ? resolveBreakpointValue(stack, breakpoints) : undefined}
        $stackedJustify={stackedMainAlign(alignY)}
        $scroll={scroll}
        $alignX={resolveAlignValue(alignX, fallbackAlign.alignX)}
        $alignY={resolveAlignValue(alignY, fallbackAlign.alignY)}
        $edges={resolveBoxEdges(spacing, defaults.panels, space)}
        $size={resolveBoxSize(size, space)}
        $borderWidth={resolveBorderEdges(
          { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
          'none',
          borderWidths,
        )}
        $borderRadius={resolveScaleValue(borderRadius, 'none', radii)}
        $borderColor={resolveBorderColor(borderColor, 'base', colors, brand, status)}
        $customCss={customCss}
        {...dom}
      />
    </TrackProvider>
  )
}
