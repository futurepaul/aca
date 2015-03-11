module.exports = {
    entry: "./app/main.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    resolve: {
        alias: {}
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: "style!css" },
        ]
    }
};