<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: fengtaotao
 * @LastEditTime: 2024-10-28 10:45:01
 * @Description:
-->
<template>
  <div :class="[showStage ? 'one' : 'oneOut', 'right_panel']">
    <carbonEmission
      title="污水处理量分析"
      :parameter="parameter"
      :class="[showStage ? 'one' : 'oneOut', 'water-module']"
      :waterPlantId="waterPlantId"
    />
    <device-list
      title="预警信息"
      :waterPlantId="waterPlantId"
      :class="[showStage ? 'two' : 'twoOut', 'production-module']"
    />
    <carbonEmissionAnalysis
      :parameter="parameter"
      :waterPlantId="waterPlantId"
      title="全厂碳排放分析"
      :class="[showStage ? 'three' : 'threeOut', 'medicine-module']"
    />
  </div>
</template>

<script>
import { mapState } from 'vuex';
import carbonEmission from '../components/carbonEmission.vue';
import carbonEmissionAnalysis from '../components/carbonEmissionAnalysis.vue';
import deviceList from '../components/deviceList.vue';
import moment from 'moment';
export default {
  name: 'RightPanelNew',
  components: { carbonEmission, carbonEmissionAnalysis, deviceList },
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
    ...mapState('setting', ['waterPlantId']),
    parameter() {
      return {
        waterPlantId: this.waterPlantId,
        dateType: 'MONTH',
        endTime: moment().endOf('month').format('YYYY-MM-DD'),
        startTime: moment().startOf('month').format('YYYY-MM-DD')
      };
    }
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
    height: 310px;
  }
  .medicine-module {
    height: 310px;
  }
  .production-module {
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
