/*
 * @Description:
 * @Author: JianYue
 * @Date: 2024-03-14 17:04:33
 * @LastEditTime: 2024-06-14 09:06:17
 * @LastEditors: wangyr
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;

// 物资类型占比  GET
export const statisticsAnalysis = () => {
  return axios({ url: BASEURL + '/materielType/statisticsAnalysis', method: 'get' });
};

// 获取物料类型  GET
export const getTopMaterialType = () => {
  return axios({ url: BASEURL + '/materielType/getTopMaterielType', method: 'get' });
};

//查询库存列表 POST
export const getStockList = data => {
  return axios({ url: BASEURL + '/stock/queryList', method: 'post', data });
};

// 库存预警预测  GET
export const getCountAnalysis = () => {
  return axios({ url: BASEURL + '/depot/countAnalysis', method: 'get' });
};

// 出入库单状态  GET
export const getCountInoutMain = () => {
  return axios({ url: BASEURL + '/inoutMain/countAnalysis', method: 'get' });
};

// 药剂使用预测  GET
export const getMaterialAlarm = () => {
  return axios({ url: BASEURL + '/alarm/materialAlarmList', method: 'get' });
};

//物资统计 POST
export const getMaterielList = data => {
  return axios({ url: BASEURL + '/materiel/queryPage', method: 'post', data });
};
