const globals = require('globals')
const parser = require('vue-eslint-parser')
const typescriptEslint = require('@typescript-eslint/eslint-plugin')
const _import = require('eslint-plugin-import')
const vue = require('eslint-plugin-vue')
const prettier = require('eslint-plugin-prettier')

const { fixupPluginRules } = require('@eslint/compat')

const js = require('@eslint/js')

const { FlatCompat } = require('@eslint/eslintrc')

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all,
})

module.exports = [
  {
    ignores: ['node_modules/', 'dist/', 'build/', 'src/vite-env.d.ts', 'eslint.config.cjs'],
  },
  js.configs.recommended,
  ...vue.configs['flat/recommended'],
  ...compat.extends('plugin:@typescript-eslint/recommended'),
  {
    files: ['**/*.{js,jsx,ts,tsx,vue}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },

      parser: parser,
      ecmaVersion: 2021,
      sourceType: 'module',

      parserOptions: {
        parser: '@typescript-eslint/parser',
      },
    },

    plugins: {
      '@typescript-eslint': typescriptEslint,
      import: fixupPluginRules(_import),
      vue,
      prettier,
    },

    rules: {
      'vue/block-order': [
        'error',
        {
          order: ['script', 'template', 'style'],
        },
      ],

      'jsx-quotes': ['error', 'prefer-single'],
      'prettier/prettier': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'no-debugger': 'error',
      eqeqeq: ['error', 'always'],
      curly: ['error', 'all'],
      '@typescript-eslint/explicit-function-return-type': 'warn',

      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],

      'vue/no-mutating-props': 'error',
      'vue/no-unused-components': 'warn',
      'vue/no-unused-vars': [
        'warn',
        {
          ignorePattern: '^_',
        },
      ],
      'vue/no-v-html': 'warn',
      'vue/html-self-closing': 'off',
      'vue/singleline-html-element-content-newline': 'off',
      'vue/multi-word-component-names': 'off',
      'vue/require-default-prop': 'off',
      'vue/max-attributes-per-line': [
        'error',
        {
          singleline: {
            max: 4,
          },
          multiline: {
            max: 1,
          },
        },
      ],
    },

    settings: {
      'import/resolver': {
        node: {
          extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
        },
      },
    },
  },
]
