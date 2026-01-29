/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;

// 设备耗电量分析  POST
export const getEnergyDeviceAnalysis = data => {
  return axios({ url: BASEURL + '/energy/getEnergyDeviceAnalysis', method: 'post', data });
};

// 全厂药耗统计  POST
export const getDrugCostByTime = data => {
  return axios({ url: BASEURL + '/stock/getDrugCostByTime', method: 'post', data });
};

// 全厂药耗统计  POST
export const getCostConsumption = data => {
  return axios({ url: BASEURL + '/costAnalysis/getCostConsumption', method: 'post', data });
};

// 全厂碳排放构成  POST
export const getCarbonRatio = data => {
  return axios({ url: BASEURL + '/costAnalysis/getCarbonRatio', method: 'post', data });
};

// 区域耗电量分析  POST
export const getEnergyPlaceAnalysis = data => {
  return axios({ url: BASEURL + '/energy/getEnergyPlaceAnalysis', method: 'post', data });
};

// 全厂电耗统计  POST
export const getEnergyData = data => {
  return axios({ url: BASEURL + '/energy/getEnergyData', method: 'post', data });
};

// 全厂碳排放分析  POST
export const overviewOfCarbonEmissions = data => {
  return axios({ url: BASEURL + '/cockpit/overviewOfCarbonEmissions', method: 'post', data });
};

// 污泥产量分析  POST
export const getChemicalSludgeRate = data => {
  return axios({ url: BASEURL + '/sludgeDischarge/getChemicalSludgeRate', method: 'post', data });
};

// 获取温测系统
export const getTemperatureMeasurementPage = data => {
  return axios({ url: BASEURL + '/temperatureMeasurement/getTemperatureMeasurementPage', method: 'post', data });
};

// 查询能耗统计分析
export const getEnergyStatisticalAnalysis = data => {
  return axios({ url: BASEURL + '/energy/energyStatisticalAnalysis', method: 'post', data });
};

// 碳源投加量
export const carbonSourceAddedList = data => {
  return axios({
    url: BASEURL + `/debugTool/carbonSourceAddedList`,
    method: 'post',
    data
  });
};
// 温测  项目基本情况
export const basicInformationOfTheProject = id => {
  return axios({
    url: BASEURL + `/temperatureMeasurement/basicInformationOfTheProject/${id}`,
    method: 'get'
  });
};
// 温测  设备在线情况
export const deviceOnlineStatus = id => {
  return axios({
    url: BASEURL + `/temperatureMeasurement/deviceOnlineStatus/${id}`,
    method: 'get'
  });
};
// 温测  站点信息详情
export const temperatureStationDetail = id => {
  return axios({
    url: BASEURL + `/temperatureMeasurement/temperatureStationDetail/${id}`,
    method: 'get'
  });
};
// 根据行业设备编号查询监测量(设备平台)
export const queryIndustryPoint = id => {
  return axios({
    url: BASEURL + `/devicePoint/queryIndustryPoint/${id}`,
    method: 'get'
  });
};
// 获取历史数据
export const getHistoryData = data => {
  return axios({
    url: BASEURL + `/modelHistoryData/getHistoryData`,
    method: 'post',
    data
  });
};

// 机械臂 依据水厂id和监测量Code获取设备列表
export const getRealDataByPointConfigCode = data => {
  return axios({
    url: BASEURL + `/pointConfig/getRealDataByPointConfigCode`,
    method: 'post',
    data
  });
};

// 机械臂 水厂id获取构筑物设施监控视频树
export const getVideoByPlaceId = data => {
  return axios({
    url: BASEURL + `/place/getVideoByPlaceId`,
    method: 'post',
    data
  });
};

// 机械臂 依据水厂id和监测量Code获取设备列表
export const queryPointHistoryData = data => {
  return axios({
    url: BASEURL + `/cockpit/queryPointHistoryData`,
    method: 'post',
    data
  });
};

// 过程仪表
export const queryProcessPoint = data => {
  return axios({
    url: BASEURL + `/intelligentProduction/processPoint`,
    method: 'post',
    data
  });
};

// 回用水量
export const queryWaterReuse = data => {
  return axios({
    url: BASEURL + `/intelligentProduction/waterReuse`,
    method: 'post',
    data
  });
};
