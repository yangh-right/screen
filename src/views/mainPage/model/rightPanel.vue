<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors:  Do not edit
 * @LastEditTime: 2024-02-29 11:25:16
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <digital-security
      title="安全评价"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
      :waterPlantId="waterPlantId"
    />
    <production-targets
      title="生产指标"
      :class="[showStage ? 'two' : 'twoOut', 'production-module']"
      :waterPlantId="waterPlantId"
    />
    <digital-assets
      title="物资管理"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DigitalAssets from '../components/DigitalAssets.vue';
import DigitalSecurity from '../components/DigitalSecurity.vue';
import ProductionTargets from '../components/ProductionTargets.vue';

export default {
  name: 'RightPanel',
  components: { DigitalSecurity, DigitalAssets, ProductionTargets },
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
    height: 232px;
  }
  .medicine-module {
    height: 232px;
  }
  .production-module {
    height: 464px;
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
