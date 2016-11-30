'use strict';
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

let firebaseConfig = process.env.FIREBASE_CONFIG ||
    fs.readFileSync('./firebase.config.local.json', {encoding: 'utf8'})

if (firebaseConfig === '') {
    throw new Error('Failed to load Firebase config.')
}

const coverage = !!process.env['COVERAGE'];
if (coverage) {
    console.log('Running tests with coverage!');
}

const reporters = ['mocha'];

if (coverage) {
    reporters.push('karma-remap-istanbul')
}

const rules = [{
    test: /\.ts$/,
    loader: 'awesome-typescript-loader',
    exclude: /node_modules/,
    query: {
        useBabel: true
    }
}];

if (coverage) {
    rules.push({
        enforce: 'post',
        test: /\.(ts|js)$/,
        loader: 'sourcemap-istanbul-instrumenter-loader',
        exclude: [
            /\.(spec|e2e|bundle)\.ts$/,
            /node_modules/
        ],
        query: {'force-sourcemap': true}
    })
}

module.exports = function (karma) {
    karma.set({
        basePath: __dirname,

        frameworks: ['jasmine'],

        files: [{pattern: 'tests.bundle.ts', watched: false}],

        preprocessors: {
            'tests.bundle.ts': ['webpack']
        },

        reporters,

        remapIstanbulReporter: {
            reports: {
                html: 'coverage',
                lcovonly: 'coverage/lcov.info'
            }
        },

        browsers: ['Chrome'],

        colors: true,
        autoWatch: true,
        singleRun: false,
        logLevel: karma.LOG_INFO,

        webpack: {
            devtool: 'inline-source-map',

            resolve: {
                extensions: ['.ts', '.js']
            },

            module: {
                rules,
            },

            plugins: [
                new webpack.DefinePlugin({
                    firebaseConfig
                }),
                new webpack.ContextReplacementPlugin(
                    /angular(\\|\/)core(\\|\/)(esm(\\|\/)src|src)(\\|\/)linker/,
                    path.resolve(__dirname, './src')
                ),
                new webpack.SourceMapDevToolPlugin({
                    filename: null, // if no value is provided the sourcemap is inlined
                    test: /\.(ts|js)($|\?)/i // process .js and .ts files only
                })
            ]
        }
    })
};
