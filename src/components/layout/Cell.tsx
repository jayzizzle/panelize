import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  gridSelfAlignCss,
  placeContentCss,
  resolveBorderColor,
  resolveBorderEdges,
  resolveBoxEdges,
  type ResolvedSizeLimits,
  resolveScaleValue,
  resolveSizeLimits,
  sizeLimitCss,
  takeBoxLayout,
} from '~/src/theme/internal'

import {
  type AlignValue,
  type BorderColorValue,
  type BoxSpacingProps,
  type DirectionalBorderProps,
  type PlaceProps,
  type SizeLimitProps,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

type StyledCellProps = {
  $spanX?: number
  $spanY?: number
  $alignX?: AlignValue
  $alignY?: AlignValue
  $edges: BoxEdges
  $size: ResolvedSizeLimits
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $placeX?: AlignValue
  $placeY?: AlignValue
  $customCss?: string
}

function spanCss(axis: 'column' | 'row', count: number | undefined) {
  if (count === undefined || !Number.isFinite(count) || count < 1 || Math.floor(count) === 1) {
    return
  }

  const span = Math.floor(count)
  return axis === 'column'
    ? css`
        grid-column: span ${span};
      `
    : css`
        grid-row: span ${span};
      `
}

const StyledCell = styled.div<StyledCellProps>`
  position: relative;
  min-width: 0;
  min-height: 0;
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size }) => sizeLimitCss($size)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $spanX }) => spanCss('column', $spanX)}
  ${({ $spanY }) => spanCss('row', $spanY)}
  ${({ $alignX, $alignY }) => gridSelfAlignCss($alignX, $alignY)}
  ${({ $placeX, $placeY }) => placeContentCss(true, $placeX, $placeY)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type CellProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeLimitProps &
  PlaceProps &
  DirectionalBorderProps & {
    /** How many column tracks this cell covers. Default `1`. Becomes 1 when the parent `Grid` is stacked to one column. */
    spanX?: number
    /** How many row tracks this cell covers. Default `1`. */
    spanY?: number
    /**
     * Left–right alignment in this cell (`justify-self`).
     * Omitted: inherit the parent `Grid` `alignX`.
     */
    alignX?: AlignValue
    /**
     * Top–bottom alignment in this cell (`align-self`).
     * Omitted: inherit the parent `Grid` `alignY`.
     */
    alignY?: AlignValue
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
 * One cell in a `Grid`. Direct child of `Grid` only. No `width` / `height` / `fill` — span
 * tracks with `spanX` / `spanY`. `placeX` / `placeY` place contents inside the cell.
 *
 * @example
 * ```tsx
 * <Grid numCols={3} gap='small'>
 *   <Cell>
 *     <Text>A</Text>
 *   </Cell>
 *   <Cell spanX={2}>
 *     <Text>B</Text>
 *   </Cell>
 * </Grid>
 * ```
 */
export function Cell(props: CellProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    spanX,
    spanY,
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

  return (
    <StyledCell
      $spanX={spanX}
      $spanY={spanY}
      $alignX={alignX}
      $alignY={alignY}
      $placeX={placeX}
      $placeY={placeY}
      $edges={resolveBoxEdges(spacing, defaults.cell, space)}
      $size={resolveSizeLimits(size, space)}
      $borderWidth={resolveBorderEdges(
        { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
        defaults.cell.borderWidth,
        borderWidths,
      )}
      $borderRadius={resolveScaleValue(borderRadius, defaults.cell.borderRadius, radii)}
      $borderColor={resolveBorderColor(borderColor, 'base', colors, brand, status)}
      $customCss={customCss}
      {...dom}
    />
  )
}
