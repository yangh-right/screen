/*
 * @Description:
 * @version:
 * @Author: fengtaotao
 * @Date: 2024-01-21 11:50:37
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-21 10:47:43
 */
import Vue from 'vue'
export const videoEvent = new Vue()
/*
 * @Description: 地图
 */

const state = {
  defaultPlayMode: '1', //1插件 2流媒体
  hideVideo: false,
  wndNum: 9,
  layout: '3x3',
  mediaType: '2' //1流 ，2插件
};
const mutations = {

  setMediaType: (state, mediaType) => {
    state.mediaType = mediaType;
  },
  setHideVideo: (state, payload) => {
    state.hideVideo = payload;
  },
  setPlayMode: (state, payload) => {
    state.defaultPlayMode = payload;
  },
  setWndNum: (state, wndNum) => {
    state.wndNum = wndNum;
  },
  setLayout: (state, layout) => {
    state.layout = layout;
  }
};

export default {
  namespaced: true,
  state,
  mutations,
};
