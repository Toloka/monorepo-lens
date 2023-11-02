import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vite';
import { viteStaticCopy } from 'vite-plugin-static-copy';

const wasmPath = require.resolve('@hpcc-js/wasm');

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        viteStaticCopy({
            targets: [
                {
                    src: wasmPath.slice(0, wasmPath.indexOf('/wasm/dist/') + 11) + '**/*.*',
                    dest: 'wasm'
                }
            ]
        })
    ],
    base: './'
});
