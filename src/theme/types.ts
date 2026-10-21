export const panelVariants = ['muted', 'base', 'highlighted'] as const

export type PanelVariant = (typeof panelVariants)[number]

/** Type roles on a panel surface. Brand and status chromas are global, not per variant. */
export const panelTextRoles = ['base', 'muted', 'highlighted'] as const

export type PanelTextRole = (typeof panelTextRoles)[number]

export type PanelTextColors = Record<PanelTextRole, string>

export type PanelColors = {
  background: string
  text: PanelTextColors
  border: string
}

export type AppColors = {
  background?: string
  text?: string
}

export type ThemeColors = Record<PanelVariant, PanelColors> & {
  app?: AppColors
}

/** Runtime / authoring schemes. Surfaces stay `muted` / `base` / `highlighted`. */
export const colorSchemeTokens = ['dark', 'light'] as const

export type ColorScheme = (typeof colorSchemeTokens)[number]

export type ColorSchemes = Record<ColorScheme, ThemeColors>

/** App brand chromas. Use on `Text` as `color="primary"`. Not panel variants. */
export const brandTokens = ['primary', 'secondary', 'accent'] as const

export type BrandToken = (typeof brandTokens)[number]

/** Meaning chromas. Shared across schemes. Not brand. No `subtle` — mix into `--panelize-bg`. */
export const statusTokens = ['danger', 'warning', 'success', 'info'] as const

export type StatusToken = (typeof statusTokens)[number]

export const brandStateTokens = ['base', 'hover', 'active'] as const

export type BrandStateToken = (typeof brandStateTokens)[number]

/** Resolved brand slot. `color="primary"` uses `base`. */
export type BrandState = Record<BrandStateToken, string>

/** Same `{ base, hover, active }` as brand. Status uses this too. */
export type ChromaState = BrandState

export type BrandColors = Record<BrandToken, ChromaState>

/** Hex (`#ff9f2e`) expands to base/hover/active, or set those keys. */
export type BrandSlotOverride = string | Partial<BrandState>

export type BrandOverrides = Partial<Record<BrandToken, BrandSlotOverride>>

export type StatusColors = Record<StatusToken, ChromaState>

export type StatusOverrides = Partial<Record<StatusToken, BrandSlotOverride>>

/** Brand (`primary`), status (`danger`), or raw CSS. Token → that slot’s `.base`. */
export type ColorValue = BrandToken | StatusToken | (string & {})

export const spaceTokens = ['none', 'extraSmall', 'small', 'base', 'large', 'extraLarge'] as const

export type SpaceToken = (typeof spaceTokens)[number]

export type SpaceScale = Record<SpaceToken, string>

/** A space token (`small`), `auto`, or a raw CSS length (`1rem`, `100%`). */
export type SpaceValue = SpaceToken | (string & {})

export type SpacingDefaults = {
  padding: SpaceToken
  margin: SpaceToken
}

export type LayoutDefaults = SpacingDefaults & {
  borderWidth: SpaceToken
  borderRadius: SpaceToken
}

export type RowDefaults = LayoutDefaults & {
  height: SpaceValue
}

export type ColDefaults = LayoutDefaults & {
  width: SpaceValue
}

export const alignValues = [
  'start',
  'end',
  'center',
  'stretch',
  'baseline',
  'space-between',
  'space-around',
  'space-evenly',
] as const

export type AlignValue = (typeof alignValues)[number]

/** `text-align` on type primitives. Not layout `alignX` / `alignY`. */
export const textAlignValues = ['start', 'end', 'center', 'justify'] as const

export type TextAlignValue = (typeof textAlignValues)[number]

export const scrollValues = ['vertical', 'horizontal', 'both'] as const

export type ScrollValue = (typeof scrollValues)[number]

export type FlexDefaults = SpacingDefaults & {
  gap: SpaceToken
  alignX: AlignValue
  alignY: AlignValue
}

export type PanelsDefaults = SpacingDefaults & {
  gap: SpaceToken
}

export type ThemeDefaults = {
  panel: LayoutDefaults
  /** Spacing and gap. Align is instance-only because `Panels` is row or column. */
  panels: PanelsDefaults
  rows: FlexDefaults
  row: RowDefaults
  cols: FlexDefaults
  col: ColDefaults
  /** Gap and item align (`stretch` / `stretch`). Track counts are instance-only (`numCols` / `numRows`). */
  grid: FlexDefaults
  cell: LayoutDefaults
  div: LayoutDefaults
  text: TextDefaults
  heading: HeadingDefaults
  textLink: TextLinkDefaults
  button: ButtonDefaults
  chip: ChipDefaults
  input: InputDefaults
  textarea: TextareaDefaults
  select: SelectDefaults
  switch: SwitchDefaults
  checkbox: CheckboxDefaults
  radio: RadioDefaults
}

export const breakpointTokens = ['sm', 'md', 'lg'] as const

