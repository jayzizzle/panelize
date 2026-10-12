import {
  type BrandColors,
  type BrandToken,
  brandTokens,
  type ChromaState,
  type ColorValue,
  type StatusColors,
  type StatusToken,
  statusTokens,
} from '~/src/theme'

import { panelCssVars } from '~/src/components/layout/Panel'

export function isBrandToken(color: string | undefined): color is BrandToken {
  return !!color && (brandTokens as readonly string[]).includes(color)
}

export function isStatusToken(color: string | undefined): color is StatusToken {
  return !!color && (statusTokens as readonly string[]).includes(color)
}

export function isChromaToken(color: string | undefined): color is BrandToken | StatusToken {
  return isBrandToken(color) || isStatusToken(color)
}

export function resolveChromaSlot(
  color: ColorValue,
  brand: BrandColors,
  status: StatusColors,
): ChromaState {
  if (isBrandToken(color)) {
    return brand[color]
  }

  if (isStatusToken(color)) {
    return status[color]
  }

  return { base: color, hover: color, active: color }
}

/** Field `color` prop: focus border / glow / caret — not glyph ink. */
export function resolveFocusColor(
  color: ColorValue,
  brand: BrandColors,
  status: StatusColors,
): string {
  return resolveChromaSlot(color, brand, status).base
}

export function resolveTextColor(
  color: ColorValue | undefined,
  highlighted: boolean | undefined,
  muted: boolean | undefined,
  brand: BrandColors,
  status: StatusColors,
): string {
  if (color !== undefined && isChromaToken(color)) {
    return resolveChromaSlot(color, brand, status).base
  }

  if (color) {
    return color
  }

  if (highlighted) {
    return `var(${panelCssVars.textHighlighted})`
  }

  if (muted) {
    return `var(${panelCssVars.textMuted})`
  }

  return `var(${panelCssVars.text})`
}

/** Rest `primary` + hover `primary` → `.hover`. Rest white + hover `primary` → `.base`. */
export function resolveLinkHover(
  restToken: ColorValue | undefined,
  hover: ColorValue | 'inherit',
  brand: BrandColors,
  status: StatusColors,
): { hover: string; active: string } {
  const restSlot =
    restToken !== undefined && isChromaToken(restToken)
      ? resolveChromaSlot(restToken, brand, status)
      : undefined

  if (hover === 'inherit') {
    const ink = `var(${panelCssVars.text})`
    return { hover: ink, active: restSlot?.active ?? ink }
  }

  if (isChromaToken(hover)) {
    const slot = resolveChromaSlot(hover, brand, status)
    const useHoverStep = restToken === hover
    return {
      hover: useHoverStep ? slot.hover : slot.base,
      active: slot.active,
    }
  }

  return { hover, active: restSlot?.active ?? hover }
}
