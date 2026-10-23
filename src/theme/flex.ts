import { css } from 'styled-components'

import { type AlignValue } from '~/src/theme/types'

export type GridAlignProps = {
  /**
   * Left–right alignment of items in their cells (`justify-items`).
   * Omitted: `stretch` (theme `defaults.grid`). Not flex packing — `space-*` does not apply.
   */
  alignX?: AlignValue
  /**
   * Top–bottom alignment of items in their cells (`align-items`).
   * Omitted: `stretch` (theme `defaults.grid`). Not flex packing — `space-*` does not apply.
   */
  alignY?: AlignValue
}

export function gridItemAlignCss(alignX: AlignValue, alignY: AlignValue) {
  return css`
    justify-items: ${alignX};
    align-items: ${alignY};
  `
}

export type SelfAlignProps = {
  /**
   * Left–right alignment of this box in its parent track (`align-self` in a column flex /
   * `justify-self` on a grid). Omitted: inherit. No-op in a row flex (`Cols`, `horizontal` `Panels`).
   * `space-*` does not apply.
   */
  alignX?: AlignValue
  /**
   * Top–bottom alignment of this box in its parent track (`align-self` in a row flex /
   * `align-self` on a grid). Omitted: inherit. No-op in a column flex (`Rows`, default `Panels`).
   * `space-*` does not apply.
   */
  alignY?: AlignValue
}

export function gridSelfAlignCss(alignX?: AlignValue, alignY?: AlignValue) {
  if (!alignX && !alignY) {
    return
  }

  return css`
    ${
      alignX
        ? css`
            justify-self: ${alignX};
          `
        : ''
    }
    ${
      alignY
        ? css`
            align-self: ${alignY};
          `
        : ''
    }
  `
}

export type FlexAlignProps = {
  /**
   * Left–right alignment. Same meaning on `Panels`, `Rows`, and `Cols`.
   * Omitted: cross-axis `stretch`, main-axis `start` (CSS flex initials for this direction).
   * `Rows` / `Cols` load that pair from `defaults.rows` / `defaults.cols`.
   * `Panels` uses the same initials for the current direction (column vs `horizontal`).
   * `space-*` only does something when X is the main axis (`horizontal` `Panels` / `Cols`).
   * `baseline` only does something when X is the cross axis (default `Panels` / `Rows`).
   */
  alignX?: AlignValue
  /**
   * Top–bottom alignment. Same meaning on `Panels`, `Rows`, and `Cols`.
   * Omitted: same initials as `alignX` (cross `stretch`, main `start`).
   * `space-*` only does something when Y is the main axis (default `Panels` / `Rows`).
   * `baseline` only does something when Y is the cross axis (`horizontal` `Panels` / `Cols`).
   */
  alignY?: AlignValue
}

/** CSS flex initials as screen axes: column → X stretch / Y start; row → X start / Y stretch. */
export function defaultFlexAlign(column: boolean | undefined): {
  alignX: AlignValue
  alignY: AlignValue
} {
  return column ? { alignX: 'stretch', alignY: 'start' } : { alignX: 'start', alignY: 'stretch' }
}

export function flexAlignCss(
  column: boolean | undefined,
  alignX?: AlignValue,
  alignY?: AlignValue,
) {
  const justify = column ? alignY : alignX
  const align = column ? alignX : alignY
  if (!justify && !align) {
    return
  }

  return css`
    ${
      justify
        ? css`
            justify-content: ${justify};
          `
        : ''
    }
    ${
      align
        ? css`
            align-items: ${align};
          `
        : ''
    }
  `
}

export type PlaceProps = {
  /**
   * Left–right place of **contents** inside this box. Omit both `placeX` and `placeY` = block
   * flow (no inner flex). Setting either makes this box a flex container.
   * `Col` / `Panel` / `Div` / `Cell` are a column; `Row` is a row. Not `alignX` (that places
   * this box in its parent). `space-*` only packs the inner main axis.
   */
  placeX?: AlignValue
  /**
   * Top–bottom place of **contents** inside this box. Same omit / flex rules as `placeX`.
   * Not `alignY` (that places this box in its parent).
   */
  placeY?: AlignValue
}

/** Inner flex so an item box can place its contents. No-op until `placeX` or `placeY` is set. */
export function placeContentCss(column: boolean, placeX?: AlignValue, placeY?: AlignValue) {
  if (!placeX && !placeY) {
    return
  }

  return css`
    display: flex;
    flex-direction: ${column ? 'column' : 'row'};
    ${flexAlignCss(column, placeX, placeY)}
  `
}

export function resolveAlignValue(value: AlignValue | undefined, fallback: AlignValue): AlignValue {
  return value ?? fallback
}

/**
 * `flex` grows (`1 1 0%`) and can shrink below intrinsic content (`min-width` / `min-height` 0)
 * so a nested scrolling pane works in a split. Items (`Panel`, `Row`, `Col`, `Div`) pass
 * `shrinkZeroUntilFlex` so they do not collapse until `flex`.
 */
export function flexItemCss(flex?: boolean, shrinkZeroUntilFlex?: boolean) {
  if (flex) {
    return css`
      flex: 1 1 0%;
      min-width: 0;
      min-height: 0;
    `
  }
  if (shrinkZeroUntilFlex) {
    return css`
      flex-shrink: 0;
    `
  }
  return
}

/**
 * Main-axis pack after `stack` (column). Explicit `alignY` wins.
 * Omitted is `start` — not the row cross-axis theme default (`stretch`).
 */
export function stackedMainAlign(alignY?: AlignValue): AlignValue {
  return alignY ?? 'start'
}
