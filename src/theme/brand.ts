import { type BrandState } from '~/src/theme/types'

function parseHex(hex: string): [number, number, number] | null {
  const raw = hex.trim()
  const short = /^#([\da-fA-F])([\da-fA-F])([\da-fA-F])$/.exec(raw)
  if (short) {
    return [
      Number.parseInt(short[1] + short[1], 16),
      Number.parseInt(short[2] + short[2], 16),
      Number.parseInt(short[3] + short[3], 16),
    ]
  }

  const full = /^#([\da-fA-F]{2})([\da-fA-F]{2})([\da-fA-F]{2})$/.exec(raw)
  if (!full) {
    return null
  }

  return [Number.parseInt(full[1], 16), Number.parseInt(full[2], 16), Number.parseInt(full[3], 16)]
}

function toHex(r: number, g: number, b: number): string {
  return `#${[r, g, b].map((n) => n.toString(16).padStart(2, '0')).join('')}`
}

function mixChannel(from: number, to: number, amount: number): number {
  return Math.round(from + (to - from) * amount)
}

function mixHex(hex: string, toward: number, amount: number): string | null {
  const rgb = parseHex(hex)
  if (!rgb) {
    return null
  }

  return toHex(
    mixChannel(rgb[0], toward, amount),
    mixChannel(rgb[1], toward, amount),
    mixChannel(rgb[2], toward, amount),
  )
}

/** Hover: mix toward white. Active: mix toward black. Non-hex `base` copies into hover/active. */
export function expandBrandHex(base: string): BrandState {
  return {
    base,
    hover: mixHex(base, 255, 0.25) ?? base,
    active: mixHex(base, 0, 0.055) ?? base,
  }
}
