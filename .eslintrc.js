/*
module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
    node: true
  },
  extends: 'standard',
  globals: {
    __static: true
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0
  }
}
*/
module.exports = {
  root: true,
  parser: 'babel-eslint',
  'env': {
    'browser': true,
    'commonjs': true,
    'es6': true,
    'node': true,

  },
  'extends': 'eslint:recommended',
  'parserOptions': {
    'ecmaFeatures': {
      'jsx': true
    },
    'ecmaVersion': 2017,
    'sourceType': 'module'
  },
  plugins: [
    'html'
  ],
  'rules': {
    // allow paren-less arrow functions
    'arrow-parens': 0,
    'no-console': 0,
    // allow async-await
    'generator-star-spacing': 0,
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    'indent': [
      'error',
      'tab'
    ],
    extends: 'standard',
    globals: {
      __static: true
    },
    'linebreak-style': [
      'error',
      'unix'
    ],
    'quotes': [
      'error',
      'double'
    ],
    'semi': [
      'error',
      'always'
    ]
  }
}
