import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';
import reactHooks from 'eslint-plugin-react-hooks';

export default tseslint.config(
  // Global ignore
  { ignores: ['**/node_modules/**', '**/dist/**', '**/*.js'] },

  // Base config for all TypeScript files
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },

  // Backend: Node.js environment
  {
    files: ['backend/**/*.ts'],
    rules: {
      'no-console': 'off',
      '@typescript-eslint/no-namespace': 'off',
    },
  },

  // Frontend: React + Vite
  {
    files: ['frontend/**/*.ts', 'frontend/**/*.tsx'],
    plugins: { 'react-hooks': reactHooks },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
    languageOptions: {
      globals: {
        window: 'readonly',
        document: 'readonly',
        fetch: 'readonly',
        console: 'readonly',
      },
    },
  },

  // Prettier must be last to disable conflicting rules
  prettierConfig,
);
