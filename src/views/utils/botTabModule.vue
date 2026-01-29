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
  <div class="map-otherPages">
    <div class="botTab"></div>
  </div>
</template>

<script>
export default {
  name: 'BotTabModule',
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.map-otherPages {
  position: fixed;
  bottom: 0px;
  z-index: 7;
  width: calc(100%);
  display: flex;
  align-items: flex-end;
  flex-direction: column;

  .botTab {
    width: 100%;
    height: 50px;
    background: url('~@/assets/img/footer.png') no-repeat center bottom/100%;
  }
}
</style>
