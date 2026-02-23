export type ThemeMode = 'light' | 'dark' | 'auto';

export type ContrastRating = 'AAA' | 'AA' | 'AA_LG' | 'FAIL';

export interface UpdatePayload {
    mode: 'light' | 'dark';
    key: 'hue' | 'chroma' | 'lightness';
    value: number;
}

export interface ColorValues {
    mode: 'light' | 'dark';
    hue: number;
    chroma: number;
    lightness: number;
}

export interface ThemeState {
    mode: ThemeMode;
    isLinked: boolean;
    light: ColorValues;
    dark: ColorValues;
    wcag: AccessibilityReport;
}

export interface AccessibilityReport {
    ratio: number;
    status: ContrastRating;
    isPass: boolean;
    colors: {
        bg: string;
        fg: string
    };
}

export interface SpectrumConfig {
    prefix?: string;
    defaults?: ThemeState;
}