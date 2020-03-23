import { terser } from "rollup-plugin-terser";
import css from "rollup-plugin-css-porter";

export default [{
  input: "tsc/ts-gantt.js",
  output: [
    { file: "dist/ts-gantt.js", format: "es" },
    { file: "dist/ts-gantt.min.js", format: "es" }
  ],
  plugins: [
    terser({
      include: [/^.+\.min\.js$/],
      exclude: ["some*"]
    }),
    css({
      raw: "dist/styles.css",
      minified: "dist/styles.min.css",
    })
  ]
}];
