<script setup lang="ts">
import {onMounted, ref} from "vue";
import {SpectrumPlugin} from '../createSpectrum';

const props = defineProps<{
    spectrum: SpectrumPlugin
}>();

const THEME_PRESETS = {
    ocean: {hue: 210, chroma: 0.14, lightness: {light: 0.42, dark: 0.3}, name: 'Ocean Blue'},
    slateblue: {hue: 258, chroma: 0.09, lightness: {light: 0.42, dark: 0.3}, name: 'Slateblue'},
    forest: {hue: 145, chroma: 0.12, lightness: {light: 0.42, dark: 0.3}, name: 'Deep Forest'},
    sunset: {hue: 25, chroma: 0.18, lightness: {light: 0.42, dark: 0.3}, name: 'Sunset Orange'},
    cyber: {hue: 310, chroma: 0.25, lightness: {light: 0.42, dark: 0.3}, name: 'Cyber Neon'},
    slate: {hue: 210, chroma: 0.02, lightness: {light: 0.42, dark: 0.3}, name: 'Professional Slate'},
} as const;

const findMatchedPreset = () => {
    const current = props.spectrum.active; // The engine's source of truth

    const match = Object.entries(THEME_PRESETS).find(([_, data]) => {
        return data.hue === current.hue &&
            data.chroma === current.chroma;
    });

    return match ? (match[0] as keyof typeof THEME_PRESETS) : null;
};

const activePresetKey = ref<keyof typeof THEME_PRESETS | null>(null);

const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const {hue, chroma, lightness} = THEME_PRESETS[presetKey];

    const targetLightness = props.spectrum.active.mode === 'dark'
        ? lightness.dark
        : lightness.light;

    activePresetKey.value = presetKey;

    // Batch update the engine state
    props.spectrum.updateValue({mode: 'light', key: 'hue', value: hue});
    props.spectrum.updateValue({mode: 'light', key: 'chroma', value: chroma});
    props.spectrum.updateValue({mode: 'light', key: 'lightness', value: targetLightness});
}

onMounted(() => {
    activePresetKey.value = findMatchedPreset();
});

</script>

<template>
    <div class="presets">
        <div class="preset-grid">
            <button
                v-for="(data, key) in THEME_PRESETS"
                :key="key"
                @click="applyPreset(key)"
                class="cx-button"
                :class="{ 'is-active': activePresetKey === key }"
                :style="{ background: `oklch(0.6 ${data.chroma} ${data.hue})` }"
                :title="data.name"
            >&nbsp;&nbsp;&nbsp;&nbsp;
            </button>
        </div>
    </div>
</template>

<style scoped>
.presets {
    .preset-grid {
        padding-inline-start: var(--s-1);
        display: flex;
        gap: var(--s-2);
        margin-bottom: var(--s-4);

        button {
            border: 1px solid transparent;
        }
        .is-active {
            border:  1px solid var(--on-brand);
            box-shadow: rgba(0, 0, 0, 0.25) 0 4px 12px;
        }
    }
}
</style>
