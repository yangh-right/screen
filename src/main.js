/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-11-26 11:22:22
 * @LastEditTime: 2024-10-30 14:15:02
 * @LastEditors: wangyr
 */
import 'babel-polyfill';
import { loadScript } from '@/common/js/tool/toolsMap.js';
import Vue from 'vue';
import App from './App.vue';
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import './assets/style/global.less';
import VueRouter from 'vue-router';
import store from './vuex';
import router from './router/routes';

const publicPath = process.env.NODE_ENV === 'production' ? '/waterPurificationBigPage/' : '/';

loadScript(`${publicPath}jsplumb/jsplumb.min.js`);

/**
 * 引入外部文件
 * base          【 公共颜色及重置样式文件 】
 * style         【 字体图标库 】
 */
import '@/common/style/base.less';
import '@/assets/style/style.css';
import '@/assets/style/global.less';
import '@/common/font/font.css';
import '@/common/style/animate.less';
// import './mock';  // 引入mock数据
// import './common/js/tool/rem' // 设置 rem
import './common/js/tool/resize';
import './common/js/instruction/fixZoom';
import 'video.js/dist/video-js.min.css';

import elResize from '@common/js/tool/resizeDirective';
import ModelTitle from '@/views/utils/modelTitle';
import { VueJsonp } from 'vue-jsonp';
import VueTypedJs from 'vue-typed-js';
import './router/router-config'; // 路由守卫，做动态路由的地方

import VScaleScreen from 'v-scale-screen';
Vue.use(VScaleScreen);

import dataV from '@jiaminghi/data-view';
Vue.use(dataV);

Vue.prototype.$bus = new Vue();
Vue.component('model-title', ModelTitle);
Vue.use(Antd);
Vue.use(VueRouter);
Vue.use(VueJsonp);
Vue.use(VueTypedJs);
Vue.use(elResize);
// 时间中文格式
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
Vue.config.productionTip = false;

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app');
