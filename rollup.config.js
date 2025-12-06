import { defineConfig } from 'rollup';
// A Rollup plugin which locates modules using the Node resolution algorithm
import { nodeResolve } from '@rollup/plugin-node-resolve';
// A Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from '@rollup/plugin-commonjs';
// Use the latest JS features in your Rollup bundle
import babel from '@rollup/plugin-babel';
// Minifies the bundle
import terser from '@rollup/plugin-terser';

import { resolve } from "path";



// Rollup configuration
export default defineConfig(async (env) => {
    // Společné pluginy
    const basePlugins = [
        commonjs(),
        nodeResolve(),
        babel({ babelHelpers: 'bundled' })
    ];
    
    // Vytvoříme samostatnou konfiguraci pro každý vstupní soubor
    return [
        {
            input: 'assets/js/index.js',
            output: {
                file: 'assets/built/index.js',
                sourcemap: true,
                format: 'iife',
                plugins: [terser()] 
            },
            plugins: basePlugins
        },
        {
            input: 'assets/js/post.js',
            output: {
                file: 'assets/built/post.js',
                sourcemap: true,
                format: 'iife',
                plugins: [terser()] 
            },
            plugins: basePlugins // Ostatní konfigurace bez livereload
        },
        {
            input: 'assets/js/slider.js',
            output: {
                file: 'assets/built/slider.js',
                sourcemap: true,
                format: 'iife',
                plugins: [terser()] 
            },
            plugins: basePlugins // Ostatní konfigurace bez livereload
        }
    ];
})