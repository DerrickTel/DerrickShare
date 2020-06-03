module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'airbnb',
    'prettier',
    'plugin:react/recommended',       //用于检测tsx文件
    'plugin:@typescript-eslint/recommended'
  ],
  plugins: [
    '@typescript-eslint'
  ],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true,
  },
  globals: {
    APP_TYPE: true,
    page: true,
  },
  rules: {
    'react/jsx-filename-extension': [1, { extensions: ['.js'] }],
    'react/jsx-wrap-multilines': 0,
    'react/prop-types': 0,
    'camelcase': 0,
    'consistent-return': 0,
    '@typescript-eslint/no-use-before-define': 0,
    '@typescript-eslint/camelcase': 0,
    'react/no-string-refs': 0,
    'react/forbid-prop-types': 0,
    'react/jsx-one-expression-per-line': 0,
    'react/destructuring-assignment': 0,
    'object-curly-spacing': 2,
    'space-infix-ops': 2,
    'key-spacing': 2,
    'array-bracket-spacing': 2,
    'space-in-parens': 2,
    'keyword-spacing': 2,
    'import/extensions': 0,
    'react/display-name': 0,
    "no-unused-vars": 2,
    '@typescript-eslint/explicit-function-return-type': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-filename-extension': 0,
    // 'space-before-function-paren': ["error", "always"],
    'arrow-spacing': 2,
    'space-unary-ops': 2,
    'spaced-comment': 2,
    'no-bitwise': 0,
    // 'import/no-unresolved': [2, { ignore: ['^@/', '^umi/'] }],
    'import/no-unresolved': 'off',
    'import/no-extraneous-dependencies': [
      2,
      {
        optionalDependencies: true,
        devDependencies: ['**/tests/**.js', '/mock/**/**.js', '**/**.test.js'],
      },
    ],
    'jsx-a11y/no-noninteractive-element-interactions': 0,
    'jsx-a11y/click-events-have-key-events': 0,
    'jsx-a11y/no-static-element-interactions': 0,
    'jsx-a11y/anchor-is-valid': 0,
    'linebreak-style': 0,
    'no-unused-expressions': 0
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url', 'object-assign'],
  },
};