module.exports = {
  clearMocks: false,
  collectCoverage: false,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  sourceMap: true,
  inlineSourceMap: true,
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: [
    "**/*.test.ts"
  ],
  transform: {
    '^.+\\.tsx?$': [
      "ts-jest",
      {
        tsconfig: "tsconfig-test.json"
      }
    ]
  }
};
