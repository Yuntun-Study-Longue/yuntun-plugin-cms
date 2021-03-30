const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

const extractLess = new MiniCssExtractPlugin({
  filename: 'static/css/[name].[contenthash].css',
  disable: process.env.NODE_ENV === 'development', // disabled during development 
})

const antdTheme = {
    'primary-color': 'red',
} || require('./antdTheme') // Include variables to override antd theme

module.exports = (config, webpack) => {
    return {
        ...config,
        module: {
            ...config.module,
            rules: [
                ...config.module.rules,
                {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'babel-loader',
                options: {
                    plugins: [['import', { libraryName: 'antd', style: true }]],
                },
                },
                {
                test: /\.less$/,
                // use the MiniCssExtractPlugin instance
                sideEffects: true,
                use: [{loader: MiniCssExtractPlugin.loader}, 'css-loader', {
                    loader: 'less-loader',
                    options: {
                    modifyVars: antdTheme,
                    },
                }],
                },
                {
                test: /\.(scss|sass)$/,
                sideEffects: true,
                use: [
                    {loader: MiniCssExtractPlugin.loader},
                    'css-loader',
                    'postcss-loader',
                    'resolve-url-loader',
                    'sass-loader',],
                }
        ],
        },
        plugins: [
        ...config.plugins,
        extractLess, // <- Add the ExtractTextPlugin instance here
        ],
        devServer: {
            ...config.devServer,
            host: '0.0.0.0',
            proxy:[{
                context: ["/sysware"],
                // target: "http://192.168.100.1:8080/",
                // target: "http://192.168.11.44:8080/",
                // target: "http://192.168.12.14:8080/",
                target: "http://192.168.5.202:8825/",
                // target: "http://192.168.12.109:8080/", 
                changeOrigin: true,
                disableHostCheck: true,
                noInfo: true,
              }
            ],
        },
    }
}

