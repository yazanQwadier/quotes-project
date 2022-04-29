const path = require('path');

module.exports = {
    mode: 'production',
    entry: './src/js/index.js',
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'index.bundle.js',
    },
    module: {
        rules: [
          {
            test: /\.s[ac]ss$/i,
            use: [
                "style-loader","css-loader",
                {
                    loader: "sass-loader",
                    options: {
                        warnRuleAsWarning: true,
                    },
                }
            ]
        },
        {
            test: /\.(png|jpe?g|gif|js)$/i,
            loader: 'file-loader',
            options: {
            publicPath: (process.env.NODE_ENV === 'development')? '' : '/quotes-project/',

              name(resourcePath, resourceQuery) {
                // `resourcePath` - `/absolute/path/to/file.js`
                // `resourceQuery` - `?foo=bar`
                return '[path][name].[ext]';
              },
            },
          },
        ]
    }
};

