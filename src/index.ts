import './styles/index.css';
export * from './core/engine';
export * from './vue';

export {
    hexToLCH,
    processUniversalInput,
    rgbToHex,
    hslToRgb,
    lchToRgb,
} from './utils/colorIngestor';

import * as ColorUtils from './utils/colorIngestor';
export { ColorUtils };