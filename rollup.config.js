import resolve from "rollup-plugin-node-resolve";
import { terser } from "rollup-plugin-terser";
import replace from "rollup-plugin-replace";
import babel from "rollup-plugin-babel";

import pkg from "./package.json";

export default [
  // CommonJS
  {
    input: "src/index.js",
    output: { file: pkg.main, format: "cjs", indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      "rxjs/operators",
    ],
    plugins: [babel()],
  },

  // ES
  {
    input: "src/index.js",
    output: { file: pkg.module, format: "es", indent: false },
    external: [
      ...Object.keys(pkg.dependencies || {}),
      ...Object.keys(pkg.peerDependencies || {}),
      "rxjs/operators",
    ],
    plugins: [babel()],
  },

  // ES for Browsers
  {
    input: "src/index.js",
    output: { file: "dist/es/index.mjs", format: "es", indent: false },
    plugins: [
      resolve({
        jsnext: true,
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },

  {
    input: "src/index.js",
    output: {
      file: "dist/index.min.js",
      format: "umd",
      name: "Redux",
      indent: false,
    },
    plugins: [
      resolve({
        jsnext: true,
      }),
      babel({
        exclude: "node_modules/**",
      }),
      replace({
        "process.env.NODE_ENV": JSON.stringify("production"),
      }),
      terser({
        compress: {
          pure_getters: true,
          unsafe: true,
          unsafe_comps: true,
          warnings: false,
        },
      }),
    ],
  },
];
