/*
 * @Author: wangyr
 * @Date: 2023-09-28 11:06:32
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-21 10:21:54
 * @Description:
 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
const deviceApi = axiosConfig.DEVICEURL;
function resultParse(res) {
  if (res && res.status === 'complete') {
    return Promise.resolve(res.resultData);
  } else {
      return Promise.reject(res);
  }
}
function resParse(res) {
  return Promise.resolve({data: res});
}
export const getHlsUrlByVideoNo = parameter => {
  return axios({
    baseURL:deviceApi,
    url: `/videoISC/getHlsUrlByVideoNo/?videoNo=${parameter.videoId}&protocol=${parameter.protocal}`,
    method: 'get',
    data: parameter
  }).then(resultParse);
};

// 视频树
export const getLocationVideoTree = parameter => {
  return axios({
    baseURL:deviceApi,
    url: `/DsDeviceVideo/queryVideoTree`,
    method: 'post',
    data: parameter
  }).then(resParse);
};
export const getBackVideoId = videoId => {
  return axios({
    baseURL:deviceApi,
    url: `/DsDeviceVideClient/getDetailByVideoId?videoId=${videoId}`,
    method: 'get',
  })
};
//  多屏设备list
export const getMultiScreenList = (params) => {
  if (params.videoGroupId) {
    return axios({
      baseURL:deviceApi,
      url: `/DsVideoGroup/queryVideoGroupDeviceTreeList`,
      method: 'post',
      data: params
    }).then(resParse);
  } else {
    return axios({
      baseURL:deviceApi,
      url: `/DsDeviceVideo/treeList`,
      method: 'post',
      data: params
    }).then(resParse);
  }
};
// 根据视频分组id和插件类型，查询视频类型
export const getVideoTypeByGroupAndPlayType = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/DsVideoGroup/getVideoTypeByVideoGroupAndPlayType`,
    method: 'post',
    data: params
  }).then(resultParse);
};
//  多屏设备树
export const getVideoTree = (params) => {
  if (params.videoGroupId) {
    return axios({
      baseURL:deviceApi,
      url: `/DsVideoGroup/queryVideoGroupDeviceTree`,
      method: 'post',
      data: params
    }).then(resultParse);
  } else {
    return axios({
      baseURL:deviceApi,
      url: `/DsDeviceVideo/queryVideoTree`,
      method: 'post',
      data: params
    }).then(resultParse);
  }
};
export const getISCHlsNoParse = (videoNo, protocol) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoISC/getHlsUrlByVideoNo/?videoNo=${videoNo}&protocol=${protocol}`,
    method: 'get',
  }).then(resParse)
};
export const getYSISCVideoLive = (videoNo, protocol) => {
  return axios({
    baseURL:deviceApi,
    url: `/YSVideoISC/getYSISCUrlByVideoNo?videoNo=${videoNo}&protocol=${protocol}`,
    method: 'get',
  }).then(resParse)
};
export const getYushiVideoMode = () => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/getYushiVideoMode`,
    method: 'get',
  }).then(resultParse)
};
export const getXmlBack = (videoNo) => {
  return axios({
    baseURL:deviceApi,
    url: `/video8700/getBackResouseByCode/${videoNo}`,
    method: 'get',
  }).then(resultParse)
};
export const getXmlLive = (videoNo) => {
  return axios({
    baseURL:deviceApi,
    url: `/video8700/getResouseByCode/${videoNo}`,
    method: 'get',
  }).then(resultParse)
};
export const getYSISCVideoBack = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/YSVideoISC/getYSISCPlaybackUrlByVideoNo`,
    data: params,
    method: 'post',
  }).then(resParse)
};
export const getVideoBKHKNoParse = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoBKHK/bkLiveVideo`,
    data: params,
    method: 'post',
  }).then(resParse)
};
export const getVideoBKHKBackUrlNoParse = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoBKHK/bkhkGetPlayBackUrl`,
    data: params,
    method: 'post',
  }).then(resParse)
};

export const setPlayTimeBKHK = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoBKHK/setPlayTime`,
    data: params,
    method: 'post',
  }).then(resParse)
};
export const getdahua8900GetDevicePlayBackUrl = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/dahua8900GetDevicePlayBackUrl`,
    data: params,
    method: 'post',
  }).then(resParse)
};
export const getPlaybackHlsNoParse = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoISC/getHlsPlaybackUrlByVideoNo`,
    data: params,
    method: 'post',
  }).then(resParse)
};
/**
 * 数据字典
 */
export const getSysDictUserClient = (sysDictCode) => {
  return axios({
    baseURL:deviceApi,
    url: `/sysUser/userClient/sysDict?sysDictCode=${sysDictCode}`,
    method: 'post',
  }).then(resultParse);
};
export const getJinanHlsLive = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/jinanGetHlsUrlByVideoId`,
    method: 'post',
    data: params
  }).then(resParse);
};

// 分组下拉框-列表
export const getVideoGroupSelect = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/DsVideoGroup/getVideoGroupSelect`,
    method: 'post',
    data: params
  }).then(resultParse);
};
export const getDahua8900Live = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/dahua8900GetStartUrlByVideoId`,
    method: 'post',
    data: params
  }).then(resParse);
};
export const getDaHuaHLSVideoLive = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/dahua506GetStartHlsUrlByVideoId`,
    method: 'post',
    data: params
  }).then(resParse);
};
export const getConfigByVideoId = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/getConfigByVideoIdAndType`,
    method: 'post',
    data: params
  }).then(resultParse);
};
export const get8700HlsNoParse = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/video8700/getPreviewUrlById`,
    method: 'post',
    data: params
  }).then(resParse)
};
export const closeVideoBKHK = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoBKHK/closeVideo`,
    method: 'post',
    data: params
  }).then(resParse)
};
export const getDaHuaHLSVideoBack = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoPlayer/dahua506GetPlayBackUrlHls`,
    method: 'post',
    data: params
  }).then(resParse);
};

// 详情
export const getStatisticPointDetail = (id) => {
  return axios({
    baseURL:deviceApi,
    url: `/statistic/point/${id}`,
    method: 'get'
  }).then(resultParse);
};
export const getYSISCConf = (videoNo) => {
  return axios({
    baseURL:deviceApi,
    url: `/YSVideoISC/getYSISCConfByVideoNo?videoNo=${videoNo}`,
    method: 'get'
  }).then(resultParse);
};
export const getISCConf = (videoNo) => {
  return axios({
    baseURL:deviceApi,
    url: `/videoISC/getISCConfByVideoNo?videoNo=${videoNo}`,
    method: 'get'
  }).then(resultParse);
};
export const fetchDispalyType = (params) => {
  return axios({
    baseURL:deviceApi,
    url: `/SysDict/listPointDisplayType`,
    method: 'get',
    data: params
  }).then(resultParse);
};
// 获取所有播放插件下载地址
export const getPluginUrl = () => {
  return axios({
    baseURL:deviceApi,
    url: `/SysDict/listHKPlayerUrl`,
    method: 'get',
  }).then(resultParse);
};
