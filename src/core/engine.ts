export type ThemeMode = 'light' | 'dark' | 'auto';


export interface ColorValues {
    hue: number;
    chroma: number;
    lightness: number;
}

export interface ThemeState {
    mode: ThemeMode;
    isLinked: boolean;
    light: ColorValues;
    dark: ColorValues;
    wcag?: AccessibilityReport;
}

export interface AccessibilityReport {
    ratio: number;
    status: 'AAA' | 'AA' | 'AA Large' | 'POOR';
    isPass: boolean;
    colors: { bg: string; fg: string };
}

export interface SpectrumConfig {
    prefix?: string;
    defaults?: Partial<Omit<ThemeState, 'mode' | 'isLinked'>>;
}

export class SpectrumEngine extends EventTarget {
    public state: ThemeState;
    private readonly prefix: string;
    public contrastReport: AccessibilityReport;

    constructor(config: SpectrumConfig = {}) {
        super();
        this.prefix = config.prefix || 'cx';
        this.state = this.loadState(config.defaults);
        this.contrastReport = {ratio: 0, status: "POOR", isPass: false, colors: {bg: 'transparent'}} as AccessibilityReport;

        this.init();
    }

    checkContrast(): AccessibilityReport {
        const probe = document.createElement('div');
        probe.className = 'brand-500-wcag-inspect';
        probe.style.cssText = 'position:absolute; visibility:hidden;';
        document.body.appendChild(probe);

        const styles = window.getComputedStyle(probe);
        // These might be "oklch(...)" strings
        const rawBg = styles.backgroundColor;
        const rawFg = styles.color;

        document.body.removeChild(probe);

        // NEW: Flatten OKLCH to RGB using a canvas "buffer"
        const bg = this.flattenToRGB(rawBg);
        const fg = this.flattenToRGB(rawFg);

        const ratio = this.calculateRatio(bg, fg);

        // ... rest of your status logic ...
        return {
            ratio: Math.round(ratio * 100) / 100,
            status: ratio >= 7 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3 ? 'AA Large' : 'POOR',
            isPass: ratio >= 4.5,
            colors: { bg, fg } // Now these will be "rgb(r, g, b)"
        };

    }

    private flattenToRGB(colorStr: string): string {
        const canvas = document.createElement('canvas');
        canvas.width = canvas.height = 1;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return colorStr;

        // The canvas engine automatically converts OKLCH -> sRGB
        ctx.fillStyle = colorStr;
        ctx.fillRect(0, 0, 1, 1);

        const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
        return `rgb(${r}, ${g}, ${b})`;
    }

    private calculateRatio(rgb1: string, rgb2: string): number {
        const l1 = this.getLuminance(rgb1);
        const l2 = this.getLuminance(rgb2);
        return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
    }

    private getLuminance(rgbStr: string): number {
        const rgb = rgbStr.match(/\d+/g)!.map(Number);
        const [r, g, b] = rgb.map(c => {
            const s = c / 255;
            return s <= 0.03928 ? s / 12.92 : Math.pow((s + 0.055) / 1.055, 2.4);
        });
        return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    }

    private emitChange() {
        // We dispatch a standard CustomEvent
        this.dispatchEvent(new CustomEvent('change', { detail: this.state }));
    }

    private setContrastReport = () => {
        requestAnimationFrame(() => {
            this.checkContrast();
        })
    }

