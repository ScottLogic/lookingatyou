module.exports = {
    moduleNameMapper: {
        '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
            '<rootDir>/__mocks__/fileMock.js',
        '\\.(scss|sass|css)$': 'identity-obj-proxy',
    },
    setupFilesAfterEnv: ['<rootDir>/src/setupTests.tsx'],
    snapshotSerializers: ['enzyme-to-json/serializer'],
    collectCoverageFrom: [
        'src/**/*.tsx',
        '!<rootDir>/src/index.tsx',
        '!<rootDir>/node_modules/',
    ],
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    coverageReporters: ['text', 'html'],
};
