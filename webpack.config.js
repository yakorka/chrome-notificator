const path = require('path');

const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        background: './src/extension/background/index.ts',
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'build')
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanAfterEveryBuildPatterns: ['*.js']
        }),
        new CopyWebpackPlugin({
            patterns: [
                { from: './src/assets/manifest.json', to: './' },
                { from: './src/assets/img/', to: './img' },
                { from: './src/assets/audio/', to: './audio' }
            ]
        })
    ]
};