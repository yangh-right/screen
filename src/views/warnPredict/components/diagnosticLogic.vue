<!--
 * @Author: wangyr
 * @Date: 2023-09-05 10:30:42
 * @LastEditors: wangyr
 * @LastEditTime: 2024-03-22 15:42:02
 * @Description:
-->
<template>
  <unit-card :cardTitle="title" class="logic">
    <div class="card-inner">
      <!-- <diagnosticLogicBg  class="bg"></diagnosticLogicBg> -->
      <design :flowId="ruleId" onlyView></design>
    </div>
  </unit-card>
</template>

<script>
import design from './design/index.vue';

export default {
  name: 'alarmSituation',
  components: {
    design,
    UnitCard: () => import('@/components/UnitCard.vue')
  },
  props: {
    title: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      pointsArr: [],
      ruleId: '632994664164753408',
      onlyView: true
    };
  },
  computed: {},
  watch: {},
  methods: {
    initData() {}
  },
  created() {},
  mounted() {
    this.initData();
  }
};
</script>

<style lang="less" scoped>
.logic {
  /deep/ .card-title {
    margin-left: 198px;
  }
}
.card-inner {
  width: 100%;
  height: calc(100% - 34px);
  position: relative;
  padding: 12px 0 0 0;
  box-sizing: border-box;
  display: flex;
  justify-content: space-between;
  align-items: center;
  .bg {
    width: 100%;
    height: 100%;
  }
}
</style>
