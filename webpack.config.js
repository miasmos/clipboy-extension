const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('./package.json');
const Dotenv = require('dotenv-webpack');

let rootPath;
const isSupported =
    process.platform === 'win32' || process.platform === 'darwin';
switch (process.platform) {
    case 'win32':
        rootPath =
            'C:\\Program Files (x86)\\Common Files\\Adobe\\CEP\\extensions';
        break;
    case 'darwin':
        rootPath = '/Library/Application Support/Adobe/CEP/extensions';
        break;
    default:
        break;
}

module.exports = env => {
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
                'process.env.ENV': JSON.stringify(env.ENV)
            })
        ]
    };

    if (isSupported) {
        const targetPath = path.resolve(`${rootPath}/${pkg.name}`);
        fs.stat(targetPath, error => {
            if (!error) {
                config.plugins.push(
                    new CopyPlugin([{ from: 'plugin', to: targetPath }])
                );
            } else {
                console.warn(
                    '\x1b[33m%s\x1b[0m',
                    `Failed to copy contents of plugin folder to '${targetPath}'. Try running webpack again as an admin, or copy the files yourself.`
                );
            }
        });
    } else {
        console.warn(
            '\x1b[33m%s\x1b[0m',
            'Unsupported OS, skipping copying of plugin folder.'
        );
    }

    return config;
};
