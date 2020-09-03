import transpile from "rollup-plugin-typescript2"
import { terser } from "rollup-plugin-terser"
import alias from "@rollup/plugin-alias"

const base = {
  plugins: [
    transpile(),
    alias({
      entries: {
        "@module": "./src"
      }
    }),
    terser({
      output: {
        comments: false
      }
    })
  ]
};

export default [
  Object.assign(
    {},
    base,
    {
      input: "src/router.ts",
      output: {
        format: "cjs",
        file: "dist/index.min.js"
      }
    }
  )
];
