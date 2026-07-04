import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'
import terser from '@rollup/plugin-terser'

export default {
    input: 'src/index.ts',
    output: {
        file: './build/bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        commonjs(),
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        typescript({
            include: ['src/**/*.ts', 'node_modules/@codesuma/baseline/**/*.ts'],
            exclude: ['node_modules/@codesuma/baseline/**/*.test.ts']
        }),
        postcss({
            modules: true,
            extract: 'bundle.css',
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
