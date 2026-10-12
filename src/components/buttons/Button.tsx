import { type ComponentPropsWithoutRef } from 'react'
import { css, styled } from 'styled-components'

import { resolvePaintSteps, resolveScaleValue } from '~/src/theme/internal'

import {
  type BrandColors,
  type BrandState,
  type BrandStateToken,
  type ColorValue,
  type FontFamilyToken,
  type FontSizeValue,
  type FontWeightValue,
  type PaintSteps,
  type SpaceValue,
  type StatusColors,
  usePanelizeTheme,
} from '~/src/theme'

import { isChromaToken, resolveChromaSlot } from '~/src/components/text/color'

type StyledButtonProps = {
  $size: string
  $weight: string
  $family: string
  $lineHeight: number | string
  $paddingX: string
  $paddingY: string
  $gap: string
  $borderWidth: string
  $borderRadius: string
  $restBg: string
  $restFg: string
  $restBorder: string
  $hoverBg: string
  $hoverFg: string
  $hoverBorder: string
  $activeBg: string
  $activeFg: string
  $activeBorder: string
  $italic?: boolean
  $uppercase?: boolean
  $fill?: boolean
  $customCss?: string
}

const StyledButton = styled.button<StyledButtonProps>`
  appearance: none;
  display: ${({ $fill }) => ($fill ? 'flex' : 'inline-flex')};
  align-items: center;
  justify-content: center;
  gap: ${({ $gap }) => $gap};
  ${({ $fill }) =>
    $fill
      ? css`
          width: 100%;
          height: 100%;
        `
      : ''}
  margin: 0;
  box-sizing: border-box;
  cursor: pointer;
  font-family: ${({ $family }) => $family};
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $lineHeight }) => $lineHeight};
  padding: ${({ $paddingY, $paddingX }) => `${$paddingY} ${$paddingX}`};
  border-width: ${({ $borderWidth }) => $borderWidth};
  border-style: solid;
  border-radius: ${({ $borderRadius }) => $borderRadius};
  border-color: ${({ $restBorder }) => $restBorder};
  background: ${({ $restBg }) => $restBg};
  color: ${({ $restFg }) => $restFg};
  &:focus-visible {
    outline: 2px solid currentColor;
    outline-offset: 2px;
  }
  &:hover:not(:disabled) {
    background: ${({ $hoverBg }) => $hoverBg};
    color: ${({ $hoverFg }) => $hoverFg};
    border-color: ${({ $hoverBorder }) => $hoverBorder};
  }
  &:active:not(:disabled) {
    background: ${({ $activeBg }) => $activeBg};
    color: ${({ $activeFg }) => $activeFg};
    border-color: ${({ $activeBorder }) => $activeBorder};
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
  ${({ $italic }) =>
    $italic
      ? css`
          font-style: italic;
        `
      : ''}
  ${({ $uppercase }) =>
    $uppercase
      ? css`
          text-transform: uppercase;
        `
      : ''}
  ${({ $customCss }) => $customCss ?? ''}
`

export type ButtonProps = ComponentPropsWithoutRef<'button'> & {
  /**
   * Brand (`primary` / `secondary` / `accent`), status (`danger` / `warning` / `success` / `info`), or raw CSS.
   * Theme default `primary`. Rest, hover, and active stay on that slot.
   */
  color?: ColorValue
  /** Border + slot label, panel shows through. Omit = filled. */
  outline?: boolean
  /** Font size token (`small`) or CSS — not the control box. Theme default `small`. Stretch with `fill`. */
  size?: FontSizeValue
  /** Font weight token (`thin` / `base` / `bold` / `heavy`) or CSS. Theme default `bold`. */
  weight?: FontWeightValue
  /** `fontFamilies` token. Omit uses `base`. */
  family?: FontFamilyToken
  /** Italic. Default off. */
  italic?: boolean
  /** `text-transform: uppercase`. Default off. */
  uppercase?: boolean
  /**
   * Width and height 100% of the parent. Height `%` only applies when the parent has a
   * definite height. Same idea as layout `fill`.
   */
  fill?: boolean
  /**
   * Visible caption. Preferred over a string as `children`.
   * Custom insides (`Cols` / `Text` / host icons) go in `children`; those win if both are set.
   * No visible text: set `aria-label`.
   */
  label?: string
  /** Extra CSS appended to this component’s styles. */
  css?: string
  /** Padding on all axes. Space token or CSS. Overrides theme `paddingX` / `paddingY` until those props are set. */
  padding?: SpaceValue
  /** Horizontal padding. Space token or CSS. Overrides `padding` and theme `paddingX`. */
  paddingX?: SpaceValue
  /** Vertical padding. Space token or CSS. Overrides `padding` and theme `paddingY`. */
  paddingY?: SpaceValue
  /** Border width token or CSS. Theme default `extraSmall`. */
  borderWidth?: SpaceValue
  /** Border radius token or CSS. Theme default `base`. */
  borderRadius?: SpaceValue
  /**
   * Fill. Token/CSS → all steps (`.base`). `{ base, hover, active }` for a one-off; omitted keys
   * keep the `color` slot (filled) or stay transparent (`outline`). Passing this on `outline` opts in to fill.
   */
  background?: PaintSteps
  /**
   * Label. Token/CSS → all steps (`.base`). `{ base, hover, active }` for a one-off; omitted keys
   * keep filled `defaults.button.ink` / hover label, or the `color` slot on `outline`.
   */
  ink?: PaintSteps
}

