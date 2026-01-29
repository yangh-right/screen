<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: fengtaotao
 * @LastEditTime: 2025-01-08 08:53:41
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <temperature-alarm
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      title="视频"
      :waterPlantId="waterPlantId"
    ></temperature-alarm>
    <carbon-dosage
      :parameter="parameter"
      :class="[showStage ? 'two' : 'twoOut', 'water-module']"
      title="缺料报警"
      :waterPlantId="waterPlantId"
    ></carbon-dosage>
    <sludge-alasysis
      :parameter="parameter"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
      title="取料历史数据"
      :waterPlantId="waterPlantId"
    ></sludge-alasysis>
  </div>
</template>

<script>
import carbonDosage from '../components/carbonDosage.vue';
import SludgeAlasysis from '../components/SludgeAlasysis.vue';
import temperatureAlarm from '../components/temperatureAlarm.vue';
export default {
  name: 'ThinkPanel',
  components: { carbonDosage, SludgeAlasysis, temperatureAlarm },
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
    return {
      info: {
        profile: null,
        area: [],
        house: []
      }
    };
  }
};
</script>

<style lang="less" scoped>
.right_panel {
  width: 476px;
  display: flex;
  flex-direction: column;
  padding: 12px 9px 12px 2px;
  box-sizing: border-box;
  background: url('~@/assets/img/hz/right-pane.png') no-repeat;
  background-size: 100% 100%;
  position: relative;

  > div {
    position: relative;
    width: 100%;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 20px 0 0;
    box-sizing: border-box;
  }
  .outwater-module {
    height: 310px;
  }
  .water-module {
    height: 309px;
  }
  .medicine-module {
    height: 309px;
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
