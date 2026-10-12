import { defaultBorderWidths, defaultRadii } from '~/src/theme/borders'
import { expandBrandHex } from '~/src/theme/brand'
import { defaultBreakpoints } from '~/src/theme/breakpoints'
import { palette } from '~/src/theme/color'
import {
  defaultFontFamilies,
  defaultFontSizes,
  defaultFontWeights,
  defaultLineHeight,
} from '~/src/theme/font'
import { defaultSpace } from '~/src/theme/space'
import {
  type BrandColors,
  type BrandOverrides,
  type BrandSlotOverride,
  type BrandState,
  type BreakpointScale,
  breakpointTokens,
  type ButtonDefaults,
  type CheckboxDefaults,
  type ChipDefaults,
  type ColDefaults,
  type ColorScheme,
  type ColorSchemes,
  type DeepPartial,
  type FlexDefaults,
  fontFamilyTokens,
  fontSizeTokens,
  fontWeightTokens,
  type HeadingDefaults,
  headingLevels,
  type InputDefaults,
  type LayoutDefaults,
  type PanelColors,
  type PanelizeTheme,
  type PanelizeThemeOverrides,
  type PanelsDefaults,
  type PanelTextColors,
  panelTextRoles,
  panelVariants,
  type RadioDefaults,
  type RowDefaults,
  type SelectDefaults,
  type SpaceScale,
  spaceTokens,
  type SpacingDefaults,
  type StatusColors,
  type StatusOverrides,
  type SwitchDefaults,
  type TextareaDefaults,
  type TextDefaults,
  type TextLinkDefaults,
  type ThemeColors,
} from '~/src/theme/types'

const noneSpacing: SpacingDefaults = {
  padding: 'none',
  margin: 'none',
}

const noneLayout: LayoutDefaults = {
  ...noneSpacing,
  borderWidth: 'none',
  borderRadius: 'none',
}

const defaultRow: RowDefaults = {
  ...noneLayout,
  height: 'auto',
}

const defaultCol: ColDefaults = {
  ...noneLayout,
  width: 'auto',
}

const defaultRows: FlexDefaults = {
  ...noneSpacing,
  gap: 'none',
  alignX: 'stretch',
  alignY: 'start',
}

const defaultCols: FlexDefaults = {
  ...noneSpacing,
  gap: 'none',
  alignX: 'start',
  alignY: 'stretch',
}

const defaultGrid: FlexDefaults = {
  ...noneSpacing,
  gap: 'none',
  alignX: 'stretch',
  alignY: 'stretch',
}

const defaultDarkColors: ThemeColors = {
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
}

const defaultLightColors: ThemeColors = {
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
}

