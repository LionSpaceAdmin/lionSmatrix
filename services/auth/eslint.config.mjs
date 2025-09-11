import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  {
    // Global ignores
    ignores: [
      'node_modules/**',
      'dist/**', 
      'build/**',
      'coverage/**',
      '*.config.js',
      '*.config.mjs'
    ]
  },
  {
    // Base configuration for TypeScript files
    files: ['**/*.ts'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      parser: tsParser,
      parserOptions: {
        project: false // Disable type-aware linting temporarily
      },
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
    plugins: {
      '@typescript-eslint': tsPlugin
    },
    rules: {
      // Code quality
      'no-console': ['warn', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
      'no-unused-vars': 'off', // Use TypeScript version instead
      'prefer-const': 'error',
      'no-var': 'error',
      
      // Security - Important for Auth Service
      'no-eval': 'error',
      'no-implied-eval': 'error',
      'no-new-func': 'error',
      
      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      // '@typescript-eslint/prefer-nullish-coalescing': 'error', // Requires type info
      // '@typescript-eslint/prefer-optional-chain': 'error', // Requires type info
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      
      // Security for Auth Service (disabled until dependencies are installed)
      // '@typescript-eslint/no-unsafe-assignment': 'error',
      // '@typescript-eslint/no-unsafe-call': 'error',
      // '@typescript-eslint/no-unsafe-member-access': 'error',
      // '@typescript-eslint/no-unsafe-return': 'error',
      '@typescript-eslint/ban-ts-comment': 'error'
    }
  },
  {
    // Test files
    files: ['**/*.{test,spec}.ts', '**/__tests__/**/*.ts'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off'
    }
  }
];