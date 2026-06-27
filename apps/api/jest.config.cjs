/** @type {import("jest").Config} */

module.exports = {
    preset: "ts-jest",
    testEnvironment: "node",
    roots: ["<rootDir>/src"],
    testMatch: ["**/*.test.ts"],
    setupFiles: ["<rootDir>/src/test/setup.ts"],
    transformIgnorePatterns: [
        "node_modules/(?!@karmaOS/db/)"
    ],
    transform: {
        "^.+\\.tsx?$": [
            "ts-jest",
            {
                tsconfig: {
                    isolatedModules: true,
                    types: ["node", "jest"]
                }
            }
        ]
    }
}