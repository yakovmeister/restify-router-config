import typescript from 'rollup-plugin-typescript2'

export default {
  entry: 'src/router.ts',
  dest: 'dist/index.js',
  format: 'es',
  plugins: [
    typescript()
  ]
}
