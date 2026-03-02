<!--
 * @Author: your name
 * @Date: 2022-03-24 22:48:27
 * @LastEditTime: 2023-08-10 13:48:23
 * @LastEditors: Do not edit
 * @Description: 底部tab切换
 * @FilePath: \ergongscreen\src\views\utils\botTabModule.vue
-->
<template>
  <!-- 底部导航 -->
  <div class="content-wrapper">
    <div class="content-bar left-bar"></div>
    <div class="content-main">
      <slot></slot>
    </div>
    <div class="content-bar right-bar"></div>
  </div>
</template>

<script>
export default {
  name: 'ContentWrapper',
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.content-wrapper {
  width: 100%;
  height: 100%;
  overflow: hidden;
  position: relative;

  // 四周阴影效果
  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    box-shadow:
      inset 0 80px 60px -20px rgba(0, 20, 50, 0.8),
      inset 0 -80px 60px -20px rgba(0, 20, 50, 0.8);
    pointer-events: none;
    z-index: 50;
  }

  .content-main {
    width: 100%;
    height: 100%;
    overflow: hidden;
    padding: 0 10px;
    box-sizing: border-box;
  }

  .content-bar {
    position: absolute;
    top: 0;
    height: 100%;
    width: 28px;
    z-index: 99;
    pointer-events: none;

    &.left-bar {
      left: 0;
      background: url('~@/assets/lightimg/int/decoration_left.png') no-repeat;
      background-size: 100% 100%;
    }

    &.right-bar {
      right: 0;
      background: url('~@/assets/lightimg/int/decoration_right.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
