import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    // Global ignores
    ignores: [
      'node_modules/**',
      '.next/**',
      'dist/**',
      'build/**',
      '.turbo/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs',
      'public/**'
    ]
  },
  {
    // Base configuration for all files
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        global: 'readonly',
        module: 'readonly',
        require: 'readonly'
      }
    },
    rules: {
      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Security
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // Performance
      'no-await-in-loop': 'warn',
      'prefer-promise-reject-errors': 'error'
    }
  },
  {
    // TypeScript files
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // Turn off base rules that TypeScript handles
      'no-unused-vars': 'off',
      
      // TypeScript specific rules (basic only)
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/ban-ts-comment': 'error'
    }
  },
  {
    // Test files - more relaxed rules
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}', '**/__tests__/**/*.{js,ts,jsx,tsx}'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
];