<script setup lang="ts">
import { SpectrumPlugin } from '../createSpectrum';
import { ref, watch } from "vue";

const props = defineProps<{
    spectrum: SpectrumPlugin
}>();

const internalMode = ref(props.spectrum.mode);

const handleAutoToggle = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    // Use the anchored .value to ensure reactivity
    props.spectrum.setThemeMode(checked ? 'auto' : props.spectrum.resolvedMode);
};

const handleDarkToggle = (e: Event) => {
    const checked = (e.target as HTMLInputElement).checked;
    props.spectrum.setThemeMode(checked ? 'dark' : 'light');
};

watch(
    () => props.spectrum,
    (newSpectrum) => {
        internalMode.value = newSpectrum.mode;
    },
    { deep: true, immediate: true }
);
</script>

<template>
    <div class="dark-mode-toggle">
        <div style="display:flex;">
            <div class="theme-controls-row">
                <div class="control-item">
                    <span class="control-label">Follow OS</span>
                    <label class="toggle-switch">
                        <input
                            type="checkbox"
                            :checked="internalMode === 'auto'"
                            @change="handleAutoToggle"
                        >
                        <span class="toggle-slider"></span>
                    </label>
                </div>

                <div class="control-divider"></div>

                <div
                    class="control-item"
                    :class="{ 'is-disabled': internalMode === 'auto' }"
                >
                    <span class="control-label">Dark Mode</span>
                    <label class="toggle-switch">
                        <input
                            type="checkbox"
                            :disabled="internalMode === 'auto'"
                            :checked="internalMode === 'dark'"
                            @change="handleDarkToggle"
                        >
                        <span class="toggle-slider"></span>
                    </label>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
/* Your existing styles remain exactly the same */
.dark-mode-toggle {
    display: flex;
    justify-content: space-between;
    align-items: center;

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
            gap: 6px;
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
</style>
