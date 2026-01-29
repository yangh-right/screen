/*
 * @Author: wangyr
 * @Date: 2024-06-12 08:58:23
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-04 14:23:32
 * @Description:
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let VUEAPPHOST = axiosConfig.VUEAPPHOST;

// 天气预报
export const getWeather = () => {
  return axios({ url: BASEURL + '/weather/get', method: 'get' });
};

// 判断结论
export const predictionConclusion = data => {
  return axios({ url: BASEURL + '/summaryOverview/predictionConclusion', method: 'post', data });
};

//实时水质数据
export const middleRealData = parameter => {
  return axios({ url: BASEURL + '/cockpit/middleRealData/' + parameter, method: 'get' });
};
//沿程水质数据
export const processAnalysis = data => {
  return axios({ url: BASEURL + '/cockpit/processAnalysis', method: 'post', data });
};

// 变化趋势
export const getAppHistoryData = data => {
  return axios({ url: VUEAPPHOST + '/main/purificationApi/modelHistoryData/getHistoryData', method: 'post', data });
};

// 变化趋势btn
export const running_parameter = parameter => {
  return axios({
    url: VUEAPPHOST + '/main/purificationApi/pointConfig/getPointConfigByPointConfigCode/' + parameter,
    method: 'get'
  });
};

// 获取温测系统报警
export const getTemperatureAlarm = data => {
  return axios({
    url: VUEAPPHOST + '/main/purificationApi/temperatureMeasurement/getTemperatureAlarm',
    method: 'post',
    data
  });
};

//依据泵房id和监测量分组Code获取泵房的监测量配置列表
export const getPointConfigsByPumpHouseIdAndGroupType = data => {
  return axios({ url: BASEURL + '/pointConfig/getPointConfigsByPumpHouseIdAndGroupType', method: 'post', data });
};

//进水
export const queryList = data => {
  return axios({ url: BASEURL + '/solution/queryList', method: 'post', data });
};

//进水
export const modelEvaluation = data => {
  return axios({ url: BASEURL + '/processSimulation/modelEvaluation', method: 'post', data });
};

// 预测模型评价
export const getForecastModelEvaluation = parameter => {
  return axios({
    url: BASEURL + `/comeWaterForecast/getForecastModelEvaluation/${parameter}`,
    method: 'post'
  });
};
// 获取温测列表数据
export const getTemperatureMeasurementPage = data => {
  return axios({
    url: VUEAPPHOST + '/main/purificationApi/temperatureMeasurement/getTemperatureMeasurementPage',
    method: 'post',
    data
  });
};
