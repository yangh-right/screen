<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-10-31 16:19:59
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'left_panel']">
    <energy-ranking
      :parameter="parameter"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      title="区域能耗排名"
      :waterPlantId="waterPlantId"
    ></energy-ranking>
    <temperature-ranking
      :parameter="parameter"
      :class="[showStage ? 'two' : 'twoOut', 'outwater-module']"
      title="温测排名"
      :waterPlantId="waterPlantId"
    ></temperature-ranking>
    <temperature-alarm
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      title="温测报警"
      :waterPlantId="waterPlantId"
    ></temperature-alarm>
  </div>
</template>

<script>
import energyRanking from '../components/energyRanking.vue';
import temperatureRanking from '../components/temperatureRanking.vue';
import temperatureAlarm from '../components/temperatureAlarm.vue';
export default {
  name: 'SlidePanel',
  components: {
    energyRanking,
    temperatureAlarm,
    temperatureRanking
  },
  props: {
    showStage: {
      type: Boolean,
      require: true
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    parameter: {
      type: Object,
      default: () => {}
    }
  },
  data() {
    return {};
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
    height: 309px;
  }
  .inwater-module {
    height: 309px;
  }
  .outwater-module {
    height: 310px;
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
