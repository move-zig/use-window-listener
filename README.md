# use-window-listener

A React hook for subscribing to window events and returning a derived value.

## Installation

```bash
npm install use-window-listener
```

Node.js 18 or higher is required.

## Usage

```tsx
import type { FC } from 'react';
import { useWindowListener } from 'use-window-listener';

const valueSelector = (w: Window) => w.scrollY;

const MyComponent: FC = () => {
  const scrollY = useWindowListener('scroll', valueSelector);
  return <div>{scrollY}</div>;
};
```

> **Important:** Define `valueSelector` outside the component (or wrap it in `useCallback`) to keep it stable. An unstable reference will cause the listener to be re-registered on every render.

## API

```ts
useWindowListener<TReturnValue, TTarget, TEvent>(
  type: string,
  valueSelector: (target: TTarget, event?: TEvent) => TReturnValue,
  fallbackValue?: TReturnValue,
  targetSelector?: (w: Window) => TTarget,
  addEventListenerOptions?: AddEventListenerOptions | boolean,
): TReturnValue | undefined
```

| Parameter | Description |
|---|---|
| `type` | The event type to listen for, e.g. `'scroll'`, `'resize'` |
| `valueSelector` | A function that reads the desired value from the target. Receives the event as a second argument if needed. Should be a stable reference. |
| `fallbackValue` | Returned during SSR. Defaults to `undefined`. |
| `targetSelector` | A that returns the `EventTarget` to attach listeners to. Defaults to `window`. Should be stable a stable reference. It is called once per stable reference and its return value is never re-evaluated. |
| `addEventListenerOptions` | Passed directly to `addEventListener` and `removeEventListener`. |

### Return Value

The current value as returned by `valueSelector`, or `fallbackValue` during SSR.

## Provided Hooks

### `useScrollY`

```tsx
const scrollY = useScrollY(); // number | undefined
```

### `useInnerWidth`

```tsx
const width = useInnerWidth(); // number | undefined
```

### `useMediaQuery`

```tsx
const isWide = useMediaQuery('(min-width: 992px)'); // boolean | undefined
```

## Important Caveats

### `valueSelector` should be stable

`valueSelector` should be defined at module scope or wrapped in `useCallback`. An unstable reference will cause the listener to be re-registered on every render.

### `targetSelector` should be stable and pure

`targetSelector` should be defined at module scope or wrapped in `useCallback`. It is called once per stable reference. As long at the reference is stable, the target will not re-evaluated. If you need the target to change, change the `targetSelector` reference itself (e.g. via `useCallback` with appropriate deps).

```tsx
// ✅ correct — targetSelector reference changes when query changes, causing re-subscription
const targetSelector = useCallback((w: Window) => w.matchMedia(query), [query]);

// ❌ incorrect — inline function creates a new reference every render, causing re-subscription on every render
useWindowListener('change', valueSelector, undefined, (w) => w.matchMedia(query));
```

### SSR

On the server, `valueSelector` is never called. `fallbackValue` is returned instead. Ensure your component handles `undefined` or provide an appropriate fallback:

```tsx
const width = useInnerWidth() ?? 0;
```