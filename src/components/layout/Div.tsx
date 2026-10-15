import { type ComponentPropsWithoutRef } from 'react'
import { styled } from 'styled-components'

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
  type SelfAlignProps,
  type SizeProps,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

import { panelCssVars } from '~/src/components/layout/Panel'

type StyledDivProps = {
  $flex?: boolean
  $fill?: boolean
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $alignX?: AlignValue
  $alignY?: AlignValue
  $trackKind?: TrackKind
  $customCss?: string
}

const StyledDiv = styled.div<StyledDivProps>`
  position: relative;
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex, true)}
  ${({ $trackKind, $alignX, $alignY }) => selfAlignCss($trackKind, $alignX, $alignY)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type DivProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  SelfAlignProps &
  DirectionalBorderProps & {
    /**
     * Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). Until then this box is
     * `flex-shrink: 0` (same as `Panel`).
     */
    flex?: boolean
    /** Size to the parent (`height` and `width` 100%). Explicit `width` / `height` win on that axis. */
    fill?: boolean
    /** Border radius token or CSS length. Default `none`. */
    borderRadius?: SpaceValue
    /**
     * Panel surface, brand (`primary`), status (`danger`), or raw CSS.
     * Omitted uses the parent `Panel` border (`var(--panelize-border)`).
     * Does not paint a panel background.
     */
    borderColor?: BorderColorValue
    /** Extra CSS appended to this component’s styles. */
    css?: string
  }

/**
 * Catch-all box (spacing, size, border, `fill` / `flex`). No surface paint. Use when a single
 * wrapper around one item is enough. Two or more items go in `Rows` / `Cols` / `Grid`. Not a
 * substitute for `Row` / `Col` / `Cell` (those still belong under their tracks).
 *
 * @example
 * ```tsx
 * <Panels fill>
 *   <Panel padding='base'>
 *     <Div maxWidth='24rem'>
 *       <Rows>
 *         <Row>
 *           <Heading level={2}>Card</Heading>
 *         </Row>
 *         <Row>
 *           <Text muted>Body</Text>
 *         </Row>
 *       </Rows>
 *     </Div>
 *   </Panel>
 * </Panels>
 * ```
 */
export function Div(props: DivProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    alignX,
    alignY,
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
  const { colors, space, borderWidths, radii, defaults, brand, status } = usePanelizeTheme()
  const trackKind = useTrackKind()

  return (
    <StyledDiv
      $flex={flex}
      $fill={fill}
      $edges={resolveBoxEdges(spacing, defaults.div, space)}
      $size={resolveBoxSize(size, space)}
      $borderWidth={resolveBorderEdges(
        { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
        defaults.div.borderWidth,
        borderWidths,
      )}
      $borderRadius={resolveScaleValue(borderRadius, defaults.div.borderRadius, radii)}
      $borderColor={
        borderColor === undefined
          ? `var(${panelCssVars.border})`
          : resolveBorderColor(borderColor, 'base', colors, brand, status)
      }
      $alignX={alignX}
      $alignY={alignY}
      $trackKind={trackKind}
      $customCss={customCss}
      {...dom}
    />
  )
}
