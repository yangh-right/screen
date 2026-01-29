/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-12-10 11:43:48
 * @LastEditTime: 2024-09-21 10:43:23
 * @LastEditors: wangyr
 */
import Vue from 'vue';
import Vuex from 'vuex';
import account from './modules/account';
import resize from './modules/resize';
import setting from './modules/setting';
import video from './modules/video';
import busi from './modules/busi';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    account,
    resize,
    setting,
    video,
    busi
  }
});
