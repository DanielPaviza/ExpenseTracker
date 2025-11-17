module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: 'vue-eslint-parser',
  parserOptions: {
    parser: '@typescript-eslint/parser',
    ecmaVersion: 2021,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:vue/vue3-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  plugins: ['@typescript-eslint', 'import', 'tailwindcss'],
  rules: {
    // Import ordering
    'import/order': [
      'warn',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          ['parent', 'sibling', 'index'],
          'object',
          'type',
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
    // Vue: enforce <script> before <template>
    'vue/component-tags-order': [
      'error',
      {
        order: ['script', 'template', 'style'],
      },
    ],
    // JSX: enforce single quotes for attributes
    'jsx-quotes': ['error', 'prefer-single'],
    // Tailwind CSS class ordering plugin - warns on non-sorted classes
    'tailwindcss/classnames-order': 'warn',
    'tailwindcss/enforces-shorthand': 'off',
    // Allow any explicit any usage only as a warning
    '@typescript-eslint/no-explicit-any': 'warn',
    // Additional useful rules:
    'no-console': 'warn', // Warn on console.log
    'no-debugger': 'error', // Disallow debugger
    eqeqeq: ['error', 'always'], // Require === and !==
    curly: ['error', 'all'], // Require curly braces for all control statements
    '@typescript-eslint/explicit-function-return-type': 'warn', // Warn if return type is not specified
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused vars, ignore args starting with _
    'vue/no-mutating-props': 'error', // Disallow mutating props in Vue
    'vue/no-unused-components': 'warn', // Warn on unused Vue components
    'vue/no-v-html': 'warn', // Warn on v-html usage (XSS risk)
    // Enforce max 3 attributes per line in Vue
    'vue/max-attributes-per-line': [
      'error',
      {
        singleline: 3,
        multiline: {
          max: 1,
          allowFirstLine: true,
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
}
