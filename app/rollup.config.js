import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
    input: 'index.ts',
    output: {
        file: '../www/public/bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        commonjs(),
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        typescript({
            include: ["**/*.ts", "baseline/**/*.ts"]
        }),
        postcss({
            modules: true,  // Enable CSS modules
            extract: 'bundle.css',  // Extract to separate CSS file
            minimize: true,
        }),
    ],
    treeshake: {
        moduleSideEffects: false,
    },
}