function resolveSlotStep(
  color: ColorValue,
  brand: BrandColors,
  status: StatusColors,
  step: BrandStateToken,
): string {
  if (isChromaToken(color)) {
    return resolveChromaSlot(color, brand, status)[step]
  }

  return color
}

function filledHoverFill(
  slot: BrandState,
  override: string | undefined,
  step: 'hover' | 'active',
): string {
  if (override !== undefined && !isChromaToken(override)) {
    return override
  }

  return slot[step]
}

/**
 * Control (`<button>`). Caption: `label` (preferred); `children` win. Place it in a `Col` /
 * `Row` / `Panel` — the wrapper positions it. `fill` stretches the button, not a panel.
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
export function Button(props: ButtonProps) {
  const {
    color,
    outline,
    size,
    weight,
    family: familyToken,
    italic,
    uppercase,
    fill,
    label,
    css: customCss,
    padding,
    paddingX,
    paddingY,
    borderWidth,
    borderRadius,
    background,
    ink,
    type = 'button',
    children,
    ...dom
  } = props
  const {
    fontSizes,
    fontWeights,
    fontFamilies,
    lineHeight,
    space,
    borderWidths,
    radii,
    defaults,
    brand,
    status,
    colors,
  } = usePanelizeTheme()
  const slot = resolveChromaSlot(color ?? defaults.button.color, brand, status)
  const filled = !outline
  const hoverTheme = defaults.button.hover
  const filledHoverFg = resolveSlotStep(hoverTheme.color, brand, status, 'base')
  const paint = (
    value: PaintSteps | undefined,
    role: 'background' | 'text',
    step: BrandStateToken,
  ) => resolvePaintSteps(value, role, step, colors, brand, status)

  const fillAt = (step: BrandStateToken) => {
    const override = paint(background, 'background', step)
    if (override !== undefined) {
      return override
    }
    if (!filled) {
      return 'transparent'
    }
    if (step === 'base') {
      return slot.base
    }
    return filledHoverFill(slot, hoverTheme.background, step)
  }

  const inkAt = (step: BrandStateToken) => {
    const override = paint(ink, 'text', step)
    if (override !== undefined) {
      return override
    }
    if (!filled) {
      return slot[step]
    }
    return step === 'base' ? defaults.button.ink : filledHoverFg
  }

  const restBg = fillAt('base')
  const hoverBg = fillAt('hover')
  const activeBg = fillAt('active')
  const restFg = inkAt('base')
  const hoverFg = inkAt('hover')
  const activeFg = inkAt('active')
  const restBorder = filled ? restBg : slot.base
  const hoverBorder = filled ? hoverBg : slot.hover
  const activeBorder = filled ? activeBg : slot.active

  return (
    <StyledButton
      type={type}
      $family={fontFamilies[familyToken ?? 'base']}
      $size={resolveScaleValue(size, defaults.button.size, fontSizes)}
      $weight={resolveScaleValue(weight, defaults.button.weight, fontWeights)}
      $lineHeight={lineHeight}
      $paddingX={resolveScaleValue(paddingX ?? padding, defaults.button.paddingX, space)}
      $paddingY={resolveScaleValue(paddingY ?? padding, defaults.button.paddingY, space)}
      $gap={resolveScaleValue(undefined, defaults.button.gap, space)}
      $borderWidth={resolveScaleValue(borderWidth, defaults.button.borderWidth, borderWidths)}
      $borderRadius={resolveScaleValue(borderRadius, defaults.button.borderRadius, radii)}
      $restBg={restBg}
      $restFg={restFg}
      $restBorder={restBorder}
      $hoverBg={hoverBg}
      $hoverFg={hoverFg}
      $hoverBorder={hoverBorder}
      $activeBg={activeBg}
      $activeFg={activeFg}
      $activeBorder={activeBorder}
      $italic={italic}
      $uppercase={uppercase}
      $fill={fill}
      $customCss={customCss}
      {...dom}
    >
      {children ?? label}
    </StyledButton>
  )
}
