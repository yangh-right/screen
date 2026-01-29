/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-12-10 11:43:48
 * @LastEditTime: 2024-09-11 11:07:54
 * @LastEditors: wangyr
 */

/* 引入 axios 配置文件 */
import axiosConfig, { resultParse } from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let DEVICEURL = axiosConfig.DEVICEURL;
let TOKENURL = axiosConfig.TOKENURL;
let VUEAPPHOST = axiosConfig.VUEAPPHOST;
let SUPPLYURL = axiosConfig.SUPPLYURL;

/**
 * @description set local time string
 * @logic id the split string by argument,if is all then make one digital number to two;
 * @param {Date} cTime cTime,current time for short
 * @param {String} splitStr if no such argument then its -
 * @param {Boolean} isAll if no such argument then show two digital number
 * @return void
 */
export const getTimeStr = (cTime = new Date(), splitStr = '-', isAll = true) => {
  let sYear = cTime.getFullYear();
  let sMonth = cTime.getMonth() + 1;
  let sDay = cTime.getDate();
  let sHour = cTime.getHours();
  let sMin = cTime.getMinutes();
  let sSec = cTime.getSeconds();
  if (isAll) {
    sMonth = sMonth > 9 ? sMonth : '0' + sMonth;
    sDay = sDay > 9 ? sDay : '0' + sDay;
    sHour = sHour > 9 ? sHour : '0' + sHour;
    sMin = sMin > 9 ? sMin : '0' + sMin;
    sSec = sSec > 9 ? sSec : '0' + sSec;
  }
  return `${sYear}${splitStr}${sMonth}${splitStr}${sDay} ${sHour}:${sMin}:${sSec}`;
};

// ------- xx大屏API -------

/**
 * @description get alarmTrend data
 * @logic request by zoneIds ;
 * @param {object} params zoneIds,startTime,endTime
 * @return void
 */
export const getAlarmTrend = params => {
  let cParams = {
    startTime: getTimeStr(new Date(new Date() - 1000 * 60 * 60 * 24 * 30)),
    endTime: getTimeStr(),
    mapIds: []
  };
  return axios.post(`${BASEURL}/alarm/getAlarmTrend`, Object.assign(cParams, params));
};

/**
 * @description get quality data
 * @logic request by zoneIds ;
 * @param {Array} params zoneIds
 * @return void
 */
export const getQualityRate = (params = []) => {
  return axios.post(`${BASEURL}/waterQuality/getQualityRate`, { mapIds: params });
};

/**
 * @description get pump house score data
 * @logic request by zoneIds ;
 * @param {Array} params zoneIds
 * @return void
 */
export const getScore = params => {
  let cParams = { mapIds: [] };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/score/getScore`, cParams);
};

/**
 * @description get plantAnalysis data
 * @logic  ;
 * @param
 * @return void
 */
export const plantAnalysis = params => {
  let cParams = {
    regulateStart: '2022-08-01',
    regulateEnd: '2022-08-08'
  };
  return axios.post(`${BASEURL}/peakWaterworks/peakAge`, Object.assign(cParams, params));
};

/**
 * @description get tankAnalysis data
 * @logic request by zoneIds ;
 * @param {Array} params zoneIds
 * @return void
 */
export const tankAnalysis = params => {
  let cParams = {
    mapIds: [],
    regulateStart: '2022-08-01',
    regulateEnd: '2022-08-08'
  };
  return axios.post(`${BASEURL}/peakWaterworks/tankAnalysis`, Object.assign(cParams, params));
};

/**
 * @description get getPumpHouseTypeCount data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getPumpHouseTypeCount = params => {
  let cParams = {
    mapIds: []
  };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/pumpHouse/pumpHouseNum`, cParams);
};

/**
 * @description get getOrgEnergyRank data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getOrgEnergyRank = params => {
  let cParams = {
    mapIds: []
  };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/energy/getOrgEnergyRank`, cParams);
};

/**
 * @description get getPumpHouseEnergyRank data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getPumpHouseEnergyRank = params => {
  let cParams = {
    mapIds: []
  };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/energy/getPumpHouseEnergyRank`, cParams);
};

/**
 * @description get getUnderPressureAnalysis data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getUnderPressureAnalysis = params => {
  let cParams = {
    mapIds: []
  };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/underPressure/getUnderPressureAnalysis`, cParams);
};

/**
 * @description get getUnderPressureAnalysis data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getFlowData = params => {
  let cParams = {
    mapIds: []
  };
  if (params && params.length > 0) cParams.mapIds = params;
  return axios.post(`${BASEURL}/energy/queryMonthFlowPowerPredict`, cParams);
};

/**
 * @description get mapAreaInfo data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return void
 */
export const getMapAreaInfo = id => {
  id = id ? id : 330200;
  return axios.get(`${BASEURL}/pumpHouse/getMapAreaInfo/${id}`);
};

/**
 * @description get getGraphUrlMap data
 * @logic request  ;
 * @return void
 */
export const getGraphUrlMap = () => {
  return axios.get(`${BASEURL}/home/getGraphUrlMap`);
};

// 组态
export function getSvgListByCondition(data) {
  return axios({
    url: BASEURL + '/svg/manager/getSvgListByCondition',
    method: 'post',
    data
  });
}

