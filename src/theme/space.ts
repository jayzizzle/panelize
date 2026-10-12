import { css } from 'styled-components'

import { type SpaceScale, type SpaceToken, spaceTokens, type SpaceValue } from '~/src/theme/types'

export type { SpaceValue }

export const defaultSpace: SpaceScale = {
  none: '0rem',
  extraSmall: '0.25rem',
  small: '0.5rem',
  base: '1rem',
  large: '1.5rem',
  extraLarge: '2rem',
}

export type DirectionalSpacingProps = {
  /** Horizontal padding (left and right). Overrides `padding`. */
  paddingX?: SpaceValue
  /** Vertical padding (top and bottom). Overrides `padding`. */
  paddingY?: SpaceValue
  /** Overrides `padding` and `paddingY` on this side. */
  paddingTop?: SpaceValue
  /** Overrides `padding` and `paddingX` on this side. */
  paddingRight?: SpaceValue
  /** Overrides `padding` and `paddingY` on this side. */
  paddingBottom?: SpaceValue
  /** Overrides `padding` and `paddingX` on this side. */
  paddingLeft?: SpaceValue
  /** Horizontal margin (left and right). Overrides `margin`. */
  marginX?: SpaceValue
  /** Vertical margin (top and bottom). Overrides `margin`. */
  marginY?: SpaceValue
  /** Overrides `margin` and `marginY` on this side. */
  marginTop?: SpaceValue
  /** Overrides `margin` and `marginX` on this side. */
  marginRight?: SpaceValue
  /** Overrides `margin` and `marginY` on this side. */
  marginBottom?: SpaceValue
  /** Overrides `margin` and `marginX` on this side. */
  marginLeft?: SpaceValue
}

export type BoxSpacingProps = DirectionalSpacingProps & {
  /** Padding on all sides. Space token or CSS length. Theme default if omitted. */
  padding?: SpaceValue
  /** Margin on all sides. Space token or CSS length. Theme default if omitted. */
  margin?: SpaceValue
}

export type BoxEdges = {
  paddingTop: string
  paddingRight: string
  paddingBottom: string
  paddingLeft: string
  marginTop: string
  marginRight: string
  marginBottom: string
  marginLeft: string
}

function isSpaceToken(value: string): value is SpaceToken {
  return (spaceTokens as readonly string[]).includes(value)
}

export function resolveScaleValue(
  value: string | undefined,
  fallback: string,
  scale: Record<string, string>,
): string {
  const resolved = value ?? fallback
  return Object.hasOwn(scale, resolved) ? scale[resolved] : resolved
}

function resolveSide(
  end: SpaceValue | undefined,
  axis: SpaceValue | undefined,
  all: string,
  space: SpaceScale,
): string {
  if (end !== undefined) {
    return isSpaceToken(end) ? space[end] : end
  }

  if (axis !== undefined) {
    return isSpaceToken(axis) ? space[axis] : axis
  }

  return all
}

export function resolveBoxEdges(
  props: BoxSpacingProps,
  fallback: { padding: SpaceToken; margin: SpaceToken },
  space: SpaceScale,
): BoxEdges {
  const paddingAll = resolveScaleValue(props.padding, fallback.padding, space)
  const marginAll = resolveScaleValue(props.margin, fallback.margin, space)

  return {
    paddingTop: resolveSide(props.paddingTop, props.paddingY, paddingAll, space),
    paddingRight: resolveSide(props.paddingRight, props.paddingX, paddingAll, space),
    paddingBottom: resolveSide(props.paddingBottom, props.paddingY, paddingAll, space),
    paddingLeft: resolveSide(props.paddingLeft, props.paddingX, paddingAll, space),
    marginTop: resolveSide(props.marginTop, props.marginY, marginAll, space),
    marginRight: resolveSide(props.marginRight, props.marginX, marginAll, space),
    marginBottom: resolveSide(props.marginBottom, props.marginY, marginAll, space),
    marginLeft: resolveSide(props.marginLeft, props.marginX, marginAll, space),
  }
}

export type SizeLimitProps = {
  /** Minimum width. Space token or CSS. Omitted means no min. */
  minWidth?: SpaceValue
  /** Maximum width. Space token or CSS. Omitted means no max. */
  maxWidth?: SpaceValue
  /** Minimum height. Space token or CSS. Omitted means no min. */
  minHeight?: SpaceValue
  /** Maximum height. Space token or CSS. Omitted means no max. */
  maxHeight?: SpaceValue
}

