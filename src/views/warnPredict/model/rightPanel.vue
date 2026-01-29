<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-05 16:25:35
 * @Description:
-->
<template>
  <div class="right_panel">
    <power-analysis
      title="环境预警"
      :waterPlantId="waterPlantId"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
    />
    <!-- <medicine-analysis
      title="优化方案"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
      @sent-solution="getSolutionVal"
    />
    <sludge-count
      title="预期出水水质"
      :class="[showStage ? 'four' : 'fourOut', 'sludge-module']"
      :waterPlantId="waterPlantId"
      :solutionVal="solutionVal"
    /> -->
  </div>
</template>

<script>
import PowerAnalysis from '../components/PowerAnalysis.vue';
// import MedicineAnalysis from '../components/MedicineAnalysis.vue';
// import SludgeCount from '../components/SludgeCount.vue';

export default {
  name: 'RightPanel',
  components: { PowerAnalysis },
  props: {
    showStage: {
      type: Boolean,
      require: true
    },
    waterPlantId: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      info: {
        profile: null,
        area: [],
        house: []
      },
      solutionVal: ''
    };
  },
  methods: {
    getSolutionVal(solutionVal) {
      this.solutionVal = solutionVal;
    }
  }
};
</script>

<style lang="less" scoped>
.in {
  animation: right-to-left 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.out {
  right: 0;
  animation: right-to-left-hide 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.right_panel {
  width: 442px;
  right: -442px;
  display: flex;
  flex-direction: column;

  > div {
    position: relative;
    width: 100%;
    right: -442px;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  }

  .water-module {
    height: 310px;
  }
  .medicine-module {
    height: 310px;
  }
  .sludge-module {
    height: 310px;
  }
  .alarm-module {
    height: 310px;
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
      right: -460px;
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
      right: -460px;
    }
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
</style>
