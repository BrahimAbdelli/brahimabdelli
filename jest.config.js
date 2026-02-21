const nextJest = require('next/jest');

const createJestConfig = nextJest({
  dir: './'
});

const customJestConfig = {
  setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/$1',
    '^src/(.*)$': '<rootDir>/src/$1',
    '^lib/(.*)$': '<rootDir>/lib/$1',
    '^site-config$': '<rootDir>/site-config.ts'
  },
  testMatch: ['**/__tests__/**/*.[jt]s?(x)', '**/?(*.)+(spec|test).[jt]s?(x)'],
  testPathIgnorePatterns: ['/node_modules/', '/__tests__/utils/'],
  collectCoverageFrom: [
    'src/**/*.{js,jsx,ts,tsx}',
    'pages/**/*.{js,jsx,ts,tsx}',
    '!**/*.d.ts',
    '!**/node_modules/**',
    '!**/.next/**',
    '!**/coverage/**',
    '!**/*.config.{js,ts}',
    '!**/cypress/**'
  ],
  coverageThreshold: {
    global: {
      branches: 50,
      functions: 50,
      lines: 50,
      statements: 50
    }
  }
};

const esmPackages = [
  'refractor',
  'hastscript',
  'hast-util-parse-selector',
  'property-information',
  'comma-separated-tokens',
  'space-separated-tokens',
  'zwitch',
  'react-markdown',
  'remark-gfm',
  'micromark',
  'micromark-.*',
  'mdast-.*',
  'unist-.*',
  'devlop',
  'ccount',
  'escape-string-regexp',
  'markdown-table',
  'decode-named-character-reference',
  'character-entities',
  'trim-lines',
  'remark-parse',
  'unified',
  'bail',
  'is-plain-obj',
  'trough',
  'vfile',
  'vfile-message',
].join('|');

module.exports = async () => {
  const jestConfig = await createJestConfig(customJestConfig)();
  jestConfig.transformIgnorePatterns = [
    `node_modules/(?!(${esmPackages})/)`,
    '^.+\\.module\\.(css|sass|scss)$',
  ];
  return jestConfig;
};
