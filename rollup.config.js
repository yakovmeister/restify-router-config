import typescript from 'rollup-plugin-typescript2'
import { uglify } from 'rollup-plugin-uglify'

export default {
  entry: 'src/router.ts',
  dest: 'dist/index.min.js',
  format: 'cjs',
  plugins: [
    typescript(),
    uglify()
  ]
}