export const defaultTheme: PanelizeTheme = {
  mode: 'dark',
  colorSchemes: { dark: defaultDarkColors, light: defaultLightColors },
  colors: defaultDarkColors,
  brand: {
    primary: expandBrandHex('#ff9f2e'),
    secondary: expandBrandHex('#ff9f2e'),
    accent: expandBrandHex('#ff9f2e'),
  },
  status: {
    danger: expandBrandHex('#f2555a'),
    warning: expandBrandHex('#ffd60a'),
    success: expandBrandHex('#4ade80'),
    info: expandBrandHex('#38bdf8'),
  },
  space: defaultSpace,
  borderWidths: defaultBorderWidths,
  radii: defaultRadii,
  breakpoints: { ...defaultBreakpoints },
  fontSizes: defaultFontSizes,
  fontWeights: defaultFontWeights,
  fontFamilies: defaultFontFamilies,
  lineHeight: defaultLineHeight,
  defaults: {
    panel: { ...noneLayout },
    panels: { ...noneSpacing, gap: 'none' },
    rows: { ...defaultRows },
    row: { ...defaultRow },
    cols: { ...defaultCols },
    col: { ...defaultCol },
    grid: { ...defaultGrid },
    cell: { ...noneLayout },
    div: { ...noneLayout },
    text: { size: 'base', weight: 'base' },
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
    textLink: { color: 'primary', hover: 'primary', hoverUnderline: false },
    button: {
      color: 'primary',
      size: 'small',
      weight: 'bold',
      ink: palette.black,
      hover: {
        color: palette.black,
      },
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
}

function mergeTokenScale<T extends string>(
  tokens: readonly T[],
  base: Record<T, string>,
  overrides?: Partial<Record<T, string>>,
): Record<T, string> {
  const next = { ...base }

  if (!overrides) {
    return next
  }

  for (const token of tokens) {
    const value = overrides[token]
    if (value !== undefined) {
      next[token] = value
    }
  }

  return next
}

function mergeScale(base: SpaceScale, overrides?: DeepPartial<SpaceScale>): SpaceScale {
  return mergeTokenScale(spaceTokens, base, overrides)
}

function mergeBreakpoints(
  base: BreakpointScale,
  overrides?: DeepPartial<BreakpointScale>,
): BreakpointScale {
  return mergeTokenScale(breakpointTokens, base, overrides)
}

function mergeSpacingDefaults(
  base: SpacingDefaults,
  overrides?: DeepPartial<SpacingDefaults>,
): SpacingDefaults {
  return {
    padding: overrides?.padding ?? base.padding,
    margin: overrides?.margin ?? base.margin,
  }
}

function mergeLayoutDefaults(
  base: LayoutDefaults,
  overrides?: DeepPartial<LayoutDefaults>,
): LayoutDefaults {
  return {
    ...mergeSpacingDefaults(base, overrides),
    borderWidth: overrides?.borderWidth ?? base.borderWidth,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
  }
}

function mergeRowDefaults(base: RowDefaults, overrides?: DeepPartial<RowDefaults>): RowDefaults {
  return {
    ...mergeLayoutDefaults(base, overrides),
    height: overrides?.height ?? base.height,
  }
}

function mergeColDefaults(base: ColDefaults, overrides?: DeepPartial<ColDefaults>): ColDefaults {
  return {
    ...mergeLayoutDefaults(base, overrides),
    width: overrides?.width ?? base.width,
  }
}

function mergePanelsDefaults(
  base: PanelsDefaults,
  overrides?: DeepPartial<PanelsDefaults>,
): PanelsDefaults {
  return {
    ...mergeSpacingDefaults(base, overrides),
    gap: overrides?.gap ?? base.gap,
  }
}

function mergeTextDefaults(
  base: TextDefaults,
  overrides?: DeepPartial<TextDefaults>,
): TextDefaults {
  return {
    size: overrides?.size ?? base.size,
    weight: overrides?.weight ?? base.weight,
  }
}

function mergeHeadingDefaults(
  base: HeadingDefaults,
  overrides?: DeepPartial<HeadingDefaults>,
): HeadingDefaults {
  const size = { ...base.size }
  for (const level of headingLevels) {
    const value = overrides?.size?.[level]
    if (value !== undefined) {
      size[level] = value
    }
  }
  return {
    size,
    weight: overrides?.weight ?? base.weight,
    family: overrides?.family ?? base.family,
  }
}

function mergeTextLinkDefaults(
  base: TextLinkDefaults,
  overrides?: DeepPartial<TextLinkDefaults>,
): TextLinkDefaults {
  return {
    color: overrides?.color ?? base.color,
    hover: overrides?.hover ?? base.hover,
    hoverUnderline: overrides?.hoverUnderline ?? base.hoverUnderline,
  }
}

function mergeChipDefaults(
  base: ChipDefaults,
  overrides?: DeepPartial<ChipDefaults>,
): ChipDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    weight: overrides?.weight ?? base.weight,
    tint: overrides?.tint ?? base.tint,
    paddingX: overrides?.paddingX ?? base.paddingX,
    paddingY: overrides?.paddingY ?? base.paddingY,
    gap: overrides?.gap ?? base.gap,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
    uppercase: overrides?.uppercase ?? base.uppercase,
  }
}

function mergeInputDefaults(
  base: InputDefaults,
  overrides?: DeepPartial<InputDefaults>,
): InputDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    weight: overrides?.weight ?? base.weight,
    paddingX: overrides?.paddingX ?? base.paddingX,
    paddingY: overrides?.paddingY ?? base.paddingY,
    borderWidth: overrides?.borderWidth ?? base.borderWidth,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
  }
}

function mergeTextareaDefaults(
  base: TextareaDefaults,
  overrides?: DeepPartial<TextareaDefaults>,
): TextareaDefaults {
  return {
    ...mergeInputDefaults(base, overrides),
    resize: overrides?.resize ?? base.resize,
    rows: overrides?.rows ?? base.rows,
  }
}

function mergeSelectDefaults(
  base: SelectDefaults,
  overrides?: DeepPartial<SelectDefaults>,
): SelectDefaults {
  return {
    ...mergeInputDefaults(base, overrides),
    listMaxHeight: overrides?.listMaxHeight ?? base.listMaxHeight,
    listOffset: overrides?.listOffset ?? base.listOffset,
    optionPaddingX: overrides?.optionPaddingX ?? base.optionPaddingX,
    optionPaddingY: overrides?.optionPaddingY ?? base.optionPaddingY,
    listZIndex: overrides?.listZIndex ?? base.listZIndex,
    listShadow: overrides?.listShadow ?? base.listShadow,
  }
}

