# @bentoo/react-lazy

A lightweight and flexible **React lazy loading library**.  
Load components or images **only when they enter the viewport**, improving performance, reducing initial bundle size, and providing optional callbacks when elements become visible.

[![Version](https://img.shields.io/npm/v/@bentoo/react-lazy?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@bentoo/react-lazy)  
[![Downloads](https://img.shields.io/npm/dt/@bentoo/react-lazy.svg?style=flat&colorA=000000&colorB=000000)](https://www.npmjs.com/package/@bentoo/react-lazy)  
[![License](https://img.shields.io/npm/l/@bentoo/react-lazy.svg?style=flat&colorA=000000&colorB=000000)](LICENSE)

---

## Features

- Lazy load **any component or element** in React.  
- Optional **fallback content** while loading.  
- Callback support when an element becomes visible.  
- Works with **Next.js**, **React 18**, and **TypeScript**.  
- Lightweight, fully typed, and tree-shakable.

---

## When to use vs TanStack Virtual

- **Use `@bentoo/react-lazy` (core)** for simple viewport-based lazy loading (components, images, infinite scroll with `LazySentinel`). It's minimal, SSR-safe, and works great with Next.js.
- **Use `@bentoo/react-lazy/virtual`** for **uniform row heights** where rendering thousands of DOM nodes hurts performance. It's a lightweight subset (vertical/horizontal, `overscan`, `scrollToIndex`) without the overhead of a full virtualizer API. Rows must all share one `itemSize` — there is no measurement.
- **Use [TanStack Virtual](https://tanstack.com/virtual)** if your rows have **uneven or measured heights**, grid layouts, window scrolling edge cases, or advanced APIs. `@bentoo/react-lazy/virtual` intentionally keeps scope small to avoid bloat.  

---

## Installation

```bash
npm install @bentoo/react-lazy
# or
yarn add @bentoo/react-lazy
# or
pnpm add @bentoo/react-lazy
```

---

## Usage

### 1. LazyComponent

Lazy load any React component with a fallback:

```tsx
import React from 'react';
import { LazyComponent } from '@bentoo/react-lazy';

export default function App() {
  return (
    <div>
      <h1>My content</h1>
      <LazyComponent fallback={<h2>Loading...</h2>}>
        <img src="/myPicture.png" alt="MyPicture" />
      </LazyComponent>
    </div>
  );
}
```

**Props**:

| Prop         | Type              | Description                         |
| ------------ | ----------------- | ----------------------------------- |
| `children`   | `ReactNode`       | Content to display after lazy load. |
| `fallback`   | `ReactNode`       | Content displayed while loading.    |
| `root`       | `Element \| null` | Scroll container for observer       |
| `rootMargin` | `string`          | Root margin for observer           |
| `threshold`  | `number \| number[]` | Visibility threshold            |
| `triggerOnce`| `boolean`         | Load only once (default `true`)    |
| `className`  | `string`          | Wrapper className                   |
| `style`      | `React.CSSProperties` | Wrapper style               |

---

### 2. LazyImage

Lazy load images with optional **placeholder, blur, fade-in, and Next.js support**:

```tsx
import { LazyImage } from '@bentoo/react-lazy';
// For Next.js, pass ImageComponent={NextImage}

<LazyImage
  src="/photo.jpg"
  alt="My Photo"
  width={600}
  height={400}
  placeholder="/photo-low.jpg"
  blur
/>
```

**Props**:

| Prop             | Type              | Description                             |
| ---------------- | ----------------- | --------------------------------------- |
| `src`            | `string`          | Image source                            |
| `alt`            | `string`          | Image alt text                          |
| `width`/`height` | `number`          | Optional width/height                   |
| `placeholder`    | `string`          | Low-res placeholder for blur effect     |
| `blur`           | `boolean`         | Apply blur to placeholder               |
| `ImageComponent` | `React Component` | Optional (pass `next/image` in Next.js) |
| `fadeInDuration`| `number`          | Fade-in duration in ms (default `300`)  |
| `onLoad`/`onError` | `React handler` | Composed with the internal handlers     |

Any other `<img>` attribute (`className`, `loading`, `sizes`, `srcSet`, …) is forwarded to the underlying image.

> `LazyImage` observes the viewport with the default options (`threshold: 0.1`, `triggerOnce: true`); it does not expose `root`/`rootMargin`/`threshold`/`triggerOnce`.

---

### 3. LazySuspense

Defer rendering until the element is visible, then let React `Suspense` handle the loading state:

```tsx
import { lazy } from 'react';
import { LazySuspense } from '@bentoo/react-lazy';

const HeavyComponent = lazy(() => import('./HeavyComponent'));

export default function App() {
  return (
    <LazySuspense fallback={<div>Loading...</div>}>
      <HeavyComponent />
    </LazySuspense>
  );
}
```

**Props**:

| Prop       | Type        | Description                              |
| ---------- | ----------- | ---------------------------------------- |
| `children` | `ReactNode` | Rendered only after becoming visible.    |
| `fallback` | `ReactNode` | Passed to the inner `Suspense` boundary. |

> Use this for components that suspend on their own (dynamic `import()`, data fetching). For plain markup, prefer `LazyComponent`.

### 4. Lazy with Callback

Two hooks are available for custom elements:

```tsx
import { useRef } from 'react';
import { useLazy, useLazyCallback } from '@bentoo/react-lazy';

export default function Section() {
  // returns { ref, visible }
  const { ref, visible } = useLazy<HTMLDivElement>({ triggerOnce: true });

  // returns { ref } and calls back when visible
  const { ref: cbRef } = useLazyCallback({
    onVisible: () => console.log('Element is now visible!'),
    triggerOnce: true
  });

  return (
    <div>
      <div ref={ref}>{visible ? 'in view' : 'not yet'}</div>
      <div ref={cbRef}>Watch me appear!</div>
    </div>
  );
}
```

**Shared props** (`useLazy`, `useLazyCallback`, `LazyComponent`, `LazySentinel`):

| Prop          | Type                 | Default   | Description                                  |
| ------------- | -------------------- | --------- | -------------------------------------------- |
| `root`        | `Element \| null`    | `null`    | Scroll container; `null` means the viewport   |
| `rootMargin`  | `string`             | `'0px'`   | Grows/shrinks the root box                   |
| `threshold`   | `number \| number[]` | `0.1`     | Visibility ratio that triggers the callback  |
| `triggerOnce` | `boolean`            | `true`    | Stop observing after the first intersection  |

> Both hooks default their element type to `HTMLDivElement`, so `<div ref={ref}>` works with no type argument. Pass `useLazy<HTMLImageElement>` when attaching to another element.

---

### 5. LazySentinel (Infinite Scroll)

Trigger loading when scrolling to the end of a list:

```tsx
import { useState } from 'react';
import { LazySentinel } from '@bentoo/react-lazy';

export default function InfiniteList() {
  const [items, setItems] = useState(Array.from({ length: 20 }, (_, i) => i));
  const [loading, setLoading] = useState(false);

  async function loadMore() {
    if (loading) return;
    setLoading(true);
    await new Promise((r) => setTimeout(r, 500));
    setItems((prev) => [...prev, ...Array.from({ length: 20 }, (_, i) => prev.length + i)]);
    setLoading(false);
  }

  return (
    <div>
      {items.map((i) => <div key={i}>Item {i}</div>)}
      <LazySentinel onVisible={loadMore} />
      {loading && <div>Loading...</div>}
    </div>
  );
}
```

**Props**:

| Prop          | Type                 | Default   | Description                                     |
| ------------- | -------------------- | --------- | ----------------------------------------------- |
| `onVisible`   | `() => void`         | required  | Called when the sentinel scrolls into view       |
| `as`          | `React.ElementType`  | `'div'`   | Element to render                               |
| `className`   | `string`             | —         | Class for the sentinel element                  |
| `style`       | `React.CSSProperties`| —         | Merged over the hidden defaults                 |
| `root`/`rootMargin`/`threshold`/`triggerOnce` | see [shared props](#4-lazy-with-callback) | | |

> The sentinel is hidden by default (`height: 0`, `visibility: hidden`, `pointer-events: none`) so it never takes up space. Pass `style` to override. It also forwards a ref and accepts children.

> Works with or without virtualization libraries (e.g., TanStack Virtual).

---

### 6. Virtualization (`/virtual`)

Lightweight fixed-size virtualization. Import from the separate entrypoint to keep the core bundle small.

#### `useVirtualizer`

```tsx
import { useRef } from 'react';
import { useVirtualizer } from '@bentoo/react-lazy/virtual';

function MyList({ count = 1000 }) {
  const parentRef = useRef<HTMLDivElement>(null);

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => parentRef.current,
    itemSize: 50,
    overscan: 2,
  });

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize(), position: 'relative' }}>
        {virtualizer.getVirtualItems().map((item) => (
          <div
            key={item.key}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: item.size,
              transform: `translateY(${item.start}px)`,
            }}
          >
            Item {item.index}
          </div>
        ))}
      </div>
    </div>
  );
}
```

#### `VirtualList` component

`VirtualList` creates and owns its own scroll container, so you only pass the data and the row size:

```tsx
import { VirtualList } from '@bentoo/react-lazy/virtual';

function App() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  return (
    <VirtualList
      items={items}
      itemSize={50}
      renderItem={(item) => <div>{item}</div>}
      style={{ height: 400 }}
    />
  );
}
```

| Prop          | Type                                        | Description                                  |
| ------------- | ------------------------------------------- | -------------------------------------------- |
| `items`       | `T[]`                                       | Data to render                               |
| `renderItem`  | `(item, index, virtual) => ReactNode`       | Renders a single row                         |
| `itemSize`    | `number`                                    | Fixed row size in px, defaults to `40`. Rows must all share this height. |
| `overscan`    | `number`                                    | Extra rows rendered outside the viewport     |
| `horizontal`  | `boolean`                                   | Lay out rows horizontally (default `false`)  |
| `className`   | `string`                                    | Class for the scroll container               |
| `style`       | `React.CSSProperties`                       | Styles for the scroll container              |

> `VirtualList` derives `count` from `items.length` and manages its scroll element for you. Use `useVirtualizer` directly when you need to own the scroll container yourself.

> Also works well alongside `LazyImage` inside virtualized cells.


## Next.js Example

```tsx
import Image from 'next/image';
import { LazyImage } from '@bentoo/react-lazy';

export default function NextApp() {
  return (
    <LazyImage
      ImageComponent={Image}
      src="/photo.jpg"
      alt="Next.js Image"
      width={600}
      height={400}
      placeholder="/photo-low.jpg"
      blur
    />
  );
}
```

> Note: `next/image` already lazy-loads by default. `LazyImage` adds a placeholder + blur + fade-in sequence gated on the viewport, plus your `onLoad`/`onError` handlers composed with the internal ones.

---

## Contribution

We welcome contributions!

1. Fork the repository
2. Create a feature branch (`git checkout -b my-feature`)
3. Commit your changes (`git commit -m 'Add feature'`)
4. Push to the branch (`git push origin my-feature`)
5. Open a Pull Request

---

## License

MIT License – see the [LICENSE](LICENSE) file for details.