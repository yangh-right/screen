<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-11-06 16:37:24
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <carbonEmission
      title="污水处理量分析"
      :parameter="parameter"
      :class="[showStage ? 'one' : 'oneOut', 'sludge-module']"
      :waterPlantId="waterPlantId"
    />
    <carbon-dosage
      :parameter="parameter"
      :class="[showStage ? 'two' : 'twoOut', 'water-module']"
      title="碳源投加量"
      :waterPlantId="waterPlantId"
    ></carbon-dosage>
    <sludge-alasysis
      :parameter="parameter"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
      title="污泥产量分析"
      :waterPlantId="waterPlantId"
    ></sludge-alasysis>
  </div>
</template>

<script>
import carbonEmission from '../components/carbonEmission.vue';
import MedicineAlasysis from '../components/MedicineAlasysis.vue';
import carbonDosage from '../components/carbonDosage.vue';
import SludgeAlasysis from '../components/SludgeAlasysis.vue';
export default {
  name: 'ThinkPanel',
  components: { carbonDosage, SludgeAlasysis, carbonEmission },
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
