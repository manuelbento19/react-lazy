# Changelog

All notable changes to this project will be documented in this file.

## [1.3.0] - 2026-10-06

### Changed (breaking)
- Removed `estimateSize` from `useVirtualizer` and `VirtualList`. `/virtual` is now explicitly **fixed-size only**: rows must share one `itemSize` (default `40`).

  The option never worked. `start` was computed as `index * estimateSize(index)` — the item's own size used as a multiplier — while `totalSize` summed sizes cumulatively, so with a varying `estimateSize` the two disagreed and item positions were not even monotonically increasing (e.g. sizes `100, 50, 200` put index 2 at `400px` and index 3 back at `150px`, overlapping and out of order). No test exercised it and nothing shipped correct, so the option is removed rather than reimplemented.

  Passing `estimateSize` now produces a TypeScript excess-property error. For uneven or measured row heights use [TanStack Virtual](https://tanstack.com/virtual) — deliberately out of scope here.

### Added
- Regression tests locking the fixed-size contract: strictly monotonic and non-overlapping positions, `totalSize` agreeing with the last item's `end`, windowing by `scrollOffset`, and `itemSize` defaulting to `40`.

## [1.2.1] - 2026-10-06

### Fixed
- `useVirtualizer` now guards `ResizeObserver`. In 1.2.0 `VirtualList` threw `ReferenceError: ResizeObserver is not defined` on mount in environments without it — notably jsdom, so any consumer testing components under Jest/jsdom hit a crash. It now falls back to a single measurement, matching how `useIntersection` already degrades without `IntersectionObserver`.

## [1.2.0] - 2026-10-06

### Added
- `/virtual` namespace with `useVirtualizer` (fixed-size vertical/horizontal, overscan, scrollToIndex) and `VirtualList` component
- Separate entrypoint exports (`./virtual`) with proper ESM/CJS/types
- Documentation for virtual namespace and comparison vs TanStack Virtual
- Document `LazySuspense`, `useLazy` and `LazySentinel` props; add README regression test (fence balance, self-contained examples, export coverage)

### Changed
- README: expanded props tables; removed `root`/`rootMargin`/`threshold`/`triggerOnce` from the `LazyImage` table (not supported by that component) and added `fadeInDuration`
- package.json: added keywords (`virtualization`, `infinite-scroll`, `intersection-observer`, `sentinel`, `virtual-list`)

### Fixed
- `VirtualList` now wires its own scroll container instead of requiring an external `getScrollElement`
- `exports["./virtual"]` pointed at non-existent paths (`dist/virtual/index.js`); the build now emits them, so `import from '@bentoo/react-lazy/virtual'` resolves
- `useVirtualizer` uses an isomorphic layout effect, removing `useLayoutEffect` SSR warnings on React 18
- `LazyImage` no longer passes an empty `src` to a custom `ImageComponent`. `next/image` warns on `src=""` and can re-download the current page; the custom component is now mounted only once the image may load, or once the preload failed so the browser can surface its broken-image state.
- `useLazy`/`useLazyCallback` (and the internal, non-exported `useIntersection` they share) default their element generic to `HTMLDivElement`, so the returned `ref` is assignable to `<div ref={...}>` without an explicit type argument

## [1.1.0] - 2026-10-06

### Added
- `LazySentinel` component for infinite scroll

### Fixed
- `LazyImage` ref handling with custom `ImageComponent` (Next.js)
- Image loading/error state handling

## [1.0.3] - 2026-10-06

### Fixed
- Minor type and build adjustments
