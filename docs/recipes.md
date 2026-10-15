# Recipes

Copyable trees that follow [composition](composition.md). Pick the closest recipe, then change copy and tokens. Every tree sits inside `PanelizeProvider` and a host with `html` / `body` / `#root { height: 100% }`.

| Need                            | Recipe                                      |
| ------------------------------- | ------------------------------------------- |
| One scrolling page              | [Page](#page)                               |
| Sidebar plus main               | [Sidebar and main](#sidebar-and-main)       |
| Centered card (login, empty)    | [Centered card](#centered-card)             |
| Label above a field             | [Form fields](#form-fields)                 |
| Metric tiles that reflow        | [Dashboard grid](#dashboard-grid)           |
| Header bar, content, action row | [Header, body, footer](#header-body-footer) |

## Page

Scroll the shell. Inner `Panel` uses `minHeight='100%'`, not `fill`.

```tsx
<Panels fill scroll='vertical'>
  <Panel variant='muted' minHeight='100%' padding='base'>
    <Rows gap='base'>
      <Row>
        <Heading level={1}>Title</Heading>
      </Row>
      <Row>
        <Text muted>Long page copy…</Text>
      </Row>
    </Rows>
  </Panel>
</Panels>
```

## Sidebar and main

`horizontal` + `fill` on `Panels`. Sidebar gets `width`. Main gets `flex` and owns `scroll`. `stack` is "at most this wide → column".

```tsx
<Panels horizontal fill stack='sm'>
  <Panel variant='muted' width='14rem' padding='base'>
    <Rows gap='small'>
      <Row>
        <TextLink href='/'>Home</TextLink>
      </Row>
      <Row>
        <TextLink href='/settings'>Settings</TextLink>
      </Row>
    </Rows>
  </Panel>
  <Panel variant='base' flex scroll='vertical' padding='base'>
    <Heading level={2}>Main</Heading>
  </Panel>
</Panels>
```

## Centered card

Center on `Panels` (not scrolling). One `Panel` is the card.

```tsx
<Panels fill alignX='center' alignY='center'>
  <Panel variant='muted' width='24rem' padding='large' borderWidth='extraSmall' borderRadius='base'>
    <Rows gap='base'>
      <Row>
        <Heading level={2}>Sign in</Heading>
      </Row>
      <Row>
        <Button fill label='Continue' />
      </Row>
    </Rows>
  </Panel>
</Panels>
```

## Form fields

Each field is a `Rows` of two `Row`s (label, control). The outer `Rows` spaces the fields. Controls take `fill` to stretch themselves; the `Row` places them. Place the form inside a `Panel`.

```tsx
<Rows gap='base'>
  <Row>
    <Rows gap='extraSmall'>
      <Row>
        <Label htmlFor='email' label='Email' />
      </Row>
      <Row>
        <Input id='email' type='email' fill />
      </Row>
    </Rows>
  </Row>
  <Row>
    <Rows gap='extraSmall'>
      <Row>
        <Label htmlFor='plan' label='Plan' />
      </Row>
      <Row>
        <Select id='plan' value={plan} onChange={setPlan} fill>
          <Option value='hobby'>Hobby</Option>
          <Option value='pro'>Pro</Option>
        </Select>
      </Row>
    </Rows>
  </Row>
</Rows>
```

A toggle pairs with a **wrapping** `Label` of the same `size`:

```tsx
<Label htmlFor='auto-save'>
  <Switch id='auto-save' defaultChecked /> Auto-save drafts
</Label>
```

## Dashboard grid

`stack='md'` collapses to `stackCols` columns at most `md` wide. Each tile is a `Panel` because it wants its own surface (`variant='muted'`). If a tile can use the surrounding surface, put the `Rows` straight in the `Cell` and drop the `Panel`.

```tsx
<Grid numCols={3} stackCols={1} stack='md' gap='base'>
  <Cell>
    <Panel variant='muted' padding='base'>
      <Rows>
        <Row>
          <Text muted size='small'>
            Users
          </Text>
        </Row>
        <Row>
          <Heading level={3}>1,204</Heading>
        </Row>
      </Rows>
    </Panel>
  </Cell>
  <Cell>
    <Panel variant='muted' padding='base'>
      <Rows>
        <Row>
          <Text muted size='small'>
            Revenue
          </Text>
        </Row>
        <Row>
          <Heading level={3}>$8.4k</Heading>
        </Row>
      </Rows>
    </Panel>
  </Cell>
  <Cell>
    <Panel variant='muted' padding='base'>
      <Rows>
        <Row>
          <Text muted size='small'>
            Errors
          </Text>
        </Row>
        <Row>
          <Heading level={3}>3</Heading>
        </Row>
      </Rows>
    </Panel>
  </Cell>
</Grid>
```

## Header, body, footer

A default `Panels` is a column. The body takes `flex` and scrolls; the bars keep their size.

```tsx
<Panels fill>
  <Panel variant='highlighted' padding='base' borderBottom='extraSmall'>
    <Heading level={2}>Project</Heading>
  </Panel>
  <Panel flex scroll='vertical' padding='base'>
    <Text>Body…</Text>
  </Panel>
  <Panel variant='muted' padding='base' borderTop='extraSmall'>
    <Cols gap='small' alignX='end'>
      <Col>
        <Button outline label='Cancel' />
      </Col>
      <Col>
        <Button label='Save' />
      </Col>
    </Cols>
  </Panel>
</Panels>
```
