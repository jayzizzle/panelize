# Theme keys

Every key `createPanelizeTheme` accepts. Omit any key to keep the library default.

```ts
import { createPanelizeTheme, palette } from 'panelize'

export const panelizeTheme = createPanelizeTheme({
  colors: {
    dark: {
      app: {
        background: '#121212',
        text: '#e8e8e8',
      },
      muted: {
        background: '#222222',
        text: {
          base: palette.gray.extraLight,
          muted: palette.gray.base,
          highlighted: palette.white,
        },
        border: palette.gray.dark,
      },
      base: {
        background: '#333333',
        text: {
          base: palette.gray.extraLight,
          muted: palette.gray.light,
          highlighted: palette.white,
        },
        border: palette.gray.base,
      },
      highlighted: {
        background: palette.gray.dark,
        text: {
          base: palette.white,
          muted: palette.gray.light,
          highlighted: palette.white,
        },
        border: palette.gray.base,
      },
    },
    light: {
      app: {
        background: '#fafafa',
        text: '#121212',
      },
      muted: {
        background: '#f2f2f2',
        text: {
          base: '#222222',
          muted: palette.gray.base,
          highlighted: palette.black,
        },
        border: palette.gray.light,
      },
      base: {
        background: '#f7f7f7',
        text: {
          base: '#333333',
          muted: palette.gray.base,
          highlighted: palette.black,
        },
        border: palette.gray.base,
      },
      highlighted: {
        background: palette.white,
        text: {
          base: palette.gray.dark,
          muted: palette.gray.base,
          highlighted: palette.black,
        },
        border: palette.gray.base,
      },
    },
  },
  brand: {
    primary: {
      base: '#ff9f2e',
      hover: '#ffb762',
      active: '#f1962b',
    },
    secondary: {
      base: '#ff9f2e',
      hover: '#ffb762',
      active: '#f1962b',
    },
    accent: {
      base: '#ff9f2e',
      hover: '#ffb762',
      active: '#f1962b',
    },
  },
  status: {
    danger: '#f2555a',
    warning: '#ffd60a',
    success: '#4ade80',
    info: '#38bdf8',
  },
  space: {
    none: '0rem',
    extraSmall: '0.25rem',
    small: '0.5rem',
    base: '1rem',
    large: '1.5rem',
    extraLarge: '2rem',
  },
  borderWidths: {
    none: '0',
    extraSmall: '1px',
    small: '2px',
    base: '4px',
    large: '8px',
    extraLarge: '12px',
  },
  breakpoints: {
    sm: '40rem',
    md: '48rem',
    lg: '64rem',
  },
  fontSizes: {
    extraSmall: '0.75rem',
    small: '0.875rem',
    base: '1rem',
    large: '1.25rem',
    extraLarge: '1.5rem',
  },
  fontWeights: {
    thin: '100',
    base: '400',
    bold: '700',
    heavy: '800',
  },
  fontFamilies: {
    base: '"Open Sans", sans-serif',
    display: 'Montserrat, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
  },
  // Unitless. `Text` leading. Switch track height is type × this. Checkbox / Radio use `1em`.
  lineHeight: 1.2,
  radii: {
    none: '0',
    extraSmall: '0.125rem',
    small: '0.25rem',
    base: '0.5rem',
    large: '0.75rem',
    extraLarge: '1rem',
  },
  defaults: {
    panel: {
      padding: 'none',
      margin: 'none',
      borderWidth: 'none',
      borderRadius: 'none',
    },
    panels: {
      padding: 'none',
      margin: 'none',
      gap: 'none',
    },
    // No panels.alignX / alignY: Panels is a column, or `horizontal` / `stack`.
    rows: {
      padding: 'none',
      margin: 'none',
      gap: 'none',
      alignX: 'stretch',
      alignY: 'start',
    },
    row: {
      padding: 'none',
      margin: 'none',
      height: 'auto',
      borderWidth: 'none',
      borderRadius: 'none',
    },
    cols: {
      padding: 'none',
      margin: 'none',
      gap: 'none',
      alignX: 'start',
      alignY: 'stretch',
    },
    col: {
      padding: 'none',
      margin: 'none',
      width: 'auto',
      borderWidth: 'none',
      borderRadius: 'none',
    },
    grid: {
      padding: 'none',
      margin: 'none',
      gap: 'none',
      alignX: 'stretch',
      alignY: 'stretch',
    },
    cell: {
      padding: 'none',
      margin: 'none',
      borderWidth: 'none',
      borderRadius: 'none',
    },
    div: {
      padding: 'none',
      margin: 'none',
      borderWidth: 'none',
      borderRadius: 'none',
    },
    text: {
      size: 'base',
      weight: 'base',
    },
    heading: {
      size: {
        1: '2rem',
        2: '1.5rem',
        3: '1.17rem',
        4: '1rem',
        5: '0.83rem',
        6: '0.67rem',
      },
      weight: 'bold',
      family: 'display',
    },
    textLink: {
      color: 'primary',
      hover: 'primary',
      hoverUnderline: false,
    },
    button: {
      color: 'primary',
      size: 'small',
      weight: 'bold',
      ink: palette.black,
      hover: { color: palette.black },
      paddingX: 'base',
      paddingY: 'small',
      gap: 'extraSmall',
      borderWidth: 'extraSmall',
      borderRadius: 'base',
    },
    chip: {
      color: 'primary',
      size: 'extraSmall',
      weight: 'bold',
      tint: '12%',
      paddingX: 'base',
      paddingY: 'extraSmall',
      gap: 'extraSmall',
      borderRadius: '999px',
      uppercase: true,
    },
    input: {
      color: 'primary',
      size: 'small',
      weight: 'base',
      paddingX: 'base',
      paddingY: 'small',
      borderWidth: 'extraSmall',
      borderRadius: 'base',
    },
    textarea: {
      color: 'primary',
      size: 'small',
      weight: 'base',
      paddingX: 'base',
      paddingY: 'small',
      borderWidth: 'extraSmall',
      borderRadius: 'base',
      resize: false,
      rows: 3,
    },
    select: {
      color: 'primary',
      size: 'small',
      weight: 'base',
      paddingX: 'base',
      paddingY: 'small',
      borderWidth: 'extraSmall',
      borderRadius: 'base',
      listMaxHeight: '16rem',
      listOffset: 'extraSmall',
      optionPaddingX: 'base',
      optionPaddingY: 'extraSmall',
      listZIndex: 1100,
      listShadow: '0 8px 24px rgb(0 0 0 / 35%)',
    },
    switch: {
      color: 'primary',
      size: 'base',
      ink: palette.white,
      widthFactor: 2,
      insetFactor: 0.2,
      borderRadius: '999px',
    },
    checkbox: {
      color: 'primary',
      size: 'base',
      ink: palette.black,
      borderWidth: 'extraSmall',
      borderRadius: 'small',
    },
    radio: {
      color: 'primary',
      size: 'base',
      borderWidth: 'extraSmall',
      borderRadius: '999px',
      insetFactor: 0.22,
    },
  },
})
```
