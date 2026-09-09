import js from '@eslint/js'
import stylistic from '@stylistic/eslint-plugin'
import globals from 'globals'

export default [
  {
    ignores: ['static/vendor/*', 'public/**', 'resources/**'],
  },

  js.configs.recommended,

  // JavaScript Standard Style, minus the `standard` toolchain.
  // `commaDangle` intentionally diverges from Standard ("never") — see README.
  stylistic.configs.customize({
    indent: 2,
    quotes: 'single',
    semi: false,
    commaDangle: 'always-multiline',
    jsx: false,
  }),

  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      // Standard puts a space before every function paren; customize() only
      // does so for anonymous/async-arrow ones.
      '@stylistic/space-before-function-paren': ['error', 'always'],
    },
  },
]
