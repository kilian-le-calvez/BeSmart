module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin', 'promise'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'error',
    'no-console': ['error', { allow: ['warn', 'error'] }],
    '@typescript-eslint/no-unused-vars': 'error',
    'prefer-const': 'error',
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'warn',
    'promise/prefer-await-to-then': 'error', // <-- Added rule
    'no-param-reassign': ['error', { props: true }],
    'no-magic-numbers': [
      'error',
      {
        ignore: [200, 201, 400, 404, 500],
      },
    ],
  },
  overrides: [
    {
      files: ['src/**/*.dto.ts', 'src/**/*.response.ts', 'src/**/*.types.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: 'FunctionDeclaration',
            message: 'No functions in DTO/response files',
          },
          {
            selector: 'ArrowFunctionExpression',
            message: 'No arrow functions in DTO/response files',
          },
        ],
      },
    },
  ],
};
