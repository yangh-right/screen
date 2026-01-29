<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'left_panel']">
    <device-type
      title="设备类型统计"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      :waterPlantId="waterPlantId"
    />
    <device-fault-order
      title="设备连续运行时间"
      :class="[showStage ? 'two' : 'twoOut', 'inwater-module']"
      :waterPlantId="waterPlantId"
    />
    <device-repaire
      title="设备维修概况"
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import DeviceType from '../components/DeviceType.vue';
import DeviceFaultOrder from '../components/DeviceFaultOrder.vue';
import DeviceRepaire from '../components/DeviceRepaire.vue';

export default {
  name: 'SlidePanel',
  components: {
    DeviceType,
    DeviceFaultOrder,
    DeviceRepaire
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
