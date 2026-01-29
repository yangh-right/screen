<!--
 * @Author: limz
 * @Date: 2022-07-12 16:07:21
 * @LastEditors: yuan wenyu
 * @LastEditTime: 2023-09-11 09:46:30
 * @Description: popup
-->
<template>
  <div class="site-marker">
    <img :src="isShowPopup ? activeIcon : defaultIcon" class="site-marker__icon" />
  </div>
</template>

<script>
let defaultIcon = require('@/assets/img/hz/station.png');
let activeIcon = require('@/assets/img/hz/station_active.png');
export default {
  name: 'SiteMarker',
  computed: {},
  data() {
    return {
      defaultIcon,
      activeIcon
    };
  },
  mounted() {}
};
</script>

<style lang="less" scoped>
.site-marker {
  width: 28px;
  &__icon {
    width: 28px;
    -webkit-user-drag: none;
  }
}
</style>
