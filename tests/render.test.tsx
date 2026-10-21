import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'

import {
  Button,
  Cell,
  Checkbox,
  Chip,
  Col,
  Cols,
  Div,
  Grid,
  Heading,
  Input,
  Label,
  MultiSelect,
  NumberInput,
  Option,
  Panel,
  PanelizeProvider,
  Panels,
  Radio,
  Row,
  Rows,
  Select,
  Span,
  Switch,
  Text,
  Textarea,
  TextLink,
  usePanelizeTheme,
} from '~/src'

afterEach(cleanup)

function renderInShell(ui: React.ReactNode, mode: 'dark' | 'light' = 'dark') {
  return render(
    <PanelizeProvider mode={mode}>
      <Panels>
        <Panel>{ui}</Panel>
      </Panels>
    </PanelizeProvider>,
  )
}

describe('layout', () => {
  it('renders a shell, tracks, and a grid', () => {
    const { container } = renderInShell(
      <>
        <Rows>
          <Row>one</Row>
          <Row>two</Row>
        </Rows>
        <Cols>
          <Col>a</Col>
          <Col>b</Col>
        </Cols>
        <Grid numCols={2}>
          <Cell>x</Cell>
          <Cell>y</Cell>
        </Grid>
        <Div>div</Div>
      </>,
    )
    for (const text of ['one', 'two', 'a', 'b', 'x', 'y', 'div']) {
      expect(container).toHaveTextContent(text)
    }
  })

  it('appends css and passes style through', () => {
    renderInShell(
      <Div data-testid='box' style={{ opacity: 0.5 }} css='outline: 1px solid red'>
        x
      </Div>,
    )
    expect(screen.getByTestId('box')).toHaveStyle({ opacity: '0.5' })
  })
})

describe('type', () => {
  it('uses the expected elements', () => {
    renderInShell(
      <>
        <Text>text</Text>
        <Heading level={3}>heading</Heading>
        <Span>span</Span>
        <TextLink href='/x'>link</TextLink>
        <Label htmlFor='f' label='label' />
      </>,
    )
    expect(screen.getByText('text').tagName).toBe('P')
    expect(screen.getByRole('heading', { level: 3 }).tagName).toBe('H3')
    expect(screen.getByText('span').tagName).toBe('SPAN')
    expect(screen.getByRole('link', { name: 'link' })).toHaveAttribute('href', '/x')
    expect(screen.getByText('label').tagName).toBe('LABEL')
  })

  it('applies text-align from align', () => {
    renderInShell(
      <Text align='center' data-testid='aligned'>
        centered
      </Text>,
    )
    expect(screen.getByTestId('aligned')).toHaveStyle({ textAlign: 'center' })
  })
})

describe('controls', () => {
  it('Button label, click, and type', () => {
    const onClick = vi.fn()
    renderInShell(<Button label='Go' onClick={onClick} />)
    const button = screen.getByRole('button', { name: 'Go' })
    expect(button).toHaveAttribute('type', 'button')
    fireEvent.click(button)
    expect(onClick).toHaveBeenCalledTimes(1)
  })

  it('Chip renders its label', () => {
    renderInShell(<Chip label='New' />)
    expect(screen.getByText('New').tagName).toBe('SPAN')
  })

  it('field primitives use the expected native elements', () => {
    renderInShell(
      <>
        <Input aria-label='input' />
        <NumberInput aria-label='number' />
        <Textarea aria-label='textarea' />
        <Switch aria-label='switch' />
        <Checkbox aria-label='checkbox' />
        <Radio aria-label='radio' name='r' value='1' />
      </>,
    )
    expect(screen.getByLabelText('input')).toHaveAttribute('type', 'text')
    expect(screen.getByLabelText('number')).toHaveAttribute('type', 'number')
    expect(screen.getByLabelText('textarea').tagName).toBe('TEXTAREA')
    expect(screen.getByRole('switch')).toBeInTheDocument()
    expect(screen.getByRole('checkbox')).toBeInTheDocument()
    expect(screen.getByRole('radio')).toBeInTheDocument()
  })

  it('Select opens a listbox and reports the picked value', () => {
    const onChange = vi.fn()
    renderInShell(
      <Select aria-label='country' value='' onChange={onChange}>
        <Option value='us'>United States</Option>
        <Option value='mx'>Mexico</Option>
      </Select>,
    )
    fireEvent.click(screen.getByRole('combobox'))
    expect(screen.getByRole('listbox')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('option', { name: 'Mexico' }))
    expect(onChange).toHaveBeenCalledWith('mx')
  })

  it('MultiSelect toggles values and stays open', () => {
    const onChange = vi.fn()
    renderInShell(
      <MultiSelect aria-label='countries' value={['us']} onChange={onChange}>
        <Option value='us'>United States</Option>
        <Option value='ca'>Canada</Option>
      </MultiSelect>,
    )
    fireEvent.click(screen.getByRole('combobox'))
    fireEvent.click(screen.getByRole('option', { name: /Canada/ }))
    expect(onChange).toHaveBeenCalledWith(['us', 'ca'])
    expect(screen.getByRole('listbox')).toBeInTheDocument()
  })
})

describe('theme hook', () => {
  function Mode() {
    const { mode, colors } = usePanelizeTheme()
    return <span data-testid='mode'>{`${mode}:${colors.base.background}`}</span>
  }

  it('reports the provider mode and its active surfaces', () => {
    const { rerender } = render(
      <PanelizeProvider mode='light'>
        <Mode />
      </PanelizeProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toMatch(/^light:/)
    const light = screen.getByTestId('mode').textContent
    rerender(
      <PanelizeProvider mode='dark'>
        <Mode />
      </PanelizeProvider>,
    )
    expect(screen.getByTestId('mode').textContent).toMatch(/^dark:/)
    expect(screen.getByTestId('mode').textContent).not.toBe(light)
  })
})
