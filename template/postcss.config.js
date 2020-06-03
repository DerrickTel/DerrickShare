/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable @typescript-eslint/no-var-requires */
const postcssAspectRatioMini = require('postcss-aspect-ratio-mini');
const postcssPxToViewport = require('postcss-px-to-viewport');
const postcssWriteSvg = require('postcss-write-svg');
const postcssViewportUnits = require('postcss-viewport-units');
const cssnano = require('cssnano');
const postcssPresetEnv = require('postcss-preset-env')

const postcssFlexbugsFixes = require('postcss-flexbugs-fixes')

module.exports = {
  plugins: [
    postcssFlexbugsFixes,
    // postcssPresetEnv({
    //   autoprefixer: {
    //     flexbox: 'no-2009',
    //   },
    //   stage: 3,
    // }),
    // 在这个位置加入我们需要配置的代码
    // 在这个位置加入我们需要配置的代码
    // 在这个位置加入我们需要配置的代码
    postcssAspectRatioMini({}),
    postcssPxToViewport({
      viewportWidth: 750, // (Number) The width of the viewport.
      viewportHeight: 1334, // (Number) The height of the viewport.
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) Expected units.
      selectorBlackList: ['.list-ignore', /notTransform/], // (Array) The selectors to ignore and leave as px.
      minPixelValue: 1, // (Number) Set the minimum pixel value to replace.
      mediaQuery: false, // (Boolean) Allow px to be converted in media queries.
      exclude: /(\/|\\)(node_modules)(\/|\\)/,
    }),
    postcssWriteSvg({
      utf8: false
    }),
    postcssPresetEnv({}),
    postcssViewportUnits({
      filterRule: rule => rule.selector.includes('::after')
        && rule.selector.includes('::before')
        && rule.selector.includes(':after')
        && rule.selector.includes(':before')
    }),
    cssnano({
      "cssnano-preset-advanced": {
        zindex: false,
        autoprefixer: false
      },
    })
  ]
};