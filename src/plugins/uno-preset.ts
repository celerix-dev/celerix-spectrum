import type { Preset } from '@unocss/core'

export function celerixPreset(): Preset {
    return {
        name: 'celerix-spectrum-preset',
        rules: [
            ['d-block', { display: 'block' }],
            ['d-none', { display: 'none' }],
            ['d-inline', { display: 'inline' }],
            ['d-inline-block', { display: 'inline-block' }],
            ['d-contents', { display: 'contents' }],

            ['d-flex', { display: 'flex' }],
            ['d-inline-flex', { display: 'inline-flex' }],
            ['d-grid', { display: 'grid' }],
            ['d-inline-grid', { display: 'inline-grid' }],

            ['flex-dir-col', { 'flex-direction': 'column' }],
            ['flex-dir-row', { 'flex-direction': 'row' }],
            ['flex-wrap', { 'flex-wrap': 'wrap' }],
            ['flex-nowrap', { 'flex-wrap': 'nowrap' }],

            ['pos-relative', { position: 'relative' }],
            ['pos-absolute', { position: 'absolute' }],
            ['pos-fixed', { position: 'fixed' }],
            ['pos-sticky', { position: 'sticky' }],

            ['z-0', { 'z-index': '0' }],
            ['z-10', { 'z-index': '10' }],
            ['z-100', { 'z-index': '100' }],
            ['z-top', { 'z-index': '9999' }],

            ['overflow-hidden', { overflow: 'hidden' }],
            ['overflow-auto', { overflow: 'auto' }],
            ['overflow-x-hidden', { 'overflow-x': 'hidden' }],
            ['overflow-y-hidden', { 'overflow-y': 'hidden' }],

            ['pointer-events-none', { 'pointer-events': 'none' }],
            ['cursor-pointer', { cursor: 'pointer' }],
            ['select-none', { 'user-select': 'none' }],

            ['text-left', { 'text-align': 'left' }],
            ['text-center', { 'text-align': 'center' }],
            ['text-right', { 'text-align': 'right' }],
            ['text-justify', { 'text-align': 'justify' }],

            ['ws-nowrap', { 'white-space': 'nowrap' }],
            ['ws-pre', { 'white-space': 'pre' }],

            ['v-hidden', { visibility: 'hidden' }],
            ['v-visible', { visibility: 'visible' }],
            ['opacity-0', { opacity: '0' }],
            ['opacity-100', { opacity: '1' }],

            ['min-w-0', { 'min-width': '0px' }],
            ['min-h-0', { 'min-height': '0px' }],
            ['w-full', { width: '100%' }],
            ['h-full', { height: '100%' }],
            ['min-w-full', { 'min-width': '100%' }],
            ['min-h-full', { 'min-height': '100%' }],
            ['max-w-full', { 'max-width': '100%' }],
            ['max-h-full', { 'max-height': '100%' }],

            ['flex-1', { flex: '1 1 0%' }],
            ['flex-auto', { flex: '1 1 auto' }],
            ['flex-grow', { 'flex-grow': '1' }],
            ['flex-shrink-0', { 'flex-shrink': '0' }],

            ['obj-cover', { 'object-fit': 'cover' }],
            ['obj-contain', { 'object-fit': 'contain' }],

            ['justify-start', { 'justify-content': 'flex-start' }],
            ['justify-end', { 'justify-content': 'flex-end' }],
            ['justify-center', { 'justify-content': 'center' }],
            ['justify-between', { 'justify-content': 'space-between' }],
            ['justify-around', { 'justify-content': 'space-around' }],
            ['justify-evenly', { 'justify-content': 'space-evenly' }],

            ['align-start', { 'align-items': 'flex-start' }],
            ['align-end', { 'align-items': 'flex-end' }],
            ['align-center', { 'align-items': 'center' }],
            ['align-baseline', { 'align-items': 'baseline' }],
            ['align-stretch', { 'align-items': 'stretch' }],

            ['align-self-start', { 'align-self': 'flex-start' }],
            ['align-self-end', { 'align-self': 'flex-end' }],
            ['align-self-center', { 'align-self': 'center' }],
            ['align-self-stretch', { 'align-self': 'stretch' }],

            ['top-0', { top: '0' }],
            ['left-0', { left: '0' }],
            ['right-0', { right: '0' }],
            ['bottom-0', { bottom: '0' }],
            ['top-50%', { top: '50%' }],
            ['left-50%', { left: '50%' }],

            ['w-screen', { width: '100vw' }],
            ['h-screen', { height: '100vh' }],
            ['h-dvh', { height: '100dvh' }],

            ['translate-center', { transform: 'translate(-50%, -50%)' }],
            ['translate-x-half', { transform: 'translateX(-50%)' }],
            ['translate-y-half', { transform: 'translateY(-50%)' }],

            ['aspect-square', { 'aspect-ratio': '1 / 1' }],
            ['aspect-video', { 'aspect-ratio': '16 / 9' }],

            [/^cx-w-(\d+)$/, ([, d]) => ({ width: `${d}%` })],
            [/^cx-h-(\d+)$/, ([, d]) => ({ height: `${d}%` })],
            [/^cx-w-\[(\d+)\]$/, ([, d]) => ({ width: `${d}px` })],
            [/^cx-h-\[(\d+)\]$/, ([, d]) => ({ height: `${d}px` })],

            // --- The "Global" Important Modifier ---
            [/^align-(.+)-important$/, ([, mode]) => {
                const map: Record<string, string> = {
                    'start': 'flex-start',
                    'end': 'flex-end',
                    'center': 'center',
                    'stretch': 'stretch',
                    'baseline': 'baseline'
                }
                return { 'align-items': `${map[mode]} !important` }
            }],

            ['text-ellipsis', {
                'overflow': 'hidden',
                'text-overflow': 'ellipsis',
                'white-space': 'nowrap'
            }],

            // This regex matches: (p|m|g)(optional direction)-(number or number-with-dash)
            [/^([pmg])([trblsexy])?-?([\d-]+)$/, ([, type, dir, val]) => {
                const propMap: Record<string, string> = { p: 'padding', m: 'margin', g: 'gap' };
                const dirMap: Record<string, string> = {
                    t: '-block-start',
                    b: '-block-end',
                    s: '-inline-start',
                    e: '-inline-end',
                    x: '-inline',
                    y: '-block',
                    c: 'column-', // for gc
                    r: 'row-'    // for gr
                };

                const property = propMap[type];
                const direction = dir ? dirMap[dir] : '';

                if (type === 'g' && dir === 'c') return { 'column-gap': `var(--s-${val})` };
                if (type === 'g' && dir === 'r') return { 'row-gap': `var(--s-${val})` };

                return { [`${property}${direction}`]: `var(--s-${val})` };
            }],

            [/^([pmg])([trblsexy])?-?([\d-]+)(-important)?$/, ([, type, dir, val, imp]) => {
                const propMap: Record<string, string> = { p: 'padding', m: 'margin', g: 'gap' };
                const dirMap: Record<string, string> = {
                    t: '-block-start', b: '-block-end',
                    s: '-inline-start', e: '-inline-end',
                    x: '-inline', y: '-block',
                    c: 'column-', r: 'row-'
                };

                const property = propMap[type];
                const direction = dir ? dirMap[dir] : '';
                const suffix = imp ? ' !important' : '';

                // Logic for gaps
                if (type === 'g' && dir === 'c') return { 'column-gap': `var(--s-${val})${suffix}` };
                if (type === 'g' && dir === 'r') return { 'row-gap': `var(--s-${val})${suffix}` };

                return { [`${property}${direction}`]: `var(--s-${val})${suffix}` };
            }],

            // --- Special Case: Auto Margins ---
            ['mx-auto', { 'margin-inline': 'auto' }],
            ['my-auto', { 'margin-block': 'auto' }],

            [/^cx-layout-(\d+)-(\d+)-(\d+)$/, ([, sb, hd, ft], { rawSelector }) => {
                // Escape the selector to ensure UnoCSS classes with special characters work
                const selector = `.${rawSelector.replace(/[:.]/g, '\\$1')}`;

                return `
                  ${selector} {
                    display: grid;
                    height: 100dvh;
                    grid-template-columns: ${sb}px 1fr;
                    grid-template-rows: ${hd}px 1fr ${ft}px;
                    transition: all 0.3s var(--ease);
                    grid-template-areas:
                      "sidebar header"
                      "sidebar main"
                      "sidebar footer";
                  }
                  ${selector} > header { grid-area: header; }
                  ${selector} > aside  { grid-area: sidebar; }
                  ${selector} > main   { grid-area: main; }
                  ${selector} > footer { grid-area: footer; }
                `;
            }],

            // A two-part version (No footer)
            [/^cx-layout-(\d+)-(\d+)$/, ([, sb, hd], { rawSelector }) => {
                // We escape the selector (handling dots/colons if they exist)
                const selector = `.${rawSelector.replace(/[:.]/g, '\\$1')}`;

                return `
                  ${selector} {
                    display: grid;
                    height: 100dvh;
                    grid-template-columns: ${sb}px 1fr;
                    grid-template-rows: ${hd}px 1fr;
                    grid-template-areas: "sidebar header" "sidebar main";
                  }
                  ${selector} > header { grid-area: header; }
                  ${selector} > aside  { grid-area: sidebar; }
                  ${selector} > main   { grid-area: main; }
                `;
            }],

            [/^cx-grid(?:-(\d+))?$/, ([, min]) => {
                const minWidth = min ? `${min}px` : '250px';
                return {
                    'display': 'grid',
                    'grid-template-columns': `repeat(auto-fit, minmax(min(${minWidth}, 100%), 1fr))`
                };
            }],
        ],
        // You can even add default colors or shortcuts here
        shortcuts: {
            'd-flex-col': 'd-flex flex-dir-col',
            'd-flex-row': 'd-flex flex-dir-row',
            'd-flex-wrap': 'd-flex flex-wrap',
            'flex-center': 'd-flex justify-center align-center',
            'flex-col-center': 'd-flex-col justify-center align-center',
            'inline-flex-center': 'd-inline-flex justify-center align-center',
            'flex-jc-between': 'd-flex justify-between',
            'flex-jc-center': 'd-flex justify-center',
            'flex-ai-center': 'd-flex align-center',
            'screen-dvh': 'w-screen h-dvh',
            'text-truncate': 'text-ellipsis',
            'abs-center': 'pos-absolute top-50% left-50% translate-center',
            'abs-cover': 'pos-absolute top-0 left-0 w-full h-full',
            'fixed-cover': 'pos-fixed top-0 left-0 w-full h-full',
            'nav-cluster': 'd-flex justify-between align-center flex-nowrap',
            'size-full': 'w-full h-full',
            'screen-full': 'w-100vw h-100vh',
            'ghost': 'v-hidden pointer-events-none select-none',
            'glass-blur': 'pos-sticky top-0 z-100 overflow-hidden',
            'flex-between-center': 'd-flex justify-between align-center',
            'flex-center-center': 'd-flex justify-center align-center',
        }
    }
}