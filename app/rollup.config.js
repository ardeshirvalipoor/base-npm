import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'

export default {
    input: 'index.ts',
    output: {
        file: '../build/bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        commonjs(),
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        typescript({
            include: ["**/*.ts"]
        }),
        postcss({
            modules: true,  // Enable CSS modules
            extract: 'bundle.css',  // Extract to separate CSS file
            minimize: true,
        }),
        terser({
            keep_fnames: true
        }),
    ],
    treeshake: {
        moduleSideEffects: false,
    },
}