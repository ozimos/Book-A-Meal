module.exports = {

  coverageDirectory: '<rootDir>/coverage',
  collectCoverage: true,
  collectCoverageFrom: [
    '<rootDir>/client/src/**/*.{js,jsx}'
  ],
  coveragePathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/server/',
    '<rootDir>/client/src/index.jsx',
    '<rootDir>/package.json',
    '<rootDir>/package-lock.json',
    '<rootDir>/client/src/services/imageUpload.js',
    '<rootDir>/client/src/components/container/requireCaterer.jsx',
    '<rootDir>/client/src/components/container/requireUser.jsx',
    '<rootDir>/client/src/components/container/PrivateRoute.jsx',
    '<rootDir>/client/src/components/mealCard/DashboardTableContainer.jsx',
    '<rootDir>/client/src/components/mealCard/OrderTableContainer.jsx',
    '<rootDir>/client/src/components/mealCard/MealsTable.jsx',
    '<rootDir>/client/src/AppRoutes.jsx',
    '<rootDir>/client/src/history.js',
    '<rootDir>/client/src/store.js',
    '<rootDir>/client/src/redux/reducers/index.js',

  ],
  moduleNameMapper: {
    '\\.(css|scss)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2)$':
     '<rootDir>/client/__tests__/__mocks__/fileMock.js'
  },
  setupTestFrameworkScriptFile: '<rootDir>/client/__tests__/setUpTests.js',

  verbose: true,
  testURL: 'http://localhost',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/package.json',
    '<rootDir>/package-lock.json',
    '<rootDir>/client/__tests__/__mocks__',
    '<rootDir>/client/__tests__/setUpTests.js'
  ],
  snapshotSerializers: ['enzyme-to-json/serializer'],
  transformIgnorePatterns: ['[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$'],
};