export type BreakpointToken = (typeof breakpointTokens)[number]

export type BreakpointScale = Record<BreakpointToken, string>

/** A breakpoint token (`sm`) or a raw CSS length (`40rem`). */
export type StackValue = BreakpointToken | (string & {})

export const fontSizeTokens = ['extraSmall', 'small', 'base', 'large', 'extraLarge'] as const

export type FontSizeToken = (typeof fontSizeTokens)[number]

export type FontSizeScale = Record<FontSizeToken, string>

/** A font size token (`small`) or a raw CSS size (`1.125rem`). */
export type FontSizeValue = FontSizeToken | (string & {})

export const fontWeightTokens = ['thin', 'base', 'bold', 'heavy'] as const

export type FontWeightToken = (typeof fontWeightTokens)[number]

export type FontWeightScale = Record<FontWeightToken, string>

/** A font weight token (`thin` / `base` / `bold` / `heavy`) or a raw CSS weight (`600`). */
export type FontWeightValue = FontWeightToken | (string & {})

export const fontFamilyTokens = ['base', 'display', 'mono'] as const

export type FontFamilyToken = (typeof fontFamilyTokens)[number]

export type FontFamilyScale = Record<FontFamilyToken, string>

export type TextDefaults = {
  size: FontSizeToken
  /** Default `base` (`400`) so `Text` does not inherit a parent’s weight. */
  weight: FontWeightToken
}

export const headingLevels = [1, 2, 3, 4, 5, 6] as const

export type HeadingLevel = (typeof headingLevels)[number]

/** UA-like `h1`–`h6` sizes (`2rem` … `0.67rem`). Instance `size` overrides. */
export type HeadingSizeScale = Record<HeadingLevel, string>

export type HeadingDefaults = {
  size: HeadingSizeScale
  /** Default `bold` (browser headings). */
  weight: FontWeightToken
  /** Default `display`. Instance `family` overrides. */
  family: FontFamilyToken
}

/** `hover: 'primary'` with rest `primary` uses that slot’s `.hover`. `inherit` = panel `text.base`. */
export type TextLinkHoverValue = ColorValue | 'inherit'

export type TextLinkDefaults = {
  /** Rest color. Default `primary` (that slot’s `.base`). */
  color: ColorValue
  /** Hover color. Default `primary` (that slot’s `.hover` when rest is also `primary`). */
  hover: TextLinkHoverValue
  /** Underline on `:hover`. Default `false`. Rest `underlined` still stays underlined on hover. */
  hoverUnderline: boolean
}

/**
 * Filled hover paints. Instance `color` owns chroma (`.hover` / `.active`).
 * `background` is only a raw CSS override for the filled hover fill.
 */
export type ButtonHoverDefaults = {
  /** Filled hover/active label. Brand/status token → that slot’s `.base`. Default `palette.black`. */
  color: ColorValue
  /** Omit = instance slot `.hover`. Raw CSS replaces filled hover/active fill. Brand/status tokens are ignored. */
  background?: string
}

/** Badge chrome. Fill is `color-mix` of chroma into `--panelize-bg` at `tint`. */
export type ChipDefaults = {
  /** Brand or status slot. Default `primary`. */
  color: ColorValue
  /** Default `extraSmall` (`0.75rem`). */
  size: FontSizeValue
  weight: FontWeightToken
  /** Share of chroma in `color-mix` against the panel background. Default `12%`. */
  tint: string
  paddingX: SpaceValue
  paddingY: SpaceValue
  gap: SpaceValue
  /** Capsule. Default `999px`. */
  borderRadius: SpaceValue
  /** Default `true`. */
  uppercase: boolean
}

/** Chrome for `Input` / `NumberInput`. Rest is panel vars; `color` is focus chroma (not ink). */
export type InputDefaults = {
  /** Brand or status slot for focus border, glow, and caret. Default `primary`. */
  color: ColorValue
  size: FontSizeToken
  /** Default `base` (`400`). */
  weight: FontWeightToken
  paddingX: SpaceValue
  paddingY: SpaceValue
  borderWidth: SpaceToken
  borderRadius: SpaceToken
}

/** Chrome for `Textarea`. Field keys inherit merged `defaults.input` unless overridden here. */
export type TextareaDefaults = InputDefaults & {
  /** Vertical resize handle. Default `false`. */
  resize: boolean
  /** Native `rows`. Default `3`. */
  rows: number
}

/** Chrome for `Select`. Field keys inherit merged `defaults.input` unless overridden here. */
export type SelectDefaults = InputDefaults & {
  /** Menu max height (CSS). Default `16rem`. */
  listMaxHeight: string
  /** Gap between trigger and menu. Default `extraSmall`. */
  listOffset: SpaceToken
  /** Option row padding X. Default `base`. */
  optionPaddingX: SpaceToken
  /** Option row padding Y. Default `extraSmall`. */
  optionPaddingY: SpaceToken
  /** Menu stacking order. Default `1100`. */
  listZIndex: number
  /** Menu drop shadow. Default `0 8px 24px rgb(0 0 0 / 35%)`. */
  listShadow: string
}

