/*
 * @Description: api配置
 * @Author: zhangtianwen
 * @LastEditTime: 2022-03-24 15:29:07
 * @Update: 增加项目配置信息 by huhaiou 2020/4/16 5:29 PM
 */
/**
 * @description: 生产模式api地址
 */

// location.origin在ie中的兼容性处理
if (!window.location.origin) {
  window.location.origin =
    window.location.protocol +
    '//' +
    window.location.hostname +
    (window.location.port ? ':' + window.location.port : '');
}

// 项目接口有关配置信息--方便部署实施中直接修改服务器配置信息
var proProfile = {
  BASEURL: window.location.origin + '/bigPage',
  ak: 'uC5txC5bpV91ALbxaH0FLhVpRDPp8SEN',
  GISURL: window.location.origin + '/gisApi',
  ASSETSURL: window.location.origin,
  STATICURL: 'static'
};

// 项目配置信息--方便部署实施中直接修改系统某些参数
var projectConfig = {
  systemName: '广州市供水加压站调度中心',
  city: {
    // 天气插件设置，defaultIp: 按IP--1, 用设置的城市--0, code: 通过配置对应城市的天气插件中获得 参考网址http://tianqi.2345.com/plugin/
    name: '广州市',
    code: 440100,
    defaultIp: 0
  },
  videoOption: {
    layout: '1+8',
    intervalNum: 9,
    isAutoPage: true, // 是否自动轮播
    autoPageTime: 5 // 自动轮播时间，分钟
  },
  mapOption: {
    // 仅用来初始化地图中心位置和缩放比例，实际位置与比例在后台配置中设置
    center: [23.136665, 113.265105],
    zoom: 11,
    minZoom: 6,
    maxZoom: 18
  },
  isSimpleMap: false // 用来配置是否是简单地图 true仅地图 false地图及左右侧详细信息
};