// 人员定位嵌入地址
export function getSafetyHelmetTokenUrl(data) {
  return axios({
    url: BASEURL + '/safetyHelmet/getTokenUrl',
    method: 'get',
    data
  });
}

// 根据code查询系统参数值
export function getByCode(data) {
  return axios({
    url: BASEURL + `/sysParam/getByCode/${data}`,
    method: 'get'
  });
}

/**
 * @description get getGraphUrlMap data
 * @logic request  ;
 * @return void
 */
export const getTemp = e => {
  return axios.get(
    `https://devapi.qweather.com/v7/weather/3d?key=3b917e717f184b80904d5b6218198f96&location=101220201&lang=zh`
  );
};

// 设备列表
export function getWaterPlants() {
  return axios.post(`${BASEURL}/waterPlantClient/getWaterPlants`);
}

// 天气情况
export const getWeather = () => {
  return axios({ url: `${TOKENURL}/weather/getWeather`, method: 'get' });
};

// 菜单管理
export const getMenuList = data => {
  return axios({ url: `${TOKENURL}/sysmenuClient/sysmenu/list`, method: 'post', data: data });
};

// 进水水质水量
export const getInletWater = parameter => {
  return axios({ url: `${BASEURL}/cockpit/getInletWater` + '/' + parameter, method: 'get' });
};

// 出水水质质量
export const getOutletWater = parameter => {
  return axios({ url: `${BASEURL}/cockpit/getOutletWater` + '/' + parameter, method: 'get' });
};

// 水质
export const getWaterQuality = date => {
  return axios({ url: `${BASEURL}/cockpit/waterQualityAnalysis?date=${date}`, method: 'get' });
};

// 维护及时率
export const getRepairTicket = () => {
  return axios({ url: `${BASEURL}/cockpit/repairTicketTypeAnalysis`, method: 'get' });
};

//水量统计
export const waterStatistics = parameter => {
  return axios({ url: `${BASEURL}/cockpit/flowTreatmentAnalysis/` + parameter, method: 'get' });
};

// 执行力管控
export const ticketAgingAnalysis = data => {
  return axios({ url: `${VUEAPPHOST}/main/outworkapi/ticketAgingAnalysis/basic`, method: 'post', data: data });
};

// 执行力管控
export const baseAnalysis = data => {
  return axios({ url: `${VUEAPPHOST}/main/outworkapi/ticketBaseAnalysis/baseAnalysis`, method: 'post', data: data });
};

// 执行力管控
export const getTemplateType = data => {
  return axios({ url: `${BASEURL}/ticket/getTemplateTypeSituation`, method: 'post', data: data });
};

// 安全评价
export const getSafetyEvaluation = parameter => {
  return axios({ url: `${BASEURL}/summaryOverview/getSafetyEvaluation/` + parameter, method: 'get' });
};

// 生产指标
export const productionIndex = data => {
  return axios({ url: `${BASEURL}/costAnalysis/getNewAllCost`, method: 'post', data });
};

// 排泥量曲线数据
export const getChemicalSludgeLine = data => {
  return axios({ url: `${BASEURL}/chemicalSludgeEntry/getChemicalSludgeLine`, method: 'post', data });
};

// 总览指标
export const overviewIndex = parameter => {
  return axios({ url: `${BASEURL}/summaryOverview/overviewIndex/` + parameter, method: 'get' });
};

// 总览指标
export const queryMaterialsAmount = () => {
  return axios({ url: `${BASEURL}/stock/queryMaterialsAmount`, method: 'get' });
};

//工单类型字典
export const getDict = data => {
  return axios({ url: `${BASEURL}/auth/allSysDict/${data}`, method: 'get' });
};

// 监控设备列表
export const getOneDevice = parameter => {
  return axios({
    url: `${BASEURL}/device/getOneDevice`,
    method: 'get',
    params: parameter
  });
};

// 查询视频列表
export const getVideoList = pumpHouseId => {
  return axios({
    url: `${BASEURL}/video/getVideoListByPumpHouseId/${pumpHouseId}`,
    method: 'get'
  });
};

// 生产监控
export const getISCHlsNoParse = (videoNo, protocol) => {
  return axios({
    url: `${DEVICEURL}/videoISC/getHlsUrlByVideoNo/?videoNo=${videoNo}&protocol=${protocol}`,
    method: 'get'
  });
};

// 分组查询报警数量
export const conditionQuery = data => {
  return axios({ url: `${BASEURL}/alarm/conditionQuery`, method: 'post', data });
};

// 系统参数
export const getSysParamByCode = code => {
  return axios({
    url: `${BASEURL}/sysParam/getByCode/${code}`,
    method: 'get'
  });
};

// 物资情况
export const getCountAnalysis = code => {
  return axios({
    url: `${BASEURL}/inoutMain/countAnalysis`,
    method: 'get'
  });
};
// 查询文件列表
export const getDataFileList = parameter => {
  return axios({
    url: `${BASEURL}/fileManage/getDataFileList`,
    method: 'post',
    params: parameter
  });
};

// 门禁视频
export const securityAnalysis = () => {
  return axios({
    url: `${BASEURL}/safetyCockpit/securityAnalysis`,
    method: 'get'
  });
};
