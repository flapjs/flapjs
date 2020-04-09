const path = require('path');

module.exports = {
    'root': true,
    'env': {
        'browser': true,
        'es6': true
    },
    'extends': [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:import/react',
        'plugin:import/recommended',
        'plugin:jsx-a11y/recommended',
        'plugin:jsdoc/recommended',
    ],
    'globals': {
        'Atomics': 'readonly',
        'SharedArrayBuffer': 'readonly'
    },
    'parser': 'babel-eslint',
    'parserOptions': {
        'ecmaFeatures': {
            'jsx': true
        },
        'ecmaVersion': 2018,
        'sourceType': 'module',
        'allowImportExportEverywhere': true,
    },
    'plugins': [
        'react',
        'import',
        'jsx-a11y',
        'jsdoc',
        'react-hooks',
    ],
    'settings': {
        'react': { 'version': 'detect' },
        /** For import aliases (eslint-plugin-import-resolver-alias) */
        'import/resolver': {
            alias: {
                map: [
                    /** Add any aliases that need to be resolved by eslint here. Refer to webpack and jest config as well. */
                    // NOTE: This does not resolve for stylelint.
                    ['@flapjs', path.resolve(__dirname, 'src')]
                ]
            }
        },
        /** For jsdoc */
        'jsdoc': {
            'tagNamePreference': {
                // NOTE: we prefer "extends" over "augments"
                'augments': {
                    'message': '@extends is to be used over @augments as it is more evocative of classes than @augments',
                    'replacement': 'extends'
                }
            }
        }
    },
    'rules': {
        'indent': [
            'error',
            4,
            { "SwitchCase": 1 }
        ],
        // NOTE: git already converts all linebreaks to unix style.
        'linebreak-style': [
            'off',
            'unix'
        ],
        'quotes': [
            'error',
            'single'
        ],
        'semi': [
            'error',
            'always'
        ],

        /** Our custom-defined rules... */

        /** Allman brace style (braces on new lines) is more readable. */
        'brace-style': [
            'error',
            'allman',
            { 'allowSingleLine': true }
        ],
        /**
         * We want an empty line at the end. This seems to be standard
         * in a lot of other style guides, so we have it too :P
         */
        'eol-last': [
            'error',
            'always'
        ],
        /**
         * This disables removing unused parameters from functions.
         * The reason is because knowing what parameters are expected
         * in a function can be a useful self-documenting feature.
         */
        'no-unused-vars': [
            'error',
            {
                'vars': 'all',
                'args': 'none'
            }
        ],
        /** Only allow JSX usage in these file types... */
        'react/jsx-filename-extension': [
            'error',
            {
                'extensions': ['jsx', 'spec.js', 'stories.js']
            }
        ],
        /** ES6 imports... */
        'import/no-absolute-path': 'error',
        'import/no-webpack-loader-syntax': 'error',
        'import/no-self-import': 'error',
        'import/no-cycle': 'error',
        'import/no-useless-path-segments': 'error',
        'import/first': 'error',
        /** Enforces all imports to have file extensions... */
        'import/extensions': ['error', 'ignorePackages'],
        'import/no-unassigned-import': ['error', {
            // NOTE: If there is ever a resource that you need
            // to import with no name, like global css files,
            // add it here.
            // NOTE: There is a caveat here where it should enforce
            // local CSS modules, but because it has the same file
            // extension as global CSS files, it can't be selected
            // by a glob pattern (negation patterns INCLUDE ALL files
            // don't match, rather than remove files that match).
            allow: [
                '**/*.css',
            ]
        }],
        // NOTE: This makes sure that dynamic imports are properly configured for webpack...
        'import/dynamic-import-chunkname': 'error',
        /** JSDoc */
        // 'jsdoc/require-description-complete-sentence': 1,
        // NOTE: There is an issue with custom-defined classes that would be helpful to use as a type.
        'jsdoc/no-undefined-types': 0,
        // NOTE: We really don't want to document every .jsx component function/class in the propTypes AND in jsdocs.
        'jsdoc/require-jsdoc': 0,
        /** React Hooks */
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
    },
    'overrides': [
        {
            'files': [ '*.spec.js' ],
            'env': {
                'jest': true
            }
        },
        {
            'files': ['*.stories.js'],
            'env': {
                'node': true
            }
        }
    ]
};
