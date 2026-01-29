/*
 * @Description: 
 * @Author: JianYue
 * @Date: 2024-03-06 09:05:38
 * @LastEditTime: 2024-03-06 11:47:08
 * @LastEditors:  Do not edit
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;

  // 去除率
export const removalRate = parameter => {
    return axios({ url:BASEURL + '/cockpit/removalRate' + '/' + parameter, method: 'get' });
  };

// 实时报警
export const alarmInfo = parameter => {
  return axios({ url:BASEURL+'/cockpit/alarmInfo' + '/' + parameter, method: 'get' });
};

// 指标
export const productionPerformanceIndex = parameter => {
  return axios({ url:BASEURL+'/summaryOverview/productionPerformanceIndex/'+ parameter, method: 'get' });
};

// 污泥产量
export const sludgeYield = parameter => {
  return axios({ url:BASEURL+'/summaryOverview/sludgeYield/'+ parameter, method: 'get' });
};