function mergeSwitchDefaults(
  base: SwitchDefaults,
  overrides?: DeepPartial<SwitchDefaults>,
): SwitchDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    ink: overrides?.ink ?? base.ink,
    widthFactor: overrides?.widthFactor ?? base.widthFactor,
    insetFactor: overrides?.insetFactor ?? base.insetFactor,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
  }
}

function mergeCheckboxDefaults(
  base: CheckboxDefaults,
  overrides?: DeepPartial<CheckboxDefaults>,
): CheckboxDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    ink: overrides?.ink ?? base.ink,
    borderWidth: overrides?.borderWidth ?? base.borderWidth,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
  }
}

function mergeRadioDefaults(
  base: RadioDefaults,
  overrides?: DeepPartial<RadioDefaults>,
): RadioDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    borderWidth: overrides?.borderWidth ?? base.borderWidth,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
    insetFactor: overrides?.insetFactor ?? base.insetFactor,
  }
}

function mergeButtonDefaults(
  base: ButtonDefaults,
  overrides?: DeepPartial<ButtonDefaults>,
): ButtonDefaults {
  return {
    color: overrides?.color ?? base.color,
    size: overrides?.size ?? base.size,
    weight: overrides?.weight ?? base.weight,
    ink: overrides?.ink ?? base.ink,
    hover: {
      color: overrides?.hover?.color ?? base.hover.color,
      background: overrides?.hover?.background ?? base.hover.background,
    },
    paddingX: overrides?.paddingX ?? base.paddingX,
    paddingY: overrides?.paddingY ?? base.paddingY,
    gap: overrides?.gap ?? base.gap,
    borderWidth: overrides?.borderWidth ?? base.borderWidth,
    borderRadius: overrides?.borderRadius ?? base.borderRadius,
  }
}

function mergeBrandSlot(current: BrandState, override?: BrandSlotOverride): BrandState {
  if (override === undefined) {
    return { ...current }
  }

  if (typeof override === 'string') {
    return expandBrandHex(override)
  }

  const base = override.base ?? current.base
  const derived = expandBrandHex(base)

  return {
    base,
    hover: override.hover ?? (override.base !== undefined ? derived.hover : current.hover),
    active: override.active ?? (override.base !== undefined ? derived.active : current.active),
  }
}

function mergeStatus(base: StatusColors, overrides?: StatusOverrides): StatusColors {
  return {
    danger: mergeBrandSlot(base.danger, overrides?.danger),
    warning: mergeBrandSlot(base.warning, overrides?.warning),
    success: mergeBrandSlot(base.success, overrides?.success),
    info: mergeBrandSlot(base.info, overrides?.info),
  }
}

function mergeBrand(base: BrandColors, overrides?: BrandOverrides): BrandColors {
  const primary = mergeBrandSlot(base.primary, overrides?.primary)
  const followPrimary = overrides?.primary !== undefined

  return {
    primary,
    secondary: mergeBrandSlot(followPrimary ? primary : base.secondary, overrides?.secondary),
    accent: mergeBrandSlot(followPrimary ? primary : base.accent, overrides?.accent),
  }
}

function mergeFlexDefaults(
  base: FlexDefaults,
  overrides?: DeepPartial<FlexDefaults>,
): FlexDefaults {
  return {
    ...mergeSpacingDefaults(base, overrides),
    gap: overrides?.gap ?? base.gap,
    alignX: overrides?.alignX ?? base.alignX,
    alignY: overrides?.alignY ?? base.alignY,
  }
}

function mergePanelText(
  base: PanelTextColors,
  overrides?: DeepPartial<PanelTextColors>,
): PanelTextColors {
  return mergeTokenScale(panelTextRoles, base, overrides)
}

function mergePanelColors(base: PanelColors, overrides?: DeepPartial<PanelColors>): PanelColors {
  return {
    background: overrides?.background ?? base.background,
    border: overrides?.border ?? base.border,
    text: mergePanelText(base.text, overrides?.text),
  }
}

function mergeSchemeColors(base: ThemeColors, overrides?: DeepPartial<ThemeColors>): ThemeColors {
  const colors: ThemeColors = { ...base }

  for (const variant of panelVariants) {
    colors[variant] = mergePanelColors(base[variant], overrides?.[variant])
  }

  const app = overrides?.app
  if (app?.background || app?.text) {
    colors.app = { ...base.app, ...app }
  } else if (base.app) {
    colors.app = { ...base.app }
  }

  return colors
}

export function applyColorScheme(theme: PanelizeTheme, mode: ColorScheme): PanelizeTheme {
  return {
    ...theme,
    mode,
    colors: theme.colorSchemes[mode],
  }
}

