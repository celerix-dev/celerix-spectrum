import type {
    AccessibilityReport,
    RGBArray,
    SpectrumConfig,
    ThemeMode,
    ThemeState,
    UpdatePayload
} from "../types/engineTypes";
import {getOnColor, lchToRgb, RGB} from "../utils/colorIngestor";

export class SpectrumEngine extends EventTarget {
    public state: ThemeState;
    private readonly prefix: string;
    private styleTag: HTMLStyleElement | null = null;
    private isDirty: boolean = false;

    constructor(config: SpectrumConfig = {}) {
        super();
        this.prefix = config.prefix || 'cx';

        this.state = {
            mode: config.defaults?.mode || 'auto',
            isLinked: config.defaults?.isLinked || true,
            light: {
                mode: 'light',
                hue: config.defaults?.light?.hue ?? 290,
                chroma: config.defaults?.light?.chroma ?? 0.18,
                lightness: config.defaults?.light?.lightness ?? 0.60
            },
            dark: {
                mode: 'dark',
                hue: config.defaults?.dark?.hue ?? 290,
                chroma: config.defaults?.dark?.chroma ?? 0.18,
                lightness: config.defaults?.dark?.lightness ?? 0.14
            },
            wcag: { ratio: 0, status: 'FAIL', isPass: false, colors: { bg: '', fg: '' } }
        };

        this.setupStyleTag();

        this.init();
    }

    private setupStyleTag() {
        if (!this.styleTag) {
            this.styleTag = document.getElementById(`${this.prefix}-dynamic-vars`) as HTMLStyleElement;
            if (!this.styleTag) {
                this.styleTag = document.createElement('style');
                this.styleTag.id = `${this.prefix}-dynamic-vars`;
                document.head.appendChild(this.styleTag);
            }
        }
    }

    private syncStyles(): void {
        if (!this.styleTag) return;

        this.styleTag.textContent = `
            :root {
              --${this.prefix}-hue-light: ${this.state.light.hue};
              --${this.prefix}-chroma-light: ${this.state.light.chroma};
              --${this.prefix}-lightness-light: ${this.state.light.lightness};

              --${this.prefix}-hue-dark: ${this.state.dark.hue};
              --${this.prefix}-chroma-dark: ${this.state.dark.chroma};
              --${this.prefix}-lightness-dark: ${this.state.dark.lightness};
            }
        `;
    }

    checkContrast(): AccessibilityReport {
        // Get the current background LCH from state
        // (Assuming we are checking the Dark mode for now, or you can pass the mode)
        const bgLCH = {
            l: this.state.light.lightness,
            c: this.state.light.chroma,
            h: this.state.light.hue
        };

        // Get the "On-Brand" foreground LCH from our logic
        const fgLCH = getOnColor(this.state.light.lightness, bgLCH.h);

        // 3. Convert both to RGB to calculate WCAG Luminance
        const bgRGB = lchToRgb(bgLCH);
        const fgRGB = lchToRgb(fgLCH);

        const ratio = this.calculateRatioFromRGB(bgRGB, fgRGB);

        return {
            ratio: Math.round(ratio * 100) / 100,
            status: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA_LG' : 'FAIL',
            isPass: ratio >= 4.5,
            colors: {
                bg: `rgb(${bgRGB.r}, ${bgRGB.g}, ${bgRGB.b})`,
                fg: `rgb(${fgRGB.r}, ${fgRGB.g}, ${fgRGB.b})`
            }
        };
    }

    private calculateRatioFromRGB(rgb1: RGB, rgb2: RGB): number {
        const l1 = this.getLuminanceFromRGB(rgb1);
        const l2 = this.getLuminanceFromRGB(rgb2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    private getLuminanceFromRGB({ r, g, b }: RGB): number {
        const [rs, gs, bs] = [r / 255, g / 255, b / 255].map(c => {
            return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
    }

    private emitChange() {
        // We dispatch a standard CustomEvent
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }

    public setThemeMode(newMode: ThemeMode): void {
        this.state.mode = newMode;
        document.documentElement.setAttribute('data-cx-mode', newMode);
        this.emitChange();
    }

    public toggleLink(): boolean {
        this.state.isLinked = !this.state.isLinked;

        if (this.state.isLinked) {
            this.updateValue({mode:'light',key:'hue', value:this.state.light.hue});
            this.updateValue({mode:'light',key:'chroma', value:this.state.light.chroma});
            this.updateValue({mode:'light',key:'lightness', value:this.state.light.lightness});
        } else {
            this.emitChange();
        }

        return this.state.isLinked;
    }

    public updateValue({mode, key, value}:UpdatePayload): void {
        const numValue = Number(value);
        if (isNaN(numValue)) return;

        this.state[mode][key] = value;

        if (this.state.isLinked) {
            const otherTheme = mode === 'light' ? 'dark' : 'light';
            this.state[otherTheme][key] = value;
        }

        this.requestSync();
        this.emitChange();
    }

    private requestSync() {
        if (this.isDirty) return;

        this.isDirty = true;
        requestAnimationFrame(() => {
            this.syncStyles();
            this.refreshWCAG();
            this.isDirty = false;
        });
    }

    private init(): void {

        document.documentElement.setAttribute('data-cx-mode', this.state.mode);
        this.syncStyles();

        requestAnimationFrame(() => {
            this.refreshWCAG();
        });

    }

    private refreshWCAG() {
        this.state.wcag = this.checkContrast();
        this.emitChange();
    }
}