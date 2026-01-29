/**
 * @DATE: 2019-12-19 11:19
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 项目工具类 如有需要可以参照平台公共方法
 * @Update: 更新内容 by yunchangJia 2019-12-19 11:19
 */
let tools = {};

// 时间数值格式化
tools.timeNumberFormat = val => {
  return ('00' + val).slice(-2);
};

/**
 * 结果解析
 * @param res
 * @returns {Promise<never>|{loginName, userName, userId, token}}
 */
tools.resultParse = res => {
  if (res.data && res.data.status === 'complete') {
    return res.data.resultData;
  } else {
    // Vue.prototype.$message.error(res && res.data && res.data.errorMessage || '接口异常');
    return Promise.reject(res.data);
  }
};

export function createDefer(fn) {
  let _resolve;
  let _reject;
  const p = new Promise((resolve, reject) => {
    _resolve = resolve;
    _reject = reject;
    fn && fn(resolve, reject);
  });
  p.resolve = _resolve;
  p.reject = _reject;
  return p;
}

/**
 * 图表 series 添加默认样式
 * @param _baseSeries  带有样式的 series
 * @param seriesArry   后台返回的 option
 */
tools.seriesAddStyle = (_baseSeries, optionObj) => {
  Object.keys(optionObj).forEach(item => {
    if (optionObj[item].constructor === Object) {
      optionObj[item].series.forEach((v, i) => {
        optionObj[item].series[i] = tools.deepObjectMerge(JSON.parse(JSON.stringify(_baseSeries)), v);
      });
    }
  });
  return optionObj;
};

/**
 * 递归深拷贝
 * @param obj
 * @returns {*}
 */
tools.deepCopy = obj => {
  let newobj = null;
  if (typeof obj === 'object' && obj !== null) {
    newobj = obj instanceof Array ? [] : {};
    for (var i in obj) {
      newobj[i] = tools.deepCopy(obj[i]);
    }
  } else {
    newobj = obj;
  }
  return newobj;
};

tools.uuid = function uuid(len, radix) {
  var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');

  var uuid = [],
    i;

  radix = radix || chars.length;

  if (len) {
    // Compact form

    for (i = 0; i < len; i++) uuid[i] = chars[0 | (Math.random() * radix)];
  } else {
    // rfc4122, version 4 form

    var r;

    // rfc4122 requires these characters

    uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';

    uuid[14] = '4';

    // Fill in random data.  At i==19 set the high bits of clock sequence as

    // per rfc4122, sec. 4.1.5

    for (i = 0; i < 36; i++) {
      if (!uuid[i]) {
        r = 0 | (Math.random() * 16);

        uuid[i] = chars[i == 19 ? (r & 0x3) | 0x8 : r];
      }
    }
  }

  return uuid.join('');
};

/**
 * 合并对象
 * @param FirstOBJ
 * @param SecondOBJ
 * @returns {*}
 */
tools.deepObjectMerge = (FirstOBJ, SecondOBJ) => {
  for (var key in SecondOBJ) {
    FirstOBJ[key] =
      FirstOBJ[key] && FirstOBJ[key].toString() === '[object Object]'
        ? tools.deepObjectMerge(FirstOBJ[key], SecondOBJ[key])
        : (FirstOBJ[key] = SecondOBJ[key]);
  }
  return FirstOBJ;
};

// is object
export function isObject(object) {
  return Object.prototype.toString.call(object) === '[object Object]';
}

// is arguments
function isArguments(object) {
  return Object.prototype.toString.call(object) === '[object Arguments]';
}

export default tools;
