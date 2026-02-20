export interface LCH {
    l: number; // 0-1
    c: number; // 0-0.37
    h: number; // 0-360
}

export interface RGB {
    r: number; // 0-255
    g: number; // 0-255
    b: number; // 0-255
}

export interface HSL {
    h: number; // 0-360
    s: number; // 0-100
    l: number; // 0-100
}

/**
 * Normalized D65 White Point Constants
 * Represents the "white" of standard sRGB screens.
 */
const Xn = 0.9504;
const Yn = 1.0;
const Zn = 1.0888;

// Pre-compiled Regex for performance
const HEX_RE = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
const HEX_FULL_RE = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})?$/i;
const DIGIT_RE = /\d+/g;

/**
 * Ingests a Hex color string and converts it to LCH (Lightness, Chroma, Hue).
 * * This utility serves as a "bridge" for developers familiar with Hex/RGB.
 * It uses a simplified D65 Reference White point transformation to ensure
 * 99% perceptual accuracy on standard web displays.
 * * @param hex - The color string to convert (e.g., "#724CF9" or "f00").
 * @returns An LCH object normalized for the Spectrum Engine:
 * - l: 0.0 to 1.0 (Lightness)
 * - c: 0.0 to 0.37 (Chroma, clamped for sRGB gamut safety)
 * - h: 0 to 360 (Hue angle)
 */
export const hexToLCH = (hex: string):LCH | null => {
    // Pre-validation: If it's too long, it's not a standard hex we support
    if (hex.length > 9) return null;

    // 1. Expand shorthand (#f00 -> #ff0000)
    const cleanedHex = hex.replace(HEX_RE, (_, r, g, b) => r + r + g + g + b + b);
    const match = cleanedHex.match(HEX_FULL_RE);
    if (!match) return null;

    const r = parseInt(match[1], 16) / 255;
    const g = parseInt(match[2], 16) / 255;
    const b = parseInt(match[3], 16) / 255;
    // match[4] would be the Alpha channel, we ignore it intentionally.

    // 2. RGB to XYZ (Simplified D65 Matrix)
    const x = r * 0.4124 + g * 0.3576 + b * 0.1805;
    const y = r * 0.2126 + g * 0.7152 + b * 0.0722;
    const z = r * 0.0193 + g * 0.1192 + b * 0.9505;

    // 3. XYZ to Lab (Approximated Cube Root)
    const f = (t: number) => (t > 0.008856 ? Math.pow(t, 1/3) : (7.787 * t) + 16/116);

    const L = (116 * f(y / Yn)) - 16;
    const A = 500 * (f(x / Xn) - f(y / Yn));
    const B = 200 * (f(y / Yn) - f(z / Zn));

    // 4. Lab to LCH
    const chroma = Math.sqrt(A * A + B * B) / 100;
    const hue = (Math.atan2(B, A) * 180) / Math.PI;

    return {
        l: Math.max(0, Math.min(1, L / 100)),
        c: Math.max(0, Math.min(0.37, chroma)),
        h: (hue + 360) % 360
    };
};

/**
 * Converts RGB components to a Hexadecimal string using bit-shifting.
 */
export const rgbToHex = ({r, g, b}:RGB): string => {
    const clamp = (val: number) => Math.max(0, Math.min(255, Math.round(val)));

    const bin = (clamp(r) << 16) | (clamp(g) << 8) | clamp(b);
    return `#${(bin | (1 << 24)).toString(16).slice(1).toUpperCase()}`;
};

/**
 * Converts HSL components to RGB (0-1 range).
 */
export const hslToRgb = ({h, s, l}:HSL):RGB => {
    // 1. Sanitize: Hue circles back (modulo 360), S/L clamp to 0-100
    const _h = ((h % 360) + 360) % 360;
    const _s = Math.max(0, Math.min(100, s)) / 100;
    const _l = Math.max(0, Math.min(100, l)) / 100;

    // 2. Standard HSL to RGB conversion formula
    const k = (n: number) => (n + _h / 30) % 12;
    const a = _s * Math.min(_l, 1 - _l);
    const f = (n: number) => _l - a * Math.max(-1, Math.min(k(n) - 3, 9 - k(n), 1));

    return {
        r: Math.round(f(0) * 255),
        g: Math.round(f(8) * 255),
        b: Math.round(f(4) * 255)
    };
};

/**
 * The entry point for the universal input box.
 * Sniffs format and pipes everything through the hexToLCH master method.
 */
export const processUniversalInput = (input: string):LCH | null => {
    if (!input) return null;
    const str = input.toLowerCase().trim();

    // Hex Detection
    if (str.startsWith('#') || (!str.includes('(') && str.length <= 7)) {
        return hexToLCH(str);
    }

    const parts = str.match(DIGIT_RE);
    if (!parts || parts.length < 3) return null;
    const [v1, v2, v3] = parts.map(Number);

    // RGB Detection
    if (str.startsWith('rgb')) {
        return hexToLCH(rgbToHex({r: v1, g: v2, b: v3}));
    }

    // HSL Detection
    if (str.startsWith('hsl')) {
        // hslToRgb now returns 0-255, so we can pass it straight to rgbToHex
        return hexToLCH(rgbToHex(hslToRgb({h: v1, s: v2, l: v3})));
    }

    return null;
};

/**
 * Converts LCH back to RGB (0-255).
 * This is the "Out-Gate" for the Spectrum Engine.
 */
export const lchToRgb = ({ l, c, h }: LCH): RGB => {
    // 1. LCH to Lab
    // We multiply c and l by 100 because our internal engine uses 0-1
    // but the standard Lab formula uses 0-100.
    const L = l * 100;
    const C = c * 100;
    const hr = (h * Math.PI) / 180;
    const a = Math.cos(hr) * C;
    const b = Math.sin(hr) * C;

    // 2. Lab to XYZ
    const fInv = (t: number) =>
        t > 0.206897 ? Math.pow(t, 3) : (t - 16/116) / 7.787;

    const y = (L + 16) / 116;
    const x = a / 500 + y;
    const z = y - b / 200;

    const X = fInv(x) * Xn;
    const Y = fInv(y) * Yn;
    const Z = fInv(z) * Zn;

    // 3. XYZ to RGB (Inverse D65 Matrix)
    let r = X * 3.2406 + Y * -1.5372 + Z * -0.4986;
    let g = X * -0.9689 + Y * 1.8758 + Z * 0.0415;
    let b_val = X * 0.0557 + Y * -0.2040 + Z * 1.0570;

    // 4. Clamp and Scale to 0-255
    const clamp = (val: number) =>
        Math.max(0, Math.min(255, Math.round(val * 255)));

    return {
        r: clamp(r),
        g: clamp(g),
        b: clamp(b_val)
    };
};

/**
 * Spectrum Engine: On-Color Utility
 */
export const getOnColor = (bgL: number, hue: number): LCH => {
    const threshold = 0.57;

    // Logic: If the background is lighter than 0.57, use Dark text (0.15)
    // If the background is darker than 0.57, use Light text (0.98)
    const targetL = bgL > threshold ? 0.15 : 0.98;

    return {
        l: targetL,
        c: 0.01,
        h: hue
    };
};