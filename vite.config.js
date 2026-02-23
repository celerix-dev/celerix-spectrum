import { defineConfig } from 'vite';
import { resolve } from 'path';
import vue from '@vitejs/plugin-vue';
import dts from 'vite-plugin-dts';

export default defineConfig({
    plugins: [
        vue(),
        dts({
            rollupTypes: true, // Merges all types into one .d.ts per entry
            insertTypesEntry: true,
            include: ['src'],
        })
    ],
    build: {
        lib: {
            entry: {
                // This will create dist/index.js and dist/index.d.ts
                index: resolve(__dirname, 'src/index.ts'),
                // This will create dist/vue.js and dist/vue.d.ts
                vue: resolve(__dirname, 'src/vue/index.ts'),
            },
            formats: ['es']
        },
        rollupOptions: {
            // ONLY externalize framework peers
            external: ['vue', 'react'],
            output: {
                // Prevents the "shared-chunk-hash.js" files
                manualChunks: undefined,
                entryFileNames: '[name].js',
                chunkFileNames: '[name].js',
                assetFileNames: 'celerix-spectrum.[ext]'
            }
        }
    }
});