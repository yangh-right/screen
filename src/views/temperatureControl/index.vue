<!--
 * @Description:
 * @Author: JianYue
 * @Date: 2024-06-17 14:58:31
 * @LastEditTime: 2024-07-04 14:06:56
 * @LastEditors:  Do not edit
-->
<template>
  <div class="main-page">
    <div class="center-side-wrap">
      <div class="iframeBox">
        <iframe
          :src="svgPreviewUrl"
          allowfullscreen
          title=""
          allow="microphone;camera;midi;encrypted-media;"
          v-if="true"
        ></iframe>
      </div>
    </div>
  </div>
</template>
<script>
import { getByCode } from '@/api/mainPage';
export default {
  name: 'monitorManage',
  data() {
    return {
      svgPreviewUrl: undefined
    };
  },
  mounted() {
    this.getSafetyHelmet();
  },
  methods: {
    async getSafetyHelmet() {
      let { resultData, status } = await getByCode('temperature_control_url');
      if (status === 'complete') {
        this.svgPreviewUrl = resultData;
      }
    }
  }
};
</script>
<style lang="less" scoped>
.main-page {
  width: 100%;
  height: 100%;
  position: relative;

  // 中间组态
  .center-side-wrap {
    // position: fixed;
    // left: 0px;
    width: 100%;
    height: 100%;
    z-index: 1;
    // bottom: 0;
    right: 0;
    display: flex;
    justify-content: center;
    // align-content: end;
    // align-items: end;
    top: 0px;
    background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
    background-size: 100% 100%;

    position: relative;
    .iframeBox > iframe {
      width: 100%;
      height: 100%;
    }
    .iframeBox {
      // background: url('~@/assets/img/hz/screen-bg.png') no-repeat;
      // background-size: 100% 100%;

      width: 100%;
      margin-top: 100px;
    }
    .bg-iframe {
      width: 70%;
      height: 60%;
      margin-top: 15%;
      margin-left: 13%;
      position: relative;
      background: url('~@/assets/img/hz/bg-iframe.png') no-repeat;
      background-size: 100% 100%;

      .device-box {
        width: 129px;
        height: 72px;
        background: url('~@/assets/img/hz/p-popup.png') no-repeat;
        background-size: 100% 100%;
        position: absolute;
        left: 0;
        top: 0;
      }
    }
  }
}
</style>