/**
 * Merge overrides onto library defaults. Author `colors.dark` / `colors.light`.
 * The returned `colors` is the **dark slice**; both maps are `colorSchemes`.
 * Pass `mode` to `PanelizeProvider`, not here. Export a stable object and wrap with
 * `PanelizeProvider`. Full keys: `examples/panelize.theme.md`.
 */
export function createPanelizeTheme(overrides?: PanelizeThemeOverrides): PanelizeTheme {
  const colorSchemes: ColorSchemes = {
    dark: mergeSchemeColors(defaultTheme.colorSchemes.dark, overrides?.colors?.dark),
    light: mergeSchemeColors(defaultTheme.colorSchemes.light, overrides?.colors?.light),
  }
  const input = mergeInputDefaults(defaultTheme.defaults.input, overrides?.defaults?.input)

  return {
    mode: 'dark',
    colorSchemes,
    colors: colorSchemes.dark,
    brand: mergeBrand(defaultTheme.brand, overrides?.brand),
    status: mergeStatus(defaultTheme.status, overrides?.status),
    space: mergeScale(defaultTheme.space, overrides?.space),
    borderWidths: mergeScale(defaultTheme.borderWidths, overrides?.borderWidths),
    radii: mergeScale(defaultTheme.radii, overrides?.radii),
    breakpoints: mergeBreakpoints(defaultTheme.breakpoints, overrides?.breakpoints),
    fontSizes: mergeTokenScale(fontSizeTokens, defaultTheme.fontSizes, overrides?.fontSizes),
    fontWeights: mergeTokenScale(
      fontWeightTokens,
      defaultTheme.fontWeights,
      overrides?.fontWeights,
    ),
    fontFamilies: mergeTokenScale(
      fontFamilyTokens,
      defaultTheme.fontFamilies,
      overrides?.fontFamilies,
    ),
    lineHeight: overrides?.lineHeight ?? defaultTheme.lineHeight,
    defaults: {
      panel: mergeLayoutDefaults(defaultTheme.defaults.panel, overrides?.defaults?.panel),
      panels: mergePanelsDefaults(defaultTheme.defaults.panels, overrides?.defaults?.panels),
      rows: mergeFlexDefaults(defaultTheme.defaults.rows, overrides?.defaults?.rows),
      row: mergeRowDefaults(defaultTheme.defaults.row, overrides?.defaults?.row),
      cols: mergeFlexDefaults(defaultTheme.defaults.cols, overrides?.defaults?.cols),
      col: mergeColDefaults(defaultTheme.defaults.col, overrides?.defaults?.col),
      grid: mergeFlexDefaults(defaultTheme.defaults.grid, overrides?.defaults?.grid),
      cell: mergeLayoutDefaults(defaultTheme.defaults.cell, overrides?.defaults?.cell),
      div: mergeLayoutDefaults(defaultTheme.defaults.div, overrides?.defaults?.div),
      text: mergeTextDefaults(defaultTheme.defaults.text, overrides?.defaults?.text),
      heading: mergeHeadingDefaults(defaultTheme.defaults.heading, overrides?.defaults?.heading),
      textLink: mergeTextLinkDefaults(
        defaultTheme.defaults.textLink,
        overrides?.defaults?.textLink,
      ),
      button: mergeButtonDefaults(defaultTheme.defaults.button, overrides?.defaults?.button),
      chip: mergeChipDefaults(defaultTheme.defaults.chip, overrides?.defaults?.chip),
      input,
      textarea: mergeTextareaDefaults(
        {
          ...input,
          resize: defaultTheme.defaults.textarea.resize,
          rows: defaultTheme.defaults.textarea.rows,
        },
        overrides?.defaults?.textarea,
      ),
      select: mergeSelectDefaults(
        {
          ...input,
          listMaxHeight: defaultTheme.defaults.select.listMaxHeight,
          listOffset: defaultTheme.defaults.select.listOffset,
          optionPaddingX: defaultTheme.defaults.select.optionPaddingX,
          optionPaddingY: defaultTheme.defaults.select.optionPaddingY,
          listZIndex: defaultTheme.defaults.select.listZIndex,
          listShadow: defaultTheme.defaults.select.listShadow,
        },
        overrides?.defaults?.select,
      ),
      switch: mergeSwitchDefaults(defaultTheme.defaults.switch, overrides?.defaults?.switch),
      checkbox: mergeCheckboxDefaults(
        defaultTheme.defaults.checkbox,
        overrides?.defaults?.checkbox,
      ),
      radio: mergeRadioDefaults(defaultTheme.defaults.radio, overrides?.defaults?.radio),
    },
  }
}
