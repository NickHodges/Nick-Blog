/** @type {import("@types/eslint").Linter.Config} */
module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 12,
    sourceType: 'module',
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:astro/recommended',
  ],
  plugins: [
    '@typescript-eslint',
    'astro',
  ],
  rules: {
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { ignoreRestSiblings: true, varsIgnorePattern: 'Props' },
    ],
    '@typescript-eslint/no-var-requires': 'warn',
  },
  overrides: [
    {
      files: ['*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        extraFileExtensions: ['.astro'],
        parser: '@typescript-eslint/parser',
      },
    },
  ],
};
