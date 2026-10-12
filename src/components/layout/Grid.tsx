import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  flexItemCss,
  gridItemAlignCss,
  resolveAlignValue,
  resolveBorderColor,
  resolveBorderEdges,
  resolveBoxEdges,
  resolveBoxSize,
  resolveBreakpointValue,
  type ResolvedBoxSize,
  resolveScaleValue,
  sizeCss,
  stackGridQueryCss,
  takeBoxLayout,
  TrackProvider,
} from '~/src/theme/internal'

import {
  type AlignValue,
  type BorderColorValue,
  type BoxSpacingProps,
  type DirectionalBorderProps,
  type GridAlignProps,
  type SizeProps,
  type SpaceValue,
  type StackValue,
  usePanelizeTheme,
} from '~/src/theme'

function repeatTracks(count: number | undefined): string | undefined {
  if (count === undefined || !Number.isFinite(count) || count < 1) {
    return undefined
  }

  return `repeat(${Math.floor(count)}, minmax(0, 1fr))`
}

type StyledGridProps = {
  $flex?: boolean
  $fill?: boolean
  $gap: string
  $columns?: string
  $rows?: string
  $alignX: AlignValue
  $alignY: AlignValue
  $stackMax?: string
  $stackCols: number
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $customCss?: string
}

const StyledGrid = styled.div<StyledGridProps>`
  display: grid;
  position: relative;
  gap: ${({ $gap }) => $gap};
  ${({ $columns }) =>
    $columns
      ? css`
          grid-template-columns: ${$columns};
        `
      : ''}
  ${({ $rows }) =>
    $rows
      ? css`
          grid-template-rows: ${$rows};
        `
      : ''}
  ${({ $alignX, $alignY }) => gridItemAlignCss($alignX, $alignY)}
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex)}
  ${({ $stackMax, $stackCols }) => ($stackMax ? stackGridQueryCss($stackMax, $stackCols) : '')}
  ${({ $customCss }) => $customCss ?? ''}
`

export type GridProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  GridAlignProps &
  DirectionalBorderProps & {
    /** Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). */
    flex?: boolean
    /** Size to the parent (`height` and `width` 100%). Explicit `width` / `height` win on that axis. */
    fill?: boolean
    /** Space between cells. Token or CSS length. Theme default is `none`. */
    gap?: SpaceValue
    /** Column track count. Each track is `minmax(0, 1fr)`. Omit for implicit auto columns. */
    numCols?: number
    /** Row track count. Each track is `minmax(0, 1fr)`. Omit for implicit content-sized rows. */
    numRows?: number
    /**
     * Reduce columns when this box is at most this wide (`sm` / `md` / `lg`, or CSS).
     * Measures this `Grid`, not the viewport. `stack="md"` is not Tailwind `md:` (that is and-up).
     * Track count while stacked is `stackCols` (default 1). Items stretch. Child `spanX`
     * becomes 1 only when stacked to one column.
     */
    stack?: StackValue
    /** Column tracks while `stack`ed. Default `1`. Ignored if `stack` is omitted. */
    stackCols?: number
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
 * Grid track. Direct children must be `Cell`, two or more. `numCols` / `numRows` are equal
 * `minmax(0, 1fr)` tracks. `stack` reduces columns when this box is at most that wide.
 *
 * @example
 * ```tsx
 * <Grid numCols={2} gap='small'>
 *   <Cell>
 *     <Text>A</Text>
 *   </Cell>
 *   <Cell>
 *     <Text>B</Text>
 *   </Cell>
 * </Grid>
 * ```
 */
export function Grid(props: GridProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    gap,
    alignX,
    alignY,
    numCols,
    numRows,
    stack,
    stackCols,
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

  return (
    <TrackProvider kind='grid'>
      <StyledGrid
        $flex={flex}
        $fill={fill}
        $gap={resolveScaleValue(gap, defaults.grid.gap, space)}
        $columns={repeatTracks(numCols)}
        $rows={repeatTracks(numRows)}
        $alignX={resolveAlignValue(alignX, defaults.grid.alignX)}
        $alignY={resolveAlignValue(alignY, defaults.grid.alignY)}
        $stackMax={resolveBreakpointValue(stack, breakpoints)}
        $stackCols={
          stackCols !== undefined && Number.isFinite(stackCols) && stackCols >= 1
            ? Math.floor(stackCols)
            : 1
        }
        $edges={resolveBoxEdges(spacing, defaults.grid, space)}
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
