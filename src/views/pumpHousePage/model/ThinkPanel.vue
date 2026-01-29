<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-08-21 14:08:05
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <Chang-trends
      title="模拟趋势"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
      :waterPlantId="waterPlantId"
    />
    <in-fluent
      title="进水准确率"
      :class="[showStage ? 'two' : 'twoOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
    />
    <out-flow
      title="出水准确率"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
    />
    <!-- <module-estimate
      title="模型精度评估"
      :class="[showStage ? 'four' : 'fourOut', 'sludge-module']"
      :waterPlantId="waterPlantId"
    /> -->
  </div>
</template>

<script>
import { mapState } from 'vuex';
import ChangTrends from '../components/ChangTrends.vue';
import InFluent from '../components/InFluent.vue';
import OutFlow from '../components/OutFlow.vue';
// import ModuleEstimate from '../components/ModuleEstimate.vue';

export default {
  name: 'ThinkPanel',
  components: { ChangTrends, InFluent, OutFlow },
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
  .medicine-module {
    height: 309px;
  }
  .sludge-module {
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
