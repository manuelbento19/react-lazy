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

## Installation

```bash
npm install @bentoo/react-lazy
# or
yarn add @bentoo/react-lazy
# or
pnpm add @bentoo/react-lazy
````

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

| Prop       | Type        | Description                         |
| ---------- | ----------- | ----------------------------------- |
| `children` | `ReactNode` | Content to display after lazy load. |
| `fallback` | `ReactNode` | Content displayed while loading.    |

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

---

### 3. Lazy with Callback

Trigger a function when an element enters the viewport:

```tsx
import { useLazyCallback } from '@bentoo/react-lazy';

export default function Section() {
  const { ref } = useLazyCallback({
    onVisible: () => console.log('Element is now visible!'),
    triggerOnce: true
  });

  return <div ref={ref}>Watch me appear!</div>;
}
```

---

### 4. LazySentinel (Infinite Scroll)

Trigger loading when scrolling to the end of a list:

```tsx
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

> Works with or without virtualization libraries (e.g., TanStack Virtual).

---

### 5. Virtualization (`/virtual`)

Lightweight fixed-size virtualization. Import from the separate entrypoint to keep the core bundle small.

#### `useVirtualizer`

```tsx
import { useVirtualizer } from '@bentoo/react-lazy/virtual';

function VirtualList({ count = 1000 }) {
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

```tsx
import { VirtualList } from '@bentoo/react-lazy/virtual';

function App() {
  const items = Array.from({ length: 1000 }, (_, i) => `Item ${i}`);

  return (
    <VirtualList
      items={items}
      itemSize={50}
      estimateSize={() => 50}
      getScrollElement={() => document.querySelector('#scroll') as HTMLElement}
      renderItem={(item) => <div>{item}</div>}
      style={{ height: 400 }}
    />
  );
}
```

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

> Note: `next/image` already supports lazy loading, but `LazyImage` adds viewport-triggered effects and callbacks.

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