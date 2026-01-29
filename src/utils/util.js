import { set, get } from 'lodash';
import { Base64 } from 'js-base64';
import storage from '@/common/js/tool/storage';
export function setVideoState(path, data) {
  setTimeout(() => {
    let oldUserData = storage.get('user_info');
    let userInfo = oldUserData ? JSON.parse(Base64.decode(oldUserData)) : {};
    let oldData = storage.get('video_state');
    let videoState = oldData ? JSON.parse(oldData) : {};
    if (userInfo?.userId) {
      if (!videoState[userInfo.userId]) videoState[userInfo.userId] = {};
      set(videoState[userInfo.userId], path, data);
      storage.set('video_state', JSON.stringify(videoState));
    }
  }, 0);
}
/**
 * 将字符串中匹配正则表达式的部分用指定类名的 span 标签包裹
 * @param {string} str - 输入的字符串
 * @param {RegExp} reg - 用于匹配的正则表达式
 * @param {string} className - 包裹匹配部分的 span 标签的类名，默认为 'feature-str'
 * @returns {string} - 处理后的字符串
 */
export function featureStr(str, reg, className = 'feature-str') {
  // 检查输入参数是否合法
  if (typeof str !== 'string' || !(reg instanceof RegExp)) {
    throw new Error('输入参数必须为字符串和正则表达式');
  }

  let result = '';
  let lastIndex = 0;

  // 使用 exec 方法循环匹配正则表达式
  let match;
  while ((match = reg.exec(str)) !== null) {
    // 添加匹配前的普通字符串
    result += str.slice(lastIndex, match.index);
    // 添加匹配部分并用 span 标签包裹
    result += `<span class="${className}">${match[0]}</span>`;
    // 更新 lastIndex
    lastIndex = reg.lastIndex;
  }

  // 添加最后一个匹配之后的普通字符串
  result += str.slice(lastIndex);

  return result;
}

export function getVideoState() {
  let oldUserData = storage.get('user_info');
  let userInfo = oldUserData ? JSON.parse(Base64.decode(oldUserData)) : {};
  let oldData = storage.get('video_state');
  let videoState = oldData ? JSON.parse(oldData) : {};
  return videoState[userInfo?.userId] || {};
}
//筛选树

export function filterMenu(data, filter, filterType) {
  const traverse = data => {
    data.forEach(child => {
      child.visible = filterMethod(filter, child, filterType);
      if (child.children) traverse(child.children);
      if (!child.visible && child.children?.length) {
        let visible = !child.children.some(child => child.visible);
        child.visible = visible === false;
      }
    });
  };
  traverse(data);
  return filterDataByVisible(data);
}

//遍历树查找符合条件的子元素
export function findItemFromTree(treeData, id, key = 'value', child = 'children') {
  let targetObj = null;
  for (let index = 0; index < treeData.length; index += 1) {
    if (treeData[index][key] === id) {
      targetObj = treeData[index];
      break;
    }
    if (treeData[index][child] instanceof Array && treeData[index][child].length > 0) {
      const returnObj = findItemFromTree(treeData[index][child], id, key);
      if (returnObj) return returnObj;
    }
  }
  return targetObj && { ...targetObj };
}

//遍历树替换字段
export function cloneTreeByFields(list, treeData, config) {
  if (!config) return;
  let { replaceFields, childReplaceFields, showEmptyChild } = config;
  config.grade = typeof config.grade === 'number' ? config.grade + 1 : 0;
  if (!replaceFields) {
    replaceFields = {
      value: 'value',
      name: 'name'
    };
  }
  showEmptyChild = showEmptyChild ?? true;
  let originChildKey = childReplaceFields?.[0] || 'children';
  let targetChildKey = childReplaceFields?.[1] || 'children';
  treeData.forEach(item => {
    let cloneItem = {
      grade: config.grade
    };
    if (showEmptyChild || item?.[originChildKey]?.length) {
      cloneItem[targetChildKey] = [];
    }
    Object.keys(replaceFields).forEach(key => {
      cloneItem[replaceFields[key]] = item[key];
    });
    list.push(cloneItem);
    if (item?.[originChildKey]?.length) {
      cloneTreeByFields(cloneItem[targetChildKey], item[originChildKey], config);
    }
  });
}
// 根据传入的值进行数据匹配, 并返回匹配结果
function filterMethod(val, data, filterType) {
  return data[filterType].includes(val);
}

// 递归过滤符合条件的数据
function filterDataByVisible(data) {
  return data.filter(item => {
    if (item.children) {
      item.children = filterDataByVisible(item.children);
    }
    if (item.visible) {
      return true;
    }
  });
}
export function getWidthScale() {
  return Number((window.document.documentElement.clientWidth / 1920).toFixed(5));
}
export function getHeightScale() {
  return Number((window.document.documentElement.clientHeight / 1200).toFixed(5));
}
