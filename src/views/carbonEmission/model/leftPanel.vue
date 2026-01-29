<!--
 * @Author: wangyr
 * @Date: 2024-07-23 13:29:43
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-29 13:39:39
 * @Description:
-->
<template>
  <div class="left_panel">
    <carbon-ranking title="碳排放各来源排行榜" :class="['pump-module']" :waterPlantId="waterPlantId" :sourceTypeList="sourceTypeList" />
    <carbon-proportion title="污水处理环节碳排放占比" :class="['outwater-module']" :waterPlantId="waterPlantId" :sourceTypeList="sourceTypeList" />
    <carbon-electricity title="电耗环节碳排放占比" :class="['inwater-module']" :waterPlantId="waterPlantId" :sourceTypeList="sourceTypeList" />
    <carbon-environmental title="环境受纳环节碳排放占比" :class="['water-module']" :waterPlantId="waterPlantId" :sourceTypeList="sourceTypeList" />
  </div>
</template>

<script>
import carbonRanking from '../components/carbonRanking.vue';
import carbonProportion from '../components/carbonProportion.vue';
import carbonElectricity from '../components/carbonElectricity.vue';
import carbonEnvironmental from '../components/carbonEnvironmental.vue';
export default {
  name: 'LeftPanel',
  components: {
    carbonRanking,
    carbonProportion,
    carbonElectricity,
    carbonEnvironmental
  },
  props: {
    showStage: {
      type: Boolean,
      require: true
    },
    waterPlantId: {
      type: String,
      default: ''
    },
    sourceTypeList: {
      type: Array,
      default: () => []
    }
  },
  data() {
    return {};
  }
};
</script>

<style lang="less" scoped>
.left_panel {
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
    height: 206px;
  }
  .outwater-module {
    height: 206px;
  }
  .water-module {
    height: 206px;
  }

  > div:nth-last-child(1) {
    margin-bottom: 0;
  }
}
</style>
