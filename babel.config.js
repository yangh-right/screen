/*
 * @Author: wangyr
 * @Date: 2023-09-15 19:00:10
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-21 15:11:00
 * @Description:
 */
const plugins = [];

module.exports = {
  presets: [
    '@vue/cli-plugin-babel/preset',
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: 3
      }
    ]
  ],
  plugins,
  compact: false
};
