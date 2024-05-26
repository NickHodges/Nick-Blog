//create a new file called eslint.config.js in the root of your project and add the things that you need for typescript and astro
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
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'plugin:astro/recommended', 'plugin:prettier/recommended'],
  plugins: ['@typescript-eslint', 'astro', 'prettier'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['warn', { ignoreRestSiblings: true, varsIgnorePattern: 'Props' }],
    '@typescript-eslint/no-var-requires': 'warn',
    'prettier/prettier': 'warn',
    quotes: ['warn', 'single', { avoidEscape: true }],
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
  ignores: [
    'node_modules/',
    'dist/',
    '.github',
    '.vercel',
    '.vscode',
    // Add other patterns you need to ignore
  ],
};
