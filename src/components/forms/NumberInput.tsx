import { type WheelEvent } from 'react'

import { Input, type InputProps } from '~/src/components/forms/Input'

/** Same chrome as `Input` (`css`, `background`, `ink`, `borderColor`, …). No `type`. */
export type NumberInputProps = Omit<InputProps, 'type'> & {
  /** Native `min`. Number or string. */
  min?: number | string
  /** Native `max`. Number or string. */
  max?: number | string
  /** Native `step`. Number, string, or `'any'`. */
  step?: number | string
}

function lockWheel(event: WheelEvent<HTMLInputElement>) {
  event.preventDefault()
  event.currentTarget.blur()
}

/**
 * `Input` locked to `type='number'`. Same chrome. `onChange` value is a string — use
 * `event.currentTarget.valueAsNumber`. Wheel blurs so the value does not nudge.
 *
 * @example
 * ```tsx
 * <Label htmlFor='count' label='Count' />
 * <NumberInput id='count' min={0} step={1} />
 * ```
 */
export function NumberInput(props: NumberInputProps) {
  const { onWheel, ...rest } = props
  return (
    <Input
      {...rest}
      type='number'
      onWheel={(event) => {
        lockWheel(event)
        onWheel?.(event)
      }}
    />
  )
}

NumberInput.displayName = 'NumberInput'
