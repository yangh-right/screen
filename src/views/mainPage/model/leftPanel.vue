<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-08-21 13:48:55
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'left_panel']">
    <water-statistics
      title="水量统计"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      :waterPlantId="waterPlantId"
    />
    <in-water-quality
      title="进水水质"
      :class="[showStage ? 'two' : 'twoOut', 'inwater-module']"
      :waterPlantId="waterPlantId"
    />
    <out-water-quality
      title="出水水质"
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      :waterPlantId="waterPlantId"
    />
    <digital-homework
      title="执行力管控"
      :class="[showStage ? 'four' : 'fourOut', 'sludge-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import WaterStatistics from '../components/WaterStatistics.vue';
import DigitalHomework from '../components/DigitalHomework.vue';
import InWaterQuality from '@/views/pumpHousePage/components/InWaterQuality.vue';
import OutWaterQuality from '@/views/pumpHousePage/components/OutWaterQuality.vue';

export default {
  name: 'LeftPanel',
  components: {
    WaterStatistics,
    DigitalHomework,
    InWaterQuality,
    OutWaterQuality
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
    height: 232px;
  }
  .inwater-module {
    height: 232px;
  }
  .outwater-module {
    height: 232px;
  }
  .sludge-module {
    height: 232px;
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
