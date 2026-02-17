import { reactive } from 'vue';
import {SpectrumConfig, SpectrumEngine, ThemeMode, ThemeState} from '../core/engine';


export interface SpectrumPlugin {
    state: ThemeState;
    updateValue: (theme: 'light' | 'dark', key: 'hue' | 'chroma', value: number) => void;
    toggleLink: () => void;
    setThemeMode: (newMode: ThemeMode) => void;
}

import { inject, InjectionKey } from 'vue';

export function createSpectrum(options: SpectrumConfig = {}) {

    const engine = new SpectrumEngine({
        prefix: options.prefix || 'cx'
    });

    const spectrumState = reactive(engine.state);

    engine.addEventListener('change', (e: any) => {
        Object.assign(spectrumState, {
            ...e.detail,
            light: { ...e.detail.light },
            dark: { ...e.detail.dark }
        });
    });

    // noinspection JSUnusedGlobalSymbols
    return {

        install(app: any) {
            // This makes 'spectrum' available in every component via inject('spectrum')
            const pluginApi: SpectrumPlugin = {
                state: spectrumState,
                updateValue: engine.updateValue.bind(engine),
                toggleLink: engine.toggleLink.bind(engine),
                setThemeMode: engine.setThemeMode.bind(engine)
            };

            app.provide(SpectrumKey, pluginApi);

            // Also, attach it to globalProperties so we can use it as $spectrum in templates
            app.config.globalProperties.$spectrum = spectrumState;
        }
    };
}

// helper hook for components
export const SpectrumKey: InjectionKey<SpectrumPlugin> = Symbol('Spectrum');

export function useSpectrum() {
    const spectrum = inject(SpectrumKey);
    if (!spectrum) throw new Error('Spectrum not provided! Did you run app.use(createSpectrum())?');
    return spectrum;
}