import { defineConfig } from 'rollup';
// A Rollup plugin which locates modules using the Node resolution algorithm
import { nodeResolve } from '@rollup/plugin-node-resolve';
// A Rollup plugin to convert CommonJS modules to ES6, so they can be included in a Rollup bundle
import commonjs from '@rollup/plugin-commonjs';
// Use the latest JS features in your Rollup bundle
import babel from '@rollup/plugin-babel';
// Minifies the bundle
import terser from '@rollup/plugin-terser';

// Development: Enables a livereload server that watches for changes to CSS, JS, and Handlbars files
import { resolve } from "path";



// Rollup configuration
export default defineConfig(async (env) => {
    const isDevelopment = env.BUILD === 'development';
    
    // Dynamicky načteme livereload plugin POUZE v development módu
    const livereload = isDevelopment 
        ? (await import('rollup-plugin-livereload')).default 
        : null;
    
    return {
        input: 'assets/js/index.js',
        output: {
            dir: "assets/built",
            sourcemap: true,
            format: 'iife',
            // Tady se spouští minifikace (terser)
            plugins: [terser()] 
        },
        plugins: [
            commonjs(),
            nodeResolve(),
            babel({ babelHelpers: 'bundled' }),
            // Livereload plugin se přidá POUZE v development módu
            livereload && livereload({
                watch: [
                    'assets/built', // Sleduje kompilovaný CSS/JS
                    '*.hbs',        // Sleduje index.hbs, post.hbs atd.
                    'partials/**'   // Sleduje partials složku
                ]
            })
        ].filter(Boolean) // Odstraní false/null hodnoty z pole pluginů
    };
})