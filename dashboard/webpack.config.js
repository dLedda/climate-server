const path = require("path");
const webpack = require("webpack");
const config = require("./src/config.json");

const TerserWebpackPlugin = require("terser-webpack-plugin");

const webpackConfig = {
    mode: "development",
    entry: "./src/main.ts",
    plugins: [new webpack.ProgressPlugin()],

    module: {
        rules: [{
            test: /\.(ts|tsx)$/,
            loader: "ts-loader",
            include: [path.resolve(__dirname, "src")],
            exclude: [/node_modules/]
        }, {
            test: /.css$/,

            use: [{
                loader: "style-loader"
            }, {
                loader: "css-loader",
                options: {
                    sourceMap: true
                }
            }]
        }]
    },

    resolve: {
        extensions: [".tsx", ".ts", ".js"]
    },

    output: {
        filename: "dashboard.js",
        path: path.resolve(__dirname, "../app-dist/static/"),
    },

    devServer: {
        contentBase: path.join(__dirname, "../app-dist/static/"),
        contentBasePublicPath: "/",
        port: 3000,
        publicPath: "http://localhost:3000/",
        hotOnly: true
    },
};

if (!config.development) {
    webpackConfig.optimization = {
        minimizer: [new TerserWebpackPlugin()],

        splitChunks: {
            cacheGroups: {
                vendors: {
                    priority: -10,
                    test: /[\\/]node_modules[\\/]/
                }
            },

            chunks: "async",
            minChunks: 1,
            minSize: 30000,
            name: false
        }
    };
    webpackConfig.mode = "production";
}

module.exports = {...webpackConfig};