    private loadState(defaults?: SpectrumConfig['defaults']): ThemeState {
        let objectFromLocalStorage = localStorage.getItem(`${this.prefix}-spectrum`);
        let stateObject:ThemeState = {mode: "auto",
            isLinked: false,
            dark:{ hue: 260, chroma:0.18, lightness:0.3},
            light:{hue: 260, chroma:0.18, lightness:0.6}
        };

        if (objectFromLocalStorage !== null) {
            stateObject = JSON.parse(objectFromLocalStorage)
        }

        /**
         * Retrieves a value from the stateObject.
         * Supports flat keys ("mode") and nested dash-keys ("hue-light").
         */
        const getStore = <T extends boolean | number | ThemeMode | ColorValues>(
            key: string,
            fallback: T
        ): T => {
            // Handle Nested Keys (e.g., "hue-light")
            if (key.includes("-")) {
                const [prop, theme] = key.split("-") as [keyof ColorValues, "light" | "dark"];

                // Ensure the theme exists in our state to avoid crashes
                const themeData = stateObject[theme];
                if (themeData && prop in themeData) {
                    return themeData[prop] as T;
                }
            }

            // Handle Flat Keys (e.g., "mode", "isLinked")
            const flatValue = stateObject[key as keyof ThemeState];

            // Null-safe return with type-casting
            return (flatValue !== undefined ? flatValue : fallback) as T;
        };

        return {
            mode: getStore('mode', 'auto') as ThemeMode,
            isLinked: getStore('isLinked', true),
            light: {
                hue: getStore('hue-light', defaults?.light?.hue ?? 290) as number,
                chroma: getStore('chroma-light', defaults?.light?.chroma ?? 0.18) as number,
                lightness: getStore('lightness-light', defaults?.light?.lightness ?? 0.60) as number
            },
            dark: {
                hue: getStore('hue-dark', defaults?.dark?.hue ?? 290) as number,
                chroma: getStore('chroma-dark', defaults?.dark?.chroma ?? 0.18) as number,
                lightness: getStore('lightness-dark', defaults?.dark?.lightness ?? 0.60) as number
            }
        };
    }

    public setThemeMode(newMode: ThemeMode): void {
        this.state.mode = newMode;
        document.documentElement.setAttribute('data-theme', newMode);
        localStorage.setItem(`${this.prefix}-spectrum`, JSON.stringify(this.state));

        this.emitChange();
    }

    public setIsLinked(toggle: boolean): void {
        this.state.isLinked = toggle;
    }

    public toggleLink(): boolean {
        this.state.isLinked = !this.state.isLinked;

        if (this.state.isLinked) {
            this.updateValue('light', 'hue', this.state.light.hue);
            this.updateValue('light', 'chroma', this.state.light.chroma);
            this.updateValue('light', 'lightness', this.state.light.lightness)
        } else {
            this.emitChange();
        }

        localStorage.setItem(`${this.prefix}-spectrum`, JSON.stringify(this.state));

        return this.state.isLinked;
    }

    public updateValue(theme: 'light' | 'dark', key: 'hue' | 'chroma' | 'lightness', value: number): void {
        this.state[theme][key] = value;
        this.applyToCSS(theme, key, value);

        if (this.state.isLinked) {
            const otherTheme = theme === 'light' ? 'dark' : 'light';
            this.state[otherTheme][key] = value;
            this.applyToCSS(otherTheme, key, value);
        }

        localStorage.setItem(`${this.prefix}-spectrum`, JSON.stringify(this.state));

        requestAnimationFrame(() => {
            this.refreshWCAG();
        });

        this.emitChange();
    }

    private applyToCSS(theme: 'light' | 'dark', key: 'hue' | 'chroma' | 'lightness', value: number): void {
        const cssVar = `--cx-${key}-${theme}`;
        document.documentElement.style.setProperty(cssVar, value.toString());
    }

    private init(): void {
        // Apply Mode
        document.documentElement.setAttribute('data-theme', this.state.mode);

        // 3. Push all values to CSS first
        const themes: ('light' | 'dark')[] = ['light', 'dark'];
        const keys: ('hue' | 'chroma' | 'lightness')[] = ['hue', 'chroma', 'lightness'];

        themes.forEach(t => {
            keys.forEach(k => this.applyToCSS(t, k, this.state[t][k]));
        });

        // 4. WAIT for the browser to "know" these variables exist
        requestAnimationFrame(() => {
            this.refreshWCAG();
        });
    }

    private refreshWCAG() {
        this.state.wcag = this.checkContrast();
        this.emitChange();
    }
}