import { resolveScaleValue } from '~/src/theme/space'
import {
  type BrandColors,
  type BrandStateToken,
  type BrandToken,
  brandTokens,
  type PanelVariant,
  panelVariants,
  type SpaceScale,
  type SpaceToken,
  type SpaceValue,
  type StatusColors,
  type StatusToken,
  statusTokens,
  type ThemeColors,
} from '~/src/theme/types'

export const defaultBorderWidths: SpaceScale = {
  none: '0',
  extraSmall: '1px',
  small: '2px',
  base: '4px',
  large: '8px',
  extraLarge: '12px',
}

export const defaultRadii: SpaceScale = {
  none: '0',
  extraSmall: '0.125rem',
  small: '0.25rem',
  base: '0.5rem',
  large: '0.75rem',
  extraLarge: '1rem',
}

/**
 * Panel surface (`muted` / `base` / `highlighted`), brand (`primary`), status (`danger`),
 * or raw CSS. `base` is the panel `base` surface, not a brand slot.
 */
export type PaintValue = PanelVariant | BrandToken | StatusToken | (string & {})

/** Same tokens as `PaintValue`. `base` is the panel `base` border, not a brand slot. */
export type BorderColorValue = PaintValue

export type PaintRole = 'background' | 'text' | 'border'

/** Token/CSS for every step, or per-step overrides. Omitted keys fall through to the control default. */
export type PaintSteps = PaintValue | Partial<Record<BrandStateToken, PaintValue>>

function isPaintStepsRecord(
  value: PaintSteps,
): value is Partial<Record<BrandStateToken, PaintValue>> {
  return typeof value === 'object' && value !== null
}

/** Width cascade: `borderWidth` → `borderX` / `borderY` → `borderTop` / … Same tokens as `borderWidth`. */
export type DirectionalBorderProps = {
  /** All sides. Token (`extraSmall` = 1px) or CSS. Theme default `none`. */
  borderWidth?: SpaceValue
  /** Left and right. Overrides `borderWidth`. */
  borderX?: SpaceValue
  /** Top and bottom. Overrides `borderWidth`. */
  borderY?: SpaceValue
  /** Overrides `borderWidth` and `borderY` on this side. */
  borderTop?: SpaceValue
  /** Overrides `borderWidth` and `borderX` on this side. */
  borderRight?: SpaceValue
  /** Overrides `borderWidth` and `borderY` on this side. */
  borderBottom?: SpaceValue
  /** Overrides `borderWidth` and `borderX` on this side. */
  borderLeft?: SpaceValue
}

function resolveBorderSide(
  end: SpaceValue | undefined,
  axis: SpaceValue | undefined,
  all: string,
  widths: SpaceScale,
): string {
  if (end !== undefined) {
    return resolveScaleValue(end, all, widths)
  }

  if (axis !== undefined) {
    return resolveScaleValue(axis, all, widths)
  }

  return all
}

/** CSS `border-width` as `top right bottom left`. */
export function resolveBorderEdges(
  props: DirectionalBorderProps,
  fallback: SpaceToken,
  widths: SpaceScale,
): string {
  const all = resolveScaleValue(props.borderWidth, fallback, widths)

  return [
    resolveBorderSide(props.borderTop, props.borderY, all, widths),
    resolveBorderSide(props.borderRight, props.borderX, all, widths),
    resolveBorderSide(props.borderBottom, props.borderY, all, widths),
    resolveBorderSide(props.borderLeft, props.borderX, all, widths),
  ].join(' ')
}

export function resolvePaintValue(
  override: PaintValue | undefined,
  role: PaintRole,
  colors: ThemeColors,
  brand: BrandColors,
  status: StatusColors,
  step: BrandStateToken = 'base',
): string | undefined {
  if (override === undefined) {
    return undefined
  }

  if ((panelVariants as readonly string[]).includes(override)) {
    const surface = colors[override as PanelVariant]
    if (role === 'background') {
      return surface.background
    }
    if (role === 'text') {
      return surface.text.base
    }
    return surface.border
  }

  if ((brandTokens as readonly string[]).includes(override)) {
    return brand[override as BrandToken][step]
  }

  if ((statusTokens as readonly string[]).includes(override)) {
    return status[override as StatusToken][step]
  }

  return override
}

/** Flat token → all steps (`.base`). Object key → that step (chroma uses `.hover` / `.active`). */
export function resolvePaintSteps(
  value: PaintSteps | undefined,
  role: PaintRole,
  step: BrandStateToken,
  colors: ThemeColors,
  brand: BrandColors,
  status: StatusColors,
): string | undefined {
  if (value === undefined) {
    return undefined
  }

  if (isPaintStepsRecord(value)) {
    const token = value[step]
    if (token === undefined) {
      return undefined
    }
    return resolvePaintValue(token, role, colors, brand, status, step)
  }

  return resolvePaintValue(value, role, colors, brand, status, 'base')
}

export function resolveBorderColor(
  override: BorderColorValue | undefined,
  variant: PanelVariant,
  colors: ThemeColors,
  brand: BrandColors,
  status: StatusColors,
): string {
  return resolvePaintValue(override, 'border', colors, brand, status) ?? colors[variant].border
}
