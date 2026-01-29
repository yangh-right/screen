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

// 查询报警历史数据  POST
export const getLeaderCockpitCard = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/getLeaderCockpitCard', method: 'post' });
};

// 工单分析  POST
export const ticketAnalysisReport = data => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/reportForm/ticketAnalysisReport', method: 'post', data });
};

// 近30日每日办结工单趋势  POST
export const nearLyThirtyDaysTicketTrend = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/nearLyThirtyDaysTicketTrend', method: 'post' });
};

// 当日工单创建办结趋势  POST
export const todayTicketCreateOrDoneTrend = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/todayTicketCreateOrDoneTrend', method: 'post' });
};

// 当前人员正在处理工单排名  POST
export const currentPersonnelDealRankingList = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/currentPersonnelDealRankingList', method: 'post' });
};

// 处理中工单类型占比  POST
export const doingTicketTypeRatio = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/doingTicketTypeRatio', method: 'post' });
};

// 工单优先级占比  POST
export const doingTicketPriorityRatio = () => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/leaderCockpit/doingTicketPriorityRatio', method: 'post' });
};

// 新增工单趋势分析  POST
export const newTicketLineChart = data => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/ticketBaseAnalysis/newTicketLineChart', method: 'post' ,data});
};

// 人员超时率前十名  POST
export const timeoutPerson = data => {
  return axios({ url: VUEAPPHOST + '/main/outworkapi/ticketAgingAnalysis/timeout/person', method: 'post' ,data});
};
