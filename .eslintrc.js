const isProd = process.env.NODE_ENV === 'production';

module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/standard',
    '@vue/typescript/recommended'
  ],
  parserOptions: {
    ecmaVersion: 2020
  },
  rules: {
    'no-console': isProd ? 'warn' : 'off',
    'no-debugger': isProd ? 'warn' : 'off',
    'comma-dangle': 'off',
    'semi': ["error", "always"],
    '@typescript-eslint/no-empty-function': isProd ? 'error' : 'warn',
    "@typescript-eslint/no-use-before-define": ["error", { "functions": false }],
    "@typescript-eslint/member-delimiter-style": ["error", {
      "multiline": {
        "delimiter": "comma",
        "requireLast": false
      },
      "singleline": {
        "delimiter": "comma",
        "requireLast": false
      }
    }],
    '@typescript-eslint/no-non-null-assertion': 'off',
    '@typescript-eslint/ban-ts-ignore': 'off',
    'space-before-function-paren': ["warn", "never"]
  }
}
