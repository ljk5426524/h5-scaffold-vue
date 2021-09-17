module.exports = {
  root: true,
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['eslint:recommended', 'plugin:vue/essential'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    env: 'readonly',
    VUE_APP_VERSION: 'writable',
    VUE_APP_PUBLISH_TIME: 'writable',
  },
  parserOptions: {
    parser: 'babel-eslint',
    sourceType: 'module',
  },
  plugins: ['vue'],
  rules: {
    'no-console': 0,
    'no-unused-vars': [
      0,
      {
        vars: 'all',
        args: 'none',
      },
    ],
    eqeqeq: 2,
  },
}
