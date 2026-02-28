<script setup lang="ts">
/**
 * @file Playground.vue
 * @description Core theme exploration component for Celerix Spectrum.
 * Integrates LCH-based color manipulation with real-time accessibility
 * validation and preset management.
 */

//region Imports
import {ref, watch} from "vue";
import {SpectrumPlugin} from '../createSpectrum';
//endregion

//region Component Configuration
const props = defineProps<{
    /** The active Spectrum engine instance controlling the state */
    spectrum: SpectrumPlugin
}>();

/** * Static Theme Presets
 * Generated via the LCH Mixer to ensure perceptually uniform transitions.
 * Using 'as const' for strict TypeScript literal type inference.
 */
const THEME_PRESETS = {
    ocean: {hue: 210, chroma: 0.14, lightness: {light: 0.42, dark: 0.3}, name: 'Ocean Blue'},
    slateblue: {hue: 258, chroma: 0.09, lightness: {light: 0.42, dark: 0.3}, name: 'Slateblue'},
    forest: {hue: 145, chroma: 0.12, lightness: {light: 0.42, dark: 0.3}, name: 'Deep Forest'},
    sunset: {hue: 25, chroma: 0.18, lightness: {light: 0.42, dark: 0.3}, name: 'Sunset Orange'},
    cyber: {hue: 310, chroma: 0.25, lightness: {light: 0.42, dark: 0.3}, name: 'Cyber Neon'},
    slate: {hue: 210, chroma: 0.02, lightness: {light: 0.42, dark: 0.3}, name: 'Professional Slate'},
} as const;

/** Tracks the currently selected preset for reactive updates */
const activePresetKey = ref<keyof typeof THEME_PRESETS>('ocean');
//endregion

//region Logic: Preset Management
/**
 * Applies a full color profile to the Spectrum engine.
 * Respects the current engine mode (light/dark) when applying lightness targets.
 * * @param presetKey - The unique key from THEME_PRESETS
 */
const applyPreset = (presetKey: keyof typeof THEME_PRESETS) => {
    const {hue, chroma, lightness} = THEME_PRESETS[presetKey];

    // Determine the specific lightness target based on the current engine state
    const targetLightness = props.spectrum.active.mode === 'dark'
        ? lightness.dark
        : lightness.light;

    activePresetKey.value = presetKey;

    // Batch update the engine state
    props.spectrum.updateValue({mode: 'light', key: 'hue', value: hue});
    props.spectrum.updateValue({mode: 'light', key: 'chroma', value: chroma});
    props.spectrum.updateValue({mode: 'light', key: 'lightness', value: targetLightness});
}
//endregion

//region Logic: Reactivity & Handlers
/**
 * Watcher: Mode Switcher
 * Ensures that when the user toggles Light/Dark mode, the lightness values
 * are re-calculated from the current preset to maintain visual accessibility.
 */
watch(
    () => props.spectrum.active.mode,
    (newMode) => {
        const currentPreset = THEME_PRESETS[activePresetKey.value];

        props.spectrum.updateValue({
            mode: newMode,
            key: 'lightness',
            value: currentPreset.lightness[newMode]
        });
    },
    {flush: 'post'}
);

/**
 * Universal handler for raw input telemetry.
 * Direct bridge between HTML Range Sliders and the Spectrum Engine.
 @param mode     - Target engine mode ('light' | 'dark')
 * @param property - LCH property to modify ('hue' | 'chroma' | 'lightness')
 * @param event    - Native DOM event from input
 */
const updateThemeProperty = (
    mode: 'light' | 'dark',
    property: 'hue' | 'chroma' | 'lightness',
    event: Event
) => {
    const target = event.target as HTMLInputElement;
    if (target) {
        props.spectrum.updateValue({
            mode: mode,
            key: property,
            value: parseFloat(target.value)
        });
    }
};
//endregion
</script>

