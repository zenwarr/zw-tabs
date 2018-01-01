const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const UglifyPlugin = require('uglifyjs-webpack-plugin');

function buildExternals() {
  let modules = {};

  fs.readdirSync('node_modules/@zcomp').forEach(function(mod) {
    modules['@zcomp/' + mod] = 'z' + mod.replace(/[\-_]/g, '').toLowerCase();
  });

  return modules;
}

module.exports = [
  {
    entry: './index.ts',

    output: {
      filename: "index.js",
      path: path.join(__dirname, 'dist'),
      library: "ztabs",
      libraryTarget: "var"
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
