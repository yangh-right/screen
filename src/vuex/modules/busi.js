/**
 * 业务部分状态管理
 */

import { getPluginUrl, fetchDispalyType, getStatisticPointDetail, getSysDictUserClient } from '@/api/video';
import { videoEvent } from "./video";

const state = {
  aboutInfo: {}, // 关于
  searchList: {},
  southAdapterNum: 0, // 网关下行配置 从站数量用于读取实时数据
  drawingList: [],
  slicePath: "",
  gatewayFlag: false,
  accountIds: {},
  videoCodeList: [],
  // iot设备模板
  iotTempObj: {},
  // 行业设备模板
  industryTempObj: {},
  // 行业设备信息
  industryInfoObj: {},
  // iot设备信息
  iotInfoObj: {},
  // 对接门户
  originPath: "",
  // 视频门禁
  videoCode: "",
  // 用来停止video选择
  videoOperationDisabled: false,
  stopPlayDeviceIDs: "",
  pausedPlayingId: "",
  playingId: "",
  defaultVideoId: [],
  currentSelectedDevice: [],
  currentProductOnlineAll: [],
  videoDeviceOnline: "0",
  videoType: undefined,
  pluginDownLoadUrl: {},
  activeMediaPlugin: "2", // 分屏页面视频播放模式
  // 集中器
  concentratorObj: {},
  // 监测量类型列表
  pointTypeList: [],
  // 统计监测量信息
  statisticMonitorObj: {},
  // 监测量参数类型列表
  pointDisplayTypeList: [],
  // 坐标系
  coordinateType: "bd09",
  // 公共配置
  commonConfigs: [],
};

