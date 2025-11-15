export const testEnvironment = 'jsdom';
export const setupFilesAfterEnv = ['<rootDir>/src/setupTests.js'];
export const moduleNameMapper = {
  '^api$': '<rootDir>/src/api.js',
  '^utilities/(.*)$': '<rootDir>/src/utilities/$1',
  '^utilities$': '<rootDir>/src/utilities',
  '^components/(.*)$': '<rootDir>/src/components/$1',
  '^components$': '<rootDir>/src/components',
  '^pages/(.*)$': '<rootDir>/src/pages/$1',
  '^pages$': '<rootDir>/src/pages',
  '^assets/(.*)$': '<rootDir>/src/assets/$1',
  '^assets$': '<rootDir>/src/assets',
  '^__mocks__/(.*)$': '<rootDir>/src/__mocks__/$1',
  '^__mocks__$': '<rootDir>/src/__mocks__',
  '^host$': '<rootDir>/src/host.js',
  '^session$': '<rootDir>/src/session.js',
  '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  '\\.(jpg|jpeg|png|gif|eot|otf|webp|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
  '\\.svg$': '<rootDir>/src/__mocks__/svgMock.js'
};
export const transform = {
  '^.+\\.(js|jsx)$': 'babel-jest'
};
export const transformIgnorePatterns = ['node_modules/(?!(axios|react-router|react-router-dom|@mui|@emotion)/)'];
export const collectCoverageFrom = [
  'src/**/*.{js,jsx}',
  '!src/index.js',
  '!src/serviceWorker.js',
  '!src/**/*.test.{js,jsx}',
  '!src/**/node_modules/**'
];
export const coverageReporters = ['html', 'text', 'text-summary', 'cobertura'];
export const testMatch = ['<rootDir>/src/**/__tests__/**/*.{js,jsx}', '<rootDir>/src/**/*.(test|spec).{js,jsx}'];
export const moduleFileExtensions = ['js', 'jsx', 'json'];
export const resetMocks = true;
export const clearMocks = true;
export const restoreMocks = true;