<template>
    <div class="playground">
        <div class="card">
            <div class="card-body">
                <div class="pg-stack">

                    <!--region LCH Title-->
                    <div class="lch-title">
                        <h3 style="font-size:1.15rem">LCH Color Mixer</h3>
                        <div>
                            <div style="width:24px;height:24px;border-radius:25px;background-color:var(--brand)"></div>
                        </div>
                    </div>
                    <!--endregion-->

                    <!-- hr -->
                    <hr class="pg-mp-0"/>

                    <!--region rgb rainbow rectangle -->
                    <div class="rainbow-rectangle">
                        <div class="color-window" :style="{
                          '--current-h': props.spectrum.active.hue,
                          '--current-c': props.spectrum.active.chroma,
                          '--current-l': props.spectrum.active.lightness
                        }">
                            <div class="color-map-grid"></div>
                            <div class="picker-handle"></div>
                        </div>
                    </div>
                    <!--endregion-->

                    <!--region hue slider -->
                    <div class="hue-control">
                        <div class="flex-between">
                            <div>Hue</div>
                            <div><span id="hue-value">{{ props.spectrum.active.hue }}</span>°</div>
                        </div>
                        <input
                            type="range"
                            id="hue-slider"
                            min="0"
                            max="360"
                            :value="props.spectrum.active.hue"
                            @input="updateThemeProperty('light', 'hue', $event)"
                            class="custom-slider"
                        >
                    </div>
                    <!--endregion-->

                    <!--region chroma slider -->
                    <div class="chroma-control" style="margin-top:var(--s-1)">
                        <div class="flex-between">
                            <div>Intensity <span class="text-muted">(Chroma)</span></div>
                            <div><span id="hue-value">{{ props.spectrum.active.chroma }}</span></div>
                        </div>
                        <input
                            type="range"
                            id="chroma-slider"
                            min="0"
                            max="0.37"
                            step="0.01"
                            :value="props.spectrum.active.chroma"
                            @input="updateThemeProperty('light', 'chroma', $event)"
                            class="chroma-slider"
                        >
                    </div>
                    <!--endregion-->

                    <!--region lightness slider -->
                    <div class="lightness-control" style="margin-top:var(--s-1)">
                        <div class="flex-between">
                            <div>Lightness</div>
                            <div><span id="hue-value">{{ props.spectrum.active.lightness }}</span></div>
                        </div>
                        <input
                            type="range"
                            id="lightness-slider"
                            min="0"
                            max="1"
                            step="0.01"
                            :value="props.spectrum.active.lightness"
                            @input="updateThemeProperty('light', 'lightness', $event)"
                            class="lightness-slider"
                        >
                    </div>
                    <!--endregion-->

                </div>

                <hr class="pg-p-0"/>

                <!--region dark mode toggle -->
                <div class="dark-mode-toggle">
                    <div class="title">Dark Mode</div>
                    <div style="display:flex;">
                        <div class="theme-controls-row">
                            <div class="control-item">
                                <span class="control-label">Follow OS</span>
                                <label class="toggle-switch">
                                    <input
                                        type="checkbox"
                                        :checked="props.spectrum.mode === 'auto'"
                                        @change="props.spectrum.setThemeMode(($event.target as HTMLInputElement).checked ? 'auto' : props.spectrum.active.mode)"
                                    >
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>

                            <div class="control-divider"></div>

                            <div class="control-item"
                                 :class="{ 'is-disabled': props.spectrum.mode === 'auto' }">
                                <span class="control-label">Dark Mode</span>
                                <label class="toggle-switch">
                                    <input
                                        type="checkbox"
                                        :disabled="props.spectrum.mode === 'auto'"
                                        :checked="props.spectrum.mode === 'dark'"
                                        @change="props.spectrum.setThemeMode(($event.target as HTMLInputElement).checked ? 'dark' : 'light')"
                                    >
                                    <span class="toggle-slider"></span>
                                </label>
                            </div>
                        </div>
                    </div>
                </div>
                <!--endregion-->

                <hr class="pg-p-0"/>

                <!--region presets -->
                <div class="presets">
                    <div class="title">Presets:</div>
                    <div class="preset-grid">
                        <button
                            v-for="(data, key) in THEME_PRESETS"
                            :key="key"
                            @click="applyPreset(key)"
                            class="cx-button"
                            :style="{ background: `oklch(0.6 ${data.chroma} ${data.hue})` }"
                            :title="data.name"
                        >&nbsp;&nbsp;&nbsp;&nbsp;
                        </button>
                    </div>
                </div>
                <!--endregion-->

            </div>

        </div>

        <!--region Right Column -->
        <div class="pg-stack" style="flex-grow: 1">
            <div class="card">
                <div class="card-body">
                    <div class="wcag-scorecard">
                        <div>
                            <div class="big-text">{{
                                    props.spectrum.wcag.ratio
                                }}:1
                            </div>
                            <div>WCAG Accessibility Scorecard</div>
                        </div>
                        <div>
                            <div class="score-pill" :class="props.spectrum.wcag.isPass ? 'success' : 'danger'">
                                <div class=""
                                     style="padding-inline-start: var(--s-3);padding-inline-end: var(--s-3);">
                                    {{ props.spectrum.wcag.status }}
                                    <template v-if="props.spectrum.wcag.isPass">-PASS</template>
                                    <template v-else>-FAIL</template>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="pg-mp-0"/>

            <div class="card">
                <div class="card-body">
                    <div class="scaling-color">
                        <div class="text-muted" style="text-align: center;width:100%">Brand 100-900
                            steps with text 'on-brand'
                        </div>
                        <div class="blocks">
                            <div v-for="step in [100, 200, 300, 400, 500, 600, 700, 800, 900]"
                                 :key="step"
                                 class="brand-block"
                                 :class="`brand-${step}`"
                                 :style="{ fontWeight: step === 500 ? '900' : '500' }">

                                {{ step }}

                                <template v-if="step === 500">
                                    <div class="block-500"></div>

                                    <div class="measure-point">
                                        <span class="label">
                                            Measure Point
                                        </span>
                                        <span class="rating-label" :style="{
                                            color: props.spectrum.wcag.isPass ? 'var(--success)' : 'var(--danger)'
                                        }">
                                            {{ props.spectrum.wcag.status }} ({{ props.spectrum.wcag.ratio }}:1)
                                        </span>
                                    </div>
                                </template>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <hr class="pg-mp-0"/>

            <div class="card">
                <div class="card-body">
                    <div class="data-preview">
                        <pre class="text-mono brand-300 code-preview">
