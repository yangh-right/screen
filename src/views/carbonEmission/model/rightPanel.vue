<!--
 * @Author: wangyr
 * @Date: 2023-03-13 09:00:44
 * @LastEditors: wangyr
 * @LastEditTime: 2024-07-29 16:24:04
 * @Description:
-->
<template>
  <div class="right_panel">
    <carbon-overview title="碳排放总览" :class="['pump-module']" :waterPlantId="waterPlantId" />
    <carbon-stage title="各环节碳排放排行" :class="['sludge-module']" :waterPlantId="waterPlantId" :sourceTypeList="sourceTypeList" />
  </div>
</template>

<script>
import carbonOverview from '../components/carbonOverview.vue';
import carbonStage from '../components/carbonStage.vue';

export default {
  name: 'RightPanel',
  components: {
    carbonOverview,
    carbonStage
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
  },
  methods: {}
};
</script>

<style lang="less" scoped>
.right_panel {
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
  .sludge-module {
    height: 630px;
  }
}
</style>
