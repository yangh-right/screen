/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2023-09-09 16:31:00
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2023-09-11 09:33:16
 * @Description:
 */
import Vue from 'vue';
import SitePopup from './sitePopup.vue';
import SiteMarker from './siteMarker.vue';

export const GB = {
  sitePopupConstructor: Vue.extend(SitePopup),
  siteMarkerConstructor: Vue.extend(SiteMarker)
};

export function AddPopup(PopupCtor, popupProps, that) {
  const instance = new PopupCtor({
    parent: that,
    data() {
      return {
        ...popupProps
      };
    },
    methods: {}
  });
  const el = instance.$mount().$el;
  return el;
}

// 百度坐标转换为WGS84坐标
export function bd09towgs84(bd_lon, bd_lat) {
  // 百度坐标转GCJ02
  const x_pi = (3.141592653 * 3000.0) / 180.0;
  const x = bd_lon - 0.0065;
  const y = bd_lat - 0.006;
  const z = Math.sqrt(x * x + y * y) - 0.00002 * Math.sin(y * x_pi);
  const theta = Math.atan2(y, x) - 0.000003 * Math.cos(x * x_pi);
  const gcj_lon = z * Math.cos(theta);
  const gcj_lat = z * Math.sin(theta);

  // GCJ02转WGS84
  const PI = 3.141592653;
  const ee = 0.006693421;
  const a = 6378245.0;

  function transformLat(x, y) {
    let ret = -100.0 + 2.0 * x + 3.0 * y + 0.2 * y * y + 0.1 * x * y + 0.2 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(y * PI) + 40.0 * Math.sin((y / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((160.0 * Math.sin((y / 12.0) * PI) + 320 * Math.sin((y * PI) / 30.0)) * 2.0) / 3.0;
    return ret;
  }

  function transformLon(x, y) {
    let ret = 300.0 + x + 2.0 * y + 0.1 * x * x + 0.1 * x * y + 0.1 * Math.sqrt(Math.abs(x));
    ret += ((20.0 * Math.sin(6.0 * x * PI) + 20.0 * Math.sin(2.0 * x * PI)) * 2.0) / 3.0;
    ret += ((20.0 * Math.sin(x * PI) + 40.0 * Math.sin((x / 3.0) * PI)) * 2.0) / 3.0;
    ret += ((150.0 * Math.sin((x / 12.0) * PI) + 300.0 * Math.sin((x / 30.0) * PI)) * 2.0) / 3.0;
    return ret;
  }

  const dLat = transformLat(gcj_lon - 105.0, gcj_lat - 35.0);
  const dLon = transformLon(gcj_lon - 105.0, gcj_lat - 35.0);
  const radLat = (gcj_lat / 180.0) * PI;
  let magic = Math.sin(radLat);
  magic = 1 - ee * magic * magic;
  const sqrtMagic = Math.sqrt(magic);
  const wgs_lat = gcj_lat - (dLat * 180.0) / (((a * (1 - ee)) / (magic * sqrtMagic)) * PI);
  const wgs_lon = gcj_lon - (dLon * 180.0) / ((a / sqrtMagic) * Math.cos(radLat) * PI);

  return [wgs_lon, wgs_lat];
}
