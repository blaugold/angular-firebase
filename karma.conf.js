const path = require('path')
const fs = require('fs')
const webpack = require('webpack')

let firebaseConfig = process.env.FIREBASE_CONFIG ||
    fs.readFileSync('./firebase.config.local.json', {encoding: 'utf8'})

if (firebaseConfig === '') {
    throw new Error('Failed to load Firebase config.')
}

module.exports = function (karma) {
    karma.set({
        basePath: __dirname,

        frameworks: ['jasmine'],

        files: [{pattern: 'tests.bundle.ts', watched: false}],

        preprocessors: {
            'tests.bundle.ts': ['webpack']
        },

        reporters: ['mocha', 'karma-remap-istanbul'],

        remapIstanbulReporter: {
            reports: {
                html: 'coverage'
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
                loaders: [
                    {
                        test: /\.ts$/,
                        loader: 'awesome-typescript',
                        exclude: /node_modules/
                    },
                    {
                        enforce: 'post',
                        test: /\.(ts|js)$/,
                        loader: 'istanbul-instrumenter',
                        include: path.resolve(__dirname, 'src'),
                        exclude: [
                            /\.(spec|e2e|bundle)\.ts$/,
                            /node_modules/
                        ]
                    }
                ]
            },
            plugins: [
                new webpack.DefinePlugin({
                    firebaseConfig
                })
            ]
        }
    })
}