mode: {{ props.spectrum.mode }}
isLinked: {{ props.spectrum.isLinked }}
active: {{ props.spectrum.active }}
wcag: {{ props.spectrum.wcag }}
                        </pre>
                    </div>
                </div>
            </div>
        </div>
        <!--endregion-->

    </div>
</template>

<style scoped>
.playground {
    display: flex;
    flex-wrap: wrap;
    justify-content: flex-start;
    gap: var(--s-3);
    align-items: stretch;

    .pg-mp-0 {
        margin: 0;
        padding: 0;
    }

    .pg-p-0 {
        padding: 0;
    }

    .flex-between {
        display: flex;
        justify-content: space-between;
    }

    .pg-stack {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        gap: var(--s-3);

        .lch-title {
            display: flex;
            justify-content: space-between;
            padding: 10px 10px 0;
        }
    }

    .dark-mode-toggle {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            padding-inline-start: var(--s-2)
        }

        .theme-controls-row {
            display: flex;
            align-items: center;
            justify-content: space-around;
            gap: 0.45rem;
            padding: 0 12px;

            .control-item {
                display: flex;
                flex-direction: column;
                align-items: center;
                gap: 6px; /* Space between text and switch */
                transition: all 0.3s ease;

                &.is-disabled {
                    opacity: 0.3;
                    filter: grayscale(1);
                    pointer-events: none;
                }
            }

            .control-label {
                font-size: 0.75rem;
                font-weight: 500;
                color: var(--text-muted, #a1a1aa);
                white-space: nowrap;
            }

            .control-divider {
                width: 1px;
                background: rgba(255, 255, 255, 0.1);
            }

        }
    }

    .presets {
        .title {
            padding-inline-start: var(--s-2);
            margin-bottom: var(--s-2);
        }

        .preset-grid {
            padding-inline-start: var(--s-1);
            display: flex;
            gap: var(--s-2);
            margin-bottom: var(--s-4);
        }
    }

    .rainbow-rectangle {
        width: 100%;
        display: flex;
        justify-content: center;
        margin-bottom: 2rem;

        .color-map-grid {
            position: absolute;
            inset: 0;
            /* 10% steps map perfectly to 0.1 increments of Lightness/Hue */
            background-image: linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px);
            background-size: 5% 5%;
            pointer-events: none;
        }

        .picker-handle {
            /* Use the variables we injected above */
            left: calc((var(--current-h) / 360) * 100%);
            top: calc(100% - (var(--current-l) * 100%));

            /* The rest of your polished styles */
            position: absolute;
            width: 12px;
            height: 12px;
            transform: translate(-50%, -50%) scale(calc(1 + var(--current-c) * 2));
            border: 2px solid white;
            border-radius: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
            pointer-events: none;
            transition: left 0.1s ease-out, top 0.1s ease-out;
        }

        .color-window {
            position: relative;
            width: 240px;
            height: 200px;
            border-radius: 12px;
            overflow: hidden;
            /* This 12-step gradient ensures 0-360 maps linearly to 0-100% */
            background: linear-gradient(to right,
            #ff0000 0%, #ff8000 8.3%, #ffff00 16.6%, #80ff00 25%,
            #00ff00 33.3%, #00ff80 41.6%, #00ffff 50%, #0080ff 58.3%,
            #0000ff 66.6%, #8000ff 75%, #ff00ff 83.3%, #ff0080 91.6%, #ff0000 100%);

            &::before {
                content: "";
                position: absolute;
                inset: 0;
                /* Fades from White (top) to Transparent (mid) to Black (bottom) */
                background: linear-gradient(to bottom,
                white 0%,
                transparent 45%,
                transparent 55%,
                black 100%);
                opacity: 0.6;
                pointer-events: none;
            }
        }
    }

    .data-preview {
        padding: var(--s-2);

        .code-preview {
            padding: var(--s-3);
            border: 1px solid var(--separator);
            color: var(--on-brand);
        }
    }

    .scaling-color {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: var(--s-3);
        padding-bottom: var(--s-5);
        margin-top: var(--s-3);

        .blocks {
            display: flex;
            justify-content: center;
            gap: var(--s-2);
            width: 100%;

            .brand-block {
                color: var(--on-brand);
                display: flex;
                width: 75px;
                height: 75px;
                justify-content: center;
                align-items: center;
                border-radius: 4px;
                position: relative;
            }

            .block-500 {
                position: absolute;
                bottom: -8px;
                left: 50%;
                transform: translateX(-50%);
                width: 0;
                height: 0;
                border-left: 6px solid transparent;
                border-right: 6px solid transparent;
                border-top: 8px solid var(--brand);
            }

            .measure-point {
                position: absolute;
                top: 90px;
                left: 50%;
                transform: translateX(-50%);
                display: flex;
                flex-direction: column;
                align-items: center;
                white-space: nowrap;
                line-height: 1.2;

                .label {
                    font-size: 10px;
                    font-weight: 800;
                    text-transform: uppercase;
                    color: light-dark(black, white);
                    opacity: 0.8;
                }

                .rating-label {
                    font-size: 12px;
                    font-weight: bold;
                }
            }
        }
    }

    .wcag-scorecard {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        padding: var(--s-3);

        .big-text {
            font-size: 2.5rem;
            font-weight: 700;
        }

        .score-pill {
            display: flex;
            padding-top: 1px;
            padding-bottom: 3px;
            justify-content: center;
            border-radius: 50px;
        }
    }

    .chroma-overlay {
        position: absolute;
        inset: 0;
        /* This fades from the vibrant hue colors at the top to neutral gray at the bottom */
        background: linear-gradient(to top, transparent, rgba(128, 128, 128, 0.5));
    }

    .hue-control, .chroma-control, .lightness-control {
        display: flex;
        flex-direction: column;
        gap: var(--s-2);
        padding-left: var(--s-3);
        padding-right: var(--s-3);
        background: var(--bg-surface);
        border-radius: var(--s-2);
    }

    .custom-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 22px;
        border-radius: 16px;
        /* A rainbow gradient representing the OKLCH hue circle */
        background: linear-gradient(to right,
        oklch(0.6 0.18 0deg), oklch(0.6 0.18 90deg),
        oklch(0.6 0.18 180deg), oklch(0.6 0.18 270deg),
        oklch(0.6 0.18 360deg)
        );
        outline: none;
    }

    /* The Handle (Thumb) */

    .custom-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        border: 3px solid var(--brand-seed); /* Glows with the selected color */
        cursor: pointer;
        /* box-shadow: 0 0 10px rgba(0,0,0,0.2);*/
        transition: transform 0.1s ease;
    }

    .custom-slider::-webkit-slider-thumb:active {
        transform: scale(1.2);
    }

    .chroma-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 22px;
        border-radius: 16px;
        /* Track goes from Gray to the Current Brand Hue */
        background: linear-gradient(to right,
        oklch(0.6 0 var(--brand-hue)),
        oklch(0.6 0.37 var(--brand-hue))
        );
        outline: none;
    }

    .chroma-slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        background: white;
        /* The thumb border shows the current intensity */
        border: 3px solid var(--brand-seed);
        cursor: pointer;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }

    .lightness-slider {
        -webkit-appearance: none;
        width: 100%;
        height: 22px;
        border-radius: 16px;
        /* Track goes from Gray to the Current Brand Hue */
        background: linear-gradient(to right,
        oklch(0 var(--brand-chroma) var(--brand-hue)),
        oklch(1 var(--brand-chroma) var(--brand-hue))
        );
        outline: none;

        &::-webkit-slider-thumb {
            -webkit-appearance: none;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            background: white;
            /* The thumb border shows the current intensity */
            border: 3px solid var(--brand-seed);
            cursor: pointer;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
    }
}


</style>
