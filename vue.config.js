/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-11-01 16:58:07
 * @LastEditTime: 2024-10-29 08:41:52
 * @LastEditors: wangyr
 */
const packageName = require('./package.json').name;
const HtmlWebpackPlugin = require('html-webpack-plugin');
const publicPath = process.env.NODE_ENV === 'production' ? '/waterPurificationBigPage' : './';
const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

module.exports = {
  publicPath,
  outputDir: 'release/waterPurificationBigPage',
  productionSourceMap: false,
  devServer: {
    overlay: {
      warnings: false,
      errors: true
    },
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT',
      'Access-Control-Allow-Credentials': 'true'
    },
    historyApiFallback: true,
    proxy: {
      '^/baiduApi': {
        target: 'https://api.map.baidu.com/weather/',
        changeOrigin: true,
        pathRewrite: {
          '^/baiduApi': ''
        }
      }
    }
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          javascriptEnabled: true
        }
      }
    }
  },
  pages: {
    index: {
      entry: 'src/main.js',
      template: 'public/index.html',
      filename: 'index.html',
      title: '永康智慧污水管理平台'
    }
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'less',
      patterns: [resolve('./common/style/color/less')]
    }
  },
  chainWebpack: config => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.publicPath = publicPath;
        return options;
      })
      .end();
    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.publicPath = publicPath;
        return options;
      })
      .end();
    config.module
      .rule('media')
      .use('url-loader')
      .loader('url-loader')
      .tap(options => {
        options.fallback.options.publicPath = publicPath;
        return options;
      })
      .end();
    config.module
      .rule('svg')
      .use('file-loader')
      .loader('file-loader')
      .tap(options => {
        options.publicPath = publicPath;
        return options;
      })
      .end();
    config.module
      .rule('swf')
      .test(/.swf$/)
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 10000
      })
      .end();
  },
  configureWebpack(config) {
    config.plugins.forEach(val => {
      if (val instanceof HtmlWebpackPlugin) {
        val.options.title = '永康智慧污水管理平台';
      }
    });
    return {
      output: {
        library: packageName,
        libraryTarget: 'umd',
        jsonpFunction: `webpackJsonp_${packageName}`
      },
      resolve: {
        alias: {
          '@': path.join(__dirname, 'src'),
          '@components': path.join(__dirname, 'src/components'),
          '@utils': path.join(__dirname, 'src/utils'),
          '@assets': path.join(__dirname, 'src/assets'),
          '@common': path.join(__dirname, 'src/common'),
          '@api': path.join(__dirname, 'src/api')
        }
      }
    };
  }
};
