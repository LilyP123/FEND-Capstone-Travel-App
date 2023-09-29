module.exports = {
  transform: {
    '^.+\\.js$': 'babel-jest',
    "^.+\\.scss$": "identity-obj-proxy"
  },
  moduleNameMapper: {
    '^axios$': '<rootDir>/__mocks__/axios.js',
    "\\.(scss)$": "<rootDir>/__mocks__/styleMock.js"
  },
  transformIgnorePatterns: [
    "/node_modules/"
  ]
};