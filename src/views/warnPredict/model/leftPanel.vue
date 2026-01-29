<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-07-05 16:32:12
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div class="left_panel">
    <device-type
      title="报警类型分析"
      :class="[showStage ? 'one' : 'oneOut', 'pump-module']"
      :waterPlantId="waterPlantId"
    />
    <alarms-list
      title="报警列表"
      :class="[showStage ? 'three' : 'threeOut', 'inwater-module']"
      :waterPlantId="waterPlantId"
    />
    <out-water-quality
      title="近14天报警走势"
      :class="[showStage ? 'three' : 'threeOut', 'outwater-module']"
      :waterPlantId="waterPlantId"
    />
  </div>
</template>

<script>
import DeviceType from '../components/DeviceType.vue';
import alarmsList from '../components/alarmsList.vue';
import OutWaterQuality from '../components/OutWaterQuality.vue';
export default {
  name: 'LeftPanel',
  components: {
    DeviceType,
    OutWaterQuality,
    alarmsList
  },
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
    return {};
  }
};
</script>

<style lang="less" scoped>
.in {
  animation: left-to-right 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.out {
  left: 0;
  animation: left-to-right-hide 1s ease-in-out 1;
  animation-fill-mode: forwards;
}

.left_panel {
  width: 442px;
  right: -442px;
  display: flex;
  flex-direction: column;

  > div {
    position: relative;
    left: -442px;
    width: 442px;
    display: flex;
    flex-direction: column;
    margin-bottom: 6px;
  }
  .pump-module {
    height: 310px;
  }
  .inwater-module {
    height: 310px;
  }
  .outwater-module {
    height: 310px;
  }
  .water-module {
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

  @keyframes left-to-right {
    from {
      left: -460px;
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
      left: -460px;
    }
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
</style>
