import typescript from 'rollup-plugin-typescript2'

export default ['es', 'cjs'].map(format => ({
    input: 'modules/Path.ts',
    plugins: [
        typescript({
            useTsconfigDeclarationDir: true
        })
    ],
    output: {
        name: 'Path',
        format,
        file: `dist/${format}/path-parser.js`
    }
}))
