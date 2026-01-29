<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-21 14:17:19
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <kpi-alasysis
      title="学历占比"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
      :waterPlantId="waterPlantId"
    />
    <device-manage-type
      title="人格测试"
      :class="[showStage ? 'two' : 'twoOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import KpiAlasysis from '../components/KpiAlasysis.vue';
import DeviceManageType from '../components/DeviceManageType.vue';

export default {
  name: 'ThinkPanel',
  components: {
    KpiAlasysis,
    DeviceManageType
  },
  props: {
    showStage: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {
      info: {
        profile: null,
        area: [],
        house: []
      }
    };
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  }
};
</script>

<style lang="less" scoped>
.right_panel {
  height: 100%;
  width: 452px;
  display: flex;
  flex-direction: column;
  background: #040c21;
  padding: 12px 9px 12px 2px;
  box-sizing: border-box;
  background-size: 100% 100%;
  position: relative;

  > div {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 12px 0 0;
    box-sizing: border-box;
  }

  .water-module {
    height: 320px;
  }
  .medicine-module {
    height: calc(100% - 320px);
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
.in {
  animation: right-to-left 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.out {
  right: 0;
  animation: right-to-left-hide 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.one:extend(.in),
.oneOut:extend(.out) {
  animation-delay: 0s;
}

.two:extend(.in),
.twoOut:extend(.out) {
  animation-delay: 0.25s;
}

.three:extend(.in),
.threeOut:extend(.out) {
  animation-delay: 0.5s;
}

.four:extend(.in),
.fourOut:extend(.out) {
  animation-delay: 0.75s;
}

@keyframes right-to-left {
  from {
    right: -486px;
  }
  to {
    right: 0;
  }
}

@keyframes right-to-left-hide {
  from {
    right: 0;
  }
  to {
    right: -486px;
  }
}
</style>
