module.exports = {
  root: true,
  env: {
    node: true,
    es2021: true
  },
  extends: [
    'eslint:recommended'
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-unused-vars': ['error', { 'argsIgnorePattern': '^_' }],
    'prefer-const': 'error',
    'no-var': 'error',
    'object-shorthand': 'error',
    'prefer-template': 'error'
  },
  overrides: [
    {
      files: ['Backend/**/*.js'],
      env: {
        node: true,
        jest: true
      },
      rules: {
        'no-console': 'off' // Allow console.log in backend
      }
    },
    {
      files: ['Frontend/**/*.{js,jsx}'],
      env: {
        browser: true,
        es6: true
      },
      extends: [
        'eslint:recommended',
        'plugin:react/recommended',
        'plugin:react-hooks/recommended'
      ],
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      plugins: ['react', 'react-hooks'],
      settings: {
        react: {
          version: 'detect'
        }
      },
      rules: {
        'react/prop-types': 'warn',
        'react/react-in-jsx-scope': 'off',
        'react-hooks/rules-of-hooks': 'error',
        'react-hooks/exhaustive-deps': 'warn'
      }
    }
  ]
};