const busi = {
  namespaced: true,
  state,
  getters: {
    pointTypeList(state) {
      return state.pointTypeList;
    },
    statisticMonitorObj(state) {
      return state.statisticMonitorObj;
    },
    pointDisplayTypeList(state) {
      return state.pointDisplayTypeList;
    },
  },
  mutations: {
    disableOperationVideo: (state, data) => {
      state.videoOperationDisabled = data
    },
    setSearchList: (state, data) => {
      state.searchList = { ...JSON.parse(data) };
    },
    clearSearchList: (state) => {
      state.searchList = {};
    },

    setsouthAdapterNum(state, data) {
      state.southAdapterNum = data;
    },
    delsouthAdapterNum(state) {
      state.southAdapterNum = 0;
    },
    setDrawingList(state, drawingList) {
      state.drawingList = drawingList;
    },
    setGatewayFlag(state, gatewayFlag) {
      state.gatewayFlag = gatewayFlag;
    },
    setUpdateTab(state, slicePath) {
      state.slicePath = slicePath;
    },
    setAccountIds(state, ids) {
      state.accountIds = { ...ids };
    },
    setIotTempObj(state, obj) {
      state.iotTempObj = { ...obj };
    },
    setIndustryTempObj(state, obj) {
      state.industryTempObj = { ...obj };
    },
    setIndustryInfoObj(state, obj) {
      state.industryInfoObj = { ...obj };
    },
    setIotInfoObj(state, obj) {
      state.iotInfoObj = { ...obj };
    },
    setAboutInfo(state, obj) {
      state.aboutInfo = { ...obj };
    },
    setOriginPath(state, path) {
      state.originPath = path;
    },
    setVideoCode(state, code) {
      state.videoCode = code;
      videoEvent.$emit('playVideo', code)
    },
    setVideoCodeList(state, list) {
      state.videoCodeList = list;
      videoEvent.$emit('playVideoList', list)
    },
    // 发给video要暂停的id
    setStopPlayDeviceID(state, code) {
      state.stopPlayDeviceID = code;
      videoEvent.$emit('stopVideo', code)
    },
    setStopPlayDeviceIDs(state, code) {
      state.stopPlayDeviceIDs = code;
      videoEvent.$emit('stopVideos', code)
    },
    // 发给tree要暂停的id
    setPausedPlayingId(state, code) {
      videoEvent.$emit('unselectTree', code)
      state.pausedPlayingId = code
    },
    setPlayingId(state, code) {
      state.playingId = code;
    },
    setDefaultVideoId(state, code) {
      state.defaultVideoId = code;
    },
    setCurrentProductOnlineAll(state, data) {
      state.currentProductOnlineAll = data;
    },
    setCurrentSelectedDevice(state, data) {
      state.currentSelectedDevice = data;
    },
    setVideoDeviceOnline(state, value) {
      state.videoDeviceOnline = value;
    },
    setVideoType(state, videoType) {
      state.videoType = videoType;
    },
    setPluginDownLoadUrl(state, pluginDownLoadUrl) {
      state.pluginDownLoadUrl = pluginDownLoadUrl;
    },
    setActiveMediaPlugin(state, activeMediaPlugin) {
      state.activeMediaPlugin = activeMediaPlugin;
    },
    setStatisticMonitorObj(state, obj) {
      state.statisticMonitorObj = { ...obj };
    },
    setPointTypeList(state, data) {
      state.pointTypeList = data;
    },
    setPointDisplayTypeList(state, data) {
      state.pointDisplayTypeList = data;
    },

    setConcentratorObj(state, obj) {
      state.concentratorObj = { ...obj };
    },
    setGisCoordinateSystem(state, coordinateType) {
      state.coordinateType = coordinateType;
    },
    setSystemCommonConfig(state, commonConfigs) {
      state.commonConfigs = commonConfigs;
    },
  },
  actions: {
    setSearchList({ commit }, data) {
      commit("setSearchList", data);
    },
    clearSearchList({ commit }) {
      commit("clearSearchList");
    },
    setsouthAdapterNum({ commit }, data) {
      commit("setsouthAdapterNum", data);
    },
    delsouthAdapterNum({ commit }) {
      commit("delsouthAdapterNum");
    },
    setUpdateTab({ commit }) {
      commit("setUpdateTab");
    },
    setAccountIds({ commit }) {
      commit("setAccountIds");
    },
    setIotTempObj({ commit }) {
      commit("setIotTempObj");
    },
    setIndustryTempObj({ commit }) {
      commit("setIndustryTempObj");
    },
    setIndustryInfoObj({ commit }) {
      commit("setIndustryInfoObj");
    },
    setIotInfoObj({ commit }) {
      commit("setIotInfoObj");
    },
    setAboutInfo({ commit }, data) {
      commit("setAboutInfo", data);
    },
    setOriginPath({ commit }, path) {
      commit("setOriginPath", path);
    },
    async setPluginDownLoadUrl({ commit }) {
      const res = await getPluginUrl();
      const obj = {} ;
      res.forEach((item) => {
        obj[item.dictCode] = item;
      });
      commit("setPluginDownLoadUrl", obj);
    },
    async setStatisticMonitorObj({ commit }, obj) {
      let res = {};
      if (obj.id) {
        res = await getStatisticPointDetail(obj.id);
      }
      commit("setStatisticMonitorObj", { ...res, ...obj });
    },
    async setPointDisplayTypeList({ commit, state }) {
      if (state.pointDisplayTypeList.length) {
        return;
      }
      const res = await fetchDispalyType();
      const pointDisplayTypeList = (res || []).map((item) => {
        return {
          label: item.dictName,
          value: Number(item.dictValue),
        };
      });
      commit("setPointDisplayTypeList", pointDisplayTypeList);
    },
    async setGisCoordinateSystem({ commit }) {
      const [{ dictValue }] = await getSysDictUserClient("GisCoordinateSystem");
      commit("setGisCoordinateSystem", dictValue);
    },
    async setSystemCommonConfig({ commit }) {
      const commonConfigs = await getSysDictUserClient("common_config");
      commit("setSystemCommonConfig", commonConfigs);
      return commonConfigs;
    },
  },
};

export default busi;
