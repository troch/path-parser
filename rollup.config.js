import babel from 'rollup-plugin-babel';
import { argv } from 'yargs';

const format = argv.format || 'amd';
const dest = {
    amd:  'dist/amd/path-parser.js',
    umd:  'dist/umd/path-parser.js'
}[format];

export default {
    entry: 'modules/Path.js',
    format,
    plugins: [ babel() ],
    moduleName: 'Path',
    moduleId: 'Path',
    dest
};
