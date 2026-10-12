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
  resolveBreakpointValue,
  type ResolvedBoxSize,
  resolveScaleValue,
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
  type SizeProps,
  type SpaceValue,
  type StackValue,
  usePanelizeTheme,
} from '~/src/theme'

type StyledColsProps = {
  $flex?: boolean
  $fill?: boolean
  $gap: string
  $alignX: AlignValue
  $alignY: AlignValue
  $wrap?: boolean
  $stackMax?: string
  $stackedJustify: AlignValue
  $edges: BoxEdges
  $size: ResolvedBoxSize
  $borderWidth: string
  $borderRadius: string
  $borderColor: string
  $customCss?: string
}

const StyledCols = styled.div<StyledColsProps>`
  display: flex;
  flex-direction: row;
  position: relative;
  flex-wrap: ${({ $wrap }) => ($wrap ? 'wrap' : 'nowrap')};
  gap: ${({ $gap }) => $gap};
  ${({ $alignX, $alignY }) => flexAlignCss(false, $alignX, $alignY)}
  ${({ $edges }) => boxEdgesCss($edges)}
  ${({ $size, $fill }) => sizeCss($size, $fill)}
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $borderColor }) => $borderColor};
  ${({ $flex }) => flexItemCss($flex)}
  ${({ $stackMax, $stackedJustify }) =>
    $stackMax ? stackQueryCss($stackMax, $stackedJustify) : ''}
  ${({ $customCss }) => $customCss ?? ''}
`

export type ColsProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  FlexAlignProps &
  DirectionalBorderProps & {
    /** Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). */
    flex?: boolean
    /** Size to the parent (`height` and `width` 100%). Explicit `width` / `height` win on that axis. */
    fill?: boolean
    /** Space between child `Col`s. Token or CSS length. Theme default is `none`. */
    gap?: SpaceValue
    /** Allow child `Col`s to wrap onto the next line. Default is no wrap. */
    wrap?: boolean
    /**
     * Become a column when this box is at most this wide (`sm` / `md` / `lg`, or CSS).
     * Measures this `Cols`, not the viewport. `stack="md"` is not Tailwind `md:` (that is and-up).
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
 * Row track. Direct children must be `Col`, two or more. Do not wrap a single column — use
 * the parent `Panel` or a `Div`. `stack` collapses this row when the box is at most that wide.
 *
 * @example
 * ```tsx
 * <Cols gap='small' stack='sm'>
 *   <Col width='12rem'>
 *     <Text>Side</Text>
 *   </Col>
 *   <Col flex>
 *     <Text>Main</Text>
 *   </Col>
 * </Cols>
 * ```
 */
export function Cols(props: ColsProps) {
  const { spacing, size, rest } = takeBoxLayout(props)
  const {
    flex,
    fill,
    gap,
    alignX,
    alignY,
    wrap,
    stack,
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
    <TrackProvider kind='row'>
      <StyledCols
        $flex={flex}
        $fill={fill}
        $gap={resolveScaleValue(gap, defaults.cols.gap, space)}
        $alignX={resolveAlignValue(alignX, defaults.cols.alignX)}
        $alignY={resolveAlignValue(alignY, defaults.cols.alignY)}
        $wrap={wrap}
        $stackMax={resolveBreakpointValue(stack, breakpoints)}
        $stackedJustify={stackedMainAlign(alignY)}
        $edges={resolveBoxEdges(spacing, defaults.cols, space)}
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
