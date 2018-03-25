import babel from 'rollup-plugin-babel'

const babelOptions = {
    presets: [['env', { modules: false }]],
    plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
}

export default ['es', 'cjs'].map(format => ({
    input: 'modules/Path.js',
    plugins: [babel(babelOptions)],
    output: {
        name: 'Path',
        format,
        file: `dist/${format}/path-parser.js`
    }
}))
