module.exports = {
  default: {
    require: ["stepdefinitions/**/*.ts", "support/**/*.ts"],
    requireModule: ["ts-node/register"],
  format: ["progress", "allure-cucumberjs/reporter"],
  paths: ["features/**/*.feature"],
  publishQuiet: false,
  tags: process.env.CUCUMBER_TAGS || ''
  }
};
