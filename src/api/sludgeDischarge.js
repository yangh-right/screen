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

//排泥计划
export const sludgeDischargePlan = data => {
  return axios({
    url: `${BASEURL}/sludgeRecordInfo/sludgeDischargePlan`,
    method: 'post',
    data
  });
};

//获取污泥外运列表
export const sludgeRecordInfoList = data => {
  return axios({
    url: `${BASEURL}/sludgeRecordInfo/sludgeRecordInfoList`,
    method: 'post',
    data
  });
};
//获取排泥量
export const sludgeDischarge = data => {
  return axios({
    url: `${BASEURL}/sludgeRecordInfo/sludgeDischarge`,
    method: 'post',
    data
  });
};
//获取污泥浓度
export const queryPointHistoryData = data => {
  return axios({
    url: `${BASEURL}/cockpit/queryPointHistoryData`,
    method: 'post',
    data
  });
};