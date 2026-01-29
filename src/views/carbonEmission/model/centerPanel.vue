<!--
 * @Author: 史磊
 * @Date: 2022-07-26 09:24:36
 * @LastEditTime: 2024-07-30 09:24:32
 * @LastEditors: wangyr
 * @Description:
-->
<template>
  <div class="center_panel">
    <carbon-weekly title="碳排放的周、月度统计" :class="['pump-module']" :waterPlantId="waterPlantId"></carbon-weekly>
    <carbon-daily title="碳排放量的日变化曲线" :class="['inwater-module']" :waterPlantId="waterPlantId"></carbon-daily>
    <carbon-time title="碳排放量的时变曲线" :class="['time-module']" :waterPlantId="waterPlantId"></carbon-time>
  </div>
</template>

<script>
import carbonWeekly from '../components/carbonWeekly.vue';
import carbonDaily from '../components/carbonDaily.vue';
import carbonTime from '../components/carbonTime.vue';

export default {
  name: 'CenterPanel',
  components: {
    carbonWeekly,
    carbonDaily,
    carbonTime
  },
  props: {
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
.center_panel {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;

  > div {
    position: relative;
    width: 100%;
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
  .time-module {
    height: 310px;
  }
}
</style>
