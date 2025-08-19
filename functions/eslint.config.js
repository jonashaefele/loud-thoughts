import js from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import tsparser from '@typescript-eslint/parser';
import importPlugin from 'eslint-plugin-import';

export default [
  // Global ignores - applied to all configurations
  {
    ignores: [
      'lib/**/*',           // Firebase Functions build output
      'node_modules/**/*',  // Dependencies
      '**/*.js.map',        // Source maps
    ],
  },
  // TypeScript source files only
  {
    files: ['src/**/*.ts'],
    languageOptions: {
      parser: tsparser,
      parserOptions: {
        ecmaVersion: 2022,
        sourceType: 'module',
        project: ['./tsconfig.json'],
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      import: importPlugin,
    },
    rules: {
      // Basic rules - can be made stricter later
      'no-unused-vars': 'off', // TypeScript handles this
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'warn',
      'quotes': ['error', 'single'],
      'semi': ['error', 'never'],
      'indent': ['error', 2],
      'comma-dangle': ['error', 'always-multiline'],
      
      // Import rules
      'import/no-unresolved': 'off', // TypeScript handles this
      'import/order': 'warn',
      
      // Relaxed rules for now
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
    },
  },
  // JavaScript config files (if any)
  {
    files: ['*.js', '*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
    },
  },
];