import { type ComponentPropsWithoutRef } from 'react'
import { styled } from 'styled-components'

import {
  type BoxEdges,
  boxEdgesCss,
  flexAlignCss,
  flexItemCss,
  resolveAlignValue,
  resolveBorderColor,
  resolveBorderEdges,
  resolveBoxEdges,
  resolveBoxSize,
  type ResolvedBoxSize,
  resolveScaleValue,
  sizeCss,
  takeBoxLayout,
  TrackProvider,
} from '~/src/theme/internal'

import {
  type AlignValue,
  type BorderColorValue,
  type BoxSpacingProps,
  type DirectionalBorderProps,
  type FlexAlignProps,
  type SizeProps,
  type SpaceValue,
  usePanelizeTheme,
} from '~/src/theme'

type StyledRowsProps = {
  $flex?: boolean
  $fill?: boolean
  $gap: string
  $alignX: AlignValue
  $alignY: AlignValue
  $wrap?: boolean
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $customCss?: string
}

const StyledRows = styled.div<StyledRowsProps>`
  display: flex;
  flex-direction: column;
  position: relative;
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  gap: ${({ $gap }) => $gap};
  ${({ $alignX, $alignY }) => flexAlignCss(true, $alignX, $alignY)}
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex)}
  ${({ $customCss }) => $customCss ?? ''}
`

export type RowsProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  FlexAlignProps &
  DirectionalBorderProps & {
    /** Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). */
    flex?: boolean
    /** Size to the parent (`height` and `width` 100%). Explicit `width` / `height` win on that axis. */
    fill?: boolean
    /** Space between child `Row`s. Token or CSS length. Theme default is `none`. */
    gap?: SpaceValue
    /**
     * Allow child `Row`s to wrap onto the next line. Default is no wrap.
     * No `stack`: `Rows` is already a column. Use `Cols` or `Panels` `stack` to collapse a row.
     */
    wrap?: boolean
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
 * Column track. Direct children must be `Row`, two or more. Do not wrap a single band — use
 * the parent `Panel` or a `Div`.
 *
 * @example
 * ```tsx
 * <Rows gap='base'>
 *   <Row>
 *     <Heading level={1}>Title</Heading>
 *   </Row>
 *   <Row>
 *     <Text muted>Caption</Text>
 *   </Row>
 * </Rows>
 * ```
 */
export function Rows(props: RowsProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    gap,
    alignX,
    alignY,
    wrap,
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
  const { space, defaults, colors, borderWidths, radii, brand, status } = usePanelizeTheme()

  return (
    <TrackProvider kind='column'>
      <StyledRows
        $flex={flex}
        $fill={fill}
        $gap={resolveScaleValue(gap, defaults.rows.gap, space)}
        $alignX={resolveAlignValue(alignX, defaults.rows.alignX)}
        $alignY={resolveAlignValue(alignY, defaults.rows.alignY)}
        $wrap={wrap}
        $edges={resolveBoxEdges(spacing, defaults.rows, space)}
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
