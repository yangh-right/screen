<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2024-06-17 14:58:31
 * @LastEditTime: 2024-10-09 09:40:42
 * @LastEditors: wangyr
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
import storage from '@/common/js/tool/storage';
export default {
  name: 'temperatureSystem',
  data() {
    return {
      svgPreviewUrl: ''
    };
  },
  mounted() {
    this.getUrlMap();
  },
  methods: {
    async getUrlMap() {
      let user = JSON.parse(storage.get('user_info'));
      let token = user.accessToken.replace('Bearer ', '');

      // 获取当前浏览器的主机地址和端口
      const currentHost = window.location.host;
      const protocol = window.location.protocol;

      // 构建跟随浏览器的URL
      this.svgPreviewUrl = `${protocol}//${currentHost}/wpg-digital-twin/#/sewageTwin?token=${token}&parent=${window.origin}`;
    }
  }
};
</script>
<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;

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
    }
  }
}
</style>
