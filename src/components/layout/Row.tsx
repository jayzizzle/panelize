import { type ComponentPropsWithoutRef } from 'react'
import { styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  flexItemCss,
  placeContentCss,
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
  type PlaceProps,
  type SelfAlignProps,
  type SizeProps,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

type StyledRowProps = {
  $flex?: boolean
  $fill?: boolean
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $alignX?: AlignValue
  $alignY?: AlignValue
  $placeX?: AlignValue
  $placeY?: AlignValue
  $trackKind?: TrackKind
  $customCss?: string
}

const StyledRow = styled.div<StyledRowProps>`
  position: relative;
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex, true)}
  ${({ $trackKind, $alignX, $alignY }) => selfAlignCss($trackKind, $alignX, $alignY)}
  ${({ $placeX, $placeY }) => placeContentCss(false, $placeX, $placeY)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type RowProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  SelfAlignProps &
  PlaceProps &
  DirectionalBorderProps & {
    /**
     * Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). Until then this box is
     * `flex-shrink: 0` (same as `Panel`).
     */
    flex?: boolean
    /**
     * Size to the parent on axes without a size. Theme `height` is `auto`, so omit `height` → width
     * 100% only. Explicit `width` / `height` win.
     */
    fill?: boolean
    /** Border radius token or CSS length. Default `none`. */
    borderRadius?: SpaceValue
    /**
     * Panel surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`), or CSS.
     * Default is `base` border. `base` is the surface, not a brand slot.
     */
    borderColor?: BorderColorValue
    /** Extra CSS appended to this component’s styles. */
    css?: string
  }

/**
 * One band in a `Rows` track. Direct child of `Rows` only. Place content here (`Text`, `Cols`,
 * controls). This box owns `alignX` / `fill` / size (its place in the track) and `placeX` /
 * `placeY` (contents). Children do not position themselves.
 *
 * @example
 * ```tsx
 * <Rows gap='small'>
 *   <Row>
 *     <Text>One</Text>
 *   </Row>
 *   <Row>
 *     <Text>Two</Text>
 *   </Row>
 * </Rows>
 * ```
 */
export function Row(props: RowProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    alignX,
    alignY,
    placeX,
    placeY,
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
    <StyledRow
      $flex={flex}
      $fill={fill}
      $edges={resolveBoxEdges(spacing, defaults.row, space)}
      $size={resolveBoxSize(size, space, { height: defaults.row.height })}
      $borderWidth={resolveBorderEdges(
        { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
        defaults.row.borderWidth,
        borderWidths,
      )}
      $borderRadius={resolveScaleValue(borderRadius, defaults.row.borderRadius, radii)}
      $borderColor={resolveBorderColor(borderColor, 'base', colors, brand, status)}
      $alignX={alignX}
      $alignY={alignY}
      $placeX={placeX}
      $placeY={placeY}
      $trackKind={trackKind}
      $customCss={customCss}
      {...dom}
    />
  )
}
