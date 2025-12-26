import typescript from '@rollup/plugin-typescript'
import nodeResolve from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'
import postcss from 'rollup-plugin-postcss'

export default {
    input: 'src/main.ts',
    output: {
        file: 'public/bundle.js',
        format: 'iife',
        sourcemap: true,
    },
    plugins: [
        commonjs(),
        nodeResolve({
            extensions: ['.js', '.ts']
        }),
        typescript(),
        postcss({
            modules: true,
            extract: 'bundle.css',
            minimize: true,
        }),
    ]
}
