import react from 'eslint-plugin-react';
import globals from 'globals';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import js from '@eslint/js';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

export default [
  {
    files: ['**/*.js', '**/*.jsx'],
    ignores: [
      '**/.git',
      '**/.svn',
      '**/.hg',
      '**/node_modules',
      '**/.github',
      '**/README.md',
      '**/LICENSE',
      '**/Makefile',
      '**/coverage',
      '**/build'
    ]
  },
  ...compat.extends('eslint:recommended', 'plugin:react/recommended', 'plugin:prettier/recommended'),
  {
    plugins: {
      react
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.jest,
        ...globals.node
      },
      ecmaVersion: 'latest',
      sourceType: 'module'
    },

    settings: {
      react: {
        createClass: 'createReactClass',
        pragma: 'React',
        fragment: 'Fragment',
        version: 'detect',
        flowVersion: '0.53'
      },

      propWrapperFunctions: [
        'forbidExtraProps',
        {
          property: 'freeze',
          object: 'Object'
        },
        {
          property: 'myFavoriteWrapper'
        },
        {
          property: 'forbidExtraProps',
          exact: true
        }
      ],

      componentWrapperFunctions: [
        'observer',
        {
          property: 'styled'
        },
        {
          property: 'observer',
          object: 'Mobx'
        },
        {
          property: 'observer',
          object: '<pragma>'
        }
      ],

      formComponents: [
        'CustomForm',
        {
          name: 'Form',
          formAttribute: 'endpoint'
        }
      ],

      linkComponents: [
        'Hyperlink',
        {
          name: 'Link',
          linkAttribute: 'to'
        }
      ]
    },

    rules: {
      'react/prop-types': 'off'
    }
  }
];
