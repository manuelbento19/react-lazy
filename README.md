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