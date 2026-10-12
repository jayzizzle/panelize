import { css, styled } from 'styled-components'

import { fieldChromeCss, type FieldChromeVars } from '~/src/components/forms/field'
import { panelCssVars } from '~/src/components/layout/Panel'

export const TriggerWrap = styled.span<{ $fill?: boolean }>`
  position: relative;
  display: ${({ $fill }) => ($fill ? 'block' : 'inline-block')};
  ${({ $fill }) =>
    $fill
      ? css`
          width: 100%;
        `
      : ''}
  min-width: 0;
  vertical-align: top;
`

export const ClearButton = styled.button<{ $end: string; $ink: string; $hoverInk: string }>`
  position: absolute;
  z-index: 1;
  top: 50%;
  inset-inline-end: ${({ $end }) => $end};
  box-sizing: border-box;
  width: 1.375rem;
  height: 1.375rem;
  margin: 0;
  padding: 0.1875rem;
  transform: translateY(-50%);
  border: 0;
  border-radius: 50%;
  background: transparent;
  background-clip: content-box;
  cursor: pointer;
  &::before,
  &::after {
    content: '';
    position: absolute;
    top: 50%;
    left: 50%;
    width: 0.58em;
    height: 0.12em;
    background: ${({ $ink }) => $ink};
  }
  &::before {
    transform: translate(-50%, -50%) rotate(45deg);
  }
  &::after {
    transform: translate(-50%, -50%) rotate(-45deg);
  }
  &:hover {
    background: color-mix(
      in srgb,
      var(${panelCssVars.textHighlighted}) 16%,
      var(${panelCssVars.background})
    );
    background-clip: content-box;
    &::before,
    &::after {
      background: ${({ $hoverInk }) => $hoverInk};
    }
  }
  &:disabled {
    cursor: not-allowed;
    opacity: 0.45;
  }
`

type StyledTriggerProps = FieldChromeVars & {
  $open: boolean
  $clearable?: boolean
  $muted: string
}

export const TriggerLabel = styled.span<{ $ink: string }>`
  min-width: 0;
  flex: 1 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: ${({ $ink }) => $ink};
  -webkit-text-fill-color: ${({ $ink }) => $ink};
`

export const StyledTrigger = styled.button<StyledTriggerProps>`
  ${fieldChromeCss}
  position: relative;
  display: ${({ $fill }) => ($fill ? 'flex' : 'inline-flex')};
  align-items: center;
  justify-content: flex-start;
  text-align: left;
  cursor: pointer;
  color: ${({ $ink }) => $ink};
  -webkit-text-fill-color: ${({ $ink }) => $ink};
  border: ${({ $borderWidth, $borderColor }) => `${$borderWidth} solid ${$borderColor}`};
  background-color: ${({ $bg }) => $bg};
  padding-inline-end: calc(
    ${({ $paddingX, $clearable }) =>
      $clearable ? `${$paddingX} + 2.15em` : `${$paddingX} + 1.15em`}
  );
  ${({ $focus, $invalid }) => css`
    &:focus,
    &[aria-expanded='true'] {
      outline: none;
      border-color: ${$focus};
      box-shadow: 0 0 0 2px color-mix(in srgb, ${$focus} 18%, transparent);
    }
    &[aria-invalid='true'],
    &[aria-invalid='true']:focus,
    &[aria-invalid='true'][aria-expanded='true'] {
      border-color: ${$invalid};
      box-shadow: 0 0 0 2px color-mix(in srgb, ${$invalid} 18%, transparent);
    }
  `}
  &::after {
    content: '';
    position: absolute;
    inset-inline-end: ${({ $paddingX }) => $paddingX};
    top: 50%;
    width: 0.4em;
    height: 0.4em;
    box-sizing: border-box;
    border-right: 0.12em solid ${({ $muted }) => $muted};
    border-bottom: 0.12em solid ${({ $muted }) => $muted};
    transform: ${({ $open }) =>
      $open
        ? 'translateY(calc(-50% + 0.06em)) rotate(-135deg)'
        : 'translateY(calc(-50% - 0.06em)) rotate(45deg)'};
    pointer-events: none;
  }
  &:disabled {
    cursor: not-allowed;
  }
  ${({ $customCss }) => $customCss ?? ''}
`

type StyledListProps = {
  $top: number
  $left: number
  $width: number
  $maxHeight: number
  $zIndex: number
  $shadow: string
  $radius: string
  $borderWidth: string
  $borderColor: string
  $bg: string
  $ink: string
  $size: string
  $weight: string
  $family: string
  $lineHeight: number | string
}

export const StyledList = styled.ul<StyledListProps>`
  box-sizing: border-box;
  position: fixed;
  z-index: ${({ $zIndex }) => $zIndex};
  top: ${({ $top }) => `${$top}px`};
  left: ${({ $left }) => `${$left}px`};
  width: ${({ $width }) => `${$width}px`};
  max-height: ${({ $maxHeight }) => `${$maxHeight}px`};
  margin: 0;
  padding: 0.25rem 0;
  overflow: auto;
  list-style: none;
  font-family: ${({ $family }) => $family};
  font-size: ${({ $size }) => $size};
  font-weight: ${({ $weight }) => $weight};
  line-height: ${({ $lineHeight }) => $lineHeight};
  color: ${({ $ink }) => $ink};
  -webkit-text-fill-color: ${({ $ink }) => $ink};
  border: ${({ $borderWidth }) => $borderWidth} solid ${({ $borderColor }) => $borderColor};
  border-radius: ${({ $radius }) => $radius};
  background: ${({ $bg }) => $bg};
  box-shadow: ${({ $shadow }) => $shadow};
`
