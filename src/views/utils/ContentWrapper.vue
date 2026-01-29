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
  display: flex;
  .content-main {
    flex: 1;
    height: calc(100% - 140px);
    margin-top: 90px;
    overflow: hidden;
  }
  .content-bar {
    height: 100%;
    width: 28px;
    &.left-bar {
      background: url('~@/assets/img/hz/left_bar.png') no-repeat;
      background-size: 100% 100%;
    }
    &.right-bar {
      background: url('~@/assets/img/hz/right_bar.png') no-repeat;
      background-size: 100% 100%;
    }
  }
}
</style>
