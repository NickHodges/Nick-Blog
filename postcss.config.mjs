import autoprefixer from 'autoprefixer';
import postcssImport from 'postcss-import';
import tailwindcss from 'tailwindcss';
import tailwindcssNesting from '@tailwindcss/nesting';

export default {
  plugins: {
    autoprefixer: {},
    'postcss-import': {},
    tailwindcss: {},
    '@tailwindcss/nesting': {},
  }
};

