/*
 * @Description:
 * @Author: JianYue
 * @Date: 2024-03-07 16:45:44
 * @LastEditTime: 2024-08-14 16:55:11
 * @LastEditors: wangyr
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let VUEAPPHOST = axiosConfig.VUEAPPHOST;

// 查询报警历史数据  POST
export const getDeviceKPI = parameter => {
  return axios({ url: BASEURL + '/technologyManagement/getDeviceKPI/' + parameter, method: 'post' });
};

// 查询报警历史数据  GET
export const deviceTypeLevelAnalysis = parameter => {
  return axios({
    url: BASEURL + '/device/getDeviceTypeLevelAnalysis?waterPlantId=' + parameter,
    method: 'get'
  });
};

// 设备维修概况  POST
export const baseAnalysis = data => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/ticketBaseAnalysis/baseAnalysis', method: 'post', data });
};

// 设备维修概况  POST
export const basic = data => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/ticketAgingAnalysis/basic', method: 'post', data });
};

// 设备连续运行时间  POST
export const deviceOperation = data => {
  return axios({ url: BASEURL + '/deviceManager/durationOfDeviceOperation', method: 'post', data });
};

// 仪表管理统计 POST
export const managementStatistics = data => {
  return axios({ url: BASEURL + '/deviceManager/instrumentManagementStatistics', method: 'post', data });
};

// 仪表管理统计类型字典 GET
export const sysDictListByCode = parameter => {
  return axios({ url: BASEURL + '/sysDict/sysDictListByCode/' + parameter, method: 'get' });
};

// 设备状态统计 POST
export const statusStatistics = data => {
  return axios({ url: BASEURL + '/deviceManager/deviceStatusStatistics', method: 'post', data });
};

// 风险等级评价
export const safetyGradeEvaluation = parameter => {
  return axios({ url: BASEURL + '/summaryOverview/safetyGradeEvaluation/' + parameter, method: 'get' });
};
