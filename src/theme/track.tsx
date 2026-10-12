import { createContext, type ReactNode, useContext } from 'react'
import { css } from 'styled-components'

import { type AlignValue } from '~/src/theme/types'

export type TrackKind = 'row' | 'column' | 'grid'

const TrackContext = createContext<TrackKind | undefined>(undefined)

export function TrackProvider({ kind, children }: { kind: TrackKind; children: ReactNode }) {
  return <TrackContext.Provider value={kind}>{children}</TrackContext.Provider>
}

export function useTrackKind() {
  return useContext(TrackContext)
}

/**
 * Screen-axis self alignment. Omit = inherit.
 * `grid` / unknown: `justify-self` / `align-self`.
 * Flex row: `alignY` → `align-self` (`alignX` no-op).
 * Flex column: `alignX` → `align-self` (`alignY` no-op).
 */
export function selfAlignCss(
  kind: TrackKind | undefined,
  alignX?: AlignValue,
  alignY?: AlignValue,
) {
  if (kind === 'column') {
    if (!alignX) {
      return
    }

    return css`
      align-self: ${alignX};
    `
  }

  if (kind === 'row') {
    if (!alignY) {
      return
    }

    return css`
      align-self: ${alignY};
    `
  }

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
