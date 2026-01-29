/*
 * @Author: wangyr
 * @Date: 2023-09-25 14:21:26
 * @LastEditors: Do not edit
 * @LastEditTime: 2023-09-26 14:28:24
 * @Description:
 */
import store from '@/vuex';

export function detectIE() {
  let ua = window.navigator.userAgent;

  // Test values; Uncomment to check result …

  // IE 10
  // ua = 'Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0)';

  // IE 11
  // ua = 'Mozilla/5.0 (Windows NT 6.3; Trident/7.0; rv:11.0) like Gecko';

  // Edge 12 (Spartan)
  // ua = 'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko)
  // Chrome/39.0.2171.71 Safari/537.36 Edge/12.0';

  // Edge 13
  // ua = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko)
  // Chrome/46.0.2486.0 Safari/537.36 Edge/13.10586';

  let msie = ua.indexOf('MSIE ');
  if (msie > 0) {
    // IE 10 or older => return version number
    return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
  }

  let trident = ua.indexOf('Trident/');
  if (trident > 0) {
    // IE 11 => return version number
    let rv = ua.indexOf('rv:');
    return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
  }

  let edge = ua.indexOf('Edge/');
  if (edge > 0) {
    // Edge (IE 12+) => return version number
    return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
  }

  // other browser
  return false;
}

export function isInIframe() {
  if (store.state.setting.isIFrame) {
    if (window.parent !== window) {
      return true;
    }
  }
}

// 解析经纬度
export function parseLngLat(lngLat) {
  return lngLat
    ? lngLat
        .split(',')
        .map(v => Number(v) || 0)
        .reverse()
    : null;
}

/** 处理泵房/水箱位置重叠 */
export function dealSameSites(list) {
  return list.map((item, i) => {
    let { lati, longi } = item;
    let arr = [
      [-0.0002, 0],
      [0.0002, 0],
      [0, 0.0002],
      [0, -0.0002],
      [0.00015, -0.00015],
      [0.00015, 0.00015],
      [-0.00015, 0.00015],
      [-0.00015, -0.00015]
    ];
    let sort = 0;
    list.forEach((r, idx) => {
      if (r.lati === lati && r.longi === longi && idx !== i) {
        if (arr[sort]) {
          r.lati = Number(r.lati) + arr[sort][0];
          r.longi = Number(r.longi) + arr[sort][1];
          sort++;
        }
      }
    });
    return item;
  });
}

/**
 * 格式化树
 * @param tree 源树数据
 * @param mapping 字段映射表，格式如：{id: 'id',name: 'data.name',list: {attr: 'currentList', mapping: {...}},children: {attr: 'childNodes', isChildren: true}}
 * @returns {{}}
 */
export function treeFormat(tree, mapping) {
  const isObject = val => Object.prototype.toString.call(val) === '[object Object]';
  const isArray = val => Object.prototype.toString.call(val) === '[object Array]';
  const formatter = function (item, mapping) {
    let _item = {};
    if (isObject(mapping)) {
      // 配置了映射表，按映射表映射
      Object.entries(mapping).forEach(([key, value]) => {
        if (isObject(value)) {
          // 对象，新增对象或子项迭代或子项属性映射
          if (value._raw) {
            let _mapping = { ...value };
            Reflect.deleteProperty(_mapping, '_raw');
            _item[key] = treeFormat(item, _mapping);
          } else if (value.isChildren) {
            _item[key] = treeFormat(item[value.attr], mapping);
          } else {
            _item[key] = treeFormat(item[value.attr], value.mapping);
          }
        } else if (typeof value === 'function') {
          // 函数，规则转换
          _item[key] = value(item);
        } else if (typeof value === 'boolean') {
          // 布尔，同名属性映射
          _item[key] = item[key];
        } else if (typeof value === 'string') {
          // 字符串，指定属性映射
          let distAttrs = value.split('.');
          let distItem = item;
          let distValue;

          if (distAttrs.length === 1) {
            distValue = distItem[distAttrs.shift()];
            return;
          }
          distItem = distItem[distAttrs.shift()];
          if (typeof distItem !== 'object') {
            return;
          }

          _item[key] = distValue;
        }
      });
    } else {
      // 否则不做处理
      _item = item;
    }
    return _item;
  };

  let _res;
  if (isArray(tree)) {
    _res = tree.map(item => formatter(item, mapping));
  } else if (isObject(tree)) {
    _res = formatter(tree, mapping);
  } else {
    _res = tree;
  }
  return _res;
}
