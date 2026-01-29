/*
 * @Description: 请输入....
 * @Author: huhaiou
 * @Date: 2021-11-25 16:35:10
 * @LastEditTime: 2021-12-28 08:58:52
 * @LastEditors: huhaiou
 */
const baseSize = 24 // 基准大小
/* eslint-disable */
let pageScale = 1 // 页面缩放比例--用来将缩放后的Echart图表等内容还原
const width = 3840, height = 2160;   // 设计稿分辨率

/**
 * 设置 rem 函数
 */
function setRem() {
  let pageWidth = document.documentElement.clientWidth,
    pageHeight = document.documentElement.clientHeight
  let scale
  if (window.location.hash.indexOf('#/leftPart') > -1 || window.location.hash.indexOf('#/rightPart') > -1) {
    // 多个模块页面构成的大屏设置它的页面大小为5760 * 3240，再按此大小缩放
    document.documentElement.style.width = pageWidth = width * 2 + 'px'
    document.documentElement.style.height = pageHeight = height * 2 + 'px'
    /* 当前页面宽度相对于5760 宽的缩放比例 */
    scale = document.documentElement.clientWidth / (width * 2)
    /* 设置页面根节点字体大小 scale大于1时，让字体不要过大*/
    // document.documentElement.style.fontSize = baseSize * scale.toFixed(2) + 'px';
    document.documentElement.style.fontSize = baseSize + 'px';
  // } else if (window.location.hash.indexOf('#/login') > -1 || window.location.hash.indexOf('#/controlboard') > -1) {
  //   scale = 1
  //   //document.documentElement.style.fontSize = baseSize + 'px';
  } else {
    document.documentElement.style.width = pageWidth = width + 'px'
    document.documentElement.style.height = pageHeight = height + 'px'
    /* 当前页面宽度相对于 1920 宽的缩放比例 */
    scale = document.documentElement.clientWidth / width
    /* 设置页面根节点字体大小 scale大于1时，让字体不要过大*/
    document.documentElement.style.fontSize = baseSize + 'px';
    // document.documentElement.style.fontSize =
    //   scale > 1 ? baseSize + 'px' : baseSize * scale.toFixed(2) + 'px';
  }

  document.documentElement.style.zoom = scale
  /* eslint-disable */
  pageScale = (1 / scale).toFixed(2)
  if (navigator.userAgent.indexOf('Firefox') > -1) {
    document.documentElement.style.MozTransform = 'scale(' + scale + ')'
    document.documentElement.style.MozTransformOrigin = 'top left'
    document.documentElement.style.fontSize = baseSize + 'px'
  }
}
/* 初始化设置 rem*/
setRem()
/* 改变窗口大小时重新设置 rem */
window.onresize = function() {
  setRem()
}

export default setRem
