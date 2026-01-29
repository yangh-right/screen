<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-08-21 14:28:54
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'left_panel']">
    <water-statistics
      title="厂区环境监测"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      :waterPlantId="waterPlantId"
    />
    <out-water-quality
      title="厂区安全概况"
      :class="[showStage ? 'two' : 'twoOut', 'outwater-module']"
      :waterPlantId="waterPlantId"
    />
    <production-targets
      title="安全报警分析"
      :class="[showStage ? 'three' : 'threeOut', 'production-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WaterStatistics from '../components/WaterStatistics.vue';
import OutWaterQuality from '../components/OutWaterQuality.vue';
import ProductionTargets from '../components/ProductionTargets.vue';
export default {
  name: 'LeftPanel',
  components: {
    WaterStatistics,
    OutWaterQuality,
    ProductionTargets
  },
  props: {
    showStage: {
      type: Boolean,
      require: true
    }
  },
  data() {
    return {};
  },
  computed: {
    ...mapState('setting', ['waterPlantId'])
  }
};
</script>

<style lang="less" scoped>
.left_panel {
  width: 476px;
  display: flex;
  flex-direction: column;
  padding: 12px 9px;
  box-sizing: border-box;
  background: url('~@/assets/img/hz/left-pane.png') no-repeat;
  background-size: 100% 100%;
  position: relative;

  > div {
    position: relative;
    width: 476px;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 12px;
    box-sizing: border-box;
  }
  .pump-module {
    height: 275px;
  }
  .outwater-module {
    height: 375px;
  }
  .production-module {
    height: 285px;
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
.in {
  animation: left-to-right 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.out {
  left: 0;
  animation: left-to-right-hide 1s ease-in-out 1;
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

@keyframes left-to-right {
  from {
    left: -492px;
  }
  to {
    left: 0;
  }
}

@keyframes left-to-right-hide {
  from {
    left: 0;
  }
  to {
    left: -492px;
  }
}
</style>
