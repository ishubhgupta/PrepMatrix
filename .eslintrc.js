module.exports = {
  extends: [
    'next/core-web-vitals',
  ],
  rules: {
    // Disable problematic rules for now
    '@typescript-eslint/no-unused-vars': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/prefer-const': 'off',
    'react/no-unescaped-entities': 'off',
  },
  ignorePatterns: ['next-env.d.ts', '.next/**/*', 'out/**/*'],
}
