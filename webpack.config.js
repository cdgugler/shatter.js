const path = require('path');

module.exports = {
    entry: './src/index.js',
    output: {
        library: 'Shatter',
        path: __dirname + '/build',
        filename: 'shatter.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                query: {
                    presets: ['es2015']
                }
            }
        ]
    }
}
