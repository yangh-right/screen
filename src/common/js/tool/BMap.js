/*
 * @version: 1.0.1
 * @Author: wang kai
 * @Date: 2020-07-27 08:53:37
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-17 10:19:26
 * @Description: 添加webgl类型判断
 * @Update: 更新内容
 */
export default function loadBMap(ak, mapType) {
  return new Promise(function (resolve, reject) {
    if (typeof window.BMap !== 'undefined' || typeof window.BMapGL !== 'undefined') {
      resolve(window.BMap || window.BMapGL);
      return true;
    }
    window.onBMapCallback = function () {
      resolve(window.BMap || window.BMapGL);
    };
    // let script = document.createElement('script');
    // script.type = 'text/javascript';
    // script.src =
    //   mapType === 'webgl'
    //     ? 'http://api.map.baidu.com/api?v=1.0&type=webgl&ak=' +
    //       ak +
    //       '&callback=onBMapCallback&s=' +
    //       new Date().getTime()
    //     : 'http://api.map.baidu.com/api?v=3.0&ak=' + ak + '&callback=onBMapCallback&s=' + new Date().getTime();
    // script.onerror = reject;
    // document.head.appendChild(script);
  });
}
