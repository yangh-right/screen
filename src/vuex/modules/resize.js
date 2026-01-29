/*
 * @Author: wangyr
 * @Date: 2024-07-22 09:01:55
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-21 10:55:58
 * @Description:
 */

import { getHeightScale, getWidthScale } from '@/utils/util';

const initView = () => {
  let currentWidth = window.innerWidth;
  let currentHeight = window.innerHeight;
  let scaleW = currentWidth / 1920;
  let scaleH = currentHeight / 1200;
  let scale = scaleW < scaleH ? scaleW : scaleH;
  return scale;
};

const state = {
  scale: 1,
  wScale: 1,
  hScale: 1
};
state.scale = initView();

export default {
  namespaced: true,
  state,
  mutations: {
    setScaleValue: (state, payload) => {
      state.wScale = getWidthScale() || state.wScale;
      state.hScale = getHeightScale() || state.hScale;
      state.scale = initView();
    }
  }
};
