import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';

const babelOptions = {
    presets: [ 'es2015-rollup' ],
    plugins: [
        'transform-object-rest-spread',
        'transform-class-properties',
        'transform-export-extensions'
    ],
    babelrc: false
};

const format = argv.format || 'amd';
const dest = {
    amd:  'dist/amd/path-parser.js',
    umd:  'dist/umd/path-parser.js'
}[format];

export default {
    entry: 'modules/Path.js',
    format,
    plugins: [ babel(babelOptions) ],
    moduleName: 'Path',
    moduleId: 'Path',
    dest
};
