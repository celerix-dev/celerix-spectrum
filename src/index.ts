import './styles/index.css';
export * from './core/engine';

export {
    hexToLCH,
    processUniversalInput,
    rgbToHex,
    hslToRgb,
    lchToRgb,
} from './utils/colorIngestor';

import * as ColorUtils from './utils/colorIngestor';
export { ColorUtils };