import { readFileSync } from 'node:fs'
import { resolve } from 'node:path'
import { describe, expect, it } from 'vitest'

const readme = readFileSync(resolve(__dirname, '../README.md'), 'utf8')

const blocks = [...readme.matchAll(/```tsx\n([\s\S]*?)```/g)].map((m) => m[1])

const REACT_HELPERS = ['useState', 'useEffect', 'useRef', 'useMemo', 'useCallback', 'lazy']

describe('README', () => {
    it('has balanced code fences', () => {
        const openers = readme.match(/^```[a-zA-Z]*\s*$/gm) ?? []
        const allRuns = readme.match(/^`{3,}/gm) ?? []
        const stray = allRuns.filter((line) => !/^```[a-zA-Z]*\s*$/.test(line))
        expect(stray, `malformed fence: ${stray.join(', ')}`).toHaveLength(0)
        expect(openers.length % 2).toBe(0)
    })

    it('contains tsx examples', () => {
        expect(blocks.length).toBeGreaterThan(0)
    })

    it.each(blocks.map((code, i) => [i + 1, code]))(
        'example %i imports every React helper it uses',
        (_index, code) => {
            const used = REACT_HELPERS.filter((h) =>
                new RegExp(`\\b${h}\\s*[<(]`).test(code)
            )
            const importedFromReact = used.every((h) =>
                new RegExp(`import[^;]*\\b${h}\\b[^;]*from\\s*['"]react['"]`).test(code)
            )
            expect(importedFromReact).toBe(true)
        }
    )

    it('documents every exported member of the package', () => {
        const core = ['LazyComponent', 'LazyImage', 'LazySentinel', 'LazySuspense', 'useLazy', 'useLazyCallback']
        const virtual = ['VirtualList', 'useVirtualizer']
        for (const name of [...core, ...virtual]) {
            const documented = new RegExp(`(^|[^\\w])${name}([^\\w]|$)`, 'm').test(readme)
            expect(documented, `missing docs for ${name}`).toBe(true)
        }
    })
})
