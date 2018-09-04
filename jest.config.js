module.exports = {

  coverageDirectory: '<rootDir>/coverage',
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/server/',
    '<rootDir>/client/src/index.jsx',
    '<rootDir>/package.json',
    '<rootDir>/package-lock.json',
    '<rootDir>/client/src/services/imageUpload.js'
  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$':
     '<rootDir>/client/tests/__mocks__/fileMock.js'
  },
  setupTestFrameworkScriptFile: '<rootDir>/client/tests/setUpTests.js',

  verbose: true,
  testURL: 'http://localhost',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/package.json',
    '<rootDir>/package-lock.json',
    '<rootDir>/client/src/services/imageUpload.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
};
