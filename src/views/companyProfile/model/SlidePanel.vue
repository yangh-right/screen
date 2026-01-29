<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'left_panel']">
    <development-history
      title="发展历程"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      :waterPlantId="waterPlantId"
    />
    <business-coverage
      title="企业构成"
      :class="[showStage ? 'two' : 'twoOut', 'inwater-module']"
      :waterPlantId="waterPlantId"
    />
    <operating-results
      title="发展历程"
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import { DevelopmentHistory, BusinessCoverage, OperatingResults } from '../components';

export default {
  name: 'SlidePanel',
  components: {
    DevelopmentHistory,
    BusinessCoverage,
    OperatingResults
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
  width: 452px;
  display: flex;
  flex-direction: column;
  background: rgba(14, 35, 67, 0.45);
  backdrop-filter: blur(6px);
  -webkit-backdrop-filter: blur(6px);
  padding: 12px 0px;
  box-sizing: border-box;
  background-size: 100% 100%;
  position: relative;

  > div {
    position: relative;
    width: 452px;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
    padding: 0 12px;
    box-sizing: border-box;
  }
  .pump-module {
    height: 350px;
  }
  .inwater-module {
    height: 350px;
  }
  .outwater-module {
    height: 350px;
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
