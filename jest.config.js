module.exports = {
    moduleNameMapper: {
        '@jahia/(.*)': '<rootDir>/node_modules/@jahia/$1/lib/$1.umd.js'
    },
    testPathIgnorePatterns: [
        '<rootDir>/node/',
        '<rootDir>/node_modules/',
        '<rootDir>/target/',
        '<rootDir>/src/main/resources/'
    ],
    verbose: true
};
