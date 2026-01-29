/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-11-26 11:24:05
 * @LastEditTime: 2024-09-21 15:10:16
 * @LastEditors: wangyr
 */

module.exports = {
  root: true,
  env: {
    // 你的环境变量（包含多个预定义的全局变量）
    node: true
  },
  extends: ['plugin:vue/essential', 'eslint:recommended'],
  parserOptions: {
    parser: 'babel-eslint'
  },
  globals: {
    // 你的全局变量（设置为 false 表示它不允许被重新赋值）
    AMap: true,
    BMap: true,
    BMapGL: true,
    BMapLib: true,
    BMapGLLib: true,
    mapvgl: true,
    mapv: true,
    BUILD_INFO: true,
    L: false,
    ht: true,
    THREE: true
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    // 自定义你的规则
    radix: 0,
    'no-async-promise-executor': 0,
    'no-unused-vars': 0,
    'vue/custom-event-name-casing': 0,
    'vue/v-on-event-hyphenation': 0,
    'vue/require-explicit-emits': 0,
    'vue/no-duplicate-attr-inheritance': 0,
    'vue/no-v-for-template-key-on-child': 0,
    // vue2.0中的部分api在3.0中废弃
    'vue/no-deprecated-destroyed-lifecycle': 0,
    'vue/no-deprecated-dollar-listeners-api': 0,
    'vue/no-deprecated-dollar-scopedslots-api': 0,
    'vue/no-deprecated-events-api': 0,
    'vue/no-deprecated-filter': 0,
    'vue/no-deprecated-html-element-is': 0,
    'vue/no-deprecated-scope-attribute': 0,
    'vue/no-deprecated-slot-attribute': 0,
    'vue/no-deprecated-slot-scope-attribute': 0,
    'vue/no-deprecated-v-bind-sync': 0,
    'vue/no-deprecated-v-on-native-modifier': 0,
    'vue/no-deprecated-v-on-number-modifiers': 0,
    'vue/no-deprecated-vue-config-keycodes': 0
  }
};
