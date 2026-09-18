// Org ESLint base: vanilla JS + JSDoc house style. ESLint 9 flat config.
// Consumers spread this and add their own globals/files blocks:
//
//   import base from './.config/eslint.base.js'
//   export default [...base, { files: ['src/**/*.js'], languageOptions: { globals: {...} } }]
//
// Peer deps the consumer installs: @eslint/js, eslint-plugin-jsdoc, globals.
import js from '@eslint/js'
import jsdoc from 'eslint-plugin-jsdoc'

export default [
  js.configs.recommended,
  jsdoc.configs['flat/recommended'],
  {
    rules: {
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-undef': 'error',
      'no-case-declarations': 'warn',
      'no-empty': ['error', { allowEmptyCatch: true }],
      'jsdoc/require-jsdoc': [
        'warn',
        {
          require: {
            FunctionDeclaration: true,
            MethodDefinition: false,
            ClassDeclaration: false,
            ArrowFunctionExpression: false,
            FunctionExpression: false,
          },
        },
      ],
      'jsdoc/require-param': 'warn',
      'jsdoc/require-returns': 'warn',
      'jsdoc/check-param-names': 'error',
      'jsdoc/check-tag-names': 'off',
      'jsdoc/no-undefined-types': 'off',
    },
  },
  { ignores: ['**/node_modules/**', '**/.wrangler/**', '**/dist/**', '**/types/**'] },
]
