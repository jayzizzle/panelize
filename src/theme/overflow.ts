import { css } from 'styled-components'

import { type ScrollValue } from '~/src/theme/types'

export type ScrollProps = {
  /**
   * Scroll this box when content overflows. Opt in on `Panels` and `Panel` only
   * (`Rows` / `Cols` are stacks, not scrollports).
   * `vertical` / `horizontal` / `both`. Omit for no clip.
   * Horizontal still needs inner content wider than this box (`width` / `minWidth` on children).
   */
  scroll?: ScrollValue
}

export function scrollCss(scroll?: ScrollValue) {
  if (!scroll) {
    return
  }

  const y = scroll === 'vertical' || scroll === 'both'
  const x = scroll === 'horizontal' || scroll === 'both'

  return css`
    overflow-x: ${x ? 'auto' : 'hidden'};
    overflow-y: ${y ? 'auto' : 'hidden'};
    ${
      y
        ? css`
            min-height: 0;
          `
        : ''
    }
    ${
      x
        ? css`
            min-width: 0;
          `
        : ''
    }
  `
}
