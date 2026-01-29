/*
 * @Author: wangyr
 * @Date: 2024-03-20 11:32:36
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-13 18:50:54
 * @Description:
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let ALARMURL = axiosConfig.ALARMURL;

// 查询报警历史数据  POST
export const alarmHandlerData = parameter => {
  return axios({ url: BASEURL + '/alarm/getAlarmPage', method: 'post', data: parameter });
};

// 近14天报警走势  POST
export const alarmRecentTrend = data => {
  return axios({ url: BASEURL + '/alarm/alarmRecentTrend', method: 'post', data });
};

// 设备预警  POST
export const getAlarmPage = data => {
  return axios({ url: BASEURL + '/alarm/getAlarmPage', method: 'post', data });
};

// 物料预警  get
export const materialAlarmList = () => {
  return axios({ url: BASEURL + '/alarm/materialAlarmList', method: 'get' });
};

// 预警报警类型分析  get
export const AlarmTypeAnalysis = () => {
  return axios({ url: BASEURL + '/alarm/warningAlarmTypeAnalysis', method: 'get' });
};

// 优化方案-方案树列表  POST
export const getSolutionTree = data => {
  return axios({ url: BASEURL + '/solution/getSolutionTree', method: 'post', data });
};

// 环境预警-获取设备列表
export const getDevices = data => {
  return axios({ url: BASEURL + '/pointConfig/getDevicesByPointConfigCode', method: 'post', data });
};

// 环境预警  get
export const environmentAlarmList = parameter => {
  return axios({ url: BASEURL + '/alarm/environmentAlarmList/' + parameter, method: 'get' });
};

// 环境预警-预期出水水质
export const solutionResult = data => {
  return axios({ url: BASEURL + '/solution/selectSolutionResult', method: 'post', data });
};

// 今日报警情况  POST
export const alarmCommonIdCount = data => {
  return axios({ url: BASEURL + '/alarm/alarmCommonIdCount', method: 'post', data });
};

//工单类型字典
export const getDetaiById = id => {
  return axios({ url: `${ALARMURL}/ruleFlow/detail?id=${id}`, method: 'post' });
};

//进水TN
export const getInflowHistoryData = data => {
  return axios({
    url: BASEURL + `/expertProcessControl/inflowHistoryData`,
    method: 'post',
    data
  });
};

//出水TN
export const getOutflowModelData = data => {
  return axios({
    url: `/expertProcessControl/outflowModelData`,
    method: 'post',
    data
  });
};

//智慧决策优化方案--专家决策报警决策数量统计
export const measuresTypeCount = data => {
  return axios({
    url: BASEURL + `/alarm/measuresTypeCount`,
    method: 'post',
    data
  });
};

//智慧决策优化方案--tittle
export const getAlarmDetial = id => {
  return axios({
    url: `${BASEURL}/alarm/detail/${id}`,
    method: 'get'
  });
};

export const getnewModelHistoryData = data => {
  return axios({
    url: `${BASEURL}/modelHistoryData/getModelHistoryData`,
    method: 'post',
    data
  });
};
export const getEnergyDayData = parameter => {
  return axios({ url: `${BASEURL}/energy/getEnergyData`, method: 'post', data: parameter });
};

//加药泵反馈  四块数据展示
export const getRealDataByPointConfigCode = data => {
  return axios({
    url: `${BASEURL}/pointConfig/getRealDataByPointConfigCode`,
    method: 'post',
    data
  });
};

export const getCarbonSourceDosingEnergyData = data => {
  return axios({
    url: `${BASEURL}/debugTool/getCarbonSourceDosingEnergyData`,
    method: 'post',
    data
  });
}

//智慧决策优化方案--历史数据(曲线图)
export const getModelHistoryData = data => {
  return axios({
    url: `${BASEURL}/modelHistoryData/getHistoryData`,
    method: 'post',
    data
  });
};

export const inflowModelHistoryData = data => {
  return axios({
    url: `${BASEURL}/expertProcessControl/inflowModelHistoryData`,
    method: 'post',
    data
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

export const getPointStandardList = data => {
  return axios({
    url: `${BASEURL}/pointStandard/getList`,
    method: 'post',
    data
  });
};
