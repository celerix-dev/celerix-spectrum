import {computed, reactive, toRef, toRefs} from 'vue';
import {
    AccessibilityReport,
    ColorValues,
    SpectrumConfig,
    ThemeMode,
    ThemeState,
    UpdatePayload
} from '../types/engineTypes';
import {SpectrumEngine} from '../core/engine';

export interface SpectrumPlugin {
    readonly mode: ThemeMode;
    readonly resolvedMode: 'light' | 'dark';
    readonly active: ColorValues;
    readonly wcag: AccessibilityReport;
    readonly isLinked: boolean;
    updateValue: ({mode, key, value}:UpdatePayload) => void;
    toggleLink: () => void;
    setThemeMode: (newMode: ThemeMode) => void;
}

import {inject, InjectionKey} from 'vue';

// noinspection JSUnusedGlobalSymbols
export function createSpectrum(options: SpectrumConfig = {}) {
    const prefix = options.prefix || 'cx';
    const storageKey = `${prefix}-spectrum`;

    // Pull from localStorage
    const saved = localStorage.getItem(storageKey);
    // If not on localStorage, use the defaults
    const defaults = saved ? JSON.parse(saved) : options.defaults;

    // Start the engine! 🚘
    const engine = new SpectrumEngine({prefix, defaults});

    const spectrumState = reactive(engine.state);
    let saveTimeout: number | null = null;

    const active = computed(() => {
        // This now correctly identifies 'dark' even if the mode is 'auto'
        return spectrumState.resolvedMode === 'dark'
            ? spectrumState.dark
            : spectrumState.light;
    });

    engine.addEventListener('change', (e: any) => {
        const data = e.detail as ThemeState;

        spectrumState.mode = data.mode;
        spectrumState.isLinked = data.isLinked;
        spectrumState.resolvedMode = data.resolvedMode;

        spectrumState.light = { ...data.light };
        spectrumState.dark = { ...data.dark };
        spectrumState.wcag = { ...data.wcag };

        // Debounce here, to make sure that changes are saved only once every 500ms
        if (saveTimeout) window.clearTimeout(saveTimeout);

        saveTimeout = window.setTimeout(() => {
            localStorage.setItem(storageKey, JSON.stringify(spectrumState));
            saveTimeout = null;
        }, 500);
    });

    // noinspection JSUnusedGlobalSymbols
    return {

        install(app: any) {
            // This makes 'spectrum' available in every component via inject('spectrum')
            const refs = toRefs(spectrumState);

            const pluginApi: SpectrumPlugin = reactive({

                mode: refs.mode,
                isLinked: refs.isLinked,
                resolvedMode: refs.resolvedMode,

                active: active,
                wcag: computed(() => spectrumState.wcag),

                updateValue: engine.updateValue.bind(engine),
                toggleLink: engine.toggleLink.bind(engine),
                setThemeMode: engine.setThemeMode.bind(engine)
            }) as unknown as SpectrumPlugin;

            app.provide(SpectrumKey, pluginApi);

            app.config.globalProperties.$spectrum = spectrumState;
        }
    };
}

// helper hook for components
export const SpectrumKey: InjectionKey<SpectrumPlugin> = Symbol('Spectrum');

// noinspection JSUnusedGlobalSymbols
export function useSpectrum() {
    const spectrum = inject(SpectrumKey);
    if (!spectrum) throw new Error('Spectrum not provided! Did you run app.use(createSpectrum())?');
    return spectrum;
}
