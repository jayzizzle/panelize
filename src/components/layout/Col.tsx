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

type StyledColProps = {
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

const StyledCol = styled.div<StyledColProps>`
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

export type ColProps = ComponentPropsWithoutRef<'div'> &
  BoxSpacingProps &
  SizeProps &
  SelfAlignProps &
  DirectionalBorderProps & {
    /**
     * Grow in a flex parent (`flex: 1 1 0%`, `min-width` / `min-height` 0). Until then this box is
     * `flex-shrink: 0` (same as `Panel`).
     */
    flex?: boolean
    /**
     * Size to the parent on axes without a size. Theme `width` is `auto`, so omit `width` → height
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
 * One column in a `Cols` track. Direct child of `Cols` only. Place content here. This box owns
 * `flex` / `width` / `alignY` — children do not position themselves.
 *
 * @example
 * ```tsx
 * <Cols gap='small'>
 *   <Col>
 *     <Button label='Save' />
 *   </Col>
 *   <Col>
 *     <Button outline label='Cancel' />
 *   </Col>
 * </Cols>
 * ```
 */
export function Col(props: ColProps) {
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
    <StyledCol
      $flex={flex}
      $fill={fill}
      $edges={resolveBoxEdges(spacing, defaults.col, space)}
      $size={resolveBoxSize(size, space, { width: defaults.col.width })}
      $borderWidth={resolveBorderEdges(
        { borderWidth, borderX, borderY, borderTop, borderRight, borderBottom, borderLeft },
        defaults.col.borderWidth,
        borderWidths,
      )}
      $borderRadius={resolveScaleValue(borderRadius, defaults.col.borderRadius, radii)}
      $borderColor={resolveBorderColor(borderColor, 'base', colors, brand, status)}
      $alignX={alignX}
      $alignY={alignY}
      $trackKind={trackKind}
      $customCss={customCss}
      {...dom}
    />
  )
}
