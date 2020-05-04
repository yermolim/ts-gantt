import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-porter";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";

export default [{
  input: "tsc/src/ts-gantt.js",
  output: [
    { file: "dist/ts-gantt.esm.js", format: "es" },
    { file: "dist/ts-gantt.esm.min.js", format: "es" },
    { file: "dist/ts-gantt.umd.js", format: "umd", name: "tsGantt" },
    { file: "dist/ts-gantt.umd.min.js", format: "umd", name: "tsGantt" },
  ],
  plugins: [
    terser({
      include: [/^.+\.min\.js$/],
      exclude: ["some*"],
    }),
    css({
      raw: "dist/styles.css",
      minified: "dist/styles.min.css",
    }),
    commonjs(),
    resolve({
      browser: true,
    }),
  ],
}];
