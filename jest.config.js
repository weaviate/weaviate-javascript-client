module.exports = {
  clearMocks: false,
  collectCoverage: true,
  coverageDirectory: "coverage",
  coverageProvider: "v8",
  preset: 'ts-jest',
  testEnvironment: "node",
  testMatch: [
    "**/*.test.ts"
  ],
  transform: {
    '^.+\\.tsx?$': [
      "ts-jest",
      { tsconfig: "tsconfig-test.json" }
    ]
  }
};
