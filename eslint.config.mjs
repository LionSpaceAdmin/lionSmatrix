import { defineConfig } from 'eslint-define-config';

export default defineConfig([
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
      parser: '@typescript-eslint/parser',
      parserOptions: {
        project: ['./tsconfig.json', './apps/*/tsconfig.json'],
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    plugins: {
      '@typescript-eslint': '@typescript-eslint/eslint-plugin'
    },
    rules: {
      // TypeScript specific
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/prefer-nullish-coalescing': 'error',
      '@typescript-eslint/prefer-optional-chain': 'error',
      '@typescript-eslint/no-non-null-assertion': 'warn',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        { prefer: 'type-imports', fixStyle: 'inline-type-imports' }
      ],
      
      // Lions of Zion specific - Security focus
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/no-unsafe-member-access': 'error',
      '@typescript-eslint/no-unsafe-return': 'error'
    }
  },
  {
    // React/Next.js files
    files: ['**/*.{jsx,tsx}'],
    plugins: {
      'react': 'eslint-plugin-react',
      'react-hooks': 'eslint-plugin-react-hooks',
      '@next/next': '@next/eslint-plugin-next'
    },
    settings: {
      react: {
        version: 'detect'
      }
    },
    rules: {
      // React rules
      'react/react-in-jsx-scope': 'off', // Next.js 13+ doesn't need this
      'react/prop-types': 'off', // We use TypeScript
      'react/no-unescaped-entities': 'error',
      'react/jsx-no-target-blank': 'error',
      'react/jsx-key': 'error',
      
      // React Hooks
      'react-hooks/rules-of-hooks': 'error',
      'react-hooks/exhaustive-deps': 'warn',
      
      // Next.js rules
      '@next/next/no-img-element': 'error',
      '@next/next/no-html-link-for-pages': 'error',
      '@next/next/no-sync-scripts': 'error',
      '@next/next/no-css-tags': 'error',
      
      // Accessibility - Important for Lions of Zion
      'jsx-a11y/alt-text': 'error',
      'jsx-a11y/aria-props': 'error',
      'jsx-a11y/aria-proptypes': 'error',
      'jsx-a11y/aria-unsupported-elements': 'error',
      'jsx-a11y/role-has-required-aria-props': 'error',
      'jsx-a11y/role-supports-aria-props': 'error'
    }
  },
  {
    // Test files
    files: ['**/*.{test,spec}.{js,ts,jsx,tsx}', '**/__tests__/**/*.{js,ts,jsx,tsx}'],
    plugins: {
      'jest': 'eslint-plugin-jest',
      '@playwright/test': '@playwright/eslint-plugin'
    },
    rules: {
      'jest/no-disabled-tests': 'warn',
      'jest/no-focused-tests': 'error',
      'jest/no-identical-title': 'error',
      'jest/prefer-to-have-length': 'warn',
      'jest/valid-expect': 'error'
    }
  },
  {
    // War Machine specific files
    files: ['**/war-machine/**/*.{ts,tsx}'],
    rules: {
      // Extra security for War Machine components
      'no-eval': 'error',
      'no-new-func': 'error',
      '@typescript-eslint/no-unsafe-assignment': 'error',
      '@typescript-eslint/no-unsafe-call': 'error',
      '@typescript-eslint/ban-ts-comment': 'error',
      
      // Performance for real-time analysis
      'no-await-in-loop': 'error',
      'prefer-promise-reject-errors': 'error'
    }
  }
]);