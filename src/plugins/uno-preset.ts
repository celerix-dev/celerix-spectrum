import type { Preset } from '@unocss/core'

export function celerixPreset(): Preset {
    return {
        name: 'celerix-spectrum-preset',
        rules: [
            // This logic will now run during the PROJECT'S build time
            [/^cx-w-\[(\d+)\]$/, ([, d]) => ({ width: `${d}px` })],
            [/^cx-h-\[(\d+)\]$/, ([, d]) => ({ height: `${d}px` })],
        ],
        // You can even add default colors or shortcuts here
        shortcuts: {

        }
    }
}