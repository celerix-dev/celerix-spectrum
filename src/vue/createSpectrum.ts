import {computed, ComputedRef, reactive, toRef} from 'vue';
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
        const mode =spectrumState.mode;
        // Handle 'auto' by checking system preference if you want to be fancy
        return mode === 'dark' ? spectrumState.dark : spectrumState.light;
    });

    engine.addEventListener('change', (e: any) => {
        const data = e.detail as ThemeState;

        spectrumState.mode = data.mode;
        spectrumState.isLinked = data.isLinked;

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
            const pluginApi = reactive({
                mode: toRef(spectrumState, 'mode'),
                active: active,
                wcag: computed(() => spectrumState.wcag),
                isLinked: toRef(spectrumState, 'isLinked'),
                updateValue: engine.updateValue.bind(engine),
                toggleLink: engine.toggleLink.bind(engine),
                setThemeMode: engine.setThemeMode.bind(engine)
            });

            app.provide(SpectrumKey, (pluginApi as unknown) as SpectrumPlugin);
            // Also, attach it to globalProperties so we can use it as $spectrum in templates
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