/*
 * @Author: your name
 * @Date: 2022-03-07 09:14:49
 * @LastEditTime: 2024-03-22 14:29:32
 * @LastEditors: wangyr
 * @Description: 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 * @FilePath: \datascreen\src\common\js\tool\toolsMap.js
 */
/**
 * @DATE: 2019-12-19 11:19
 * @Version: 0.0.1
 * @Author: yunchangJia
 * @Description: 项目工具类 如有需要可以参照平台公共方法
 * @Update: 更新内容 by yunchangJia 2019-12-19 11:19
 */

 import Vue from 'vue';
 import SnowflakeId from 'snowflake-id';

/**
 * 获取环境变量
 * @param name
 * @returns {*}
 */
 export function getEnvVariable(name) {
  if (process.env.NODE_ENV === 'production') {
    return window?.apiconfig?.[name];
  }
  return process.env[`VUE_APP_${name}`] || process.env[name];
}

 /**
  * @description: 动态加载css
  * @param {*} url
  * @return {*}
  */
 export function loadCss(url) {
   let css = document.createElement('link');
   css.href = url;
   css.rel = 'stylesheet';
   css.type = 'text/css';
   document.head.appendChild(css);
 }

 /**
  * @description: 动态加载单一script
  * @param {*} src
  * @param {*} callback
  * @return {*}
  */
 export function loadSingleScript(src, callback) {
   let s = document.createElement('script');
   s.async = false;
   s.src = src;
   s.addEventListener(
     'load',
     function loadEvent(e) {
       s.parentNode.removeChild(s);
       s.removeEventListener('load', loadEvent, false);
       callback && callback();
     },
     false
   );
   document.body.appendChild(s);
 }

 /**
  * @description: 动态加载多个script
  * @param {*} list
  * @param {*} callback
  * @return {*}
  */
 export function loadScripts(list, callback) {
   let loaded = 0;
   let loadNext = () => {
     loadSingleScript(list[loaded], function () {
       loaded++;
       if (loaded >= list.length) {
         callback && callback();
       } else {
         loadNext();
       }
     });
   };
   loadNext();
 }

export function loadScript(url) {
  let script = document.createElement('script');
  script.setAttribute('type', 'text/javascript');
  script.setAttribute('src', url);
  let head = document.getElementsByTagName('head');
  if (head.length) {
    head[0].appendChild(script);
  } else {
    document.documentElement.appendChild(script);
  }
}

 /**
  * @description: 获取静态文件路径
  * @param {*}
  * @return {*}
  */
 export function getStaticPath() {
   let { PUBLICPATH } = getEnvVariable('VUE_APP_PUBLICPATH');
   return PUBLICPATH === undefined ? `/static` : `${PUBLICPATH}/static`;
 }

 export function uuid() {
   return new SnowflakeId();
 }
