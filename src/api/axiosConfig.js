import axios from 'axios';
import storage from '@/common/js/tool/storage';
/**
 * router     【引入路由】
 * customCode 【引入自定义状态码】
 * store      【引入状态管理仓】
 */
// import router from '../router/routes';
import customCode from './customCode';
import store from '../vuex/index';
let outToken;

/* 设置接口响应时间 */
axios.defaults.timeout = 100000;
/**
 * 清除 token 信息并跳转到登录页面
 * @private
 */
function _logOutEvent() {
  store.commit('account/setLogout');
}

/**
 *  http request 拦截器
 *  see readme for details
 */
axios.interceptors.request.use(
  config => {
    let token = storage.get('token');
    if (token) {
      try {
        // 如果 token 存在, 每个请求header添加token
        // 让每个请求携带自定义 token 请根据实际情况自行修改
        if (token && !(config.url.indexOf('loginIn') > -1)) {
          config.headers['Authorization'] = token;
          outToken = token;
        }
      } catch (e) {
        // token解析出错时清空登录信息
        storage.remove('user_info');
        location.reload();
      }
    }
    return config;
  },
  err => {
    return Promise.reject(err);
  }
);

/**
 *  http response  拦截器
 *  see readme for details
 */
axios.interceptors.response.use(
  response => {
    if (response.data.errorCode === customCode.JWT_TOKEN_EXPIRED) _logOutEvent(); // 如果 token 失效
    return response.data;
  },
  error => {
    console.log(error);
    if (error.response) {
      switch (error.response.status) {
        case 401:
          _logOutEvent(); // 如果报401
          return false;
        default:
          return false;
      }
    }
    return Promise.reject(error.response); // 返回接口返回的错误信息
  }
);

/**
 * 获取环境变量
 * @param name
 * @returns {*}
 */
const getEnvVariable = name => {
  if (process.env.NODE_ENV === 'production') {
    return window?.apiconfig?.[name];
  }
  return process.env[`VUE_APP_${name}`] || process.env[name];
};

/* 引入配置的后台接口地址 */
let BASEURL = getEnvVariable('VUE_APP_API_BASE_URL');
let SUPPLYURL = getEnvVariable('VUE_APP_API_SUPPLY_URL');
let ALARMURL = getEnvVariable('VUE_APP_API_ALARM_URL');
let DEVICEURL = getEnvVariable('VUE_APP_API_DEVICE_URL');
let TOKENURL = getEnvVariable('VUE_APP_API_TOKEN_URL');
let IMGBASEURL = `${TOKENURL}/FileManager?url=`;
let VUEAPPHOST = getEnvVariable('VUE_APP_HOST');
if (process.env.NODE_ENV === 'production') {
  BASEURL = window.location.origin + '/main/purificationApi';
  SUPPLYURL = window.location.origin + '/main/secondaryWaterSupplyApi';
  ALARMURL = window.location.origin + '/main/alarmRebuildApi';
  DEVICEURL = window.location.origin + '/main/deviceManagmentApi';
  TOKENURL = window.location.origin + '/main/userCenterApi';
  IMGBASEURL = window.location.origin + '/main/userCenterApi/FileManager?url=';
  VUEAPPHOST = window.location.origin;
}

// 结果解析
const resultParse = res => {
  if (!(res && (res.status === 'complete' || res.status === 0))) {
    if (res && res.errmsg && res.errmsg.length > 50) {
      res.errorMessage = '接口异常';
    }
  }
  return res.resultData || res.message || {};
};

export default {
  axios,
  BASEURL,
  TOKENURL,
  DEVICEURL,
  SUPPLYURL,
  ALARMURL,
  IMGBASEURL,
  VUEAPPHOST,
  resultParse,
  outToken
};
