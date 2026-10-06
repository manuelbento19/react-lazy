# Changelog

All notable changes to this project will be documented in this file.

## [1.2.0] - 2026-10-06

### Added
- `/virtual` namespace with `useVirtualizer` (fixed-size vertical/horizontal, overscan, scrollToIndex) and `VirtualList` component
- Separate entrypoint exports (`./virtual`) with proper ESM/CJS/types
- Documentation for virtual namespace and comparison vs TanStack Virtual

### Changed
- README: expanded props tables for `LazyImage` and `LazyComponent`
- package.json: added keywords (`virtualization`, `infinite-scroll`, `intersection-observer`, `sentinel`, `virtual-list`)

### Fixed
- `VirtualList` now wires its own scroll container instead of requiring an external `getScrollElement`
- `exports["./virtual"]` pointed at non-existent paths (`dist/virtual/index.js`); the build now emits them, so `import from '@bentoo/react-lazy/virtual'` resolves
- `useVirtualizer` uses an isomorphic layout effect, removing `useLayoutEffect` SSR warnings on React 18

## [1.1.0] - 2026-10-06

### Added
- `LazySentinel` component for infinite scroll

### Fixed
- `LazyImage` ref handling with custom `ImageComponent` (Next.js)
- Image loading/error state handling

## [1.0.3] - 2026-10-06

### Fixed
- Minor type and build adjustments
