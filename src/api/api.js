/*
 * @Author: wangyr
 * @Date: 2023-08-09 16:01:10
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-07-02 15:46:17
 * @Description:
 */
/* 引入 axios 配置文件 */
import { VUE_APP_HOST } from '@/constants';
import axiosConfig from './axiosConfig.js';
let axios = axiosConfig.axios;
let BASEURL = axiosConfig.BASEURL;
let resultParse = axiosConfig.resultParse;

// ------- xx大屏API -------
// 登录
export const login = params => {
  return axios.post(`${BASEURL}/auth/login`, params);
};
export const getBusChargeWaterUser = () => {};

// ------- 泵房详情 -------
// 获取组态
export const getSvgUrl = pumpId => {
  return axios.post(`${BASEURL}/svg/getSvgList`, pumpId).then(resultParse);
};

//  获取设备
export const getDevicesByPumpId = pumpId => {
  return axios.get(`${BASEURL}/device/deviceList/${pumpId}`).then(resultParse);
};

// 获取压力数据
export const getPressureData = params => {
  return axios.post(`${BASEURL}/statisticsData/getHistoryData`, params).then(resultParse);
};

// 获取流量数据
export const getFlowData = params => {
  return axios.post(`${BASEURL}/energy/queryDayFlowPowerPredict`, params).then(resultParse);
};
// 获取视频列表
export const getVideoListByPumpId = pumpId => {
  return axios.get(`${BASEURL}/video/queryList/${pumpId}`).then(resultParse);
};

// 获取视频url
export const getVideoUrl = params => {
  return axios.post(`${BASEURL}/video/getUrl`, params);
};

// 获取24小时的水泵状态
export const getDayPumpStatus = deviceId => {
  return axios.get(`${BASEURL}/device/singleDeviceFigure/${deviceId}`).then(resultParse);
};

// 获取3天和7天的水泵状态
export const getLongPumpStatus = params => {
  return axios.post(`${BASEURL}/device/multiPumpFigure`, params).then(resultParse);
};

// 获取工单列表
export const getTicketList = params => {
  return axios.post(`${BASEURL}/ticket/list`, params).then(resultParse);
};

// 夜间小流量
export const getNightFlow = params => {
  return axios.post(`${BASEURL}/leakage/leakageAnalysis`, params).then(resultParse);
};

// 夜间小流量
export const getPumpHouseId = () => {
  return axios.get(`${BASEURL}/home/getPumpHouseId`).then(resultParse);
};
// checkToken
export const checkToken = () => {
  return axios.get(`${BASEURL}/auth/checkToken`);
};

// token 登录
// export const loginToken = params => {
//   return axios.get(`${BASEURL}/auth/getUserMsgByToken`, params).then(resultParse);
// };
export const loginToken = params => {
  let origin = process.env.NODE_ENV === 'production' ? window.location.origin : VUE_APP_HOST;
  return axios.get(`${origin}/main/auth/token/getTokenInfo`, params).then(resultParse);
};

//登录页标题是可以配置
export const getProductDetailByCode = code => {
  return axios.get(`${BASEURL}/auth/getProductDetailByCode/${code}`);
}
