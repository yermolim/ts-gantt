module.exports = function(config) {
  config.set({
    frameworks: ["jasmine", "karma-typescript"],
    files: [
      { pattern: "src/**/*.ts" },
      { pattern: "test/**/*.ts" }
    ],
    preprocessors: {
      "**/*.ts": ["karma-typescript"]
    },
    reporters: ["kjhtml", "karma-typescript"],
    browsers: ["ChromeHeadless"],
    singleRun: true
  });
};
