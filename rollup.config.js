import babel from 'rollup-plugin-babel';

const babelOptions = {
    presets: [['env', {modules: false}]],
    plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
};

export default ['es', 'cjs'].map(format => ({
    entry: 'modules/Path.js',
    format,
    plugins: [ babel(babelOptions) ],
    moduleName: 'Path',
    moduleId: 'Path',
    dest: `dist/${format}/path-parser.js`
}));
