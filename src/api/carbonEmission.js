/*
 * @Author: wangyr
 * @Date: 2024-07-29 10:36:35
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-29 10:40:47
 * @Description:
 */
/* 碳排放类型数据分析 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;

// 碳排放类型数据分析
export const sourceTimeData = data => {
  return axios({ url: BASEURL + '/carbonEmission/sourceTimeData', method: 'post', data });
};

// 碳排放气体数据分析
export const gasTimeData = data => {
  return axios({ url: BASEURL + '/carbonEmission/gasTimeData', method: 'post', data });
};

// 碳排放月减数据分析
export const monthReduceData = data => {
  return axios({ url: BASEURL + '/carbonEmission/monthReduceData', method: 'post', data });
};

// 碳排放数据来源分析
export const sourceTypeAnalysis = data => {
  return axios({ url: BASEURL + '/carbonEmission/sourceTypeAnalysis', method: 'post', data });
};
