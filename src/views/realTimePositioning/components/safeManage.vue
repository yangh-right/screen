<!--
 * @Author: wangyr
 * @Date: 2023-05-30 13:40:08
 * @LastEditors: wangyr
 * @LastEditTime: 2024-12-10 14:25:04
 * @Description:
-->
<template>
  <div class="container">
    <div class="card-content">
      <personnel-wrist
        :tokenLogin="tokenLogin"
        :stationData="stationData"
        @viewTrajectory="viewTrajectory"
      ></personnel-wrist>
    </div>
  </div>
</template>

<script>
import personnelWrist from './personnelWrist.vue';
export default {
  name: 'safeManage',
  props: {
    stationData: {
      type: Array,
      default: () => []
    },
    tokenLogin: {
      type: String,
      default: ''
    }
  },
  components: { personnelWrist },
  data() {
    return {};
  },
  methods: {
    viewTrajectory(data) {
      this.$emit('viewTrajectory', data);
    }
  }
};
</script>

<style lang="less" scoped>
.container {
  width: 100%;
  height: 100%;
  position: relative;

  .card-content {
    width: 100%;
    height: 100%;
    position: relative;
  }
}
</style>
