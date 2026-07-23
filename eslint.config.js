const expoConfig = require('eslint-config-expo/flat');

module.exports = [
  ...expoConfig,
  {
    ignores: ['functions/lib/**', 'dist/**', 'Utsav Premium/**'],
  },
];
