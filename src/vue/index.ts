export { default as ColorMixer } from "./components/ColorMixer.vue";
export { default as Playground } from "./components/Playground.vue";
export { default as ColorPresets } from "./components/ColorPresets.vue";
export { default as LightDarkSwitch } from "./components/LightDarkSwitch.vue";

export { createSpectrum, useSpectrum } from "./createSpectrum";

// The Contract (Specific and Intentional)
export type {
    UpdatePayload,
    ThemeState,
    ThemeMode,
    ContrastRating,
    AccessibilityReport
} from "../types/engineTypes";