/** Chrome for `Switch`. Track height is type size × `lineHeight`. */
export type SwitchDefaults = {
  /** Brand or status slot for the on track. Default `primary`. */
  color: ColorValue
  /** Type size the track is built for. Default `base`. */
  size: FontSizeToken
  /** Thumb fill. Default `palette.white`. */
  ink: string
  /** Track width as a multiple of the type size. Default `2`. */
  widthFactor: number
  /** Inset on every edge as a multiple of the type size. Default `0.2`. Thumb is height − 2×this. */
  insetFactor: number
  /** Track radius. Default `999px` (capsule). Instance `borderRadius` overrides. Thumb follows `min(this, 50%)`. */
  borderRadius: SpaceValue
}

/** Chrome for `Checkbox`. Box is the type size (`1em`), square. */
export type CheckboxDefaults = {
  /** Brand or status slot for the on fill. Default `primary`. */
  color: ColorValue
  /** Type size the box is built for. Default `base`. */
  size: FontSizeToken
  /** Check / dash on the on fill. Default `palette.black` (same as filled `Button`). */
  ink: string
  /** Rest stroke. Default `extraSmall` (`1px`). */
  borderWidth: SpaceToken
  /** Box radius. Default `small`. */
  borderRadius: SpaceValue
}

/** Chrome for `Radio`. Box is the type size (`1em`), circle. */
export type RadioDefaults = {
  /** Brand or status slot for the checked ring and inner disc. Default `primary`. */
  color: ColorValue
  /** Type size the box is built for. Default `base`. */
  size: FontSizeToken
  /** Rest stroke. Default `extraSmall` (`1px`). */
  borderWidth: SpaceToken
  /** Box radius. Default `999px` (circle). Instance `borderRadius` overrides. Inner disc follows `min(this, 50%)`. */
  borderRadius: SpaceValue
  /** Gap from the inner edge of the ring to the disc, as a multiple of the type size. Default `0.22`. */
  insetFactor: number
}

/** Chrome for `Button`. `color` is the chroma slot; `ink` is the filled rest label. */
export type ButtonDefaults = {
  /** Brand or status slot. Default `primary`. */
  color: ColorValue
  size: FontSizeToken
  weight: FontWeightToken
  /** Filled rest label. Outline rest uses the chroma slot instead. Default `palette.black`. */
  ink: string
  hover: ButtonHoverDefaults
  paddingX: SpaceValue
  paddingY: SpaceValue
  /** Flex gap between children (icon + label). Default `extraSmall`. */
  gap: SpaceValue
  borderWidth: SpaceValue
  borderRadius: SpaceValue
}

export type PanelizeTheme = {
  /** Active scheme. Default `dark`. Set on `PanelizeProvider`, not in `createPanelizeTheme`. */
  mode: ColorScheme
  /** Both scheme maps. Input is `createPanelizeTheme({ colors: { dark, light } })`. */
  colorSchemes: ColorSchemes
  /**
   * Active surfaces only (`muted` / `base` / `highlighted` / `app`). Not `{ dark, light }`.
   * `Panel` / `usePanelizeTheme().colors` read this. Both maps are `colorSchemes`.
   */
  colors: ThemeColors
  /** Global brand chromas. Shared across schemes. `Text` `color="primary"` reads `brand.primary.base`. */
  brand: BrandColors
  /** Meaning chromas. Shared across schemes. `Text` `color="danger"` reads `status.danger.base`. */
  status: StatusColors
  space: SpaceScale
  borderWidths: SpaceScale
  radii: SpaceScale
  breakpoints: BreakpointScale
  fontSizes: FontSizeScale
  fontWeights: FontWeightScale
  fontFamilies: FontFamilyScale
  /**
   * Unitless `line-height` on `Text` (`font-size × this`). Default `1.2`.
   * `Checkbox` / `Radio` use the type size (`1em`), not this. `Switch` track height is type × this.
   */
  lineHeight: number | string
  defaults: ThemeDefaults
}

export type DeepPartial<T> = {
  [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K]
}

/** `createPanelizeTheme` input. `colors.dark` / `colors.light` are scheme maps. `mode` is a provider prop. */
export type PanelizeThemeOverrides = Omit<
  DeepPartial<PanelizeTheme>,
  'brand' | 'status' | 'colors' | 'colorSchemes' | 'mode'
> & {
  brand?: BrandOverrides
  status?: StatusOverrides
  /**
   * Scheme maps (`dark` / `light`), each with `muted` / `base` / `highlighted` / `app`.
   * Top-level `muted` (old shape) is ignored. `dark` here is a scheme, not a panel variant.
   */
  colors?: Partial<Record<ColorScheme, DeepPartial<ThemeColors>>>
}
