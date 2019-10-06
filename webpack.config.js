const path = require('path');
const fs = require('fs');
const fsp = require('fs').promises;
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const Dotenv = require('dotenv-webpack');

module.exports = async env => {
    const getResources = async () => {
        const locales = await fsp.readdir('./static/locales');
        const files = await Promise.all(
            locales.map(async locale => {
                const file = await fsp.readFile(
                    `./static/locales/${locale}/translations.json`
                );
                return file;
            }, {})
        );

        const resources = files.reduce((prev, file, index) => {
            const locale = locales[index];
            prev[locale] = {
                translation: JSON.parse(file.toString())
            };
            return prev;
        }, {});
        return resources;
    };

    const resources = await getResources();
    const config = {
        output: {
            filename: 'ui.compiled.js',
            path: path.resolve(__dirname, 'plugin/lib')
        },
        devtool: 'source-map',
        module: {
            rules: [
                {
                    test: /\.(js|jsx)$/,
                    exclude: [/node_modules/],
                    use: {
                        loader: 'babel-loader'
                    }
                },
                {
                    test: /\.(png|jpe?g|gif)$/i,
                    use: [
                        {
                            loader: 'file-loader'
                        }
                    ]
                }
            ]
        },
        node: {
            fs: 'empty'
        },
        plugins: [
            new CopyPlugin([
                {
                    from: path.resolve(
                        __dirname,
                        './src/extendscript/Premiere.jsx'
                    ),
                    to: path.resolve(__dirname, './plugin/jsx/PPRO')
                }
            ]),
            new Dotenv({
                path: `./.${env.ENV}.env`
            }),
            new webpack.DefinePlugin({
                'process.env.ENV': JSON.stringify(env.ENV),
                'process.env.LOCALES': JSON.stringify(resources)
            })
        ]
    };

    return config;
};
