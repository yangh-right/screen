/*
 * @Description:
 * @Author: JianYue
 * @Date: 2024-09-18 16:58:01
 * @LastEditTime: 2024-10-28 14:40:44
 * @LastEditors: wangyr
 */
/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let ALARMURL = axiosConfig.ALARMURL;

//人员定位对接-登录
export const personLocationLogin = data => {
  return axios({
    url: `${BASEURL}/personLocation/auth/login?code=${data.code}&username=${data.username}`,
    method: 'post'
  });
};

//安全帽-登录
export const safetyHatLogin = data => {
  return axios({
    url: `${BASEURL}/personLocation/getSafetyHelmetHatToken?pwd=${data.pwd}&username=${data.username}`,
    method: 'post'
  });
};

// 安全帽-列表
export const getGroupUserList = data => {
  return axios({
    url: `${BASEURL}/personLocation/getGroupUserList?token=${data.token}&adminId=${data.adminId}&gId=${data.gId}`,
    method: 'post'
  });
};

// 安全帽-录音列表
export const getRecordList = data => {
  return axios({
    url: `${BASEURL}/personLocation/getRecordList?token=${data.token}&adminId=${data.adminId}&userId=${data.userId}&pageSize=${data.pageSize}`,
    method: 'post'
  });
};

// 安全帽-视频回放列表
export const getVideoList = data => {
  return axios({
    url: `${BASEURL}/personLocation/getVideoList?token=${data.token}&aminId=${data.aminId}&uid=${data.uid}&year=${data.year}&month=${data.month}&day=${data.day}`,
    method: 'post'
  });
};

//安全帽-文字转语音
export const broadcastToCat = data => {
  return axios({
    url: `${BASEURL}/personLocation/broadcastToCat?token=${data.token}&content=${data.content}`,
    method: 'post'
  });
};

//安全帽-上传录音文件
export const uploadVideo = data => {
  return axios({
    url: `${BASEURL}/personLocation/uploadVideo?token=${data.token}&FileName=${data.FileName}`,
    method: 'post',
    data: data.content
  });
};

//定位卡查询
export const personLocationCard = data => {
  return axios({
    url: `${BASEURL}/personLocation/card/data?token=${data}&pageSize=9999&pageNum=1`,
    method: 'post'
  });
};

//历史轨迹
export const personLocationHistory = data => {
  return axios({
    url: `${BASEURL}/personLocation/history?token=${data.token}&entityIds=${data.entityIds}&startTime=${data.startTime}&endTime=${data.endTime}`,
    method: 'post',
    data
  });
};

//实时定位
export const personLocationSnapshot = data => {
  return axios({
    url: `${BASEURL}/personLocation/snapshot?token=${data}`,
    method: 'post'
  });
};
