/*
 * @Author: yuan wenyu
 * @Version: 1.0.1
 * @Date: 2024-01-22 09:55:45
 * @LastEditors: wangyr
 * @LastEditTime: 2024-09-21 10:33:20
 * @Description:
 */
// 文件导出
export function exportFile(data, filename, ext = 'xlsx') {
  // xls
  // console.log("exportFile data", data);
  const blob = new Blob([data]);
  if (window.navigator.msSaveBlob) {
    try {
      // ie浏览器自带下载文件的方法
      window.navigator.msSaveBlob(data, filename);
    } catch (e) {
      // console.log(e);
    }
  } else {
    const elink = document.createElement('a');
    elink.download = `${filename}.${ext}`;
    elink.style.display = 'none';

    const href = window.URL.createObjectURL(blob);
    elink.href = href;

    document.body.appendChild(elink);
    elink.click();

    document.body.removeChild(elink);
    window.URL.revokeObjectURL(href); // 释放掉blob对象
  }
}
export function sleep(ms) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(undefined);
    }, ms);
  });
}

export function getWidthScale() {
  return Number((window.document.documentElement.clientWidth / 1920).toFixed(5));
}
export function getHeightScale() {
  return Number((window.document.documentElement.clientHeight / 1200).toFixed(5));
}
