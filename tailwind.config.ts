import type { Config } from 'tailwindcss';

// Only the typography (`prose`) customization lives here: @tailwindcss/typography reads it through
// `@config` in src/styles/global.css. Everything else Tailwind needs is configured in that CSS file.

const cactusLink = {
  backgroundImage: 'linear-gradient(transparent,transparent 5px,hsl(var(--theme-text)) 5px,hsl(var(--theme-text)))',
  backgroundSize: '100% 6px',
  backgroundPosition: 'bottom',
  backgroundRepeat: 'repeat-x',
  textDecoration: 'none',
  '&:hover': {
    backgroundImage: 'linear-gradient(transparent,transparent 4px,hsl(var(--theme-link)) 4px,hsl(var(--theme-link)))',
  },
};

export default {
  theme: {
    extend: {
      typography: {
        cactus: {
          css: {
            '--tw-prose-body': 'hsl(var(--theme-text))',
            '--tw-prose-headings': 'hsl(var(--theme-accent-2))',
            '--tw-prose-links': 'hsl(var(--theme-text))',
            '--tw-prose-bold': 'hsl(var(--theme-text))',
            '--tw-prose-bullets': 'hsl(var(--theme-text))',
            '--tw-prose-quotes': 'hsl(var(--theme-quote))',
            '--tw-prose-code': 'hsl(var(--theme-text))',
            '--tw-prose-hr': '0.5px dashed #666',
            '--tw-prose-th-borders': '#666',
          },
        },
        DEFAULT: {
          css: {
            a: cactusLink,
            strong: {
              fontWeight: '700',
            },
            code: {
              border: '1px dotted #666',
              borderRadius: '2px',
            },
            blockquote: {
              borderLeftWidth: '0',
            },
            hr: {
              borderTopStyle: 'dashed',
            },
            thead: {
              borderBottomWidth: 'none',
            },
            'thead th': {
              fontWeight: '700',
              borderBottom: '1px dashed #666',
            },
            'tbody tr': {
              borderBottomWidth: 'none',
            },
            tfoot: {
              borderTop: '1px dashed #666',
            },
            sup: {
              marginInlineStart: '0.125rem',
              a: {
                backgroundImage: 'none',
                '&:hover': {
                  color: 'hsl(var(--theme-link))',
                  textDecoration: 'none',
                  backgroundImage: 'none',
                },
                '&:before': {
                  content: "'['",
                },
                '&:after': {
                  content: "']'",
                },
              },
            },
          },
        },
        sm: {
          css: {
            code: {
              fontSize: '0.875rem',
              fontWeight: '400',
            },
          },
        },
      },
    },
  },
} satisfies Partial<Config>;
