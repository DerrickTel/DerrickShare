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
    // 在这个位置加入我们需要配置的代码
    // 在这个位置加入我们需要配置的代码
    // 在这个位置加入我们需要配置的代码
    postcssAspectRatioMini({}),
    postcssPxToViewport({
      viewportWidth: 750, // 基准宽度（一般的设计都是这个基准
      viewportHeight: 1334, // 基准高度（一般的设计都是这个基准
      unitPrecision: 3, // (Number) The decimal numbers to allow the REM units to grow to.
      viewportUnit: 'vw', // (String) 单位
      selectorBlackList: ['.list-ignore', /notTransform/], // 带上这个单词的就不会fix为vw单位
      minPixelValue: 1, // (Number) 最小像素
      mediaQuery: false, // (Boolean) 允许在媒体查询中转换px。
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