/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-12-10 11:43:48
 * @LastEditTime: 2022-09-01 15:46:28
 * @LastEditors: 史磊
 */

/* 引入 axios 配置文件 */
import axiosConfig from './axiosConfig';
let axios = Object.assign(axiosConfig.axios);
let BASEURL = axiosConfig.BASEURL;
let iDay = 60 * 1000 * 60 * 24;

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
    if (isAll) {
        sMonth = sMonth > 9 ? sMonth : '0' + sMonth;
        sDay = sDay > 9 ? sDay : '0' + sDay;
    }
    return `${sYear}${splitStr}${sMonth}${splitStr}${sDay}`;
};

// ------- xx大屏API -------

/**
 * @description get RepairQuestionList data
 * @logic
 * @param 
 * @return {Promise}
 */
export const getRepairQuestionList = () => {
    return axios.get(`${BASEURL}/repairQuestion/getRepairQuestionList`);
};

/**
 * @description get getOrgEnergyRank data
 * @logic request by mapIds ;
 * @param {Array} params mapIds
 * @return {Promise}
 */
export const getTank = params => {
    let cParams = {
        lifeDays: [0, 1, 2, 3],
        page: { "current": 1, "size": 30 }
    };
    return axios.post(`${BASEURL}/pumpHouseTank/getPage`, Object.assign({}, cParams, params));
};

/**
 * @description 工单日历接口
 * @logic request by date ;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const getTicketCalendar = params => {
    let startTime = new Date(new Date() - iDay * 21);
    let cParams = {
        startDate: getTimeStr(startTime),
        endDate: getTimeStr()
    };
    return axios.post(`${BASEURL}/ticket/getTicketCalendar`, Object.assign({}, cParams, params));
};

/**
 * @description 工单统计模块接口：
 * @logic request by date ;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const workOrderAnalysis = params => {
    let startTime = new Date(new Date() - iDay * 30);
    let cParams = {
        startDate: getTimeStr(startTime),
        endDate: getTimeStr()
    };
    return axios.post(`${BASEURL}/ticket/workOrderAnalysis`, Object.assign({}, cParams, params));
};

/**
 * @description 各类型的工单完成率接口：
 * @logic request by date ;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const getTypeStatistic = params => {
    let startTime = new Date(new Date() - iDay * 30);
    let cParams = {
        startDate: getTimeStr(startTime),
        endDate: getTimeStr()
    };
    return axios.post(`${BASEURL}/ticket/getTypeStatistic`, Object.assign({}, cParams, params));
};

/**
 * @description 获取组织运维划进度接口：
 * @logic request by date ;
 * @param {Object} params st计artTime,endTime
 * @return {Promise}
 */
export const getOrgOpsSchedule = params => {
    let startTime = new Date(new Date() - iDay * 30);
    let cParams = {
        startDate: getTimeStr(startTime),
        endDate: getTimeStr()
    };
    return axios.post(`${BASEURL}/ticket/getOrgOpsSchedule`, Object.assign({}, cParams, params));
};

/**
 * @description 获取组织运维计划进度接口：
 * @logic request by date ,type ,page option;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const getAlarmPage = params => {
    let startDate = new Date(new Date() - iDay * 30);
    let cParams = {
        status: "1",
        currentPage: 0,
        pageSize: 2,
        startTime: getTimeStr(startDate),
        endTime: getTimeStr()
    };
    return axios.post(`${BASEURL}/alarm/getAlarmPage`, Object.assign({}, cParams, params));
};

/**
 * @description 获取工单类型时长分布接口：
 * @logic request by date ;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const getTicketDurationTime = params => {
    let startTime = new Date(new Date() - iDay * 30);
    let cParams = {
        startDate: getTimeStr(startTime),
        endDate: getTimeStr()
    };
    return axios.post(`${BASEURL}/ticket/getTicketDurationTime`, Object.assign({}, cParams, params));
};

/**
 * @description 获取运维地图接口：
 * @logic request by date ;
 * @param {Object} params startTime,endTime
 * @return {Promise}
 */
export const getGraphUrlOperationMap = () => {
    return axios.get(`${BASEURL}/home/getGraphUrlOperationMap`);
};