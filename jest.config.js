module.exports = {
    "roots": [
        "<rootDir>/src"
    ],
    "transform": {
        "^.+\\.tsx?$": "ts-jest"
    },
    "collectCoverageFrom": [
        "src/**/*.ts",
        "!**/index.ts",
        "!**/__fixtures__/**",
        "!**/__tests_utils__/**"
    ],
    "testRegex": "(/__tests__/.*|(\\.|/)(test|spec))\\.tsx?$",
    "moduleFileExtensions": [
        "ts",
        "tsx",
        "js",
        "jsx",
        "json",
        "node"
    ],
}