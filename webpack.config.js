module.exports = {
    entry: "./main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        alias: {}
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style-loader!css-loader" }
        ]
    }
};