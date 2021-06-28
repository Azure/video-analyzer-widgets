module.exports = {
    extends: ['eslint:recommended'],
    env: {
        browser: true,
        es6: true,
        node: true
    },
    parser: '@typescript-eslint/parser',
    plugins: ['@typescript-eslint'],
    rules: {
        '@typescript-eslint/array-type': 'off',
        '@typescript-eslint/consistent-type-definitions': 'error',
        '@typescript-eslint/explicit-member-accessibility': [
            'error',
            {
                accessibility: 'explicit',
                overrides: {
                    parameterProperties: 'explicit'
                }
            }
        ],
        '@typescript-eslint/indent': 'error',
        '@typescript-eslint/member-delimiter-style': [
            'error',
            {
                multiline: {
                    delimiter: 'semi',
                    requireLast: true
                },
                singleline: {
                    delimiter: 'semi',
                    requireLast: false
                }
            }
        ],
        '@typescript-eslint/member-ordering': 'error',
        '@typescript-eslint/naming-convention': [
            'error',
            {
                selector: 'interface',
                format: ['PascalCase'],
                custom: {
                    regex: '^I[A-Z]',
                    match: true
                }
            }
        ],
        '@typescript-eslint/no-empty-function': 'off',
        '@typescript-eslint/no-empty-interface': 'error',
        '@typescript-eslint/no-explicit-any': 'error',
        '@typescript-eslint/no-inferrable-types': [
            'off',
            {
                ignoreParameters: true
            }
        ],
        '@typescript-eslint/no-misused-new': 'error',
        '@typescript-eslint/no-non-null-assertion': 'error',
        '@typescript-eslint/no-shadow': [
            'error',
            {
                hoist: 'all'
            }
        ],
        '@typescript-eslint/no-unused-expressions': 'error',
        '@typescript-eslint/no-use-before-define': 'off',
        '@typescript-eslint/prefer-for-of': 'error',
        '@typescript-eslint/prefer-function-type': 'error',
        '@typescript-eslint/quotes': ['error', 'single'],
        '@typescript-eslint/semi': ['error', 'always'],
        '@typescript-eslint/type-annotation-spacing': 'error',
        '@typescript-eslint/unified-signatures': 'error',
        'arrow-body-style': 'error',
        'arrow-parens': ['off', 'always'],
        'brace-style': ['error', '1tbs'],
        'comma-dangle': 'error',
        'constructor-super': 'error',
        curly: 'error',
        'eol-last': 'error',
        'id-blacklist': 'off',
        'id-match': 'off',
        'import/order': 'off',
        'linebreak-style': 'off',
        'max-classes-per-file': 'off',
        'max-len': [
            'error',
            {
                code: 150
            }
        ],
        'new-parens': 'off',
        'newline-per-chained-call': 'off',
        'no-bitwise': 'error',
        'no-caller': 'error',
        'no-console': [
            'error',
            {
                allow: [
                    'warn',
                    'dir',
                    'timeLog',
                    'assert',
                    'clear',
                    'count',
                    'countReset',
                    'group',
                    'groupEnd',
                    'table',
                    'dirxml',
                    'groupCollapsed',
                    'Console',
                    'profile',
                    'profileEnd',
                    'timeStamp',
                    'context'
                ]
            }
        ],
        'no-debugger': 'error',
        'no-empty': 'off',
        'no-eval': 'error',
        'no-extra-semi': 'off',
        'no-fallthrough': 'error',
        'no-irregular-whitespace': 'off',
        'no-multiple-empty-lines': 'off',
        'no-regex-spaces': 'off',
        'no-restricted-imports': ['error', 'rxjs/Rx'],
        'no-trailing-spaces': 'error',
        'no-undef-init': 'error',
        'no-underscore-dangle': 'off',
        'no-unused-labels': 'error',
        'no-var': 'error',
        'prefer-const': 'error',
        'quote-props': 'off',
        radix: 'error',
        'space-before-function-paren': 'off',
        'space-in-parens': ['off', 'never'],
        'spaced-comment': [
            'error',
            'always',
            {
                markers: ['/']
            }
        ]
    }
};
