/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;

// 结果解析
function resultParse(res) {
  if (res && res.status === 'complete') {
    return res.resultData;
  } else {
    return Promise.reject(res);
  }
}

export const AllPumpHouse = parameter => {
  return axios({ url: BASEURL + '/home/allPumpHouse', method: 'post', data: parameter });
};

export const MapRealTimeData = parameter => {
  return axios({ url: BASEURL + '/home/getMapRealTimeData', method: 'post', data: parameter });
};

export const MapRealStatus = parameter => {
  return axios({ url: BASEURL + '/home/getMapRealStatus', method: 'post', data: parameter });
};

/* 查询地图数据 */
export function GetSiteList(data) {
  return axios({
    url: BASEURL + '/home/new/list',
    method: 'post',
    data,
    timeout: 60000
  }).then(resultParse);
}