export type SizeProps = SizeLimitProps & {
  /**
   * Width. Space token or CSS (`auto`, `4rem`, `100%`). Omitted: unset, except `Col` uses
   * theme `defaults.col.width` (`auto`). Overrides `fill` on this axis. Not on `Cell`.
   */
  width?: SpaceValue
  /**
   * Height. Space token or CSS (`auto`, `4rem`, `100%`). Omitted: unset, except `Row` uses
   * theme `defaults.row.height` (`auto`). Overrides `fill` on this axis. Not on `Cell`.
   */
  height?: SpaceValue
}

export type ResolvedSizeLimits = {
  minWidth?: string
  maxWidth?: string
  minHeight?: string
  maxHeight?: string
}

export type ResolvedBoxSize = ResolvedSizeLimits & {
  width?: string
  height?: string
}

export function takeBoxLayout<T extends BoxSpacingProps & SizeProps>(props: T) {
  const {
    padding,
    margin,
    paddingX,
    paddingY,
    paddingTop,
    paddingRight,
    paddingBottom,
    paddingLeft,
    marginX,
    marginY,
    marginTop,
    marginRight,
    marginBottom,
    marginLeft,
    minWidth,
    maxWidth,
    minHeight,
    maxHeight,
    width,
    height,
    ...rest
  } = props

  return {
    spacing: {
      padding,
      margin,
      paddingX,
      paddingY,
      paddingTop,
      paddingRight,
      paddingBottom,
      paddingLeft,
      marginX,
      marginY,
      marginTop,
      marginRight,
      marginBottom,
      marginLeft,
    },
    size: { minWidth, maxWidth, minHeight, maxHeight, width, height },
    rest,
  }
}

export function resolveSizeLimits(props: SizeLimitProps, space: SpaceScale): ResolvedSizeLimits {
  return {
    minWidth:
      props.minWidth === undefined ? undefined : resolveScaleValue(props.minWidth, 'none', space),
    maxWidth:
      props.maxWidth === undefined ? undefined : resolveScaleValue(props.maxWidth, 'none', space),
    minHeight:
      props.minHeight === undefined ? undefined : resolveScaleValue(props.minHeight, 'none', space),
    maxHeight:
      props.maxHeight === undefined ? undefined : resolveScaleValue(props.maxHeight, 'none', space),
  }
}

export function resolveBoxSize(
  props: SizeProps,
  space: SpaceScale,
  fallbacks?: { width?: SpaceValue; height?: SpaceValue },
): ResolvedBoxSize {
  return {
    ...resolveSizeLimits(props, space),
    width:
      props.width === undefined && fallbacks?.width === undefined
        ? undefined
        : resolveScaleValue(props.width, fallbacks?.width ?? 'auto', space),
    height:
      props.height === undefined && fallbacks?.height === undefined
        ? undefined
        : resolveScaleValue(props.height, fallbacks?.height ?? 'auto', space),
  }
}

export function sizeCss(size: ResolvedBoxSize, fill?: boolean) {
  const width = size.width ?? (fill ? '100%' : undefined)
  const height = size.height ?? (fill ? '100%' : undefined)

  return css`
    box-sizing: border-box;
    ${
      width !== undefined
        ? css`
            width: ${width};
          `
        : ''
    }
    ${
      height !== undefined
        ? css`
            height: ${height};
          `
        : ''
    }
    ${sizeLimitCss(size)}
  `
}

export function sizeLimitCss(limits: ResolvedSizeLimits) {
  return css`
    ${
      limits.minWidth !== undefined
        ? css`
            min-width: ${limits.minWidth};
          `
        : ''
    }
    ${
      limits.maxWidth !== undefined
        ? css`
            max-width: ${limits.maxWidth};
          `
        : ''
    }
    ${
      limits.minHeight !== undefined
        ? css`
            min-height: ${limits.minHeight};
          `
        : ''
    }
    ${
      limits.maxHeight !== undefined
        ? css`
            max-height: ${limits.maxHeight};
          `
        : ''
    }
  `
}

export function boxEdgesCss(edges: BoxEdges) {
  return css`
    padding-top: ${edges.paddingTop};
    padding-right: ${edges.paddingRight};
    padding-bottom: ${edges.paddingBottom};
    padding-left: ${edges.paddingLeft};
    margin-top: ${edges.marginTop};
    margin-right: ${edges.marginRight};
    margin-bottom: ${edges.marginBottom};
    margin-left: ${edges.marginLeft};
  `
}
