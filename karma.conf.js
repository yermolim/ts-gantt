process.env.CHROME_BIN = require("puppeteer").executablePath();

module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "test/**/*.ts" }
    ],
    karmaTypescriptConfig: {
      compilerOptions: {
        module: "commonjs"
      },
      tsconfig: "./tsconfig.json",
    },
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },
    reporters: ["kjhtml", "karma-typescript"],
    browsers: ["ChromeHeadless"],
    singleRun: true
  });
};
