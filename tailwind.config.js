/** @type {import('tailwindcss').Config} */
export default {
    content: ["./*.hbs", "./**/*.hbs"],
    theme: {
        container: {
            center: true,
        },
        extend: {
            container: {
                screens: {
                    '2xl': '1280px'
                },
                padding: {
                    DEFAULT: '1.2rem',
                    '2xl': '2rem'
                }
            },
            fontSize: {
                card: ['2.8rem', '1.19'],
            },
            typography: ({ theme }) => ({
                macaw: {
                  css: {
                    '--tw-prose-body': theme('colors.gray[900]'),
                    '--tw-prose-headings': theme('colors.gray[900]'),
                    '--tw-prose-lead': theme('colors.gray[700]'),
                    '--tw-prose-bold': theme('colors.gray[900]'),
                    '--tw-prose-hr': theme('colors.gray[200]'),
                    '--tw-prose-captions': theme('colors.gray[900]'),
                    '--tw-prose-code': theme('colors.gray[900]'),
                    '--tw-prose-pre-code': theme('colors.gray[700]'),
                    '--tw-prose-pre-bg': theme('colors.gray[900]'),
                    '--tw-prose-th-borders': theme('colors.gray[200]'),
                    '--tw-prose-td-borders': theme('colors.gray[100]')
                  }
                },
              }),
        },
      },
    plugins: [
        require('@tailwindcss/typography')
    ]
  }
