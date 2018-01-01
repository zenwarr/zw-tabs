const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

function buildExternals() {
  let modules = {};

  fs.readdirSync('node_modules/@zcomp').forEach(function(mod) {
    modules['@zcomp/' + mod] = '@zcomp/' + mod;
  });

  return modules;
}

module.exports = [
  {
    entry: './index.ts',

    output: {
      filename: "index.js",
      path: path.join(__dirname, 'dist'),
      libraryTarget: "commonjs"
    },

    target: 'web',

    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.json', '.webpack.js']
    },

    externals: buildExternals(),

    module: {
      rules: [
        {
          test: /\.tsx?$/,
          loader: 'ts-loader'
        }
      ]
    },

    plugins: [
        new UglifyPlugin()
    ]
  }
];
