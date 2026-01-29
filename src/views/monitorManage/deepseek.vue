<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2024-06-17 14:58:31
 * @LastEditTime: 2024-06-17 15:45:05
 * @LastEditors:  Do not edit
-->
<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <iframe :src="svgPreviewUrl" allowfullscreen title="" allow="microphone;camera;midi;encrypted-media;"></iframe>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'deepseek',
  data() {
    return {
      svgPreviewUrl: 'http://192.168.0.17:8212/'
    };
  }
};
</script>
<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;

  /* 中间组态 */
  .center-side-wrap {
    width: 100%;
    height: 100%;
    z-index: 1;
    right: 0;
    display: flex;
    justify-content: center;
    top: 0px;
    background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
    background-size: 100% 100%;

    position: relative;
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      width: 100%;
      margin-top: 100px;
    }
  }
}
</style>
