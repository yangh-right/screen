/*
 * @Description:
 * @Author: JianYue
 * @Date: 2024-03-11 17:13:05
 * @LastEditTime: 2024-03-15 09:18:25
 * @LastEditors:  Do not edit
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let VUEAPPHOST = axiosConfig.VUEAPPHOST;
let ALARMURL = axiosConfig.ALARMURL;

export const effluentQualityControl = params => {
  return axios({
    url: BASEURL + `/cockpit/effluentQualityControl`,
    data: params,
    method: 'post'
  });
};

export const getRealDataByPointConfigCode = data => {
  return axios({
    url: BASEURL + '/pointConfig/getRealDataByPointConfigCode',
    method: 'post',
    data
  });
};
export const controlAccuracy = data => {
  return axios({
    url: BASEURL + '/intelligentProduction/controlAccuracy',
    method: 'post',
    data
  });
};
export const doControl = data => {
  return axios({
    url: BASEURL + '/intelligentProduction/doControl',
    method: 'post',
    data
  });
};
export const getOutletWater = parameter => {
  return axios({ url: BASEURL + '/cockpit/getOutletWater/' + parameter, method: 'get' });
};

// 过程水质控制
export const queryWaterQualityControl = waterPlantId => {
  return axios({
    url: `${BASEURL}/cockpit/processWaterQualityControl/${waterPlantId}`,
    method: 'get'
  });
};

// 获取过程构筑物
export const queryProcessStructure = () => {
  return axios({
    url: `${BASEURL}/cockpit/processStructure`,
    method: 'get'
  });
};

// 获取水厂负荷情况
export const processStructure = data => {
  return axios({
    url: `${BASEURL}/waterQualityStandard/getRunningTime`,
    method: 'post',
    data
  });
};

// 获取水厂负荷情况
export const getKeyInstrument = (waterPlantId, line) => {
  return axios({
    url: `${BASEURL}/intelligentProduction/keyInstrument/${waterPlantId}/${line}`,
    method: 'get'
  });
};
//智慧预测
export const alarmHandlerData = parameter => {
  return axios({ url: `${BASEURL}/alarm/getAlarmPage`, method: 'post', data: parameter });
};

//获取预警图片
export const getAlarmImage = data => {
  return axios({
    url: `${ALARMURL}/alarm/details/${data}`,
    method: 'get'
  });
};

export const getExpertProcessControlList = data => {
  return axios({
    url: `${BASEURL}/expertProcessControlDecision/getExpertProcessControlDecisionFactorTypeByControlId`,
    method: 'post',
    data
  });
};
export const getExpertProcessData = data => {
  return axios({
    url: `${BASEURL}/expertProcessControlDecision/getExpertProcessControlDecisionDetail`,
    method: 'post',
    data
  });
};
export const alarmDetailInfo = parameter => {
  return axios({ url: `${BASEURL}/alarm/detail/${parameter}`, method: 'get' });
};
export const alarmDetail = parameter => {
  return axios({ url: `${ALARMURL}/alarm/detail/${parameter}`, method: 'get' });
};
export const predictionConclusion = data => {
  return axios({ url: `${BASEURL}/summaryOverview/predictionConclusion`, method: 'post', data });
};

export function getForecastAndHistory(waterPlantId, configType) {
  return axios({
    url: `${BASEURL}/comeWaterForecast/getForecastAndHistory/${waterPlantId}/${configType}`,
    method: 'post'
  });
}

export function getPlanConfigPage(data) {
  return axios({
    url: `${BASEURL}/planConfig/planPage`,
    method: 'post',
    data
  });
}

export function illuminationCondition(waterPlantId) {
  return axios({
    url: `${BASEURL}/intelligentLighting/illuminationCondition/${waterPlantId}`,
    method: 'get'
  });
}

//查询水厂文件
export function searchFile(keyWord) {
  return axios({
    url: `${BASEURL}/waterPlantFile/searchFile?keyword=${keyWord}`,
    method: 'post'
  });
}

export const wasteLiquidsCount = data => {
  return axios({
    url: `${BASEURL}/wasteLiquids/count`,
    method: 'post',
    data
  });
};

export const specialEquipmentCount = data => {
  return axios({
    url: `${BASEURL}/device/queryParentTypeCount`,
    method: 'post',
    data
  });
};

// 危化品管理
export const hazardousChemicalsPage = data => {
  return axios({
    url: `${BASEURL}/hazardousChemicals/get/page`,
    method: 'post',
    data
  });
};

// 门禁记录
export const getAccessRecord = data => {
  return axios({
    url: `${BASEURL}/door/getAccessRecord`,
    method: 'post',
    data
  });
};

export const aiAlarmAnalysis = data => {
  return axios({
    url: `${BASEURL}/alarm/aiAlarmAnalysis`,
    method: 'post',
    data
  })
}
