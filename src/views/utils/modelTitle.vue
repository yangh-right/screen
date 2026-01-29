<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:22:29
 * @LastEditTime: 2023-05-12 14:46:03
 * @LastEditors: Do not edit
 * @Description:
-->

<template>
  <div class="model_title">
    <i class="ico-circle"></i> {{ title }}
    <slot name="footer"></slot>
    <!-- <div class="moving_light"></div> -->
  </div>
</template>

<script>
export default {
  name: 'ModelTitle',
  props: {
    title: {
      type: String,
      require: true,
      default: ''
    }
  }
};
</script>

<style lang="less" scoped>
.model_title {
  position: relative;
  display: flex;
  width: 100%;
  height: 30px;
  padding-left: 8px;
  align-items: center;
  font-family: Pangy, sans-serif;

  font-size: 24px;
  color: #ffffff;

  .ico-circle {
    display: inline-block;
    width: 12px;
    height: 12px;
    margin-right: 10px;
    vertical-align: middle;
    background: url(~@assets/img/circle.png) no-repeat;
  }

  .moving_light {
    position: absolute;
    top: 0;
    left: 0;
    height: 30px;
    width: 79px;
    background: url(~@assets/img/c_title_light.png) no-repeat 0/100%;
    animation: left-to-right 3s linear 0.5s infinite forwards;
  }

  @keyframes left-to-right {
    0% {
      left: 0;
    }

    100% {
      left: calc(100% - 40px);
    }
  }
}
</style>
