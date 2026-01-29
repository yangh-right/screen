<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-10-11 13:41:53
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <removal-rate title="去除率" :class="[showStage ? 'one' : 'oneOut', 'water-module']" :waterPlantId="waterPlantId" />
    <sludge-count
      title="污泥产量"
      :class="[showStage ? 'two' : 'twoOut', 'sludge-module']"
      :waterPlantId="waterPlantId"
    />
    <real-alarm
      title="报警列表"
      :class="[showStage ? 'three' : 'threeOut', 'alarm-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import RemovalRate from '../components/RemovalRate.vue';
import SludgeCount from '../components/SludgeCount.vue';
import RealAlarm from '../components/RealAlarm.vue';

export default {
  name: 'RightPanel',
  components: { RemovalRate, SludgeCount, RealAlarm },
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

  .water-module {
    height: 309px;
  }
  .sludge-module {
    height: 309px;
  }
  .alarm-module {
    height: 310px;
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
