import { css } from 'styled-components'

import {
  type BreakpointScale,
  type BreakpointToken,
  breakpointTokens,
  type StackValue,
} from '~/src/theme/types'

/** Tailwind `sm` / `md` / `lg` widths, in rem (16px root). */
export const defaultBreakpoints: BreakpointScale = {
  sm: '40rem',
  md: '48rem',
  lg: '64rem',
}

function isBreakpointToken(value: string): value is BreakpointToken {
  return (breakpointTokens as readonly string[]).includes(value)
}

export function resolveBreakpointValue(
  value: StackValue | undefined,
  scale: BreakpointScale,
): string | undefined {
  if (value === undefined) {
    return undefined
  }

  return isBreakpointToken(value) ? scale[value] : value
}

/**
 * Collapse to a column at `max-width` (inclusive). Not Tailwind `md:` (min-width / and-up).
 * Forces `align-items: stretch` and `width: auto` on children, so `alignX="center"` does not apply while stacked.
 */
/**
 * Collapse a `Grid` at `max-width` to `stackedCols` equal tracks (default 1).
 * Child `spanX` becomes 1 only when stacked to a single column.
 */
export function stackGridQueryCss(maxWidth: string, stackedCols: number = 1) {
  const cols = Number.isFinite(stackedCols) && stackedCols >= 1 ? Math.floor(stackedCols) : 1
  const columns = `repeat(${cols}, minmax(0, 1fr))`

  return css`
    container-type: inline-size;
    @container (max-width: ${maxWidth}) {
      grid-template-columns: ${columns};
      justify-items: stretch;
      align-items: stretch;
      ${
        cols === 1
          ? css`
              & > * {
                grid-column: auto / span 1;
              }
            `
          : ''
      }
    }
  `
}

export function stackQueryCss(maxWidth: string, stackedJustify: string = 'start') {
  return css`
    container-type: inline-size;
    @container (max-width: ${maxWidth}) {
      flex-direction: column;
      flex-wrap: nowrap;
      align-items: stretch;
      justify-content: ${stackedJustify};
      & > * {
        width: auto;
        max-width: 100%;
      }
    }
  `
}
